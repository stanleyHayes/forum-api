# forum-api

forum api is an application containing JavaScript. The checked-in dependency manifests use Express, MongoDB via Mongoose. Source modules cover `Reply`, `Session`, `Topic`, `User`, `Replies`, `SessionsController`, `Topics`, `Users`.

## Repository layout

- `models/` — 4 tracked file(s); source examples: `models/Reply.js`, `models/Session.js`.
- `routes/` — 4 tracked file(s); source examples: `routes/Replies.js`, `routes/SessionsController.js`.

## Local setup

Run each package setup block from the repository root. For workspace repositories, install dependencies at the root before running application-specific scripts.

Clone this repository and enter its directory:

```sh
git clone https://github.com/stanleyHayes/forum-api.git
cd forum-api
```

### Node package: `package.json`

Use Node.js and npm.

```sh
npm install
```

- `node index.js` — executes the package entry point.
- The package test script is a placeholder and exits with an error; it does not run an automated test suite.

## Configuration

The application declares `dotenv`. Review environment-variable references in the source and supply your own local values before starting it. Keep credentials out of Git; do not reuse committed credentials.

## Source entry points

- [index.js](index.js)
- [models/Reply.js](models/Reply.js)
- [models/Session.js](models/Session.js)
- [models/Topic.js](models/Topic.js)
- [models/User.js](models/User.js)
- [routes/Replies.js](routes/Replies.js)
- [routes/SessionsController.js](routes/SessionsController.js)
- [routes/Topics.js](routes/Topics.js)

## Development notes

Commands above come from the tracked manifests and source layout. External services and runtime configuration may be required. Documentation updates do not establish that the application is deployed or that its tests pass.
