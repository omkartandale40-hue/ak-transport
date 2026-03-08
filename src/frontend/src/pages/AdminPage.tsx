import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  Car,
  ClipboardList,
  Hash,
  Loader2,
  Phone,
  Shield,
  Trash2,
  Truck,
  UserPlus,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { BookingStatus } from "../backend.d";
import { StatusBadge } from "../components/StatusBadge";
import {
  useAddDriver,
  useAllBookings,
  useAllDrivers,
  useAssignDriver,
  useIsAdmin,
  useRemoveDriver,
  useUpdateBookingStatus,
  useUpdateDriverAvailability,
} from "../hooks/useQueries";

const statusOptions = [
  { value: BookingStatus.pending, label: "Pending" },
  { value: BookingStatus.confirmed, label: "Confirmed" },
  { value: BookingStatus.inProgress, label: "In Progress" },
  { value: BookingStatus.completed, label: "Completed" },
  { value: BookingStatus.cancelled, label: "Cancelled" },
];

function formatDateTime(nanos: bigint) {
  const ms = Number(nanos) / 1_000_000;
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(ms));
}

// ── Driver Form ────────────────────────────────────────────────────────────

interface DriverFormState {
  name: string;
  phone: string;
  vehicleType: string;
  licensePlate: string;
}

const emptyDriverForm: DriverFormState = {
  name: "",
  phone: "",
  vehicleType: "",
  licensePlate: "",
};

function AddDriverForm() {
  const [form, setForm] = useState<DriverFormState>(emptyDriverForm);
  const addDriver = useAddDriver();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDriver.mutateAsync(form);
      toast.success("Driver added successfully.");
      setForm(emptyDriverForm);
    } catch {
      toast.error("Failed to add driver.");
    }
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-base font-bold flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-accent" />
          Add New Driver
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="space-y-1.5">
            <Label
              htmlFor="driverName"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Name
            </Label>
            <Input
              id="driverName"
              name="name"
              placeholder="Driver full name"
              value={form.name}
              onChange={handleChange}
              required
              data-ocid="admin.driver_name_input"
              className="focus-visible:ring-accent"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="driverPhone"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Phone
            </Label>
            <Input
              id="driverPhone"
              name="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={form.phone}
              onChange={handleChange}
              required
              data-ocid="admin.driver_phone_input"
              className="focus-visible:ring-accent"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="driverVehicle"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Vehicle Type
            </Label>
            <Input
              id="driverVehicle"
              name="vehicleType"
              placeholder="e.g. Box Truck, Van, SUV"
              value={form.vehicleType}
              onChange={handleChange}
              required
              data-ocid="admin.driver_vehicle_input"
              className="focus-visible:ring-accent"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="driverPlate"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              License Plate
            </Label>
            <Input
              id="driverPlate"
              name="licensePlate"
              placeholder="AK-1234"
              value={form.licensePlate}
              onChange={handleChange}
              required
              data-ocid="admin.driver_plate_input"
              className="focus-visible:ring-accent"
            />
          </div>
          <div className="sm:col-span-2">
            <Button
              type="submit"
              disabled={addDriver.isPending}
              data-ocid="admin.driver_submit_button"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-navy"
            >
              {addDriver.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Adding...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" /> Add Driver
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// ── Main Admin Page ─────────────────────────────────────────────────────────

export function AdminPage() {
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsAdmin();
  const { data: bookings, isLoading: bookingsLoading } = useAllBookings();
  const { data: drivers, isLoading: driversLoading } = useAllDrivers();

  const updateStatus = useUpdateBookingStatus();
  const assignDriver = useAssignDriver();
  const removeDriver = useRemoveDriver();
  const updateAvailability = useUpdateDriverAvailability();

  const handleStatusChange = async (id: bigint, status: BookingStatus) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success("Status updated.");
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const handleAssignDriver = async (bookingId: bigint, driverIdStr: string) => {
    try {
      await assignDriver.mutateAsync({
        bookingId,
        driverId: BigInt(driverIdStr),
      });
      toast.success("Driver assigned.");
    } catch {
      toast.error("Failed to assign driver.");
    }
  };

  const handleRemoveDriver = async (driverId: bigint, _index: number) => {
    try {
      await removeDriver.mutateAsync(driverId);
      toast.success("Driver removed.");
    } catch {
      toast.error("Failed to remove driver.");
    }
  };

  const handleToggleAvailability = async (
    driverId: bigint,
    available: boolean,
  ) => {
    try {
      await updateAvailability.mutateAsync({ driverId, available });
      toast.success(
        available ? "Driver marked available." : "Driver marked unavailable.",
      );
    } catch {
      toast.error("Failed to update driver availability.");
    }
  };

  // Loading check
  if (isCheckingAdmin) {
    return (
      <main className="min-h-screen py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-8">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div>
              <Skeleton className="h-6 w-40 mb-1" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </main>
    );
  }

  // Access denied
  if (!isAdmin) {
    return (
      <main className="min-h-screen py-16 bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-sm mx-auto px-4 text-center"
        >
          <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="font-display text-2xl font-black text-foreground mb-3">
            Access Denied
          </h2>
          <p className="text-muted-foreground text-sm">
            You don't have permission to access the admin panel. Please login
            with an admin account.
          </p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                Admin Panel
              </h1>
              <p className="text-muted-foreground text-sm">
                Manage bookings and drivers.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="bookings">
          <TabsList className="mb-6 bg-muted border border-border/50">
            <TabsTrigger
              value="bookings"
              data-ocid="admin.bookings_tab"
              className="flex items-center gap-2"
            >
              <ClipboardList className="w-4 h-4" />
              All Bookings
              {bookings && (
                <Badge variant="secondary" className="ml-1 text-xs h-4 px-1.5">
                  {bookings.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="drivers"
              data-ocid="admin.drivers_tab"
              className="flex items-center gap-2"
            >
              <Truck className="w-4 h-4" />
              Drivers
              {drivers && (
                <Badge variant="secondary" className="ml-1 text-xs h-4 px-1.5">
                  {drivers.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ── Bookings Tab ───────────────────────────────────────── */}
          <TabsContent value="bookings">
            {bookingsLoading ? (
              <Skeleton className="h-64 rounded-xl" />
            ) : (
              <Card className="navy-card-shadow border-border/50">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table data-ocid="admin.bookings_table">
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold text-xs uppercase tracking-wider">
                            ID
                          </TableHead>
                          <TableHead className="font-semibold text-xs uppercase tracking-wider">
                            Customer
                          </TableHead>
                          <TableHead className="font-semibold text-xs uppercase tracking-wider">
                            Route
                          </TableHead>
                          <TableHead className="font-semibold text-xs uppercase tracking-wider">
                            Date
                          </TableHead>
                          <TableHead className="font-semibold text-xs uppercase tracking-wider">
                            Status
                          </TableHead>
                          <TableHead className="font-semibold text-xs uppercase tracking-wider">
                            Assign Driver
                          </TableHead>
                          <TableHead className="font-semibold text-xs uppercase tracking-wider">
                            Update Status
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings && bookings.length === 0 && (
                          <TableRow>
                            <TableCell
                              colSpan={7}
                              className="text-center text-muted-foreground py-12 text-sm"
                            >
                              No bookings found.
                            </TableCell>
                          </TableRow>
                        )}
                        {bookings?.map((booking, index) => {
                          const ocidIndex = index + 1;
                          return (
                            <TableRow
                              key={booking.id.toString()}
                              className="hover:bg-muted/30"
                            >
                              <TableCell className="font-mono text-xs text-muted-foreground">
                                #{booking.id.toString()}
                              </TableCell>
                              <TableCell>
                                <div className="font-medium text-sm">
                                  {booking.customerName}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {booking.phone}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm font-medium max-w-[150px] truncate">
                                  {booking.origin}
                                </div>
                                <div className="text-xs text-muted-foreground max-w-[150px] truncate">
                                  → {booking.destination}
                                </div>
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                {formatDateTime(booking.dateTime)}
                              </TableCell>
                              <TableCell>
                                <StatusBadge status={booking.status} />
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={
                                    booking.assignedDriver?.toString() ?? ""
                                  }
                                  onValueChange={(v) =>
                                    handleAssignDriver(booking.id, v)
                                  }
                                >
                                  <SelectTrigger
                                    className="w-36 h-8 text-xs"
                                    data-ocid={`admin.assign_driver_select.${ocidIndex}`}
                                  >
                                    <SelectValue placeholder="Assign driver" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {drivers?.map((d) => (
                                      <SelectItem
                                        key={d.id.toString()}
                                        value={d.id.toString()}
                                      >
                                        {d.name}
                                        {!d.available && " (unavail.)"}
                                      </SelectItem>
                                    ))}
                                    {(!drivers || drivers.length === 0) && (
                                      <SelectItem value="none" disabled>
                                        No drivers
                                      </SelectItem>
                                    )}
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={booking.status}
                                  onValueChange={(v) =>
                                    handleStatusChange(
                                      booking.id,
                                      v as BookingStatus,
                                    )
                                  }
                                >
                                  <SelectTrigger
                                    className="w-36 h-8 text-xs"
                                    data-ocid={`admin.booking_status_select.${ocidIndex}`}
                                  >
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {statusOptions.map((s) => (
                                      <SelectItem key={s.value} value={s.value}>
                                        {s.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ── Drivers Tab ───────────────────────────────────────── */}
          <TabsContent value="drivers">
            <div className="space-y-6">
              <AddDriverForm />

              {/* Drivers list */}
              {driversLoading ? (
                <Skeleton className="h-48 rounded-xl" />
              ) : (
                <Card className="navy-card-shadow border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="font-display text-base font-bold flex items-center gap-2">
                      <Truck className="w-4 h-4 text-accent" />
                      Driver Roster
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {!drivers || drivers.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground text-sm">
                        No drivers registered. Add one above.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/50">
                              <TableHead className="font-semibold text-xs uppercase tracking-wider">
                                <div className="flex items-center gap-1">
                                  <Hash className="w-3 h-3" /> ID
                                </div>
                              </TableHead>
                              <TableHead className="font-semibold text-xs uppercase tracking-wider">
                                Name
                              </TableHead>
                              <TableHead className="font-semibold text-xs uppercase tracking-wider">
                                <div className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" /> Phone
                                </div>
                              </TableHead>
                              <TableHead className="font-semibold text-xs uppercase tracking-wider">
                                <div className="flex items-center gap-1">
                                  <Car className="w-3 h-3" /> Vehicle
                                </div>
                              </TableHead>
                              <TableHead className="font-semibold text-xs uppercase tracking-wider">
                                Plate
                              </TableHead>
                              <TableHead className="font-semibold text-xs uppercase tracking-wider">
                                Available
                              </TableHead>
                              <TableHead className="font-semibold text-xs uppercase tracking-wider">
                                Remove
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {drivers.map((driver, index) => {
                              const ocidIndex = index + 1;
                              return (
                                <TableRow
                                  key={driver.id.toString()}
                                  className="hover:bg-muted/30"
                                >
                                  <TableCell className="font-mono text-xs text-muted-foreground">
                                    #{driver.id.toString()}
                                  </TableCell>
                                  <TableCell>
                                    <span className="font-medium text-sm">
                                      {driver.name}
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-sm text-muted-foreground">
                                    {driver.phone}
                                  </TableCell>
                                  <TableCell className="text-sm">
                                    {driver.vehicleType}
                                  </TableCell>
                                  <TableCell>
                                    <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                                      {driver.licensePlate}
                                    </span>
                                  </TableCell>
                                  <TableCell>
                                    <Switch
                                      checked={driver.available}
                                      onCheckedChange={(v) =>
                                        handleToggleAvailability(driver.id, v)
                                      }
                                      data-ocid={`admin.driver_availability_toggle.${ocidIndex}`}
                                      className="data-[state=checked]:bg-green-500"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleRemoveDriver(driver.id, index)
                                      }
                                      disabled={removeDriver.isPending}
                                      data-ocid={`admin.driver_delete_button.${ocidIndex}`}
                                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground h-8 w-8 p-0"
                                    >
                                      {removeDriver.isPending ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      ) : (
                                        <Trash2 className="w-3.5 h-3.5" />
                                      )}
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
