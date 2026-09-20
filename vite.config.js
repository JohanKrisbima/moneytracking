import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import inertia from "@inertiajs/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/js/app.tsx"],
            refresh: true,
        }),
        inertia(),
        react(),
        tailwindcss(),
    ],

    server: {
        watch: {
            ignored: ["**/storage/framework/views/**"],
        },
    },
});
