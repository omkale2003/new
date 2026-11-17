import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { activityBookingsApi } from "../api/activityBookings.api.js";

export function useActivityBookings(params = {}) {
  return useQuery({
    queryKey: ["activity-bookings", params],
    queryFn: () => activityBookingsApi.getBookings(params),
  });
}

export function useActivityBooking(id) {
  return useQuery({
    queryKey: ["activity-booking-detail", id],
    queryFn: () => activityBookingsApi.getBookingById(id),
    enabled: Boolean(id),
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, status, reason }) =>
      activityBookingsApi.updateBookingStatus(bookingId, status, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activity-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["activity-booking-detail"] });
    },
  });
}

export function useActivityParticipants(params = {}) {
  return useQuery({
    queryKey: ["activity-participants", params],
    queryFn: () => activityBookingsApi.getParticipants(params),
  });
}

