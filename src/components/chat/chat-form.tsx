"use client";

import { ChangeEvent, FormEvent } from "react";
import { ChatRequestOptions } from "ai";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SendHorizonal } from "lucide-react";
interface ChatFormProps {
  input: string;
  handelInputChange: (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => void;
  onSubmit: (
    e: FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions | undefined
  ) => void;
  isLoading: boolean;
}

const ChatForm = ({
  input,
  handelInputChange,
  onSubmit,
  isLoading,
}: ChatFormProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className="border-t border-primary/10 py-4 flex items-center gap-x-2"
    >
      <Input
        disabled={isLoading}
        value={input}
        onChange={handelInputChange}
        placeholder="Type a message"
        className="rounded-lg bg-primary/10"
      />
      <Button variant="ghost" disabled={isLoading}>
        <SendHorizonal className="h-6 w-6" />
      </Button>
    </form>
  );
};

export default ChatForm;
