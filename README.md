## Requirements

Install the development requirements as described in this [article](https://tauri.app/v1/guides/getting-started/prerequisites#installing).

Install the npm dependencies:

```bash
npm install
```

## Building the application

Run the following command after installing the requirements:

```bash
npm run tauri build --release
```

## Running in dev environment

Run the following command after installing the requirements:

```bash
npm run tauri dev
```

## Running tests

Running frontend unit tests:

```bash
npm run test:vitest
```

Running backend integration tests:

```bash
cd ./src-tauri/
cargo test
```

## Known Issues

-   End2End tests (File: `test/test.cjs`) not working --> Webdriver client can't connect to tauri-driver instance
