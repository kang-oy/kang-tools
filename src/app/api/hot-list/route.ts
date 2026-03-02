import { NextResponse } from "next/server";

const HN_TOP = "https://hacker-news.firebaseio.com/v0/topstories.json";
const HN_ITEM = (id: number) =>
  `https://hacker-news.firebaseio.com/v0/item/${id}.json`;

export interface HotItem {
  title: string;
  url: string;
  source: string;
  id: string | number;
}

export async function GET() {
  try {
    const [hnRes] = await Promise.all([
      fetch(HN_TOP, { next: { revalidate: 300 } }),
    ]);
    if (!hnRes.ok) throw new Error("HN fetch failed");

    const hnIds = (await hnRes.json()) as number[];
    const topIds = hnIds.slice(0, 15);
    const items = await Promise.all(
      topIds.map((id) =>
        fetch(HN_ITEM(id), { next: { revalidate: 300 } }).then((r) => r.json())
      )
    );

    const tech: HotItem[] = items
      .filter((x) => x?.title && (x.url || x.id))
      .map((x) => ({
        title: x.title,
        url: x.url || `https://news.ycombinator.com/item?id=${x.id}`,
        source: "Hacker News",
        id: x.id,
      }));

    return NextResponse.json({
      tech,
      updatedAt: Date.now(),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "获取失败";
    return NextResponse.json({ error: message, tech: [] }, { status: 500 });
  }
}
