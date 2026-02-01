import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  console.log("Search query:", q);

  if (!q) {
    return NextResponse.json(
      { error: "Missing query param: q" },
      { status: 400 }
    );
  }

  const API_KEY = process.env.YT_API_KEY;
  const maxResults = 1;

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${q}&key=${API_KEY}&maxResults=${maxResults}`;

  const response = await fetch(url);
  const data = await response.json();

  return NextResponse.json(data);
}
