# AK Transport

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- A transportation management app branded as "AK TRANSPORT"
- Home/landing page with company branding and key services
- Booking/Request a Ride form (origin, destination, date/time, passenger count, cargo type)
- Fleet management section showing available vehicles
- Shipment/booking tracking with status updates
- Admin dashboard to manage bookings and drivers
- Driver listing with availability status
- Contact/support section

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend (Motoko):
   - Data types: Booking (id, customerName, phone, origin, destination, dateTime, passengers, cargoType, status, driverId)
   - Data types: Driver (id, name, phone, vehicleType, licensePlate, available)
   - Data types: Vehicle (id, type, capacity, licensePlate, status)
   - CRUD for bookings: createBooking, getBookings, getBookingById, updateBookingStatus, cancelBooking
   - CRUD for drivers: addDriver, getDrivers, updateDriverAvailability
   - Admin role: manage all bookings, assign drivers

2. Frontend:
   - Landing page with AK TRANSPORT branding, hero section, services overview
   - Booking form page (request transport/shipment)
   - Booking tracking page (enter booking ID to see status)
   - Admin panel: list of bookings, ability to update status and assign driver
   - Drivers management page
   - Responsive layout with navigation
