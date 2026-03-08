import List "mo:core/List";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  type BookingStatus = {
    #pending;
    #confirmed;
    #inProgress;
    #completed;
    #cancelled;
  };

  type Booking = {
    id : Nat;
    customerName : Text;
    phone : Text;
    origin : Text;
    destination : Text;
    dateTime : Time.Time;
    passengers : Nat;
    cargoType : Text;
    notes : ?Text;
    status : BookingStatus;
    assignedDriver : ?Nat;
    owner : Principal;
  };

  type Driver = {
    id : Nat;
    name : Text;
    phone : Text;
    vehicleType : Text;
    licensePlate : Text;
    available : Bool;
  };

  var nextBookingId = 1;
  var nextDriverId = 1;

  let bookings = Map.empty<Nat, Booking>();
  let drivers = Map.empty<Nat, Driver>();

  public shared ({ caller }) func createBooking(customerName : Text, phone : Text, origin : Text, destination : Text, dateTime : Time.Time, passengers : Nat, cargoType : Text, notes : ?Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create bookings");
    };

    let booking : Booking = {
      id = nextBookingId;
      customerName;
      phone;
      origin;
      destination;
      dateTime;
      passengers;
      cargoType;
      notes;
      status = #pending;
      assignedDriver = null;
      owner = caller;
    };

    bookings.add(nextBookingId, booking);
    nextBookingId += 1;
    booking.id;
  };

  public query ({ caller }) func getAllBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all bookings");
    };
    bookings.values().toArray();
  };

  public query ({ caller }) func getMyBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their bookings");
    };
    bookings.values().filter(func(booking : Booking) : Bool { booking.owner == caller }).toArray();
  };

  public query ({ caller }) func getBookingById(id : Nat) : async Booking {
    switch (bookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        if (caller != booking.owner and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own booking");
        };
        booking;
      };
    };
  };

  public shared ({ caller }) func updateBookingStatus(id : Nat, status : BookingStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update booking status");
    };

    switch (bookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        let updatedBooking = { booking with status };
        bookings.add(id, updatedBooking);
      };
    };
  };

  public shared ({ caller }) func assignDriver(bookingId : Nat, driverId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can assign drivers");
    };

    switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        switch (drivers.get(driverId)) {
          case (null) { Runtime.trap("Driver not found") };
          case (?driver) {
            if (not driver.available) {
              Runtime.trap("Driver is not available");
            };
            let updatedBooking = { booking with assignedDriver = ?driverId };
            bookings.add(bookingId, updatedBooking);
          };
        };
      };
    };
  };

  public shared ({ caller }) func cancelBooking(id : Nat) : async () {
    switch (bookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        if (caller != booking.owner and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the owner or admin can cancel the booking");
        };
        let updatedBooking = { booking with status = #cancelled };
        bookings.add(id, updatedBooking);
      };
    };
  };

  public shared ({ caller }) func addDriver(name : Text, phone : Text, vehicleType : Text, licensePlate : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add drivers");
    };

    let driver : Driver = {
      id = nextDriverId;
      name;
      phone;
      vehicleType;
      licensePlate;
      available = true;
    };

    drivers.add(nextDriverId, driver);
    nextDriverId += 1;
    driver.id;
  };

  public query ({ caller }) func getAllDrivers() : async [Driver] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view drivers");
    };
    drivers.values().toArray();
  };

  public shared ({ caller }) func updateDriverAvailability(driverId : Nat, available : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update driver availability");
    };

    switch (drivers.get(driverId)) {
      case (null) { Runtime.trap("Driver not found") };
      case (?driver) {
        let updatedDriver = { driver with available };
        drivers.add(driverId, updatedDriver);
      };
    };
  };

  public shared ({ caller }) func removeDriver(driverId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove drivers");
    };

    if (not drivers.containsKey(driverId)) {
      Runtime.trap("Driver not found");
    };

    drivers.remove(driverId);
  };
};
