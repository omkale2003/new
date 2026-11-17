import { MOCK_RATES } from "../services/activityMockData.js";

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));
const RATES_STORAGE_KEY = "konkantrip_activity_rates_list";

function getLocalRates() {
  const raw = localStorage.getItem(RATES_STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // ignore
    }
  }
  localStorage.setItem(RATES_STORAGE_KEY, JSON.stringify(MOCK_RATES));
  return MOCK_RATES;
}

function saveLocalRates(list) {
  localStorage.setItem(RATES_STORAGE_KEY, JSON.stringify(list));
}

export const activityRatesApi = {
  async getRates({ activity_id, participant_type, is_active } = {}) {
    await delay();
    let list = getLocalRates();

    if (activity_id) {
      list = list.filter((r) => r.activity_id === activity_id);
    }
    if (participant_type && participant_type !== "All") {
      list = list.filter((r) => r.participant_type === participant_type);
    }
    if (typeof is_active === "boolean") {
      list = list.filter((r) => r.is_active === is_active);
    }

    return list;
  },

  async createRate(rateData) {
    await delay(350);
    const newRate = {
      ...rateData,
      rate_id: `rat_${Date.now()}`,
      is_active: rateData.is_active ?? true,
      currency: rateData.currency || "INR",
    };

    const list = getLocalRates();
    const updated = [newRate, ...list];
    saveLocalRates(updated);
    return newRate;
  },

  async updateRate(rateId, patch) {
    await delay(300);
    const list = getLocalRates();
    const idx = list.findIndex((r) => r.rate_id === rateId);
    if (idx === -1) throw new Error(`Rate ${rateId} not found.`);

    const updatedItem = { ...list[idx], ...patch };
    list[idx] = updatedItem;
    saveLocalRates(list);
    return updatedItem;
  },

  async toggleRateStatus(rateId) {
    await delay(200);
    const list = getLocalRates();
    const idx = list.findIndex((r) => r.rate_id === rateId);
    if (idx === -1) throw new Error(`Rate ${rateId} not found.`);

    list[idx].is_active = !list[idx].is_active;
    saveLocalRates(list);
    return list[idx];
  },

  async deleteRate(rateId) {
    await delay(250);
    const list = getLocalRates();
    const filtered = list.filter((r) => r.rate_id !== rateId);
    saveLocalRates(filtered);
    return { success: true };
  },
};

export default activityRatesApi;

