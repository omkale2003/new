import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { activityRatesApi } from "../api/activityRates.api.js";
import { ACTIVITY_QUERY_KEYS } from "./useActivities.js";

export function useActivityRates(params = {}) {
  return useQuery({
    queryKey: ["activity-rates", params],
    queryFn: () => activityRatesApi.getRates(params),
  });
}

export function useCreateRate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => activityRatesApi.createRate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activity-rates"] });
      queryClient.invalidateQueries({ queryKey: ACTIVITY_QUERY_KEYS.ALL });
    },
  });
}

export function useUpdateRate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }) => activityRatesApi.updateRate(id, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activity-rates"] });
    },
  });
}

export function useToggleRateStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => activityRatesApi.toggleRateStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activity-rates"] });
    },
  });
}

export function useDeleteRate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => activityRatesApi.deleteRate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activity-rates"] });
    },
  });
}

