# Rapidez OpenReplay

Integration for https://openreplay.com

## Installation

```
yarn add @openreplay/tracker @openreplay/tracker-graphql -D
```

```
composer require rapidez/openreplay
```

## Configuration

Add your OpenReplay credentials in the `.env`:

```
VITE_OPENREPLAY_URL=https://domain.com/ingest
VITE_OPENREPLAY_TOKEN=
```

Optionally you can disable the network requests capturing with:
```
VITE_OPENREPLAY_CAPTURE_NETWORK=false
```

When network capture has been enabled you should redact some values like passwords.
We have a default list which you can extend by adding:
```
VITE_OPENREPLAY_SANITIZE_HEADERS="Token Authorization"
VITE_OPENREPLAY_SANITIZE_JSON_VALUES="new_password password email"
```

For more advanced sanitization you can set 
```js
// https://docs.openreplay.com/en/installation/network-options/
window.openreplaySanitizer = (requestAndResponse) => {
    return requestAndResponse;
}
```

## License

GNU General Public License v3. Please see [License File](LICENSE) for more information.
