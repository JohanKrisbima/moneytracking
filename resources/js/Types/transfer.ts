import type { Wallet } from "./wallet";

export type Transfer = {
    id: number;
    user_id: number;
    from_wallet_id: number;
    to_wallet_id: number;
    amount: number | string;
    transfer_date: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    from_wallet?: Wallet;
    to_wallet?: Wallet;
};

export type TransferForm = {
    from_wallet_id: string | number;
    to_wallet_id: string | number;
    amount: string | number;
    transfer_date: string;
    description: string;
};
