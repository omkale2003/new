import { MOCK_SLOTS } from "../services/activityMockData.js";

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));
const SLOTS_STORAGE_KEY = "konkantrip_activity_slots_list";

function getLocalSlots() {
  const raw = localStorage.getItem(SLOTS_STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // ignore
    }
  }
  localStorage.setItem(SLOTS_STORAGE_KEY, JSON.stringify(MOCK_SLOTS));
  return MOCK_SLOTS;
}

function saveLocalSlots(list) {
  localStorage.setItem(SLOTS_STORAGE_KEY, JSON.stringify(list));
}

export const activitySlotsApi = {
  async getSlots({ activity_id, date, status } = {}) {
    await delay();
    let list = getLocalSlots();

    if (activity_id) {
      list = list.filter((s) => s.activity_id === activity_id);
    }
    if (date) {
      list = list.filter((s) => s.activity_date === date);
    }
    if (status && status !== "All") {
      list = list.filter((s) => s.status.toLowerCase() === status.toLowerCase());
    }

    return list;
  },

  async createSlot(slotData) {
    await delay(350);
    const newSlot = {
      ...slotData,
      slot_id: `slt_${Date.now()}`,
      booked_count: 0,
      status: slotData.status || "Available",
      booking_cutoff_hours: Number(slotData.booking_cutoff_hours) || 2,
    };

    const list = getLocalSlots();
    const updated = [newSlot, ...list];
    saveLocalSlots(updated);
    return newSlot;
  },

  async updateSlot(slotId, patch) {
    await delay(300);
    const list = getLocalSlots();
    const idx = list.findIndex((s) => s.slot_id === slotId);
    if (idx === -1) throw new Error(`Slot ${slotId} not found.`);

    const updated = { ...list[idx], ...patch };
    list[idx] = updated;
    saveLocalSlots(list);
    return updated;
  },

  async blockSlot(slotId) {
    return this.updateSlot(slotId, { status: "Blocked" });
  },

  async unblockSlot(slotId) {
    return this.updateSlot(slotId, { status: "Available" });
  },

  async cancelSlot(slotId) {
    return this.updateSlot(slotId, { status: "Cancelled" });
  },

  async deleteSlot(slotId) {
    await delay(250);
    const list = getLocalSlots();
    const filtered = list.filter((s) => s.slot_id !== slotId);
    saveLocalSlots(filtered);
    return { success: true };
  },
};

export default activitySlotsApi;

