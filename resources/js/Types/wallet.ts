export type WalletType = "bank" | "ewalet" | "cash" | "saving";

export type Wallet = {
    id: number;
    name: string;
    type: WalletType;
    balance?: number;
    created_at: string;
    updated_at: string;
};

export type WalletForm = {
    name: string;
    type: WalletType;
};
