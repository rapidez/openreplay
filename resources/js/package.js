if (import.meta.env.VITE_OPENREPLAY_TOKEN && import.meta.env.VITE_OPENREPLAY_URL) {
    (() => import('./openreplay.js'))();
}
