import { NextRequest, NextResponse } from "next/server";

const RAILWAY_API = process.env.RAILWAY_API_URL || "https://healthiness365-api-production.up.railway.app";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const niche = searchParams.get("niche") || "gut health";

  try {
    const res  = await fetch(`${RAILWAY_API}/api/recipes?niche=${encodeURIComponent(niche)}`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch recipes", data: [] }, { status: 500 });
  }
}
