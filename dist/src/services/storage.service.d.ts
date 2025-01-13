import { CeramicDocument } from "@useorbis/db-sdk";
export declare class StorageService {
    private static instance;
    private lit;
    private orbis;
    private embeddingService;
    private constructor();
    static getInstance(): StorageService;
    start(): Promise<void>;
    storeMessage(context: string, is_user: boolean): Promise<CeramicDocument>;
    storeMessageWithEmbedding(context: string, is_user: boolean): Promise<CeramicDocument[]>;
    getConversation(): Promise<string | null>;
    getEmbeddingContext(text: string): Promise<string | null>;
    stop(): Promise<void>;
}
