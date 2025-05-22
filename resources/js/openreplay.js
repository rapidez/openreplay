import Tracker from '@openreplay/tracker'
import { createGraphqlMiddleware } from '@openreplay/tracker-graphql';

const captureNetwork = import.meta.env.VITE_OPENREPLAY_CAPTURE_NETWORK === undefined
    || import.meta.env.VITE_OPENREPLAY_CAPTURE_NETWORK === 'true'

const checkAndHandleGraphql = (requestAndResponse) => {
    const isGraphql = requestAndResponse.url.includes("/graphql");
    if (isGraphql && requestAndResponse.response.body) {
        try {
            const responseObject = typeof requestAndResponse.response.body !== 'string' ? requestAndResponse.response.body : JSON.parse(requestAndResponse.response.body);
            const requestObject = typeof requestAndResponse.request.body !== 'string' ? requestAndResponse.request.body : JSON.parse(requestAndResponse.request.body);

            recordGraphQL(
                requestAndResponse.request.body.includes('mutation') ? 'mutation' : 'query',
                Object.keys(responseObject?.data).join('') || 'unknown',
                requestObject?.variables,
                responseObject
            );

            return true
        } catch (e) {
            return false
        }
    }

    return false
}

// https://docs.openreplay.com/en/installation/network-options/
const openreplaySanitizer = (requestAndResponse) => {
    for (const headerToSanitize of [
        'Authorization',
        'X-CSRF-Token',
        'Cookie',
        'Set-Cookie',
        ...(import.meta.env.VITE_OPENREPLAY_SANITIZE_HEADERS || '').split(/ |,/),
    ]) {
        if (!headerToSanitize) {
            continue;
        }
        if (requestAndResponse.request.headers[headerToSanitize]) {
            requestAndResponse.request.headers[headerToSanitize] = '[Filtered]'
        }
    }

    if (typeof requestAndResponse.request.body !== 'string') {
        // If the request body is not a string, we do not save it.
        // As this will be one of https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#body
        requestAndResponse.request.body = ''
    }

    let responseBodyString = requestAndResponse.response.body
    if (typeof responseBodyString === 'object') {
        try {
            responseBodyString = JSON.stringify(responseBodyString)
        } catch (e) {
            // Rather safe than sorry, if it fails we empty the response body
            responseBodyString = '{}'
        }
    }

    for (const jsonValueToSanitize of [
        'password',
        'token',
        'mask',
        'cart_id',
        'postcode',
        'city',
        'customer_telephone',
        'telephone',
        'fax',
        'vat_id',
        'po_number',
        'pay_return_url',
        'pay_redirect_url',
        'iban',
        ...(import.meta.env.VITE_OPENREPLAY_SANITIZE_JSON_VALUES || '').split(/ |,/),
    ]) {
        if (!jsonValueToSanitize) {
            continue;
        }
        const re = new RegExp(`("?${jsonValueToSanitize}"?: ?")([^"]+)(")`, 'g')
        requestAndResponse.request.body = requestAndResponse.request.body?.replaceAll(re, '$1[Filtered]$3')
        responseBodyString = responseBodyString?.replaceAll(re, '$1[Filtered]$3')
    }

    if (typeof requestAndResponse.response.body === 'object') {
        try {
            requestAndResponse.response.body = JSON.parse(responseBodyString)
        } catch (e) {
            // Ignore error
        }
    } else {
        requestAndResponse.response.body = responseBodyString
    }

    // After we've done sanitisation, we could allow the user to sanitize further.
    if (window.openreplaySanitizer) {
        requestAndResponse = window.openreplaySanitizer(requestAndResponse);
    }

    checkAndHandleGraphql(requestAndResponse)

    return requestAndResponse
}

const tracker = new Tracker({
    projectKey: import.meta.env.VITE_OPENREPLAY_TOKEN,
    ingestPoint: import.meta.env.VITE_OPENREPLAY_URL,
    network: {
        capturePayload: captureNetwork,
        sanitizer: openreplaySanitizer,
    },
})

export const recordGraphQL = window.recordGraphQL = tracker.use(createGraphqlMiddleware());

document.addEventListener('vue:loaded', (event) => {
    if (window.app && (window.app.user?.email || window.app.guestEmail)) {
        tracker.setUserID(window.app.user?.email || window.app.guestEmail)
    }
})

tracker.start()
