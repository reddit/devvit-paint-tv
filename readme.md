# 🎨📺 Paint TV

QVC for Bob Ross

## [How to Play](docs/how-to-play.md)

## Development

Install all dependencies once after cloning (and whenever they change).

```sh
npm install
```

Run `npm test` to execute tests. See
[supplemental development notes](docs/dev.md).

### Local Iframe Development

Develop locally for iframe (web view code under src/iframe and src/shared).

```sh
npm start
```

Visit **[http://localhost:1234](http://localhost:1234)** in your web browser. No
code or data is uploaded.

### Playtest Production and Devvit Blocks

Develop in prod with playtest for Devvit Blocks (src/main.ts, src/devvit, and
src/shared).

First, copy the template and upload an initial version. This only needs to be
done once.

```sh
cp tools/devvit.template.yaml devvit.dev.yaml
# edit the name field to be uniquely associated to you such as painttvfoo; it
# must be 16 characters or less.

npm run devvit:dev:upload
```

⚠️ Execute `npm run devvit:dev:upload` verbatim; it references the dev config.

Now playtest whenever wanted.

```
npm run playtest -- r/<development subreddit uniquely associated to you>
```

Visit **https://reddit.com/r/<sub>?playtest&devvitdebug=app**. Also,
launches [local iframe development](#local-iframe-development).

⚠️ `devvit` logs do not include iframe output.

### NPM Scripts

- `install`: install app dependencies.
- `start`: run development server on http://localhost:1234.
- `playtest r/<sub>`: live-reload on reddit.com. Don't forget to append the
  `?playtest&devvitdebug=app` query parameters to the URL. Also starts the local
  development server.
- `test`: execute all tests. Anything that can be validated automatically before
  publishing runs through this command.
- `run test:unit`: run the unit tests. Pass `--update` to update all test
  snapshots.
- `run format`: apply lint fixes automatically where available.
- `run build`: compile source inputs to artifacts under `dist/` and `webroot/`.
- `run devvit:install`: build, upload, and install a new version to r/PaintTV.
- `run devvit:dev:upload`: upload a new development version for new dev setup.

💡 Add `--` to pass arguments to the script command. For example,
`npm run test:unit -- --update` to update snapshots.

### Project Structure

- **assets**/: Devvit Blocks data uploads.
- **docs**/: supplemental documentation.
- **src**/: source inputs.
  - **devvit**/, **src/main.ts**: Devvit Blocks code.
  - **iframe**/: web view code.
  - **shared**/: code that may run in iframe and / or Devvit.
  - **test**/, **\*.test.ts**: tests and test utils.
- **tools**/: development scripts and configs.
- **webroot**/: iframe uploads.
  - **assets**/: iframe data uploads.
  - **index.\***: iframe web page code uploads.

## [License (BSD-3-Clause)](license.text)
