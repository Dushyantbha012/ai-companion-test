"use client";

import { Companion, Message } from "@prisma/client";
import ChatHeader from "./chat-header";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
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

  const {
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
    setInput,
    completion,
  } = useCompletion({
    api: `/api/chat/${companion.id}`,
    onResponse(response: Response) {
      const func = async (response: Response) => {
        const data = await response.json();
        console.log(data);
        if (data.message) {
          const systemMessage: ChatMessageProps = {
            role: "system",
            content: data.message,
          };
          setMessages((current) => [...current, systemMessage]);
        }
        setInput("");
        router.refresh();
      };
      func(response);
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
    <div className="flex flex-col h-full p-4 space-y-2 w-full">
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
