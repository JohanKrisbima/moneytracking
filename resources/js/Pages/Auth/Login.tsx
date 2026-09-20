import { Head, useForm } from "@inertiajs/react";
import type { FormEvent } from "react";

export default function Login() {
    const form = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        form.post("/login", {
            onFinish: () => form.reset("password"),
        });
    };

    return (
        <>
            <Head title="Login" />

            <main className="min-h-screen bg-[#F5F1EA] text-[#2B2724] dark:bg-[#171412] dark:text-[#F5F1EA]">
                <div className="flex min-h-screen items-center justify-center px-6 py-12">
                    <div className="w-full max-w-md">
                        <div className="mb-8 text-center">
                            <p className="mb-3 text-sm font-medium tracking-[0.2em] text-[#C2632A] uppercase">
                                MoneyTrack
                            </p>

                            <h1 className="text-[2.5rem] leading-[1.15] font-semibold tracking-tight">
                                Welcome back
                            </h1>

                            <p className="mt-3 text-sm leading-6 text-[#6B6560] dark:text-[#A39C94]">
                                Kelola uangmu dengan lebih tenang dan teratur.
                            </p>
                        </div>

                        <div className="rounded-[24px] border border-white/35 bg-white/55 p-8 shadow-[0_8px_32px_rgba(43,39,36,0.12)] backdrop-blur-[16px] backdrop-saturate-[140%] dark:border-white/8 dark:bg-[#211D1A]/55 dark:shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-medium"
                                    >
                                        Email
                                    </label>

                                    <input
                                        id="email"
                                        type="email"
                                        value={form.data.email}
                                        onChange={(event) =>
                                            form.setData(
                                                "email",
                                                event.target.value,
                                            )
                                        }
                                        placeholder="johan@example.com"
                                        autoComplete="email"
                                        className="w-full rounded-[16px] border border-white/35 bg-white/70 px-4 py-3.5 text-sm outline-none transition focus:border-[#C2632A] focus:ring-2 focus:ring-[#C2632A]/15 dark:border-white/10 dark:bg-[#211D1A]/70"
                                    />

                                    {form.errors.email && (
                                        <p className="mt-2 text-sm text-[#B54A3F]">
                                            {form.errors.email}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="password"
                                        className="mb-2 block text-sm font-medium"
                                    >
                                        Password
                                    </label>

                                    <input
                                        id="password"
                                        type="password"
                                        value={form.data.password}
                                        onChange={(event) =>
                                            form.setData(
                                                "password",
                                                event.target.value,
                                            )
                                        }
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        className="w-full rounded-[16px] border border-white/35 bg-white/70 px-4 py-3.5 text-sm outline-none transition focus:border-[#C2632A] focus:ring-2 focus:ring-[#C2632A]/15 dark:border-white/10 dark:bg-[#211D1A]/70"
                                    />

                                    {form.errors.password && (
                                        <p className="mt-2 text-sm text-[#B54A3F]">
                                            {form.errors.password}
                                        </p>
                                    )}
                                </div>

                                <label className="flex items-center gap-3 text-sm text-[#6B6560] dark:text-[#A39C94]">
                                    <input
                                        type="checkbox"
                                        checked={form.data.remember}
                                        onChange={(event) =>
                                            form.setData(
                                                "remember",
                                                event.target.checked,
                                            )
                                        }
                                        className="h-4 w-4 rounded border-[#6B6560]/30 accent-[#C2632A]"
                                    />
                                    Ingat saya
                                </label>

                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="w-full rounded-full bg-[#C2632A] px-6 py-3 font-semibold text-white transition hover:bg-[#A34F1E] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {form.processing ? "Memproses..." : "Masuk"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
