# YT Playlist


> This app was developed using Angularjs and component arquitecture.

[Setup and install](#setup-and-install) |
[Tasks](#tasks)

----

## Live demo

[YT playlist demo](https://carlafranca.github.io/carlafranca).

## Setup and install

#### Dependency installation

1. Download and install [Node.js here](https://nodejs.org/en/download/) .
2. Install [SASS/Compass](http://thesassway.com/beginner/getting-started-with-sass-and-compass).
3. Install Gulp CLI on the command-line with `npm install -g gulp`

#### Project installation and server


 Install dependencies:

```
npm install
```


Run the server:

```
npm start
```

Everything is compiled and outputted inside `/docs`, this is the same for both local development and deployment (not using dist here due to guithub page folder name requeriment).

## Tasks

Here are all tasks available:

Run the local server:

```
npm start
```


To deploy:

```
npm run deploy
```

## Notes

I encountered a few issues reloading/refreshing the page aligned with `html5Mode` on guithub and the limitation using `.htaccess`. To fix this issue I'm using [this](https://github.com/rafrex/spa-github-pages) solution. This may cause flick on reload.
