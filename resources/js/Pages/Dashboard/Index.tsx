import { Head, usePage } from "@inertiajs/react";
import { useEffect } from "react";
import Swal from "sweetalert2";
import AppLayout from "@/Components/Layouts/AppLayout";
import { useSweetAlert } from "@/Hooks/useSweetAlert";

type PageProps = {
    flash: {
        success?: string;
    };
};

export default function Dashboard() {
    const { flash } = usePage<PageProps>().props;

    const { success } = useSweetAlert();
    useEffect(() => {
        if (flash.success) {
            success(flash.success);
        }
    }, [flash.success, success]);

    return (
        <AppLayout>
            <Head title="Dashboard - MoneyTrack" />

            <div className="space-y-10">
                <section>
                    <h1 className="font-heading text-[2.5rem] leading-[1.15] font-semibold">
                        Dashboard
                    </h1>

                    <p className="mt-2 text-sm text-[var(--muted)]">
                        Selamat datang di MoneyTrack.
                    </p>
                </section>
            </div>
        </AppLayout>
    );
}
