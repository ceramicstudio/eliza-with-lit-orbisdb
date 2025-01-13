import { Document } from "langchain/document";
export declare class EmbeddingService {
    createEmbeddings(text: string): Promise<{
        chunks: Document<Record<string, any>>[];
        embeddingsArrays: number[][];
    }>;
    createEmbedding(text: string): Promise<number[][]>;
}
