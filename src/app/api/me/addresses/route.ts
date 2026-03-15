import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบก่อนทำรายการ" },
        { status: 401 }
      );
    }

    const addresses = await prisma.address.findMany({
      where: { userId: session.userId },
    });

    return NextResponse.json(addresses);
  } catch {
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูลที่อยู่" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบก่อนทำรายการ" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { line, province, district, subdistrict, postalCode } = body;

    if (!line || !province || !district || !subdistrict || !postalCode) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลที่อยู่ให้ครบถ้วน" },
        { status: 400 }
      );
    }

    const address = await prisma.address.create({
      data: {
        line,
        province,
        district,
        subdistrict,
        postalCode,
        userId: session.userId,
      },
    });

    return NextResponse.json(address, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการเพิ่มที่อยู่" },
      { status: 500 }
    );
  }
}
