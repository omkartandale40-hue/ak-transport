import { BookingStatus } from "../backend.d";

interface StatusBadgeProps {
  status: BookingStatus;
}

const statusConfig = {
  [BookingStatus.pending]: { label: "Pending", className: "status-pending" },
  [BookingStatus.confirmed]: {
    label: "Confirmed",
    className: "status-confirmed",
  },
  [BookingStatus.inProgress]: {
    label: "In Progress",
    className: "status-inProgress",
  },
  [BookingStatus.completed]: {
    label: "Completed",
    className: "status-completed",
  },
  [BookingStatus.cancelled]: {
    label: "Cancelled",
    className: "status-cancelled",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: String(status),
    className: "status-pending",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}
