"use client"
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserData {
  name: string;
  createdAt: string;
}

interface profileDataType {
  name: string;
  totalMinutes: number;
  todayMinutes: number;
  battleCount: number;
  _id: string;
  dailyLog: Record<string, number>;
}

interface SkillCardProps {
  name: string;
  totalMinutes: number;
  todayMinutes: number;
  dailyLog: Record<string, number>;
}

// ── helpers ──────────────────────────────────────────────
function getLast30Days(): string[] {
  const days: string[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

function getDaysOfYear(year: number): string[] {
  const days: string[] = [];
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

function getCircleColor(value: number): string {
  if (value === 0) return "#001421";
  if (value === 1) return "#004069";
  if (value === 2) return "#005082";
  if (value === 3) return "#0063A1";
  if (value === 4) return" #0081D1";
   return "#00A1FF";
}

function getMembershipDuration(dateString: string): string {
  const created = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const remainingDays = days % 30;
  return `Member for ${months} months ${remainingDays} days`;
}

// dummy skills with empty dailyLog for unauthenticated users
function getDummySkills() {
  return [
    { _id: "dummy-1", name: "Skill 1", totalMinutes: 0, todayMinutes: 0, battleCount: 0, dailyLog: {} },
    { _id: "dummy-2", name: "Skill 2", totalMinutes: 0, todayMinutes: 0, battleCount: 0, dailyLog: {} },
    { _id: "dummy-3", name: "Skill 3", totalMinutes: 0, todayMinutes: 0, battleCount: 0, dailyLog: {} },
  ];
}

// dummy consistency data for unauthenticated users — all empty
const dummyConsistency: Record<string, number> = {};

// ── Main Tracker ──────────────────────────────────────────
function MainTracker({
  consistencyData,
  createdAt,
}: {
  consistencyData: Record<string, number>;
  createdAt: string | undefined;
}) {
  const currentYear = new Date().getFullYear();
  const startYear = createdAt ? new Date(createdAt).getFullYear() : currentYear;
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const days = getDaysOfYear(selectedYear);
  const weeks: string[][] = [];
  const firstDayOfWeek = new Date(days[0]).getDay();
  const paddedDays = [...Array(firstDayOfWeek).fill(""), ...days];
  for (let i = 0; i < paddedDays.length; i += 7) {
    weeks.push(paddedDays.slice(i, i + 7));
  }

  const monthLabels: { label: string; weekIndex: number }[] = [];
  weeks.forEach((week, wi) => {
    const firstReal = week.find((d) => d !== "");
    if (firstReal) {
      const date = new Date(firstReal);
      if (date.getDate() <= 7) {
        monthLabels.push({
          label: date.toLocaleString("default", { month: "short" }),
          weekIndex: wi,
        });
      }
    }
  });

  const activeDays = Object.values(consistencyData).filter((v) => v > 0).length;

  return (
    <div className="bg-[#111827] rounded-2xl p-5 border border-gray-800">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h3 className="text-base font-semibold text-white">Consistency Tracker</h3>
          <p className="text-xs text-gray-500 mt-0.5">Brighter = more skills done that day</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            <span className="text-blue-400 font-bold">{activeDays}</span> active days
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedYear((y) => Math.max(y - 1, startYear))}
              disabled={selectedYear <= startYear}
              className="px-2 py-1 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-30 text-sm transition-colors"
            >←</button>
            <span className="text-white text-sm font-medium w-10 text-center">{selectedYear}</span>
            <button
              onClick={() => setSelectedYear((y) => Math.min(y + 1, currentYear))}
              disabled={selectedYear >= currentYear}
              className="px-2 py-1 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-30 text-sm transition-colors"
            >→</button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div style={{ minWidth: "700px" }}>
          <div className="flex mb-1 pl-7">
            {weeks.map((_, wi) => {
              const label = monthLabels.find((m) => m.weekIndex === wi);
              return (
                <div key={wi} style={{ width: "15px", marginRight: "3px", flexShrink: 0 }}
                  className="text-xs text-gray-600">
                  {label ? label.label : ""}
                </div>
              );
            })}
          </div>

          <div className="flex">
            <div className="flex flex-col mr-2" style={{ gap: "3px" }}>
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <div key={i} className="text-xs text-gray-600 text-right"
                  style={{ height: "15px", lineHeight: "15px", width: "20px" }}>
                  {d}
                </div>
              ))}
            </div>

            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col" style={{ gap: "3px", marginRight: "3px" }}>
                {week.map((day, di) => {
                  if (!day) return <div key={`e-${di}`} style={{ width: "15px", height: "15px" }} />;
                  const value = Math.min(consistencyData[day] || 0, 5);
                  return (
                    <div
                      key={day}
                      title={`${day}: ${consistencyData[day] || 0} sessions`}
                      style={{
                        width: "15px", height: "15px",
                        borderRadius: "50%",
                        backgroundColor: getCircleColor(value),
                        flexShrink: 0,
                        border: "1px solid rgba(255,255,255,0.05)",
                        transition: "transform 0.15s",
                        cursor: "default",
                      }}
                      onMouseEnter={(e) => ((e.target as HTMLElement).style.transform = "scale(1.5)")}
                      onMouseLeave={(e) => ((e.target as HTMLElement).style.transform = "scale(1)")}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-3 justify-end">
            <span className="text-xs text-gray-600">Less</span>
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <div key={n} style={{
                width: "12px", height: "12px", borderRadius: "50%",
                backgroundColor: getCircleColor(n),
                border: "1px solid rgba(255,255,255,0.05)",
              }} />
            ))}
            <span className="text-xs text-gray-600">More</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Skill Card ────────────────────────────────────────────
function SkillCard({ name, totalMinutes, todayMinutes, dailyLog }: SkillCardProps) {
  const last30 = getLast30Days();
  const activeDays = Object.values(dailyLog).filter((v) => v > 0).length;

  return (
    <div className="bg-[#111827] rounded-xl p-5 border border-gray-800 hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-medium text-white">{name}</h3>
          <div className="flex gap-4 mt-1">
            <p className="text-gray-400 text-sm">Time Invested: {totalMinutes} min</p>
            <p className="text-gray-400 text-sm">Today: {todayMinutes} min</p>
          </div>
        </div>
        <span className="text-xs text-gray-600">
          <span className="text-green-400 font-medium">{activeDays}</span> days
        </span>
      </div>

      {/* 30 day mini tracker */}
      <div className="overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        <div className="flex gap-1" style={{ width: "max-content" }}>
          {last30.map((day) => {
            const value = Math.min(dailyLog[day] || 0, 5);
            return (
              <div
                key={day}
                title={`${day}: ${dailyLog[day] || 0} sessions`}
                style={{
                  width: "14px", height: "14px",
                  borderRadius: "50%",
                  backgroundColor: getCircleColor(value),
                  flexShrink: 0,
                  border: "1px solid rgba(255,255,255,0.05)",
                  transition: "transform 0.15s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.transform = "scale(1.4)")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.transform = "scale(1)")}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Profile Page ──────────────────────────────────────────
export default function ProfilePage() {
  const [skills, setSkills] = useState<profileDataType[]>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const { status } = useSession();
  const router = useRouter();

  // merge all skill dailyLogs for main tracker
  const consistencyData: Record<string, number> = {};
  skills.forEach((skill) => {
    Object.entries(skill.dailyLog || {}).forEach(([date, value]) => {
      consistencyData[date] = (consistencyData[date] || 0) + (value as number);
    });
  });

  useEffect(() => {
    if (status !== "authenticated") return;
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (!res.ok) return;
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, [status]);

  useEffect(() => {
    if (status !== "authenticated") return;
    const fetchSkills = async () => {
      try {
        const res = await fetch("/api/skills");
        const data = await res.json();
        setSkills(data);
      } catch (error) {
        console.log("Failed to fetch skill in profile", error);
      }
    };
    fetchSkills();
  }, [status]);

  const name = user?.name || "Username";
  const memberText = user?.createdAt ? getMembershipDuration(user.createdAt) : "Member for -";
  const displaySkills = status === "authenticated" ? skills : getDummySkills();
  const displayConsistency = status === "authenticated" ? consistencyData : dummyConsistency;

  if (status === "loading") {
    return <p className="p-4 text-sm text-gray-400">Loading ...</p>;
  }

  return (
    <div className="space-y-10">

      {/* Profile Header — unchanged */}
      <div className="bg-[#111827] rounded-2xl p-6 shadow-lg border border-gray-800">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{name}</h2>
            <p className="text-gray-400 text-sm">{memberText}</p>
            {status === "authenticated" ? (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => router.push("/signup")}
                className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm"
              >
                To Track Progress Signup
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Tracker — replaces stat cards */}
      <MainTracker
        consistencyData={displayConsistency}
        createdAt={user?.createdAt}
      />

      {/* Skill Cards */}
      <div className="space-y-5">
        {displaySkills.map((skill) => (
          <SkillCard
            key={skill._id}
            name={skill.name}
            totalMinutes={skill.totalMinutes}
            todayMinutes={skill.todayMinutes}
            dailyLog={skill.dailyLog || {}}
          />
        ))}
      </div>

    </div>
  );
}