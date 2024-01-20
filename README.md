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

Running backend unit and integration tests:

```bash
cd ./src-tauri/
```

For Powershell:

```bash
$Env:SET_TEST_FILE=1; cargo test
cargo test
```

To remove the set environment variable:

```bash
Remove-Item Env:SET_TEST_FILE
```

else:

```bash
SET_TEST_FILE=1 cargo test
```

## Known Issues

- Datetimelocal picker is not working on Linux and Mac due to issues with the underlying webview
- End2End tests (File: `test/test.cjs`) not working --> Webdriver client can't connect to tauri-driver instance
- Integration tests are supposed to be in a separate folder (/src-tauri/tests) but are currently in the same file as the unit tests due to organizational issues. The size of this project is small enough to justify the combination of unit and integration tests.
