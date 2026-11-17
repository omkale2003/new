import { MOCK_MEDIA } from "../services/activityMockData.js";

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));
const MEDIA_STORAGE_KEY = "konkantrip_activity_media_list";

function getLocalMedia() {
  const raw = localStorage.getItem(MEDIA_STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // ignore
    }
  }
  localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(MOCK_MEDIA));
  return MOCK_MEDIA;
}

function saveLocalMedia(list) {
  localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(list));
}

export const activityMediaApi = {
  async getMedia({ activity_id, media_type } = {}) {
    await delay();
    let list = getLocalMedia();

    if (activity_id) {
      list = list.filter((m) => m.activity_id === activity_id);
    }
    if (media_type && media_type !== "All") {
      list = list.filter((m) => m.media_type === media_type);
    }

    return list.sort((a, b) => a.display_order - b.display_order);
  },

  async addMedia(mediaPayload) {
    await delay(400);
    const list = getLocalMedia();
    const newMedia = {
      ...mediaPayload,
      media_id: `med_${Date.now()}`,
      display_order: mediaPayload.display_order || list.length + 1,
      is_cover: Boolean(mediaPayload.is_cover),
      created_at: new Date().toISOString(),
    };

    if (newMedia.is_cover) {
      list.forEach((m) => {
        if (m.activity_id === newMedia.activity_id) {
          m.is_cover = false;
        }
      });
    }

    const updated = [...list, newMedia];
    saveLocalMedia(updated);
    return newMedia;
  },

  async setCover(activityId, mediaId) {
    await delay(250);
    const list = getLocalMedia();
    list.forEach((m) => {
      if (m.activity_id === activityId) {
        m.is_cover = m.media_id === mediaId;
      }
    });
    saveLocalMedia(list);
    return { success: true };
  },

  async updateMediaMeta(mediaId, { caption, alt_text, display_order }) {
    await delay(250);
    const list = getLocalMedia();
    const idx = list.findIndex((m) => m.media_id === mediaId);
    if (idx === -1) throw new Error(`Media ${mediaId} not found.`);

    if (caption !== undefined) list[idx].caption = caption;
    if (alt_text !== undefined) list[idx].alt_text = alt_text;
    if (display_order !== undefined) list[idx].display_order = Number(display_order);

    saveLocalMedia(list);
    return list[idx];
  },

  async deleteMedia(mediaId) {
    await delay(250);
    const list = getLocalMedia();
    const filtered = list.filter((m) => m.media_id !== mediaId);
    saveLocalMedia(filtered);
    return { success: true };
  },
};

export default activityMediaApi;

