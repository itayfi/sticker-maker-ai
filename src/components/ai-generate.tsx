import { FormEvent, useRef } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

type Props = {
  onStart: () => void;
  onError: () => void;
  onFinish: (path: string) => void;
};
export const AiGenerate = ({ onStart, onFinish, onError }: Props) => {
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const onGenerate = async (event: FormEvent) => {
    event?.preventDefault();
    onStart();
    const prompt = promptRef.current?.value;
    if (!prompt || prompt === "") {
      onError()
      return;
    }

    const apiKey = localStorage.getItem("openai-api-key");

    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        method: "POST",
        body: JSON.stringify({
          prompt,
          n: 1,
          size: "1024x1024",
          model: "dall-e-3",
          response_format: "b64_json",
        }),
      }
    );
    if (!response.ok) {
      onError();
      return;
    }
    const { data } = (await response.json()) as { data: { b64_json: string }[] };
    const b64_json = data[0].b64_json;
    onFinish(`data:image/png;base64,${b64_json}`);
  };
  return (
    <form onSubmit={onGenerate} className="text-right space-y-3 mt-4">
      <Textarea
        required
        placeholder="Generate Sticker using AI"
        ref={promptRef}
      />
      <Button type="submit">Generate</Button>
    </form>
  );
};
