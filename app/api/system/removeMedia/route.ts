// app/api/system/removeMedia/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, msg: "id الزامی است" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const result = await db.collection("media").deleteOne({ id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, msg: "مدیا یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, msg: "مدیا با موفقیت حذف شد" });
  } catch (err) {
    console.error("removeMedia error:", err);
    return NextResponse.json(
      { success: false, msg: "خطا در حذف مدیا" },
      { status: 500 }
    );
  }
}
