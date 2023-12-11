import Tracker from '@openreplay/tracker'

const captureNetwork = import.meta.env.VITE_OPENREPLAY_CAPTURE_NETWORK === undefined
    || import.meta.env.VITE_OPENREPLAY_CAPTURE_NETWORK === 'true'

const tracker = new Tracker({
    projectKey: import.meta.env.VITE_OPENREPLAY_TOKEN,
    ingestPoint: import.meta.env.VITE_OPENREPLAY_URL,
    network: {
        capturePayload: captureNetwork
    }
})

document.addEventListener('turbo:load', (event) => {
    if (window.app && (window.app.user?.email || window.app.guestEmail)) {
        tracker.setUserID(window.app.user?.email || window.app.guestEmail)
    }
})

tracker.start()
