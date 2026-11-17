import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { activitiesApi } from "../api/activities.api.js";

export const ACTIVITY_QUERY_KEYS = {
  ALL: ["activities"],
  LIST: (params) => ["activities", "list", params],
  DETAIL: (id) => ["activities", "detail", id],
  CATEGORIES: ["activities", "categories"],
  RATES: (activityId) => ["activities", "rates", activityId],
  SLOTS: (params) => ["activities", "slots", params],
  BOOKINGS: (params) => ["activities", "bookings", params],
  BOOKING_DETAIL: (id) => ["activities", "booking", id],
  PARTICIPANTS: (params) => ["activities", "participants", params],
  MEDIA: (activityId) => ["activities", "media", activityId],
  PROFILE: ["activities", "profile"],
};

export function useActivities(params = {}) {
  return useQuery({
    queryKey: ACTIVITY_QUERY_KEYS.LIST(params),
    queryFn: () => activitiesApi.getActivities(params),
  });
}

export function useActivity(id) {
  return useQuery({
    queryKey: ACTIVITY_QUERY_KEYS.DETAIL(id),
    queryFn: () => activitiesApi.getActivityById(id),
    enabled: Boolean(id),
  });
}

export function useActivityCategories() {
  return useQuery({
    queryKey: ACTIVITY_QUERY_KEYS.CATEGORIES,
    queryFn: () => activitiesApi.getCategories(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ payload, shouldSubmitForReview }) =>
      activitiesApi.createActivity(payload, shouldSubmitForReview),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITY_QUERY_KEYS.ALL });
    },
  });
}

export function useUpdateActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }) => activitiesApi.updateActivity(id, patch),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ACTIVITY_QUERY_KEYS.ALL });
      queryClient.invalidateQueries({ queryKey: ACTIVITY_QUERY_KEYS.DETAIL(variables.id) });
    },
  });
}

export function useDeleteActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => activitiesApi.deleteActivity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITY_QUERY_KEYS.ALL });
    },
  });
}

export function useUpdateActivityStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => activitiesApi.updateActivityStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITY_QUERY_KEYS.ALL });
    },
  });
}

