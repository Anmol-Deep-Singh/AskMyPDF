// utils/embedder.ts
import { pipeline } from "@xenova/transformers";

let embedder: any = null;

async function getEmbedder() {
  if (!embedder) {
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedder;
}

/**
 * Convert an array of text chunks into embeddings
 * @param chunks - array of text strings
 * @returns Promise<number[][]> - array of embeddings
 */
export async function getEmbeddingsFromChunks(chunks: string[]): Promise<number[][]> {
  const embedder = await getEmbedder();

  const vectors: number[][] = await Promise.all(
    chunks.map(async (chunk) => {
      const output = await embedder(chunk, { pooling: "mean", normalize: true });
      return Array.from(output.data as Float32Array); // <-- cast here
    })
  );

  return vectors;
}
