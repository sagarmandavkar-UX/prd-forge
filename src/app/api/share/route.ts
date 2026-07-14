import { NextResponse } from "next/server";

import { createShareToken, hashToken } from "@/lib/security/tokens";

export async function POST() {
  const token = createShareToken();
  return NextResponse.json({
    token,
    tokenHash: hashToken(token)
  });
}
