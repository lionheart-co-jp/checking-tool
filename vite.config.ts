import path from "path";

export default {
    base: "./",
    outDir: ".vite",

    alias: {
        "@/": path.join(__dirname, "renderer"),
    },

    optimizeDeps: {
        exclude: ["jsdom", "node-fetch", "encoding", "tslib", "ncp"],
    },
};
