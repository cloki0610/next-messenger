import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

import prisma from "@/app/_lib/prismadb";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, name, password } = body;

        if (!email || !name || !password) {
            return new NextResponse("Missing information", { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: { email, name, hashedPassword },
        });
        const response = {
            id: user.id,
            email: user.email,
            name: user.name,
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error(error, "REGISTRATION_ERROR");
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
