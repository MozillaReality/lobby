# WebVR Lobby

Welcome to the **[WebVR Lobby](https://caseyyee.github.io/webvr-lobby/)**!


## Local development

To get started with local development, clone this repository, install the [Node](https://nodejs.org/) dependencies, and start the local development server:

```sh
git clone https://github.com/caseyyee/webvr-lobby.git  # Clone the repository.
cd webvr-lobby && npm install  # Install dependencies.
npm start  # Start the local development server.
```

And open this URL in your browser: **[`http://localhost:8000/`](http://localhost:8000/)**


## Deployment

To deploy the static pages to [production](https://caseyyee.github.io/webvr-lobby/):

```sh
npm run deploy
```

To deploy the static pages to your repository's GitHub pages (replacing `cvan` with your username):

```sh
GHPAGES_REPO="cvan/webvr-lobby" npm run deploy
```


## License

[MIT](LICENSE.md)
