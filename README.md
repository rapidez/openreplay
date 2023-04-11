# Rapidez OpenReplay

## Installation

```
yarn add @openreplay/tracker -D
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

## License

GNU General Public License v3. Please see [License File](LICENSE) for more information.
