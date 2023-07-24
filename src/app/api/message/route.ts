import { chatbotPrompt } from "@/helpers/constants/chatbot-propmt";
import {
  ChatGPTMessage,
  openAIStream,
  OpenAIStreamPayload,
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
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 250,
    stream: true,
    n: 1,
  };

  const stream = await openAIStream(payload);

  return new Response(stream);
}
