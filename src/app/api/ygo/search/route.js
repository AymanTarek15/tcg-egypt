import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q) {
    return NextResponse.json({ data: [] });
  }

  try {
    const url = `https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${encodeURIComponent(q)}`;
    const res = await fetch(url, {
      next: { revalidate: 60 * 60 * 24 },
    });

    if (!res.ok) {
      return NextResponse.json({ data: [] });
    }

    const json = await res.json();

    const slim = (json.data || []).slice(0, 10).map((card) => ({
      id: card.id,
      name: card.name,
      type: card.type,
      image: card.card_images?.[0]?.image_url_small || null,
    }));

    return NextResponse.json({ data: slim });
  } catch {
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}