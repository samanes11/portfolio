// app/api/system/msg/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { Name, Email, msg } = body;

    if (!Name || !Email || !msg) {
      return NextResponse.json(
        { success: false, msg: "همه فیلدها الزامی هستند" },
        { status: 400 }
      );
    }

    const db = await getDb();

    const now = new Date();
    const date = now.toLocaleString("en-US", {
      year:   "numeric",
      month:  "short",
      day:    "numeric",
      hour:   "2-digit",
      minute: "2-digit",
    });

    await db.collection("messages").insertOne({
      ID:    crypto.randomUUID(),
      Name,
      Email,
      msg,
      Date:  date,
    });

    return NextResponse.json({ success: true, msg: "پیام با موفقیت ارسال شد" });
  } catch (err) {
    console.error("msg error:", err);
    return NextResponse.json(
      { success: false, msg: "خطا در ارسال پیام" },
      { status: 500 }
    );
  }
}
