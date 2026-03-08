import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Booking {
    id: bigint;
    customerName: string;
    status: BookingStatus;
    destination: string;
    cargoType: string;
    owner: Principal;
    origin: string;
    assignedDriver?: bigint;
    passengers: bigint;
    notes?: string;
    phone: string;
    dateTime: Time;
}
export type Time = bigint;
export interface Driver {
    id: bigint;
    vehicleType: string;
    licensePlate: string;
    name: string;
    available: boolean;
    phone: string;
}
export interface UserProfile {
    name: string;
}
export enum BookingStatus {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    confirmed = "confirmed",
    inProgress = "inProgress"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addDriver(name: string, phone: string, vehicleType: string, licensePlate: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignDriver(bookingId: bigint, driverId: bigint): Promise<void>;
    cancelBooking(id: bigint): Promise<void>;
    createBooking(customerName: string, phone: string, origin: string, destination: string, dateTime: Time, passengers: bigint, cargoType: string, notes: string | null): Promise<bigint>;
    getAllBookings(): Promise<Array<Booking>>;
    getAllDrivers(): Promise<Array<Driver>>;
    getBookingById(id: bigint): Promise<Booking>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyBookings(): Promise<Array<Booking>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeDriver(driverId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateBookingStatus(id: bigint, status: BookingStatus): Promise<void>;
    updateDriverAvailability(driverId: bigint, available: boolean): Promise<void>;
}
