export type ReportSummary = {
    income: number;
    expense: number;
    net: number;
    avg_daily_exp: number;
};

export type CategoryBreakdown = {
    category_id: number | null;
    name: string;
    color: string;
    icon: string;
    total: number;
    percentage: number;
    count: number;
};

export type DailyTrend = {
    day: number;
    date: string;
    income: number;
    expense: number;
};

export type ReportFilters = {
    month: string;
    wallet_id?: string;
};
