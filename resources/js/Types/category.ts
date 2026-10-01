export type CategoryType = "income" | "expense";

export type Category = {
    id: number;
    user_id: number;
    name: string;
    type: CategoryType;
    created_at: string;
    updated_at: string;
};

export type CategoryForm = {
    name: string;
    type: CategoryType;
};
