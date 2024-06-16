import ChatClient from "@/components/chat/chat-client";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface ChatIdPageProps {
  params: {
    chatId: string;
  };
}

const ChatIdPage = async ({ params }: ChatIdPageProps) => {
  const { userId } = auth();
  if (!userId) {
    return auth().redirectToSignIn();
  }
  const companion = await prismadb.companion.findUnique({
    where: {
      userId,
      id: params.chatId,
    },
    include: {
      messages: {
        where: {
          userId,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
  if (!companion) {
    return redirect("/");
  }
  return <ChatClient companion={companion} />;
};

export default ChatIdPage;
