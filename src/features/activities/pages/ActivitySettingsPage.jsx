import { useState } from "react";
import { Settings, Shield, Bell, CreditCard, Lock, CheckCircle2 } from "lucide-react";
import Button from "../../../components/ui/Button/Button.jsx";
import Input from "../../../components/ui/Input/Input.jsx";

export function ActivitySettingsPage() {
  const [saved, setSaved] = useState(false);
  const [bankData, setBankData] = useState({
    account_holder: "Konkan Ocean Adventures Pvt Ltd",
    bank_name: "State Bank of India (Malvan Branch)",
    account_number: "••••••••9841",
    ifsc_code: "SBIN0000421",
    upi_id: "konkanocean@sbi",
  });

  const [notifications, setNotifications] = useState({
    sms_booking_alerts: true,
    email_daily_manifest: true,
    whatsapp_dispatch: true,
    weather_warnings: true,
  });

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Account Settings</h1>
        <p className="mt-1 text-xs text-slate-500">
          Configure payout destination, reservation dispatch alerts, and operator preferences.
        </p>
      </div>

      {saved && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Settings updated successfully.
        </div>
      )}

      {/* Payout Banking Details */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-konkan-50 text-konkan-700">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Payout Bank Account & UPI</h3>
            <p className="text-xs text-slate-500">
              Where weekly booking payouts and tourist advance fees are disbursed.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Beneficiary Account Name"
            value={bankData.account_holder}
            onChange={(e) => setBankData({ ...bankData, account_holder: e.target.value })}
          />
          <Input
            label="Bank Name & Branch"
            value={bankData.bank_name}
            onChange={(e) => setBankData({ ...bankData, bank_name: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Bank Account Number"
            value={bankData.account_number}
            onChange={(e) => setBankData({ ...bankData, account_number: e.target.value })}
          />
          <Input
            label="IFSC Code"
            value={bankData.ifsc_code}
            onChange={(e) => setBankData({ ...bankData, ifsc_code: e.target.value })}
          />
          <Input
            label="Direct UPI ID"
            value={bankData.upi_id}
            onChange={(e) => setBankData({ ...bankData, upi_id: e.target.value })}
          />
        </div>
      </div>

      {/* Dispatch Notifications */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Trip Dispatch Alerts</h3>
            <p className="text-xs text-slate-500">
              Notification channels for immediate reservation tickets and guest manifests.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/60 cursor-pointer">
            <div>
              <p className="text-xs font-bold text-slate-900">Instant SMS on New Reservation</p>
              <p className="text-[11px] text-slate-500">Send guest count & slot directly to registered mobile.</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.sms_booking_alerts}
              onChange={(e) =>
                setNotifications({ ...notifications, sms_booking_alerts: e.target.checked })
              }
              className="h-4 w-4 rounded border-slate-300 text-konkan-600 focus:ring-konkan-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/60 cursor-pointer">
            <div>
              <p className="text-xs font-bold text-slate-900">Daily Morning Guest Manifest Email</p>
              <p className="text-[11px] text-slate-500">Receives full PDF manifest of day's participants at 6:00 AM.</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.email_daily_manifest}
              onChange={(e) =>
                setNotifications({ ...notifications, email_daily_manifest: e.target.checked })
              }
              className="h-4 w-4 rounded border-slate-300 text-konkan-600 focus:ring-konkan-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/60 cursor-pointer">
            <div>
              <p className="text-xs font-bold text-slate-900">Automated Maritime Weather Advisories</p>
              <p className="text-[11px] text-slate-500">Receive high tide and rough sea alerts from port authorities.</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.weather_warnings}
              onChange={(e) =>
                setNotifications({ ...notifications, weather_warnings: e.target.checked })
              }
              className="h-4 w-4 rounded border-slate-300 text-konkan-600 focus:ring-konkan-500"
            />
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="button" size="lg" onClick={handleSaveSettings}>
          Save Account Preferences
        </Button>
      </div>
    </div>
  );
}

export default ActivitySettingsPage;

