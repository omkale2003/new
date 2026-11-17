import { useState } from "react";
import Input from "../../../../components/ui/Input/Input.jsx";
import Button from "../../../../components/ui/Button/Button.jsx";
import { ArrowLeft, ArrowRight, Plus, Trash2, CalendarClock, Clock } from "lucide-react";

export function Step6Availability({ initialData, onNext, onPrev }) {
  const [slots, setSlots] = useState(() =>
    initialData?.slots?.length
      ? initialData.slots
      : [
          {
            activity_date: "2024-11-20",
            start_time: "09:00",
            end_time: "11:00",
            capacity: 8,
            booking_cutoff_hours: 4,
            status: "Available",
            special_price: null,
            notes: "Morning high visibility session",
          },
          {
            activity_date: "2024-11-20",
            start_time: "14:00",
            end_time: "16:00",
            capacity: 8,
            booking_cutoff_hours: 4,
            status: "Available",
            special_price: null,
            notes: "Afternoon dive session",
          },
        ]
  );

  const [currentSlot, setCurrentSlot] = useState({
    activity_date: "2024-11-21",
    start_time: "10:00",
    end_time: "12:00",
    capacity: 10,
    booking_cutoff_hours: 3,
    status: "Available",
    special_price: "",
    notes: "",
  });

  const [slotError, setSlotError] = useState("");

  const handleAddSlot = (e) => {
    e.preventDefault();
    if (!currentSlot.activity_date) {
      setSlotError("Date is required.");
      return;
    }
    if (!currentSlot.start_time || !currentSlot.end_time) {
      setSlotError("Start and end times are required.");
      return;
    }

    setSlotError("");
    setSlots([
      ...slots,
      {
        ...currentSlot,
        capacity: Number(currentSlot.capacity) || 8,
        booking_cutoff_hours: Number(currentSlot.booking_cutoff_hours) || 2,
        special_price: currentSlot.special_price ? Number(currentSlot.special_price) : null,
      },
    ]);

    setCurrentSlot({
      activity_date: currentSlot.activity_date,
      start_time: "16:00",
      end_time: "18:00",
      capacity: 8,
      booking_cutoff_hours: 3,
      status: "Available",
      special_price: "",
      notes: "",
    });
  };

  const handleRemoveSlot = (index) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext({ slots });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-lg font-bold text-slate-900">Step 6 — Slot Availability & Schedules</h3>
        <p className="text-xs text-slate-500">
          Create operational time batches, specify cutoff limits, and set per-slot capacity.
        </p>
      </div>

      {slotError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
          {slotError}
        </div>
      )}

      {/* Slots List */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Configured Slots ({slots.length})
        </h4>

        {slots.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No slots scheduled yet. Add below.</p>
        ) : (
          <div className="space-y-2.5">
            {slots.map((s, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">
                        {s.activity_date} • {s.start_time} - {s.end_time}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                        {s.capacity} Guests Max
                      </span>
                      {s.special_price && (
                        <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                          Special: ₹{s.special_price}
                        </span>
                      )}
                    </div>
                    {s.notes && <p className="text-[11px] text-slate-500 mt-0.5">{s.notes}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">
                    Cutoff: {s.booking_cutoff_hours}h prior
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSlot(idx)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Slot Block */}
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-5 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
          <Plus className="h-4 w-4 text-konkan-600" /> Schedule A Time Slot
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Slot Date"
            type="date"
            value={currentSlot.activity_date}
            onChange={(e) => setCurrentSlot({ ...currentSlot, activity_date: e.target.value })}
          />
          <Input
            label="Start Time"
            type="time"
            value={currentSlot.start_time}
            onChange={(e) => setCurrentSlot({ ...currentSlot, start_time: e.target.value })}
          />
          <Input
            label="End Time"
            type="time"
            value={currentSlot.end_time}
            onChange={(e) => setCurrentSlot({ ...currentSlot, end_time: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Seat Capacity"
            type="number"
            value={currentSlot.capacity}
            onChange={(e) => setCurrentSlot({ ...currentSlot, capacity: e.target.value })}
          />
          <Input
            label="Booking Cutoff (Hours before start)"
            type="number"
            value={currentSlot.booking_cutoff_hours}
            onChange={(e) => setCurrentSlot({ ...currentSlot, booking_cutoff_hours: e.target.value })}
          />
          <Input
            label="Special Price Override (Optional)"
            type="number"
            placeholder="Default rate if empty"
            value={currentSlot.special_price}
            onChange={(e) => setCurrentSlot({ ...currentSlot, special_price: e.target.value })}
          />
        </div>

        <Input
          label="Internal Operator Notes / Tidal Advisory"
          placeholder="e.g. Low tide slot, optimal water clarity"
          value={currentSlot.notes}
          onChange={(e) => setCurrentSlot({ ...currentSlot, notes: e.target.value })}
        />

        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={handleAddSlot}
            className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-xs font-semibold shadow-xs"
          >
            + Add Slot Schedule
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <Button type="button" variant="secondary" onClick={onPrev}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Previous
        </Button>
        <Button type="button" onClick={handleSubmit}>
          Next: Media Gallery <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

export default Step6Availability;

