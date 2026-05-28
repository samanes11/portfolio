// app/api/system/addMedia/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, image, category, description } = body;

    if (!id || !title) {
      return NextResponse.json(
        { success: false, msg: "id و title الزامی هستند" },
        { status: 400 }
      );
    }

    const db = await getDb();

    const existing = await db.collection("media").findOne({ id });
    if (existing) {
      return NextResponse.json(
        { success: false, msg: "این id قبلاً استفاده شده است" },
        { status: 409 }
      );
    }

    await db.collection("media").insertOne({
      id,
      title,
      image:       image       || "",
      category:    category    || "",
      description: description || "",
    });

    return NextResponse.json({ success: true, msg: "مدیا با موفقیت اضافه شد" });
  } catch (err) {
    console.error("addMedia error:", err);
    return NextResponse.json(
      { success: false, msg: "خطا در افزودن مدیا" },
      { status: 500 }
    );
  }
}
