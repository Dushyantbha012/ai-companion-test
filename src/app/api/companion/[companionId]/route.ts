import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { companionId: string } }
) {
  try {
    const body = await req.json();
    const user = await currentUser();
    const { src, name, description, seed, instruction, categoryId } = body;
    const companionId = params.companionId;
    if (!companionId) {
      return new NextResponse("Companion Id is Required", { status: 401 });
    }
    if (!user || !user.id || !user.firstName) {
      return new NextResponse("Unauthorised", { status: 401 });
    }
    if (!src || !name || !description || !seed || !instruction || !categoryId) {
      return new NextResponse("Incomplete data", { status: 402 });
    }
    const checkCompanion = await prismadb.companion.findUnique({
      where: {
        id: companionId,
        userId: user.id,
      },
    });
    if (!checkCompanion) {
      return new NextResponse(
        "Companion doesn't exists or You are not authorised",
        { status: 402 }
      );
    }
    const companion = await prismadb.companion.update({
      where: {
        id: companionId,
        userId: user.id,
      },
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
    console.log("COMPANION_PATCH", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { companionId: string } }
) {
  try {
    const user = await currentUser();
    const companionId = params.companionId;
    if (!companionId) {
      return new NextResponse("Companion Id is Required", { status: 401 });
    }
    if (!user || !user.id || !user.firstName) {
      return new NextResponse("Unauthorised", { status: 401 });
    }
    const checkCompanion = await prismadb.companion.findUnique({
      where: {
        id: companionId,
        userId: user.id,
      },
    });
    if (!checkCompanion) {
      return new NextResponse(
        "Companion doesn't exists or You are not authorised",
        { status: 402 }
      );
    }
    await prismadb.companion.delete({
      where: {
        id: companionId,
        userId: user.id,
      },
    });
    return new NextResponse("Companion Deleted", { status: 200 });
  } catch (error) {
    console.log("COMPANION_PATCH", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
