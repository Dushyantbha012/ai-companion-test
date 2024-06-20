"use client";

import { Companion, Message } from "@prisma/client";
import ChatHeader from "./chat-header";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useCompletion } from "@ai-sdk/react";
import ChatForm from "./chat-form";
import ChatMessages from "./chat-messages";
import { ChatMessageProps } from "./chat-message";
interface ChatClientProps {
  companion: Companion & {
    messages: Message[];
  };
}

const ChatClient = ({ companion }: ChatClientProps) => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessageProps[]>(
    companion.messages
  );

  const { input, isLoading, handleInputChange, handleSubmit, setInput } =
    useCompletion({
      api: `/api/chat/${companion.id}`,
      onFinish(prompt, completion) {
        const systemMessage: ChatMessageProps = {
          role: "system",
          content: completion,
        };
        setMessages((current) => [...current, systemMessage]);
        setInput("");
        router.refresh();
      },
    });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const userMessage: ChatMessageProps = {
      role: "user",
      content: input,
    };
    setMessages((current) => [...current, userMessage]);
    handleSubmit(e);
  };
  return (
    <div className="flex flex-col h-full p-4 space-y-2">
      <ChatHeader companion={companion} />
      <ChatMessages
        companion={companion}
        isLoading={isLoading}
        messages={messages}
      />
      <ChatForm
        isLoading={isLoading}
        input={input}
        handelInputChange={handleInputChange}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default ChatClient;
