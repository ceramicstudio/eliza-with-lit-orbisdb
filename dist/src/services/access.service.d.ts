export declare class Lit {
    litNodeClient: any;
    chain: any;
    constructor();
    connect(): Promise<any>;
    disconnect(): Promise<any>;
    encrypt(message: string): Promise<{
        ciphertext: string;
        dataToEncryptHash: string;
    }>;
    decrypt(ciphertext: string, dataToEncryptHash: string): Promise<string>;
    getDelegationAuthSig(): Promise<any>;
    getSessionSignatures(): Promise<any>;
}
