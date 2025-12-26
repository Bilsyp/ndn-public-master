import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "model.json");
    const file = fs.readFileSync(filePath, "utf-8");
    const model = JSON.parse(file);

    return NextResponse.json(model);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load model" },
      { status: 500 }
    );
  }
}
