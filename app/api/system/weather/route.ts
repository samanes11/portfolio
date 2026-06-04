// app/api/system/weather/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city") || "Shiraz";
  const type = searchParams.get("type") || "current";

  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { message: "OPENWEATHER_API_KEY is not set in .env.local" },
      { status: 500 }
    );
  }

  const endpoint =
    type === "forecast"
      ? `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&cnt=40`
      : `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  try {
    const res = await fetch(endpoint, {
      cache: "no-store",
      headers: { "Accept": "application/json" },
    });

    const text = await res.text();

    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("OpenWeather non-JSON response:", text.slice(0, 200));
      return NextResponse.json(
        { message: `OpenWeather returned non-JSON: ${text.slice(0, 100)}` },
        { status: 502 }
      );
    }

    if (!res.ok) {
      return NextResponse.json(
        { message: data.message || `OpenWeather error ${res.status}` },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("weather fetch error:", err);
    return NextResponse.json(
      { message: err?.message || "Failed to connect to weather service" },
      { status: 500 }
    );
  }
}