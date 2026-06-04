"use client";

import { useState, useEffect, useCallback } from "react";
import WindowFloat from "../ui/WindowFloat";

interface WeatherWindowProps {
  onClose: () => void;
  onMinimize: () => void;
}

interface WeatherData {
  city: string;
  country: string;
  temp: number;
  feelsLike: number;
  description: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  weatherId: number;
  updatedAt: string;
}

interface ForecastDay {
  day: string;
  avgTemp: number;
  minTemp: number;
  weatherId: number;
}

const DEFAULT_CITY = "Shiraz";
const CITY_KEY = "ww_city";
const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "";

function getCondition(id: number): {
  bg: string;
  accent: string;
  emoji: string;
  label: string;
} {
  if (id >= 200 && id < 300)
    return {
      bg: "linear-gradient(160deg,#1a1035 0%,#2d1b69 60%,#11001c 100%)",
      accent: "#a78bfa",
      emoji: "⛈",
      label: "Thunderstorm",
    };
  if (id >= 300 && id < 400)
    return {
      bg: "linear-gradient(160deg,#0f2027 0%,#203a43 50%,#2c5364 100%)",
      accent: "#67e8f9",
      emoji: "🌦",
      label: "Drizzle",
    };
  if (id >= 500 && id < 600)
    return {
      bg: "linear-gradient(160deg,#0f2027 0%,#203a43 50%,#1e3a5f 100%)",
      accent: "#38bdf8",
      emoji: "🌧",
      label: "Rain",
    };
  if (id >= 600 && id < 700)
    return {
      bg: "linear-gradient(160deg,#e8eaf6 0%,#c5cae9 50%,#9fa8da 100%)",
      accent: "#3949ab",
      emoji: "❄",
      label: "Snow",
    };
  if (id >= 700 && id < 800)
    return {
      bg: "linear-gradient(160deg,#2d3436 0%,#636e72 100%)",
      accent: "#b2bec3",
      emoji: "🌫",
      label: "Fog",
    };
  if (id === 800)
    return {
      bg: "linear-gradient(160deg,#0f4c81 0%,#1565c0 50%,#0d47a1 100%)",
      accent: "#ffd54f",
      emoji: "☀",
      label: "Clear",
    };
  if (id === 801)
    return {
      bg: "linear-gradient(160deg,#1565c0 0%,#1976d2 50%,#0d47a1 100%)",
      accent: "#fff9c4",
      emoji: "🌤",
      label: "Mostly Clear",
    };
  if (id === 802)
    return {
      bg: "linear-gradient(160deg,#37474f 0%,#455a64 50%,#263238 100%)",
      accent: "#eceff1",
      emoji: "⛅",
      label: "Partly Cloudy",
    };
  return {
    bg: "linear-gradient(160deg,#263238 0%,#37474f 50%,#1c313a 100%)",
    accent: "#cfd8dc",
    emoji: "☁",
    label: "Cloudy",
  };
}

function getDayName(dt: number): string {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
    new Date(dt * 1000).getDay()
  ];
}

export default function WeatherWindow({
  onClose,
  onMinimize,
}: WeatherWindowProps) {
  const [city, setCity] = useState(
    () =>
      (typeof window !== "undefined"
        ? sessionStorage.getItem(CITY_KEY)
        : null) || DEFAULT_CITY,
  );
  const [cityInput, setCityInput] = useState(
    () =>
      (typeof window !== "undefined"
        ? sessionStorage.getItem(CITY_KEY)
        : null) || DEFAULT_CITY,
  );
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [phase, setPhase] = useState<"loading" | "data" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [showCityEdit, setShowCityEdit] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const fetchForecast = useCallback(async (cityName: string) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric&cnt=40`,
      );
      if (!res.ok) return;
      const d = await res.json();
      if (!d.list) return;
      const daily: Record<string, { temps: number[]; ids: number[] }> = {};
      (d.list as any[]).forEach((item: any) => {
        const day = getDayName(item.dt);
        if (!daily[day]) daily[day] = { temps: [], ids: [] };
        daily[day].temps.push(item.main.temp);
        daily[day].ids.push(item.weather[0].id);
      });
      setForecast(
        Object.entries(daily)
          .slice(1, 6)
          .map(([day, data]) => ({
            day,
            avgTemp: Math.round(
              data.temps.reduce((a, b) => a + b, 0) / data.temps.length,
            ),
            minTemp: Math.round(Math.min(...data.temps)),
            weatherId: data.ids[Math.floor(data.ids.length / 2)],
          })),
      );
    } catch {}
  }, []);

  const fetchWeather = useCallback(
    async (cityName: string) => {
      setPhase("loading");
      setErrorMsg("");
      if (!API_KEY) {
        setErrorMsg("NEXT_PUBLIC_OPENWEATHER_API_KEY not set in .env.local");
        setPhase("error");
        return;
      }
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`,
        );
        const d = await res.json();
        if (!res.ok) throw new Error(d.message || "API error");
        const now = new Date();
        setWeather({
          city: d.name,
          country: d.sys.country,
          temp: Math.round(d.main.temp),
          feelsLike: Math.round(d.main.feels_like),
          description: d.weather[0].description,
          humidity: d.main.humidity,
          windSpeed: Math.round(d.wind.speed * 3.6),
          visibility: parseFloat((d.visibility / 1000).toFixed(1)),
          weatherId: d.weather[0].id,
          updatedAt: `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`,
        });
        sessionStorage.setItem(CITY_KEY, cityName);
        setAnimKey((k) => k + 1);
        setPhase("data");
        fetchForecast(cityName);
      } catch (e: any) {
        setErrorMsg(e.message || "Connection error");
        setPhase("error");
      }
    },
    [fetchForecast],
  );

  useEffect(() => {
    fetchWeather(city);
  }, []); // eslint-disable-line

  const handleCityChange = () => {
    const t = cityInput.trim();
    if (!t) return;
    setCity(t);
    setShowCityEdit(false);
    fetchWeather(t);
  };

  const cond = weather ? getCondition(weather.weatherId) : null;
  const isLight =
    weather?.weatherId !== undefined &&
    weather.weatherId >= 600 &&
    weather.weatherId < 700;

  return (
    <WindowFloat
      onclose={onClose}
      onminimize={onMinimize}
      maxWidth="320px"
      title="weather.tsx"
      contentStyle={{
        padding: 0,
        background: cond?.bg ?? "#111827",
        transition: "background 0.8s ease",
      }}
    >
      <style>{`
        @keyframes ww-spin { to { transform: rotate(360deg); } }
        @keyframes ww-in   { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes ww-pulse { 0%,100% { opacity:.4; } 50% { opacity:1; } }
        .ww-in  { animation: ww-in 0.5s cubic-bezier(.34,1.4,.64,1) both; }
        .ww-in-1 { animation-delay: .05s; }
        .ww-in-2 { animation-delay: .12s; }
        .ww-in-3 { animation-delay: .19s; }
        .ww-in-4 { animation-delay: .26s; }
      `}</style>

      {/* Wrapper */}
      <div className="ltr min-h-[380px] relative overflow-hidden">
        {/* ── Noise texture overlay ── */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
            backgroundSize: "180px",
          }}
        />

        {/* ── LOADING ── */}
        {phase === "loading" && (
          <div className="relative z-10 px-6 py-[60px] flex flex-col items-center gap-4">
            <div
              className="w-8 h-8 rounded-full"
              style={{
                border: `2px solid ${cond?.accent ?? "rgba(255,255,255,0.15)"}22`,
                borderTopColor: cond?.accent ?? "rgba(255,255,255,0.6)",
                animation: "ww-spin 0.9s linear infinite",
              }}
            />
            <span className="text-white/35 text-[11px] tracking-widest font-mono uppercase">
              Loading
            </span>
          </div>
        )}

        {/* ── ERROR ── */}
        {phase === "error" && (
          <div className="relative z-10 px-5 py-8 flex flex-col items-center gap-[14px]">
            <span className="text-3xl" style={{ filter: "grayscale(0.3)" }}>
              ⚠️
            </span>
            <span className="text-red-300 text-[11px] font-mono text-center leading-[1.7] max-w-[220px] bg-red-500/[0.08] rounded-[10px] border border-red-500/20 px-[14px] py-[10px]">
              {errorMsg}
            </span>
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => fetchWeather(city)}
                className="px-4 py-[7px] bg-white/[0.07] border border-white/15 rounded-[10px] text-white text-[11px] font-mono cursor-pointer"
              >
                ↻ retry
              </button>
              <button
                onClick={() => {
                  setShowCityEdit(true);
                  setPhase("data");
                }}
                className="px-4 py-[7px] bg-amber-400/[0.12] border border-amber-400/25 rounded-[10px] text-amber-400 text-[11px] font-mono cursor-pointer"
              >
                change city
              </button>
            </div>
          </div>
        )}

        {/* ── DATA ── */}
        {phase === "data" && weather && cond && (
          <div key={animKey} className="relative z-10">
            {/* Big emoji + temp */}
            <div className="ww-in px-6 pt-7">
              {/* Location row */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-[5px]">
                  <span
                    className={`text-[10px] tracking-[0.12em] font-mono uppercase ${isLight ? "text-black/40" : "text-white/40"}`}
                  >
                    📍 {weather.city}, {weather.country}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setShowCityEdit((v) => !v);
                    setCityInput(city);
                  }}
                  className={`bg-transparent border-none cursor-pointer text-sm px-1 py-0.5 rounded transition-colors duration-200 ${isLight ? "text-black/30" : "text-white/30"}`}
                  title="Change city"
                >
                  ✏️
                </button>
              </div>

              {/* Emoji */}
              <div
                className="text-[64px] leading-none mb-2  "
                style={{ filter: "drop-shadow(0 4px 24px rgba(0,0,0,0.3))" }}
              >
                {cond.emoji}
              </div>

              {/* Temperature */}
              <div className="flex items-start gap-0.5 mb-0.5">
                <span
                  className={`text-[80px] font-extralight leading-none -tracking-[4px] font-serif ${isLight ? "text-[#1a1a2e]" : "text-white"}`}
                >
                  {weather.temp}
                </span>
                <span
                  className={`text-[22px] mt-[10px] font-mono ${isLight ? "text-black/40" : "text-white/40"}`}
                >
                  °C
                </span>
              </div>

              {/* Description + feels like */}
              <div className="mb-6">
                <div
                  className={`text-[13px] capitalize font-mono tracking-[0.04em] ${isLight ? "text-black/70" : "text-white/75"}`}
                >
                  {weather.description}
                </div>
                <div
                  className={`text-[11px] mt-[3px] font-mono ${isLight ? "text-black/35" : "text-white/35"}`}
                >
                  feels like {weather.feelsLike}°
                </div>
              </div>
            </div>

            {/* City edit inline */}
            {showCityEdit && (
              <div className="ww-in px-5 pb-4 flex gap-2">
                <input
                  autoFocus
                  type="text"
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCityChange();
                    if (e.key === "Escape") setShowCityEdit(false);
                  }}
                  placeholder="City name..."
                  className={`flex-1 rounded-[10px] py-[7px] px-3 text-[12px] font-mono outline-none ${isLight ? "bg-black/[0.06] text-[#1a1a2e]" : "bg-white/[0.08] text-white"}`}
                  style={{ border: `1px solid ${cond.accent}44` }}
                />
                <button
                  onClick={handleCityChange}
                  className={`px-[14px] py-[7px] rounded-[10px] border-none text-[11px] font-mono font-bold cursor-pointer ${isLight ? "text-[#1a1a2e]" : "text-[#111]"}`}
                  style={{ background: cond.accent }}
                >
                  Go
                </button>
              </div>
            )}

            {/* Divider */}
            <div
              className={`h-px mx-5 ${isLight ? "bg-black/[0.08]" : "bg-white/[0.08]"}`}
            />

            {/* Stats row */}
            <div className="ww-in ww-in-1 grid grid-cols-3 px-2 py-[14px]">
              {[
                { label: "humidity", val: `${weather.humidity}%`, icon: "◈" },
                { label: "wind", val: `${weather.windSpeed}km/h`, icon: "◎" },
                {
                  label: "visibility",
                  val: `${weather.visibility}km`,
                  icon: "◉",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center gap-1 px-1 py-2 ${i > 0 ? (isLight ? "border-l border-black/[0.08]" : "border-l border-white/[0.08]") : ""}`}
                >
                  <span
                    className="text-sm opacity-80"
                    style={{ color: cond.accent }}
                  >
                    {s.icon}
                  </span>
                  <span
                    className={`text-[13px] font-semibold font-mono ${isLight ? "text-[#1a1a2e]" : "text-white"}`}
                  >
                    {s.val}
                  </span>
                  <span
                    className={`text-[9px] font-mono uppercase tracking-[0.08em] ${isLight ? "text-black/35" : "text-white/35"}`}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Forecast */}
            {forecast.length > 0 && (
              <>
                <div
                  className={`h-px mx-5 ${isLight ? "bg-black/[0.08]" : "bg-white/[0.08]"}`}
                />
                <div className="ww-in ww-in-2 px-4 pt-[14px] pb-4">
                  <div
                    className={`text-[9px] tracking-[0.14em] uppercase font-mono mb-[10px] ${isLight ? "text-black/30" : "text-white/30"}`}
                  >
                    5 — day
                  </div>
                  <div className="flex gap-[6px]">
                    {forecast.map((fc, i) => {
                      const fc_cond = getCondition(fc.weatherId);
                      return (
                        <div
                          key={i}
                          className={`flex-1 flex flex-col items-center gap-[5px] py-[10px] px-1 rounded-xl border ${isLight ? "bg-black/[0.05] border-black/[0.06]" : "bg-white/[0.06] border-white/[0.06]"}`}
                        >
                          <span
                            className={`text-[9px] font-mono uppercase ${isLight ? "text-black/40" : "text-white/40"}`}
                          >
                            {fc.day}
                          </span>
                          <span className="text-lg">{fc_cond.emoji}</span>
                          <span
                            className={`text-[12px] font-bold font-mono ${isLight ? "text-[#1a1a2e]" : "text-white"}`}
                          >
                            {fc.avgTemp}°
                          </span>
                          <span
                            className={`text-[9px] font-mono ${isLight ? "text-black/30" : "text-white/30"}`}
                          >
                            {fc.minTemp}°
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </WindowFloat>
  );
}
