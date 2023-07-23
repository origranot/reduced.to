<h1>
<img src="https://seeklogo.com/images/P/playwright-logo-22FA8B9E63-seeklogo.com.png" width="40" hight="40" />
e2e-tests
</h1>

Welcome to the End-to-End (E2E) test suite for this project, powered by [Playwright][playwright-url]! These tests ensure that the application behaves correctly and as expected from the user's perspective.

## Introduction

This folder contains the End-to-End tests for the project. E2E tests are designed to simulate user interactions with the application and validate that the entire system is working as intended. We use Playwright as the testing framework for its simplicity, speed, and cross-browser capabilities.

## Prerequisites

Before running the tests, make sure you followed the instructions detailed in the main [README][readme-url] file.

[playwright-url]: https://playwright.dev/
[readme-url]: https://github.com/origranot/reduced.to/blob/master/README.md

## Running tests

Navigate to the `e2e-tests` folder:

```bash
cd e2e-tests
```

Install dependencies:

```bash
npm install
```

Execute the E2E tests:

```bash
npm run test:e2e
```

This command will trigger the Playwright test runner, which will launch the specified browsers and execute the test scenarios against the application.
