export declare class Lit {
    litNodeClient: any;
    chain: any;
    constructor();
    connect(): Promise<any>;
    disconnect(): Promise<any>;
    encrypt(message: any): Promise<{
        ciphertext: string;
        dataToEncryptHash: string;
    }>;
    decrypt(ciphertext: any, dataToEncryptHash: any): Promise<string>;
    getDelegationAuthSig(): Promise<any>;
    getSessionSignatures(): Promise<any>;
}
