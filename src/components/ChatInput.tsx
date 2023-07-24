"use client";
import { cn } from "@/lib/utils";
import { Message } from "@/lib/validators/message";
import { useMutation } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import React, { FC, HtmlHTMLAttributes, useState } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";

interface Props extends HtmlHTMLAttributes<HTMLDivElement> {}

type Input = {
  text: string;
};

const ChatInput: FC<Props> = ({ className, ...props }) => {
  const { register, getValues } = useForm<Input>();

  const { mutate } = useMutation({
    mutationKey: ["sendMessage"],
    mutationFn: async (payload: Message) => {
      const res = await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [payload] }),
      });
      return res.body;
    },
    onSuccess: async (stream) => {
      if (!stream) throw new Error("Error fetching response");
      const reader = stream?.getReader();
      const decoder = new TextDecoder();
      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunckValue = decoder?.decode(value);
        console.log({ chunckValue });
      }
    },
  });

  return (
    <div {...props} className={cn("border-t border-zinc-300", className)}>
      <div className="relative flex-1 mt-4 overflow-hidden border-none rounded-lg outline-none">
        <TextareaAutosize
          rows={2}
          maxRows={4}
          autoFocus
          {...register("text")}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              mutate({
                id: nanoid(),
                isUserInput: true,
                text: getValues("text"),
              });
            }
          }}
          placeholder="Write a prompt..."
          className="peer disabled:opacity-50 pr-14 resize-none block w-full border-0 bg-zinc-100 py-1.5 text-gray-900 focus:ring-0 text-sm sm:leading-6"
        />
      </div>
    </div>
  );
};

export default ChatInput;
