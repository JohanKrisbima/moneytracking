import type { Category } from "./category";
import type { Wallet } from "./wallet";

export type TransactionType = "income" | "expense";

export type Transaction = {
    id: number;
    user_id: number;
    wallet_id: number;
    category_id: number;
    type: TransactionType;
    amount: number | string;
    transaction_date: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    wallet?: Wallet;
    category?: Category;
};

export type TransactionForm = {
    wallet_id: string | number;
    category_id: string | number;
    type: TransactionType;
    amount: string | number;
    transaction_date: string;
    description: string;
};
