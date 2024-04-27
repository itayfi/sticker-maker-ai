import {
  AutoTokenizer,
  BertPreTrainedModel,
  PreTrainedTokenizer,
  Tensor,
} from "@xenova/transformers";

export async function generateUsingEmoji({ prompt }: { prompt: string }) {
  const emojiDataPromise = import("@/assets/emoji-embeddings.json");

  const tokenizer = await AutoTokenizer.from_pretrained(
    "Qdrant/bge-small-en-v1.5-onnx-Q"
  );

  const model = (await BertPreTrainedModel.from_pretrained(
    "Qdrant/bge-small-en-v1.5-onnx-Q",
    {
      model_file_name: "../model_optimized",
      quantized: false,
    }
  )) as BertPreTrainedModel;
  const binaryEmbedding = await embedString(tokenizer, prompt, model);

  const emojiData = (await emojiDataPromise) as unknown as {
    default: { embed: string; gStaticUrl: string }[];
  };

  let maxSim = 0,
    maxUrl: string | null = null;
  for (const emoji of emojiData.default) {
    const sim = similarity(binaryEmbedding, emoji.embed);
    if (sim > maxSim) {
      maxSim = sim;
      maxUrl = emoji.gStaticUrl;
    }
  }

  if (maxUrl) return maxUrl;

  throw new Error("Not implemented");
}

async function embedString(
  tokenizer: PreTrainedTokenizer,
  prompt: string,
  model: BertPreTrainedModel
) {
  const tokens = tokenizer(prompt);
  const output = await model(tokens);
  const embedding = output.last_hidden_state as Tensor;
  const binaryEmbedding = embedding
    .slice(0, 0, null)
    .tolist()
    .map((x) => (x > 0 ? 1 : 0));
  return binaryEmbedding;
}

function similarity(source: number[], target: string) {
  const decoded = atob(target);
  let result = 0;
  for (let i = 0; i < decoded.length; i++) {
    result += source[i] & decoded.charCodeAt(i);
  }
  return result;
}
