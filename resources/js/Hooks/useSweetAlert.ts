import { useCallback } from "react";
import Swal from "sweetalert2";

export function useSweetAlert() {
    const success = useCallback((message: string) => {
        Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: message,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        });
    }, []);

    const error = useCallback((message: string) => {
        Swal.fire({
            toast: true,
            position: "top-end",
            icon: "error",
            title: message,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        });
    }, []);

    const warning = useCallback((message: string) => {
        Swal.fire({
            toast: true,
            position: "top-end",
            icon: "warning",
            title: message,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        });
    }, []);

    const info = useCallback((message: string) => {
        Swal.fire({
            toast: true,
            position: "top-end",
            icon: "info",
            title: message,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        });
    }, []);

    const confirm = useCallback(
        async ({
            title = "Apakah Anda yakin?",
            text = "Data yang dihapus tidak dapat dikembalikan!",
            confirmButtonText = "Ya, Hapus!",
            cancelButtonText = "Batal",
        }: {
            title?: string;
            text?: string;
            confirmButtonText?: string;
            cancelButtonText?: string;
        } = {}) => {
            const result = await Swal.fire({
                title,
                text,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#B54A3F",
                cancelButtonColor: "#6B6560",
                confirmButtonText,
                cancelButtonText,
                reverseButtons: true,
            });

            return result.isConfirmed;
        },
        [],
    );

    return {
        success,
        error,
        warning,
        info,
        confirm,
    };
}
