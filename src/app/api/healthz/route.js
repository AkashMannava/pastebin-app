import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import mongoose from "mongoose";

export async function GET() {
  try {
    await dbConnect();

    if (mongoose.connection.readyState === 1) {
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json(
      { ok: false, status: "db_not_connected" },
      { status: 503 }
    );
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e.message },
      { status: 500 }
    );
  }
}
