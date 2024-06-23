import { StreamingTextResponse, LangChainAdapter, LangChainStream } from "ai";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ConsoleCallbackHandler } from "langchain/callbacks";
import { Replicate } from "@langchain/community/llms/replicate";
import { NextResponse } from "next/server";
import { MemoryManager } from "@/lib/memory";
import { rateLimit } from "@/lib/rate-limit";
import prismadb from "@/lib/prismadb";
import { CallbackManager } from "@langchain/core/callbacks/manager";

export async function POST(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  console.log("request reached here");
  try {
    const { prompt } = await request.json();
    const user = await currentUser();
    if (!user || !user.firstName || !user.id) {
      return new NextResponse("unauthorised", { status: 401 });
    }

    const identifier = request.url + "-" + user.id;
    const { success } = await rateLimit(identifier);
    if (!success) {
      return new NextResponse("Rate limit Exceeded", { status: 429 });
    }
    const companion = await prismadb.companion.update({
      where: { id: params.chatId, userId: user.id },
      data: {
        messages: {
          create: {
            content: prompt,
            role: "user",
            userId: user.id,
          },
        },
      },
    });
    if (!companion) {
      return new NextResponse("Companion not found", { status: 404 });
    }
    const name = companion.id;
    const companion_file_name = name + ".txt";
    const companionKey = {
      companionName: name,
      userId: user.id,
      modelName: "llama2-13b",
    };
    const memoryManager = await MemoryManager.getInstance();
    const records = await memoryManager.readLatestHistory(companionKey);
    if (records.length === 0) {
      await memoryManager.seedChatHistory(companion.seed, "\n\n", companionKey);
    }
    console.log(
      "REached here..........................................................................................................................................................................................................\n\n\n"
    );
    await memoryManager.writeToHistory("User: " + prompt + "\n", companionKey);
    const recentChatHistory = await memoryManager.readLatestHistory(
      companionKey
    );
    console.log(
      "REached here before similardocs..........................................................................................................................................................................................................\n\n\n"
    );
    const similarDocs = await memoryManager.vectorSearch(
      recentChatHistory,
      companion_file_name
    );
    let relevantHistory = "";
    if (!!similarDocs && similarDocs.length != 0) {
      relevantHistory = similarDocs.map((doc) => doc.pageContent).join("\n");
    }
    const { handlers } = LangChainStream();
    console.log(
      "REached here before Replicate..........................................................................................................................................................................................................\n\n\n"
    );
    const model = new Replicate({
      model:
        "a16z-infra/llama13b-v2-chat:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5",
      input: {
        max_length: 2048,
      },
      apiKey: process.env.REPLICATE_API_TOKEN,
      callbackManager: CallbackManager.fromHandlers(handlers),
    });
    console.log(
      "REached here after Replicate..........................................................................................................................................................................................................\n\n\n"
    );
    model.verbose = true;
    const response = String(
      await model
        .invoke(
          `
        ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${name}:prefix.DO NOT generate more than 100 words,

        ${companion.instruction}

        Below are the relevant details about ${name}'s past and the conversation you are in,
        ${relevantHistory}. Keep these details to yourself and do not repeat them in your output.Give small, concise, relevant and to the point outputs.
        ONLY ANSWER WHAT IS ASKED AT LAST NOT THE PREVIOUS QUESTIONS.

        ${recentChatHistory}\n${name}:
        `
        )
        .catch(console.error)
    );
    console.log(
      "REached here after response..........................................................................................................................................................................................................\n\n\n"
    );
    await memoryManager.writeToHistory("" + response.trim(), companionKey);
    var Readable = require("stream").Readable;
    let s = new Readable();
    s.push(response);
    s.push(null);
    if (response !== undefined && response.length > 1) {
      memoryManager.writeToHistory("" + response.trim(), companionKey);
      await prismadb.companion.update({
        where: {
          id: params.chatId,
          userId: user.id,
        },
        data: {
          messages: {
            create: {
              content: response.trim(),
              role: "system",
              userId: user.id,
            },
          },
        },
      });
    }
    return NextResponse.json({ message: response.trim() });
  } catch (error) {
    console.log("[Chat_Post]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
