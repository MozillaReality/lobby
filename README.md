# WebVR Lobby

Welcome to the **[WebVR Lobby](https://lobby.webvr.rocks/)**!

![WebVR Lobby](https://raw.githubusercontent.com/caseyyee/webvr-lobby/master/img/preview.png)

## Local development

To get started with local development, clone this repository, install the [Node](https://nodejs.org/) dependencies, and start the local development server:

```sh
git clone https://github.com/WebVRRocks/webvr-lobby.git  # Clone the repository.
cd webvr-lobby && npm install  # Install dependencies.
npm start  # Start the local development server.
```

And, then open this URL in your browser: **[`http://localhost:8000/`](http://localhost:8000/)**

### Using with WebVR-Agent

To work with the lobby using the **[WebVR Agent](https://github.com/WebVRRocks/webvr-agent)**, clone the **[WebVR Agent](https://github.com/WebVRRocks/webvr-agent)** repo, install [Node](https://nodejs.org/) dependencies, and start the agent in another terminal session, then start the WebVR lobby using instructions for _Local Development_.

Full instructions can be found in the **[WebVR Agent](https://github.com/WebVRRocks/webvr-agent)** repo.

## Deployment

To deploy the static pages to [production](https://lobby.webvr.rocks/):

```sh
npm run deploy
```

To deploy the static pages to your repository's GitHub pages (replacing `cvan` with your username):

```sh
GHPAGES_REPO="cvan/webvr-lobby" npm run deploy
```


## License

[MIT](LICENSE.md)
