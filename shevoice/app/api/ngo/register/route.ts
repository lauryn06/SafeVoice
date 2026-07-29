import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, email, password, phone, region } = await req.json();

    if (!name || !email || !password || !phone || !region) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const existing = await prisma.ngo.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An NGO with this email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const ngo = await prisma.ngo.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        region,
      },
    });

    return NextResponse.json({ success: true, id: ngo.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}