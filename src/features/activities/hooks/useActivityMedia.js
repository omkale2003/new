import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { activityMediaApi } from "../api/activityMedia.api.js";

export function useActivityMedia(params = {}) {
  return useQuery({
    queryKey: ["activity-media", params],
    queryFn: () => activityMediaApi.getMedia(params),
  });
}

export function useAddMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => activityMediaApi.addMedia(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activity-media"] });
    },
  });
}

export function useSetCoverMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ activityId, mediaId }) => activityMediaApi.setCover(activityId, mediaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activity-media"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });
}

export function useUpdateMediaMeta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ mediaId, meta }) => activityMediaApi.updateMediaMeta(mediaId, meta),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activity-media"] });
    },
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mediaId) => activityMediaApi.deleteMedia(mediaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activity-media"] });
    },
  });
}

