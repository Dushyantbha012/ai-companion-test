import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await currentUser();
    const { src, name, description, seed, instruction, categoryId } = body;
    if (!user || !user.id || !user.firstName) {
      return new NextResponse("unauthorised", { status: 401 });
    }
    if (!src || !name || !description || !seed || !instruction || !categoryId) {
      return new NextResponse("Incomplete data", { status: 402 });
    }
    const companion = await prismadb.companion.create({
      data: {
        categoryId,
        userId: user.id,
        userName: user.firstName,
        src,
        name,
        description,
        seed,
        instruction,
      },
    });
    return new NextResponse("Companion Created", { status: 200 });
  } catch (error) {
    console.log("COMPANION_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
