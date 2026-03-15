import { prisma } from "@/lib/prisma";
import { REFRESH_TOKEN_COOKIE } from "@/lib/auth/constants";
import { verifyRefreshToken } from "@/lib/auth/jwt";
import { clearAuthCookies } from "@/lib/auth/cookies";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const refreshJwt = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  if (refreshJwt) {
    const payload = await verifyRefreshToken(refreshJwt);
    if (payload?.tokenId) {
      await prisma.refreshToken.updateMany({
        where: { id: payload.tokenId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
  }

  const response = NextResponse.json({ success: true });
  return clearAuthCookies(response);
}
