import { OrbisConnectResult, CeramicDocument } from "@useorbis/db-sdk";
import { Memory, Content } from "@ai16z/eliza";
export type ServerMessage = Memory & {
    content: Content | string;
    createdAt: string;
    is_user: boolean;
};
export declare class Orbis {
    private static instance;
    private db;
    private constructor();
    static getInstance(): Orbis;
    getAuthenticatedInstance(): Promise<OrbisConnectResult>;
    getController(): Promise<string>;
    updateOrbis(content: ServerMessage): Promise<CeramicDocument>;
    query(text: string): Promise<{
        columns: Array<string>;
        rows: ServerMessage[];
    } | null>;
}
