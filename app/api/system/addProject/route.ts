// app/api/system/addProject/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, date, platform, tech, desc } = body;

    if (!id || !name) {
      return NextResponse.json(
        { success: false, msg: "id و name الزامی هستند" },
        { status: 400 }
      );
    }

    const db = await getDb();

    // بررسی تکراری بودن id
    const existing = await db.collection("project").findOne({ id });
    if (existing) {
      return NextResponse.json(
        { success: false, msg: "این id قبلاً استفاده شده است" },
        { status: 409 }
      );
    }

    await db.collection("project").insertOne({
      id,
      name,
      date:     date     || "",
      platform: platform || "",
      tech:     tech     || "",
      desc:     desc     || "",
    });

    return NextResponse.json({ success: true, msg: "پروژه با موفقیت اضافه شد" });
  } catch (err) {
    console.error("addProject error:", err);
    return NextResponse.json(
      { success: false, msg: "خطا در افزودن پروژه" },
      { status: 500 }
    );
  }
}
