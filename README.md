## Requirements

Install Rust, Node and NPM or follow the installation guide on this [article](https://tauri.app/v1/guides/getting-started/prerequisites#installing). We tested the application with the following versions:
rustc: 1.74.0
node: v16.13.2
npm: 8.3.1

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

If you run into issues while executing the tests, you can look up more information [here](https://doc.rust-lang.org/book/ch12-05-working-with-environment-variables.html) or write a mail to either one of us.

## Known Issues

- Datetimelocal picker is not working on Linux and Mac due to issues with the underlying webview
- End2End tests (File: `test/test.cjs`) not working --> Webdriver client can't connect to tauri-driver instance
- Integration tests are supposed to be in a separate folder (/src-tauri/tests) but are currently in the same file as the unit tests due to organizational issues. The size of this project is small enough to justify the combination of unit and integration tests.
- The rust backend contains two functions called `read_task_db` and `read_preset_db`. They have the exact same logic but separate data types. We could not refactor it to a function version that works with generics, as we did with the `write_to_db` function, because we lacked advanced Rust knowledge.
- Currently, if an error occurs in the backend, the program will shut down with an error message. We have the structure to implement better error handling, but it is not required for this project.
