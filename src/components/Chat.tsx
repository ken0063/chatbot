import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./Accordion";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";

const Chat = () => {
  return (
    <Accordion
      type="single"
      collapsible
      className="relative z-40 bg-white shadow"
    >
      <AccordionItem value="item-1">
        <div className="fixed bg-white border border-gray-200 rounded-md overflow:hidden right-8 w-80 bottom-8">
          <div className="flex flex-col w-full h-full">
            <AccordionTrigger className="px-6 border-b border-zinc-300">
              <ChatHeader />
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col h-80">
                message
                <ChatInput className="px-4"></ChatInput>
              </div>
            </AccordionContent>
          </div>
        </div>
      </AccordionItem>
    </Accordion>
  );
};

export default Chat;
