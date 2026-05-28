// app/api/system/showMedia/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const items = await db
      .collection("media")
      .find({})
      .sort({ _id: -1 })
      .toArray();

    const data = items.map(({ _id, ...rest }) => rest);

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("showMedia error:", err);
    return NextResponse.json(
      { success: false, msg: "خطا در دریافت مدیا" },
      { status: 500 }
    );
  }
}
