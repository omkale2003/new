import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { activitySlotsApi } from "../api/activitySlots.api.js";

export function useActivitySlots(params = {}) {
  return useQuery({
    queryKey: ["activity-slots", params],
    queryFn: () => activitySlotsApi.getSlots(params),
  });
}

export function useCreateSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => activitySlotsApi.createSlot(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activity-slots"] });
    },
  });
}

export function useUpdateSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }) => activitySlotsApi.updateSlot(id, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activity-slots"] });
    },
  });
}

export function useBlockSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => activitySlotsApi.blockSlot(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activity-slots"] });
    },
  });
}

export function useUnblockSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => activitySlotsApi.unblockSlot(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activity-slots"] });
    },
  });
}

export function useCancelSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => activitySlotsApi.cancelSlot(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activity-slots"] });
    },
  });
}

export function useDeleteSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => activitySlotsApi.deleteSlot(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activity-slots"] });
    },
  });
}

