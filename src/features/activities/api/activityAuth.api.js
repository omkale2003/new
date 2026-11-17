import activityStorageService from "../services/activityStorage.service.js";
import { MOCK_VENDOR } from "../services/activityMockData.js";

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const activityAuthApi = {
  async register(data) {
    await delay();
    const vendor = {
      ...MOCK_VENDOR,
      vendor_id: `vnd_${Date.now()}`,
      account_type: data.account_type || "Individual",
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone,
      email: data.email,
      business_name: data.business_name || "",
      legal_business_name: data.legal_business_name || "",
      business_type: data.business_type || "",
      gstin: data.gstin || "",
      business_registration_number: data.business_registration_number || "",
      public_display_name: data.public_display_name || `${data.first_name} ${data.last_name}`,
      bio: data.bio || "",
      years_of_experience: Number(data.years_of_experience) || 0,
      languages_spoken: data.languages_spoken || ["Marathi", "Hindi", "English"],
      contact_phone: data.contact_phone || data.phone,
      contact_email: data.contact_email || data.email,
      insurance_details: data.insurance_details || "",
      licence_details: data.licence_details || "",
      emergency_contact_name: data.emergency_contact_name || "",
      emergency_contact_phone: data.emergency_contact_phone || "",
      status: "Pending Verification",
      mobile_verified: false,
      email_verified: false,
      created_at: new Date().toISOString(),
    };

    activityStorageService.setUser(vendor);
    activityStorageService.setVerificationState({
      mobileVerified: false,
      emailVerified: false,
    });

    return {
      success: true,
      message: "Activity provider registration initiated. Please verify mobile and email OTP.",
      vendor,
    };
  },

  async sendMobileOtp(phone) {
    await delay();
    return {
      success: true,
      message: `OTP sent successfully to mobile number ${phone}. (Mock OTP: 123456)`,
    };
  },

  async verifyMobileOtp(phone, otp) {
    await delay();
    if (otp !== "123456" && otp.length !== 6) {
      throw new Error("Invalid mobile verification code. Please enter 123456 for demo.");
    }
    const current = activityStorageService.getVerificationState();
    const updated = { ...current, mobileVerified: true };
    activityStorageService.setVerificationState(updated);

    const user = activityStorageService.getUser();
    if (user) {
      user.mobile_verified = true;
      if (updated.emailVerified) {
        user.status = "Pending Review"; // Moves to Pending Review when both OTPs verified
      }
      activityStorageService.setUser(user);
    }

    return {
      success: true,
      message: "Mobile number verified successfully.",
      verificationState: updated,
    };
  },

  async sendEmailOtp(email) {
    await delay();
    return {
      success: true,
      message: `OTP sent successfully to email ${email}. (Mock OTP: 654321)`,
    };
  },

  async verifyEmailOtp(email, otp) {
    await delay();
    if (otp !== "654321" && otp.length !== 6) {
      throw new Error("Invalid email verification code. Please enter 654321 for demo.");
    }
    const current = activityStorageService.getVerificationState();
    const updated = { ...current, emailVerified: true };
    activityStorageService.setVerificationState(updated);

    const user = activityStorageService.getUser();
    if (user) {
      user.email_verified = true;
      if (updated.mobileVerified) {
        user.status = "Pending Review";
      }
      activityStorageService.setUser(user);
    }

    return {
      success: true,
      message: "Email address verified successfully.",
      verificationState: updated,
    };
  },

  async login(credentials) {
    await delay();
    const { email, password, login_method, otp } = credentials;

    if (login_method === "otp") {
      if (otp !== "123456") {
        throw new Error("Invalid OTP code. Use 123456 for testing.");
      }
    } else {
      if (!password || password.length < 6) {
        throw new Error("Password must be at least 6 characters.");
      }
    }

    let existingUser = activityStorageService.getUser();
    if (!existingUser || existingUser.email !== email) {
      existingUser = {
        ...MOCK_VENDOR,
        email: email || MOCK_VENDOR.email,
      };
      activityStorageService.setUser(existingUser);
    }

    const token = `act_jwt_${Date.now()}_mock_token`;
    activityStorageService.setToken(token);

    return {
      success: true,
      token,
      user: existingUser,
    };
  },

  async forgotPassword(email) {
    await delay();
    return {
      success: true,
      message: `Password reset instructions sent to ${email}.`,
    };
  },

  async getProfile() {
    await delay(200);
    const user = activityStorageService.getUser() || MOCK_VENDOR;
    return user;
  },

  async updateProfile(updatedData) {
    await delay();
    const current = activityStorageService.getUser() || MOCK_VENDOR;
    const merged = { ...current, ...updatedData, updated_at: new Date().toISOString() };
    activityStorageService.setUser(merged);
    return merged;
  },

  async checkStatus() {
    await delay(150);
    const user = activityStorageService.getUser() || MOCK_VENDOR;
    return {
      status: user.status || "Active",
      mobile_verified: Boolean(user.mobile_verified),
      email_verified: Boolean(user.email_verified),
      can_publish: user.status === "Active",
    };
  },
};

export default activityAuthApi;

