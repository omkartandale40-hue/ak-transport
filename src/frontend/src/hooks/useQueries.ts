import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Booking, BookingStatus, Driver } from "../backend.d";
import { useActor } from "./useActor";

// ─── Queries ─────────────────────────────────────────────────────────────────

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllBookings() {
  const { actor, isFetching } = useActor();
  return useQuery<Booking[]>({
    queryKey: ["allBookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyBookings() {
  const { actor, isFetching } = useActor();
  return useQuery<Booking[]>({
    queryKey: ["myBookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllDrivers() {
  const { actor, isFetching } = useActor();
  return useQuery<Driver[]>({
    queryKey: ["allDrivers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDrivers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBookingById(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Booking | null>({
    queryKey: ["booking", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      try {
        return await actor.getBookingById(id);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateBooking() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      customerName: string;
      phone: string;
      origin: string;
      destination: string;
      dateTime: bigint;
      passengers: bigint;
      cargoType: string;
      notes: string | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createBooking(
        params.customerName,
        params.phone,
        params.origin,
        params.destination,
        params.dateTime,
        params.passengers,
        params.cargoType,
        params.notes,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myBookings"] });
      qc.invalidateQueries({ queryKey: ["allBookings"] });
    },
  });
}

export function useCancelBooking() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.cancelBooking(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myBookings"] });
      qc.invalidateQueries({ queryKey: ["allBookings"] });
    },
  });
}

export function useUpdateBookingStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: { id: bigint; status: BookingStatus }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateBookingStatus(id, status);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allBookings"] });
    },
  });
}

export function useAssignDriver() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      bookingId,
      driverId,
    }: { bookingId: bigint; driverId: bigint }) => {
      if (!actor) throw new Error("Not connected");
      return actor.assignDriver(bookingId, driverId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allBookings"] });
    },
  });
}

export function useAddDriver() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      name: string;
      phone: string;
      vehicleType: string;
      licensePlate: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addDriver(
        params.name,
        params.phone,
        params.vehicleType,
        params.licensePlate,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allDrivers"] });
    },
  });
}

export function useRemoveDriver() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (driverId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.removeDriver(driverId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allDrivers"] });
    },
  });
}

export function useUpdateDriverAvailability() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      driverId,
      available,
    }: { driverId: bigint; available: boolean }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateDriverAvailability(driverId, available);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allDrivers"] });
    },
  });
}
