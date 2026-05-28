// app/api/system/updateProject/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, date, platform, tech, desc } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, msg: "id الزامی است" },
        { status: 400 }
      );
    }

    const db = await getDb();

    const result = await db.collection("project").updateOne(
      { id },
      {
        $set: {
          ...(name     !== undefined && { name }),
          ...(date     !== undefined && { date }),
          ...(platform !== undefined && { platform }),
          ...(tech     !== undefined && { tech }),
          ...(desc     !== undefined && { desc }),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, msg: "پروژه یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, msg: "پروژه با موفقیت بروزرسانی شد" });
  } catch (err) {
    console.error("updateProject error:", err);
    return NextResponse.json(
      { success: false, msg: "خطا در بروزرسانی پروژه" },
      { status: 500 }
    );
  }
}
