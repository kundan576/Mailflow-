"use client";
import { useState, useEffect } from "react";
import AppShell from "../../components/layout/AppShell";
import { useRouter } from "next/navigation";

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17];

function getWeekDates(baseDate) {
  const start = new Date(baseDate);
  start.setDate(start.getDate() - start.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export default function CalendarPage() {
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState(getWeekDates(new Date()));
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    invite: "",
  });
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setWeekDates(getWeekDates(currentDate));
    fetchEvents();
  }, [currentDate]);

  async function fetchEvents() {
    setLoading(true);
    try {
      const res = await fetch("/api/calendar");
      if (res.status === 401) {
        router.replace("/");
        return;
      }
      const data = await res.json();
      if (data?.events) setEvents(data.events);
    } catch (err) {
      console.error("Calendar error:", err);
    }
    setLoading(false);
  }

  function prevWeek() {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  }

  function nextWeek() {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  }

  function getEventForSlot(dayIdx, hour) {
    return events.find((e) => {
      const start = new Date(e.start);
      return (
        start.getDay() === dayIdx &&
        start.getHours() === hour &&
        start.toDateString() === weekDates[dayIdx].toDateString()
      );
    });
  }

  const todayIdx = new Date().getDay();
  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  async function handleCreate() {
    if (!form.title || !form.date || !form.time) return;
    setCreating(true);
    try {
      const dateTime = new Date(`${form.date}T${form.time}`);
      const endTime = new Date(dateTime.getTime() + 60 * 60 * 1000);
      await fetch("/api/calendar/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          start: dateTime.toISOString(),
          end: endTime.toISOString(),
          attendee: form.invite,
        }),
      });
      setShowModal(false);
      setForm({ title: "", date: "", time: "", invite: "" });
      fetchEvents();
    } catch (err) {
      console.error("Create event error:", err);
    }
    setCreating(false);
  }

  return (
    <AppShell>
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={prevWeek}
              className="text-white/25 hover:text-white/60 transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <h2 className="text-sm font-semibold text-white/70 tracking-tight">
              {monthYear}
            </h2>
            <button
              onClick={nextWeek}
              className="text-white/25 hover:text-white/60 transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchEvents}
              className="text-xs text-white/40 border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors"
            >
              {loading ? "Syncing..." : "Refresh"}
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 text-xs text-[#0f0f0f] bg-[#4ade80] px-3 py-1.5 rounded-lg font-medium hover:bg-[#4ade80]/90 transition-colors"
            >
              + New event
            </button>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="flex-1 overflow-auto px-4 pb-4">
          <div className="min-w-[700px]">
            {/* Day headers */}
            <div className="grid grid-cols-[50px_repeat(7,1fr)] border-b border-white/[0.06] sticky top-0 bg-[#0f0f0f] z-10">
              <div />
              {DAYS.map((day, i) => (
                <div key={day} className="py-3 text-center">
                  <div className="text-[10px] text-white/30 tracking-widest mb-1">
                    {day}
                  </div>
                  <div
                    className={`text-sm font-medium mx-auto w-7 h-7 flex items-center justify-center rounded-full ${
                      weekDates[i]?.toDateString() === new Date().toDateString()
                        ? "text-[#4ade80] bg-[#4ade80]/15"
                        : "text-white/40"
                    }`}
                  >
                    {weekDates[i]?.getDate()}
                  </div>
                </div>
              ))}
            </div>

            {/* Time rows */}
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="grid grid-cols-[50px_repeat(7,1fr)] border-b border-white/[0.04] min-h-[56px]"
              >
                <div className="py-2 pr-3 text-right">
                  <span className="text-[10px] text-white/20">
                    {hour > 12 ? `${hour - 12}pm` : `${hour}am`}
                  </span>
                </div>
                {DAYS.map((_, dayIdx) => {
                  const event = getEventForSlot(dayIdx, hour);
                  return (
                    <div
                      key={dayIdx}
                      className="border-l border-white/[0.04] relative p-1"
                    >
                      {event && (
                        <div className="bg-[#4ade80]/15 border border-[#4ade80]/25 rounded-md px-2 py-1.5 cursor-pointer hover:bg-[#4ade80]/20 transition-colors">
                          <span className="text-xs text-[#4ade80] font-medium">
                            {event.title}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* New event modal */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-[#1a1a1a] border border-white/[0.08] rounded-2xl p-6 w-full max-w-sm mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-sm font-semibold text-white/80 mb-4">
                New event
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Title", key: "title", placeholder: "Event title" },
                  { label: "Date", key: "date", placeholder: "2026-06-05" },
                  { label: "Time", key: "time", placeholder: "09:00" },
                  {
                    label: "Invite",
                    key: "invite",
                    placeholder: "email@example.com",
                  },
                ].map(({ label, key, placeholder }) => (
                  <div key={label}>
                    <label className="text-[10px] text-white/30 tracking-wider uppercase block mb-1">
                      {label}
                    </label>
                    <input
                      value={form[key]}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, [key]: e.target.value }))
                      }
                      placeholder={placeholder}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white/60 placeholder-white/20 outline-none focus:border-[#4ade80]/40 transition-colors"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 text-xs text-white/40 border border-white/[0.08] py-2 rounded-lg hover:bg-white/[0.04] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={creating}
                  className="flex-1 text-xs text-[#0f0f0f] bg-[#4ade80] py-2 rounded-lg font-medium hover:bg-[#4ade80]/90 transition-colors disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create event"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
