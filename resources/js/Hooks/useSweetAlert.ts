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

    return {
        success,
        error,
        warning,
        info,
    };
}
