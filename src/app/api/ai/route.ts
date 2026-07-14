import { NextResponse } from "next/server";

import { getAiProvider } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const provider = getAiProvider();
    const action = body.action as string;

    if (action === "analyze") {
      const result = await provider.analyzeProductIdea(body.context);
      return NextResponse.json({ provider: provider.name, result });
    }

    return NextResponse.json(
      { error: "Unsupported AI action." },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "AI request failed." },
      { status: 400 }
    );
  }
}
