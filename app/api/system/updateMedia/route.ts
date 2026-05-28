// app/api/system/updateMedia/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, image, category, description } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, msg: "id الزامی است" },
        { status: 400 }
      );
    }

    const db = await getDb();

    const result = await db.collection("media").updateOne(
      { id },
      {
        $set: {
          ...(title       !== undefined && { title }),
          ...(image       !== undefined && { image }),
          ...(category    !== undefined && { category }),
          ...(description !== undefined && { description }),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, msg: "مدیا یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, msg: "مدیا با موفقیت بروزرسانی شد" });
  } catch (err) {
    console.error("updateMedia error:", err);
    return NextResponse.json(
      { success: false, msg: "خطا در بروزرسانی مدیا" },
      { status: 500 }
    );
  }
}
