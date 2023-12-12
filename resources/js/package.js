if (import.meta.env.VITE_OPENREPLAY_TOKEN !== undefined && import.meta.env.VITE_OPENREPLAY_URL !== undefined) {
    (() => import('./openreplay.js'))();
}
