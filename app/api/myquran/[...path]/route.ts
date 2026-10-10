import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://api.myquran.com/v3";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path } = await params;

    // Batasi proxy hanya untuk endpoint yang diperlukan.
    const allowedPrefixes = ["sholat", "cal"];

    if (!path.length || !allowedPrefixes.includes(path[0])) {
      return NextResponse.json(
        { status: false, message: "Endpoint tidak diizinkan." },
        { status: 400 },
      );
    }

    const apiUrl = new URL(
      `${API_BASE_URL}/${path.map(encodeURIComponent).join("/")}`,
    );

    request.nextUrl.searchParams.forEach((value, key) => {
      apiUrl.searchParams.append(key, value);
    });

    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      {
        status: false,
        message: "Gagal menghubungi MyQuran API.",
      },
      { status: 502 },
    );
  }
}
