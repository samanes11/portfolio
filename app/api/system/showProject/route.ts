// app/api/system/showProject/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const projects = await db
      .collection("project")
      .find({})
      .sort({ _id: -1 })
      .toArray();

    // تبدیل _id به string و حذف آن
    const data = projects.map(({ _id, ...rest }) => rest);

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("showProject error:", err);
    return NextResponse.json(
      { success: false, msg: "خطا در دریافت پروژه‌ها" },
      { status: 500 }
    );
  }
}
