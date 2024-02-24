import { FormEvent, useRef } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { SelectValue } from "@radix-ui/react-select";

const settingsByModel = {
  "dall-e-2": {
    model: "dall-e-2",
    size: "512x512",
  },
  "dall-e-3": {
    model: "dall-e-3",
    size: "1024x1024",
  },
} as const;

type Props = {
  onStart: () => void;
  onError: () => void;
  onFinish: (path: string) => void;
};
export const AiGenerate = ({ onStart, onFinish, onError }: Props) => {
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const modelRef = useRef<HTMLSelectElement>(null);
  const onGenerate = async (event: FormEvent) => {
    event?.preventDefault();
    onStart();
    const prompt = promptRef.current?.value;
    if (!prompt || prompt === "") {
      onError();
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
          ...settingsByModel[modelRef.current?.value as keyof typeof settingsByModel],
          response_format: "b64_json",
        }),
      }
    );
    if (!response.ok) {
      onError();
      return;
    }
    const { data } = (await response.json()) as {
      data: { b64_json: string }[];
    };
    const b64_json = data[0].b64_json;
    onFinish(`data:image/png;base64,${b64_json}`);
  };
  return (
    <form onSubmit={onGenerate} className="space-y-3 mt-4">
      <Textarea
        required
        placeholder="Generate Sticker using AI"
        ref={promptRef}
      />
      <div className="flex flex-row gap-2 items-centers justify-end">
        <Select defaultValue="dall-e-3">
          <SelectTrigger className="inline-flex w-48 h-10">
            <SelectValue placeholder="Model" ref={modelRef} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dall-e-2">DALL-e 2</SelectItem>
            <SelectItem value="dall-e-3">DALL-e 3</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit">Generate</Button>
      </div>
    </form>
  );
};
