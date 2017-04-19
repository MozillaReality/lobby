# WebVR Lobby

The **[WebVR Lobby](https://lobby.webvr.rocks/)** is a WebVR home place for **[Project Moonrise](https://github.com/webvrrocks/moonrise)** and the **[WebVR Agent](https://github.com/WebVRRocks/webvr-agent).**

Welcome to the **[WebVR Lobby](https://lobby.webvr.rocks/)**!

[![WebVR Lobby](https://raw.githubusercontent.com/webvrrocks/webvr-lobby/master/img/preview.png "WebVR Lobby")](https://lobby.webvr.rocks/)


## Local development

To get started with local development, clone this repository, install the [Node](https://nodejs.org/) dependencies, and start the local development server:

```sh
git clone https://github.com/WebVRRocks/webvr-lobby.git  # Clone this repository.
cd webvr-lobby && npm install  # Install dependencies.
npm start  # Start the local development server.
```

And, then open this URL in your browser: **[`http://localhost:8000/`](http://localhost:8000/)**

### Using with the [WebVR Agent](https://github.com/WebVRRocks/webvr-agent)

To work with the lobby using the **[WebVR Agent](https://github.com/WebVRRocks/webvr-agent)**, clone the **[WebVR Agent](https://github.com/WebVRRocks/webvr-agent)** repo, install [Node](https://nodejs.org/) dependencies, and start the WebVR Agent in another terminal session, then start the WebVR lobby using instructions for _Local Development_.

Full instructions can be found in the **[WebVR Agent](https://github.com/WebVRRocks/webvr-agent)** repo.


## Deployment

The static version of this project is automatically deployed to [production](https://lobby.webvr.rocks/) by [Travis CI](https://travis-ci.org/WebVRRocks/webvr-lobby) when Pull Requests are successfully merged and commits are pushed to the `master` branch of this repository.

To manually deploy the static version of this project to [production](https://lobby.webvr.rocks/):

```sh
npm run deploy
```

To deploy the static version of this project to your repository's GitHub pages (e.g., https://cvan.github.io/), set the `GHPAGES_REPO` environment variable like so (i.e., containing your username instead of `cvan`):

```sh
GHPAGES_REPO="cvan/webvr-lobby" npm run deploy
```


## License

All code and content within this source-code repository is licensed under the [**Creative Commons Zero v1.0 Universal** license (CC0 1.0 Universal; Public Domain Dedication)](LICENSE.md).

You can copy, modify, distribute and perform this work, even for commercial purposes, all without asking permission.

For more information, refer to these following links:

* a copy of the [license](LICENSE.md) in [this source-code repository](https://github.com/webvrrocks/webvr-lobby)
* the [human-readable summary](https://creativecommons.org/publicdomain/zero/1.0/) of the [full text of the legal code](https://creativecommons.org/publicdomain/zero/1.0/legalcode)
* the [full text of the legal code](https://creativecommons.org/publicdomain/zero/1.0/legalcode)
