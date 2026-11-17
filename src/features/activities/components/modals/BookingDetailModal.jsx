import {
  X,
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  Ticket,
  CircleDollarSign,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import Button from "../../../../components/ui/Button/Button.jsx";

export function BookingDetailModal({ booking, isOpen, onClose, onUpdateStatus }) {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl z-10 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-base text-slate-900">
                {booking.booking_code}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                  booking.booking_status === "Confirmed"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : booking.booking_status === "Completed"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : booking.booking_status === "Cancelled"
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                {booking.booking_status}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Booked on{" "}
              {new Date(booking.booking_date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Activity & Slot Info */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-konkan-700">
            Activity Reserved
          </p>
          <h4 className="text-sm font-bold text-slate-900">{booking.activity_name}</h4>
          <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>{booking.slot_date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <span>{booking.slot_time}</span>
            </div>
          </div>
        </div>

        {/* Customer Contact */}
        <div className="space-y-3">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Primary Guest Contact
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="rounded-xl border border-slate-100 p-3 bg-white">
              <p className="text-slate-400 text-[11px]">Guest Name</p>
              <p className="font-bold text-slate-900 mt-0.5">{booking.customer_name}</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-3 bg-white">
              <p className="text-slate-400 text-[11px]">Mobile Phone</p>
              <p className="font-bold text-slate-900 mt-0.5">{booking.customer_phone}</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-3 bg-white">
              <p className="text-slate-400 text-[11px]">Email Address</p>
              <p className="font-bold text-slate-900 mt-0.5 truncate">{booking.customer_email}</p>
            </div>
          </div>
        </div>

        {/* Participant Manifest */}
        <div className="space-y-3">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Participant Manifest ({booking.participants?.length || 0} Guests)
          </h5>
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[11px] text-slate-400">
                  <th className="py-2.5 pl-3">Participant Name</th>
                  <th className="py-2.5">Type / Age</th>
                  <th className="py-2.5">Weight</th>
                  <th className="py-2.5">Waiver Status</th>
                  <th className="py-2.5 pr-3">Special Requirement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(booking.participants || []).map((p, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 pl-3 font-semibold text-slate-900">{p.name}</td>
                    <td className="py-2.5 text-slate-600">
                      {p.type} ({p.age} yrs)
                    </td>
                    <td className="py-2.5 text-slate-600">{p.weight_kg} kg</td>
                    <td className="py-2.5">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          p.waiver_status === "Signed"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {p.waiver_status}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3 text-slate-500 text-[11px]">
                      {p.special_requirements || "None"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="space-y-3">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Pricing Breakdown
          </h5>
          <div className="rounded-2xl border border-slate-100 p-4 space-y-2 text-xs">
            {(booking.items || []).map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-slate-700">
                <span>
                  {item.description} ({item.quantity} × ₹{item.unit_price})
                </span>
                <span className="font-semibold text-slate-900">
                  ₹{Number(item.total).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
            <div className="pt-2 border-t border-slate-100 flex justify-between items-center font-bold text-sm text-slate-900">
              <span>Total Paid Amount:</span>
              <span className="text-konkan-800">
                ₹{Number(booking.total_amount).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
              <span>Payment Mode: {booking.payment_method}</span>
              <span>Txn Ref: {booking.transaction_id || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Special Requests */}
        {booking.special_requests && (
          <div className="rounded-xl bg-amber-50/70 border border-amber-200/80 p-3 text-xs text-amber-900">
            <span className="font-bold">Guest Special Instructions:</span>
            <p className="mt-0.5">{booking.special_requests}</p>
          </div>
        )}

        {/* Cancellation Reason if cancelled */}
        {booking.cancellation_reason && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-900">
            <span className="font-bold">Cancellation Reason:</span>
            <p className="mt-0.5">{booking.cancellation_reason}</p>
          </div>
        )}

        {/* Status Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Update Status:</span>
            {["Confirmed", "Completed", "Cancelled", "No Show"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => onUpdateStatus(booking.booking_id, st)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  booking.booking_status === st
                    ? "bg-konkan-700 text-white"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingDetailModal;

