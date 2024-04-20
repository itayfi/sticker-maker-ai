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

export async function generateOpenAi({
  prompt,
  apiKey,
  model,
}: {
  prompt: string;
  apiKey: string;
  model: keyof typeof settingsByModel;
}) {
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    method: "POST",
    body: JSON.stringify({
      prompt,
      n: 1,
      ...settingsByModel[model],
      response_format: "b64_json",
    }),
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const { data } = (await response.json()) as {
    data: { b64_json: string }[];
  };
  const b64_json = data[0].b64_json;
  return `data:image/png;base64,${b64_json}`;
}
