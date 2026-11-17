import { MOCK_ACTIVITIES, MOCK_CATEGORIES } from "../services/activityMockData.js";
import activityStorageService from "../services/activityStorage.service.js";

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const ACTIVITIES_STORAGE_KEY = "konkantrip_activities_list";

function getLocalActivities() {
  const raw = localStorage.getItem(ACTIVITIES_STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // ignore
    }
  }
  localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(MOCK_ACTIVITIES));
  return MOCK_ACTIVITIES;
}

function saveLocalActivities(list) {
  localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(list));
}

export const activitiesApi = {
  async getCategories() {
    await delay(150);
    return MOCK_CATEGORIES;
  },

  async getActivities({ page = 1, limit = 10, status = "all", search = "", category_id } = {}) {
    await delay();
    let list = getLocalActivities();

    if (status && status !== "all") {
      list = list.filter(
        (a) => a.status.toLowerCase().replace(/\s+/g, "_") === status.toLowerCase().replace(/\s+/g, "_")
      );
    }

    if (category_id) {
      list = list.filter((a) => Number(a.category_id) === Number(category_id));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.city.toLowerCase().includes(q) ||
          a.category_name.toLowerCase().includes(q)
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

  async getActivityById(id) {
    await delay(200);
    const list = getLocalActivities();
    const activity = list.find((a) => a.activity_id === id);
    if (!activity) {
      throw new Error(`Activity with id ${id} not found.`);
    }
    return activity;
  },

  async createActivity(activityPayload, shouldSubmitForReview = false) {
    await delay(500);
    const user = activityStorageService.getUser();
    
    // Check provider status if submitting for review
    if (shouldSubmitForReview && user?.status && user.status !== "Active") {
      throw new Error(
        `Cannot publish activities while your provider account status is "${user.status}". Account must be Active.`
      );
    }

    const newActivity = {
      ...activityPayload,
      activity_id: `act_${Date.now()}`,
      vendor_id: user?.vendor_id || "vnd_001",
      status: shouldSubmitForReview ? "Pending Review" : "Draft",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const list = getLocalActivities();
    const updatedList = [newActivity, ...list];
    saveLocalActivities(updatedList);
    activityStorageService.clearDraft();

    return newActivity;
  },

  async updateActivity(id, patchData) {
    await delay(400);
    const list = getLocalActivities();
    const index = list.findIndex((a) => a.activity_id === id);
    if (index === -1) {
      throw new Error(`Activity ${id} not found.`);
    }

    const updated = {
      ...list[index],
      ...patchData,
      updated_at: new Date().toISOString(),
    };

    list[index] = updated;
    saveLocalActivities(list);
    return updated;
  },

  async deleteActivity(id) {
    await delay(300);
    const list = getLocalActivities();
    const filtered = list.filter((a) => a.activity_id !== id);
    saveLocalActivities(filtered);
    return { success: true, message: "Activity deleted successfully." };
  },

  async updateActivityStatus(id, newStatus) {
    await delay(300);
    const user = activityStorageService.getUser();
    if (newStatus === "Active" && user?.status && user.status !== "Active") {
      throw new Error("Provider account is not active. Publishing restricted.");
    }

    return this.updateActivity(id, { status: newStatus });
  },
};

export default activitiesApi;

