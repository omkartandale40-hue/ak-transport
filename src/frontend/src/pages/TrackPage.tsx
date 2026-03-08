import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  Calendar,
  Hash,
  MapPin,
  Package,
  Phone,
  Search,
  Truck,
  User,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { StatusBadge } from "../components/StatusBadge";
import { useAllDrivers, useBookingById } from "../hooks/useQueries";

function formatDateTime(nanos: bigint) {
  const ms = Number(nanos) / 1_000_000;
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(ms));
}

export function TrackPage() {
  const [inputId, setInputId] = useState("");
  const [searchId, setSearchId] = useState<bigint | null>(null);
  const [inputError, setInputError] = useState("");

  const { data: booking, isLoading, isError } = useBookingById(searchId);
  const { data: drivers } = useAllDrivers();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setInputError("");
    const trimmed = inputId.trim();
    if (!trimmed) {
      setInputError("Please enter a booking ID.");
      return;
    }
    try {
      setSearchId(BigInt(trimmed));
    } catch {
      setInputError("Invalid booking ID format. Please enter a numeric ID.");
    }
  };

  const assignedDriver = drivers?.find(
    (d) =>
      booking?.assignedDriver !== undefined && d.id === booking.assignedDriver,
  );

  const detailRows = booking
    ? [
        { icon: Hash, label: "Booking ID", value: `#${booking.id.toString()}` },
        { icon: User, label: "Customer", value: booking.customerName },
        { icon: Phone, label: "Phone", value: booking.phone },
        { icon: MapPin, label: "Origin", value: booking.origin },
        { icon: MapPin, label: "Destination", value: booking.destination },
        {
          icon: Calendar,
          label: "Date & Time",
          value: formatDateTime(booking.dateTime),
        },
        {
          icon: Users,
          label: "Passengers",
          value: booking.passengers.toString(),
        },
        {
          icon: Package,
          label: "Cargo Type",
          value: booking.cargoType || "None",
        },
      ]
    : [];

  return (
    <main className="min-h-screen py-12 bg-background">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Search className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                Track Booking
              </h1>
              <p className="text-muted-foreground text-sm">
                Enter your booking ID to check status.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="navy-card-shadow border-border/50 mb-6">
            <CardContent className="p-5">
              <form onSubmit={handleSearch} className="space-y-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="trackId"
                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Booking ID
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="trackId"
                      placeholder="Enter numeric booking ID"
                      value={inputId}
                      onChange={(e) => {
                        setInputId(e.target.value);
                        setInputError("");
                      }}
                      data-ocid="track.id_input"
                      className="flex-1 focus-visible:ring-accent font-mono"
                    />
                    <Button
                      type="submit"
                      data-ocid="track.search_button"
                      disabled={isLoading}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-navy"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  {inputError && (
                    <p className="text-destructive text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {inputError}
                    </p>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Error state */}
        <AnimatePresence mode="wait">
          {isError || (searchId !== null && !isLoading && booking === null) ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              data-ocid="track.error_state"
            >
              <div className="flex items-center gap-3 bg-destructive/10 border border-destructive/20 rounded-xl p-4">
                <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
                <div>
                  <p className="text-destructive font-semibold text-sm">
                    Booking not found
                  </p>
                  <p className="text-destructive/70 text-xs mt-0.5">
                    No booking found for ID #{searchId?.toString()}. Please
                    check the ID and try again.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : null}

          {/* Result panel */}
          {booking && !isError ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              data-ocid="track.result_panel"
            >
              <Card className="navy-card-shadow border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-display font-bold text-base">
                      Booking #{booking.id.toString()}
                    </CardTitle>
                    <StatusBadge status={booking.status} />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* Route visualization */}
                  <div className="bg-muted rounded-xl p-4 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                        <div className="w-0.5 h-8 bg-border" />
                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      </div>
                      <div className="flex flex-col gap-4 flex-1 min-w-0">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                            From
                          </p>
                          <p className="font-semibold text-foreground text-sm truncate">
                            {booking.origin}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                            To
                          </p>
                          <p className="font-semibold text-foreground text-sm truncate">
                            {booking.destination}
                          </p>
                        </div>
                      </div>
                      <Truck className="w-7 h-7 text-accent shrink-0" />
                    </div>
                  </div>

                  {/* Details grid */}
                  <div className="space-y-2.5">
                    {detailRows.map((row) => (
                      <div key={row.label} className="flex items-start gap-3">
                        <row.icon className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div className="flex items-baseline gap-2 min-w-0">
                          <span className="text-xs text-muted-foreground w-24 shrink-0">
                            {row.label}
                          </span>
                          <span className="text-sm text-foreground font-medium truncate">
                            {row.value}
                          </span>
                        </div>
                      </div>
                    ))}

                    {/* Assigned driver */}
                    {assignedDriver && (
                      <div className="flex items-start gap-3">
                        <Truck className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div className="flex items-baseline gap-2 min-w-0">
                          <span className="text-xs text-muted-foreground w-24 shrink-0">
                            Driver
                          </span>
                          <span className="text-sm text-foreground font-medium">
                            {assignedDriver.name} — {assignedDriver.vehicleType}{" "}
                            ({assignedDriver.licensePlate})
                          </span>
                        </div>
                      </div>
                    )}

                    {booking.notes && (
                      <div className="mt-3 bg-muted rounded-lg p-3">
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">
                          Notes
                        </p>
                        <p className="text-sm text-foreground">
                          {booking.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </main>
  );
}
