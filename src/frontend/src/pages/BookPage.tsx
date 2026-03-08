import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Loader2,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  Truck,
  User,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCreateBooking } from "../hooks/useQueries";

interface BookingForm {
  customerName: string;
  phone: string;
  origin: string;
  destination: string;
  dateTime: string;
  passengers: string;
  cargoType: string;
  notes: string;
}

const initialForm: BookingForm = {
  customerName: "",
  phone: "",
  origin: "",
  destination: "",
  dateTime: "",
  passengers: "1",
  cargoType: "",
  notes: "",
};

export function BookPage() {
  const { identity, login } = useInternetIdentity();
  const createBooking = useCreateBooking();
  const [form, setForm] = useState<BookingForm>(initialForm);
  const [successId, setSuccessId] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) {
      login();
      return;
    }

    const dateMs = new Date(form.dateTime).getTime();
    if (Number.isNaN(dateMs)) return;

    try {
      const id = await createBooking.mutateAsync({
        customerName: form.customerName,
        phone: form.phone,
        origin: form.origin,
        destination: form.destination,
        dateTime: BigInt(dateMs) * BigInt(1_000_000), // ms → ns
        passengers: BigInt(Math.max(1, Number.parseInt(form.passengers) || 1)),
        cargoType: form.cargoType || "None",
        notes: form.notes.trim() ? form.notes : null,
      });
      setSuccessId(id.toString());
      setForm(initialForm);
    } catch {
      // Error displayed via mutation state
    }
  };

  const resetSuccess = () => {
    setSuccessId(null);
    createBooking.reset();
  };

  return (
    <main className="min-h-screen py-12 bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Truck className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                Book a Trip
              </h1>
              <p className="text-muted-foreground text-sm">
                Fill in the details below to schedule your transport.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Success state */}
        {successId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            data-ocid="booking.success_state"
            className="mb-6"
          >
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-display font-bold text-green-900 text-base mb-1">
                      Booking Confirmed!
                    </h3>
                    <p className="text-green-700 text-sm">
                      Your booking has been created successfully.
                    </p>
                    <div className="mt-3 bg-white border border-green-200 rounded-lg px-4 py-2.5 inline-block">
                      <span className="text-xs text-green-600 uppercase tracking-widest font-semibold">
                        Booking ID
                      </span>
                      <p className="font-mono font-bold text-green-900 text-sm mt-0.5">
                        #{successId}
                      </p>
                    </div>
                    <p className="text-green-600 text-xs mt-3">
                      Use this ID to track your booking on the Track page.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetSuccess}
                      className="mt-4 border-green-300 text-green-700 hover:bg-green-100"
                    >
                      Book Another Trip
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Error state */}
        {createBooking.isError && !successId && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            data-ocid="booking.error_state"
            className="mb-6"
          >
            <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg px-4 py-3 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                Failed to create booking. Please try again or ensure you are
                logged in.
              </span>
            </div>
          </motion.div>
        )}

        {/* Form */}
        {!successId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="navy-card-shadow border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-lg font-bold">
                  Trip Details
                </CardTitle>
                <CardDescription>
                  {!identity
                    ? "You'll be asked to login before submitting."
                    : "All fields except Notes are required."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Row: Name + Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="customerName"
                        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                      >
                        <User className="w-3 h-3" /> Customer Name
                      </Label>
                      <Input
                        id="customerName"
                        name="customerName"
                        placeholder="John Doe"
                        value={form.customerName}
                        onChange={handleChange}
                        required
                        data-ocid="booking.customerName_input"
                        className="focus-visible:ring-accent"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="phone"
                        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                      >
                        <Phone className="w-3 h-3" /> Phone
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        data-ocid="booking.phone_input"
                        className="focus-visible:ring-accent"
                      />
                    </div>
                  </div>

                  {/* Row: Origin + Destination */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="origin"
                        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                      >
                        <MapPin className="w-3 h-3" /> Origin
                      </Label>
                      <Input
                        id="origin"
                        name="origin"
                        placeholder="City, State"
                        value={form.origin}
                        onChange={handleChange}
                        required
                        data-ocid="booking.origin_input"
                        className="focus-visible:ring-accent"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="destination"
                        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                      >
                        <MapPin className="w-3 h-3" /> Destination
                      </Label>
                      <Input
                        id="destination"
                        name="destination"
                        placeholder="City, State"
                        value={form.destination}
                        onChange={handleChange}
                        required
                        data-ocid="booking.destination_input"
                        className="focus-visible:ring-accent"
                      />
                    </div>
                  </div>

                  {/* Row: Date + Passengers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="dateTime"
                        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                      >
                        <Calendar className="w-3 h-3" /> Date & Time
                      </Label>
                      <Input
                        id="dateTime"
                        name="dateTime"
                        type="datetime-local"
                        value={form.dateTime}
                        onChange={handleChange}
                        required
                        data-ocid="booking.datetime_input"
                        className="focus-visible:ring-accent"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="passengers"
                        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                      >
                        <Users className="w-3 h-3" /> Passengers
                      </Label>
                      <Input
                        id="passengers"
                        name="passengers"
                        type="number"
                        min="1"
                        max="100"
                        value={form.passengers}
                        onChange={handleChange}
                        required
                        data-ocid="booking.passengers_input"
                        className="focus-visible:ring-accent"
                      />
                    </div>
                  </div>

                  {/* Cargo Type */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="cargoType"
                      className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      <Package className="w-3 h-3" /> Cargo Type
                    </Label>
                    <Input
                      id="cargoType"
                      name="cargoType"
                      placeholder="e.g. Electronics, Furniture, Documents, None"
                      value={form.cargoType}
                      onChange={handleChange}
                      data-ocid="booking.cargo_input"
                      className="focus-visible:ring-accent"
                    />
                  </div>

                  {/* Notes */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="notes"
                      className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      <MessageSquare className="w-3 h-3" /> Notes{" "}
                      <span className="normal-case text-muted-foreground/60 font-normal">
                        (optional)
                      </span>
                    </Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Special instructions, pickup details, etc."
                      value={form.notes}
                      onChange={handleChange}
                      rows={3}
                      data-ocid="booking.notes_textarea"
                      className="focus-visible:ring-accent resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={createBooking.isPending}
                      data-ocid="booking.submit_button"
                      className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base shadow-navy"
                    >
                      {createBooking.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Creating Booking...
                        </>
                      ) : !identity ? (
                        "Login & Book"
                      ) : (
                        "Confirm Booking"
                      )}
                    </Button>
                    {!identity && (
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        You'll be redirected to login, then your booking will be
                        saved.
                      </p>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </main>
  );
}
