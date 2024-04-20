import { FormEvent, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { useLocalStorage } from "@uidotdev/usehooks";
import { generateOpenAi } from "@/lib/generate/open-ai";
import { generateUsingEmoji } from "@/lib/generate/emoji-kitchen";

const functionByModel = {
  "dall-e-2": generateOpenAi,
  "dall-e-3": generateOpenAi,
  "emoji-kitchen": generateUsingEmoji,
} as const;

type Props = {
  onStart: () => void;
  onError: () => void;
  onFinish: (path: string) => void;
};
export const AiGenerate = ({ onStart, onFinish, onError }: Props) => {
  const [apiKey] = useLocalStorage("openai-api-key", "");
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const [selectedModel, setSelectedModel] =
    useState<keyof typeof functionByModel>("emoji-kitchen");
  const isDisabled = apiKey === "" && selectedModel !== "emoji-kitchen";
  const onGenerate = (event: FormEvent) => {
    event?.preventDefault();

    if (isDisabled) {
      return;
    }

    onStart();
    const prompt = promptRef.current?.value;
    if (!prompt || prompt === "") {
      onError();
      return;
    }

    functionByModel[selectedModel]({
      prompt,
      apiKey,
      // @ts-expect-error This is OK, TS is confused
      model: selectedModel,
    })
      .then(onFinish)
      .catch((e) => {
        console.error(e);
        onError();
      });
  };
  return (
    <>
      <form onSubmit={onGenerate} className="space-y-3 mt-4">
        <Textarea
          required
          placeholder="Generate Sticker using AI"
          ref={promptRef}
          disabled={isDisabled}
        />
        <div className="flex flex-row gap-2 items-centers justify-end">
          <Select
            defaultValue="emoji-kitchen"
            onValueChange={(value) => {
              setSelectedModel(value as keyof typeof functionByModel);
            }}
          >
            <SelectTrigger className="inline-flex w-48 h-10">
              <SelectValue placeholder="Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="emoji-kitchen">Emoji Kitchen</SelectItem>
              <SelectItem value="dall-e-2">DALL-e 2</SelectItem>
              <SelectItem value="dall-e-3">DALL-e 3</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" disabled={isDisabled}>
            Generate
          </Button>
        </div>
      </form>
      {isDisabled && (
        <p className="mt-2 text-sm text-foreground/70">
          In order to use this model, you need to set your OpenAI API Key in the
          settings. If you don't have an API Key yet, you can create one in{" "}
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            className="text-blue-500 hover:underline"
            rel="noreferrer"
          >
            OpenAI's website
          </a>
          .
        </p>
      )}
    </>
  );
};
