// app/api/system/showMsg/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const messages = await db
      .collection("messages")
      .find({})
      .sort({ _id: -1 })
      .toArray();

    const data = messages.map(({ _id, ...rest }) => rest);

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("showMsg error:", err);
    return NextResponse.json(
      { success: false, msg: "خطا در دریافت پیام‌ها" },
      { status: 500 }
    );
  }
}
