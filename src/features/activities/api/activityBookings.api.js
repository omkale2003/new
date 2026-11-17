import { MOCK_BOOKINGS } from "../services/activityMockData.js";

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));
const BOOKINGS_STORAGE_KEY = "konkantrip_activity_bookings_list";

function getLocalBookings() {
  const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // ignore
    }
  }
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(MOCK_BOOKINGS));
  return MOCK_BOOKINGS;
}

function saveLocalBookings(list) {
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(list));
}

export const activityBookingsApi = {
  async getBookings({ page = 1, limit = 10, status = "All", search = "", activity_id } = {}) {
    await delay();
    let list = getLocalBookings();

    if (status && status !== "All") {
      list = list.filter((b) => b.booking_status.toLowerCase() === status.toLowerCase());
    }

    if (activity_id) {
      list = list.filter((b) => b.activity_id === activity_id);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.booking_code.toLowerCase().includes(q) ||
          b.customer_name.toLowerCase().includes(q) ||
          b.activity_name.toLowerCase().includes(q) ||
          b.customer_phone.includes(q)
      );
    }

    const total = list.length;
    const startIndex = (page - 1) * limit;
    const paged = list.slice(startIndex, startIndex + limit);

    return {
      data: paged,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  },

  async getBookingById(bookingId) {
    await delay(200);
    const list = getLocalBookings();
    const item = list.find((b) => b.booking_id === bookingId || b.booking_code === bookingId);
    if (!item) throw new Error(`Booking ${bookingId} not found.`);
    return item;
  },

  async updateBookingStatus(bookingId, status, reason = null) {
    await delay(350);
    const list = getLocalBookings();
    const idx = list.findIndex((b) => b.booking_id === bookingId);
    if (idx === -1) throw new Error(`Booking ${bookingId} not found.`);

    list[idx].booking_status = status;
    if (reason) list[idx].cancellation_reason = reason;
    saveLocalBookings(list);
    return list[idx];
  },

  async getParticipants({ search = "", activity_id, waiver_status } = {}) {
    await delay();
    const list = getLocalBookings();
    let participants = [];

    list.forEach((b) => {
      if (activity_id && b.activity_id !== activity_id) return;
      (b.participants || []).forEach((p) => {
        participants.push({
          ...p,
          booking_code: b.booking_code,
          activity_name: b.activity_name,
          slot_date: b.slot_date,
          slot_time: b.slot_time,
          customer_name: b.customer_name,
          booking_id: b.booking_id,
        });
      });
    });

    if (waiver_status && waiver_status !== "All") {
      participants = participants.filter((p) => p.waiver_status === waiver_status);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      participants = participants.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.booking_code.toLowerCase().includes(q) ||
          p.activity_name.toLowerCase().includes(q)
      );
    }

    return participants;
  },
};

export default activityBookingsApi;

