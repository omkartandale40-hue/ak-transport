import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  Calendar,
  ClipboardList,
  Loader2,
  LogIn,
  MapPin,
  Package,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { BookingStatus } from "../backend.d";
import { StatusBadge } from "../components/StatusBadge";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCancelBooking, useMyBookings } from "../hooks/useQueries";

function formatDateTime(nanos: bigint) {
  const ms = Number(nanos) / 1_000_000;
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(ms));
}

export function MyBookingsPage() {
  const { identity, login } = useInternetIdentity();
  const { data: bookings, isLoading, isError } = useMyBookings();
  const cancelBooking = useCancelBooking();

  const handleCancel = async (id: bigint, _index: number) => {
    try {
      await cancelBooking.mutateAsync(id);
      toast.success("Booking cancelled successfully.");
    } catch {
      toast.error("Failed to cancel booking. Please try again.");
    }
  };

  if (!identity) {
    return (
      <main className="min-h-screen py-16 bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-md mx-auto px-4 text-center"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-black text-foreground mb-3">
            Login Required
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            Please login to view and manage your bookings.
          </p>
          <Button
            onClick={login}
            data-ocid="nav.login_button"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-navy px-8"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Login to Continue
          </Button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-12 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                My Bookings
              </h1>
              <p className="text-muted-foreground text-sm">
                {bookings
                  ? `${bookings.length} booking${bookings.length !== 1 ? "s" : ""}`
                  : "Loading your trips..."}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div data-ocid="mybookings.loading_state" className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-border/50">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                      <Skeleton className="h-3 w-36" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div
            data-ocid="mybookings.error_state"
            className="flex items-center gap-3 bg-destructive/10 border border-destructive/20 rounded-xl p-4"
          >
            <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
            <p className="text-destructive text-sm">
              Failed to load bookings. Please refresh the page.
            </p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && bookings?.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            data-ocid="mybookings.empty_state"
            className="text-center py-16"
          >
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display font-bold text-foreground text-lg mb-2">
              No bookings yet
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              You haven't made any bookings. Book your first trip to get
              started.
            </p>
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-navy"
            >
              <a href="/book">Book a Trip</a>
            </Button>
          </motion.div>
        )}

        {/* Bookings list */}
        {!isLoading && bookings && bookings.length > 0 && (
          <div data-ocid="mybookings.list" className="space-y-4">
            <AnimatePresence>
              {bookings.map((booking, index) => {
                const ocidIndex = index + 1;
                const isCancellable =
                  booking.status !== BookingStatus.cancelled &&
                  booking.status !== BookingStatus.completed;

                return (
                  <motion.div
                    key={booking.id.toString()}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    data-ocid={`mybookings.item.${ocidIndex}`}
                  >
                    <Card className="navy-card-shadow border-border/50 hover:border-primary/20 transition-all group">
                      <CardContent className="p-5">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            {/* ID + status */}
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                #{booking.id.toString()}
                              </span>
                              <StatusBadge status={booking.status} />
                            </div>

                            {/* Route */}
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                              <span className="text-sm font-semibold text-foreground truncate">
                                {booking.origin}
                              </span>
                              <span className="text-muted-foreground">→</span>
                              <span className="text-sm font-semibold text-foreground truncate">
                                {booking.destination}
                              </span>
                            </div>

                            {/* Date */}
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="w-3.5 h-3.5 shrink-0" />
                              <span className="text-xs">
                                {formatDateTime(booking.dateTime)}
                              </span>
                            </div>

                            {booking.notes && (
                              <p className="text-xs text-muted-foreground mt-2 italic">
                                "{booking.notes}"
                              </p>
                            )}
                          </div>

                          {/* Cancel button */}
                          {isCancellable && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancel(booking.id, index)}
                              disabled={cancelBooking.isPending}
                              data-ocid={`mybookings.cancel_button.${ocidIndex}`}
                              className="border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground shrink-0"
                            >
                              {cancelBooking.isPending ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                              <span className="ml-1.5">Cancel</span>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}
