import emojiRegex from "emoji-regex";

type EmojiMetadata = {
  data: Record<
    string,
    {
      emoji: string;
      keywords: string[];
      alt: string;
      gBoardOrder: number;
      combinations: {
        gStaticUrl: string;
        leftEmoji: string;
        rightEmoji: string;
      }[];
    }
  >;
};

export async function generateUsingEmoji({ prompt }: { prompt: string }) {
  const metadata = (await (
    await fetch(generateCorsSafeUrl("https://backend.emojikitchen.dev"))
  ).json()) as EmojiMetadata;

  const emojis = new Map(
    prompt.match(emojiRegex())?.map((match) => [match[0], 100]) ?? []
  );

  for (const emoji of Object.values(metadata.data)) {
    const keywords = emoji.keywords.filter((keyword) =>
      prompt.toLowerCase().includes(keyword.toLowerCase().replace(/_/g, " "))
    );
    if (keywords.length) {
      emojis.set(
        emoji.emoji,
        Math.max(
          emojis.get(emoji.emoji) ?? 0,
          prompt.toLowerCase().includes(emoji.alt)
            ? 100
            : Math.max(...keywords.map((k) => k.length)) - emoji.keywords.length
        )
      );
    }
  }

  if (emojis.size === 0) {
    throw new Error("No emojis found");
  }

  if (emojis.size === 1) {
    return generateSingleEmoji(emojis.keys().next().value);
  }

  const sortedEmojis = Array.from(emojis).sort((a, b) => b[1] - a[1]);
  for (const [emoji] of sortedEmojis) {
    const emojiMetadata = Object.values(metadata.data).find(
      (obj) => obj.emoji === emoji
    );
    const combo = emojiMetadata?.combinations.map(
      (combo) =>
        [
          combo,
          (emojis.get(combo.leftEmoji) ?? -20) +
            (emojis.get(combo.rightEmoji) ?? -20),
        ] as const
    );
    combo?.sort((a, b) => b[1] - a[1]);
    if (combo?.length) {
      return generateCorsSafeUrl(combo[0][0].gStaticUrl);
    }
  }

  return generateSingleEmoji(emojis.keys().next().value);
}

async function generateSingleEmoji(emoji: string) {
  const canvas = new OffscreenCanvas(512, 512);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }
  ctx.font = '400 430px "Noto Color Emoji"';
  ctx.fillStyle = "black";
  const rect = ctx.measureText(emoji);
  ctx.fillText(emoji, (512 - rect.width) / 2, 410);

  return URL.createObjectURL(await canvas.convertToBlob());
}

function generateCorsSafeUrl(url: string) {
  return "https://corsproxy.io/?" + encodeURIComponent(url);
}
