// app/api/system/checkPass/route.ts
import { NextRequest, NextResponse } from "next/server";

// رمز عبور ادمین را در .env.local تنظیم کنید:
//   ADMIN_PASSWORD=your_secret_password

export async function POST(req: NextRequest) {
  try {
    const { pass } = await req.json();

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error("ADMIN_PASSWORD در .env.local تنظیم نشده است");
      return NextResponse.json(
        { success: false, msg: "خطای سرور: رمز ادمین تنظیم نشده" },
        { status: 500 }
      );
    }

    if (pass === adminPassword) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, msg: "رمز عبور اشتباه است" },
      { status: 401 }
    );
  } catch (err) {
    console.error("checkPass error:", err);
    return NextResponse.json(
      { success: false, msg: "خطا در بررسی رمز عبور" },
      { status: 500 }
    );
  }
}
