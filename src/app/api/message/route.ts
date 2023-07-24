import { chatbotPrompt } from "@/helpers/constants/chatbot-propmt";
import {
  ChatGPTMessage,
  OpenAIStreamPayload,
  openAIStream,
} from "@/lib/openai-stream";
import { MessageArraySchema } from "@/lib/validators/message";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const parsedData = MessageArraySchema.parse(messages);

  const outboundMessages: ChatGPTMessage[] = parsedData.map((message) => ({
    role: message?.isUserInput ? "user" : "system",
    content: message?.text,
  }));

  outboundMessages.unshift({
    role: "system",
    content: chatbotPrompt,
  });

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: outboundMessages,
    temperature: 0.4,
    stream: true,
    max_tokens: 250,
  };

  const stream = await openAIStream(payload);
  console.log(new Response(stream));

  return new Response(stream);
}
