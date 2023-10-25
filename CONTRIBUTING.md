# Contributing Guidelines

Thank you for taking the time to contribute to our project. Please take a moment to read the following guidelines before contributing:

## Prerequisites ⚠️

- Open Source Etiquette: If you've never contributed to an open source project before, have a read of [Basic etiquette](https://developer.mozilla.org/en-US/docs/MDN/Community/Open_source_etiquette) for open source projects.

- Basic familiarity with Git and GitHub: If you are also new to these tools, visit [GitHub for complete beginners](https://developer.mozilla.org/en-US/docs/MDN/Contribute/GitHub_beginners) for a comprehensive introduction to them.

- Make sure you have [Node.js](https://nodejs.org/) installed.
- Make sure you have [Docker](https://docs.docker.com/get-docker/) installed.

---

## How to Contribute 🤔

To get started, look at the existing [**Issues**](https://github.com/rupali-codes/LinksHub/issues) or [**create a new issue**](https://github.com/rupali-codes/LinksHub/issues/new/choose)!

### Setup guidelines 🪜
Follow these steps to setup LinksHub on your local machine

1. [Fork](https://github.com/rupali-codes/LinksHub/fork) the project
2. Clone the project to run on your local machine using the following command:

   ```sh
   git clone https://github.com/<your_github_username>/reduced.to.git
   ```

3. Get into the root directory

   ```sh
   cd reduced.to
   ```

4. Install all dependencies by running

   ```sh
   npm install
   ```

5. Create your branch

   ```sh
   git checkout -b <your_branch_name>
   ```
   
6. Copy `.example.env` to `.env` and fill it properly.

7. Make sure you have a local instance of PostgreSQL running on port 5432. If not, you can run it using docker:
   ```sh
   docker run --name reduced_to_db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=reduced_to_db -p 5432:5432 -d postgres
   ```
8. Run Prisma migration from root folder:
   ```sh
   npx nx migrate-dev prisma --name=init
   ```
9. Run the backend from root folder:
   ```sh
   npx nx serve backend
   ```
10. Run the frontend from root folder:
    ```sh 
    npx nx serve frontend
    ```
   
### 🐳 Docker

You can build the docker images by running the following nx command:

  ```sh
npx nx run-many -t docker-build
  ```

- This command will automatically build the dependencies and the backend and frontend images.

### 🐙 Docker compose

- In case you have docker installed, you can _single-click_ deploy and test your changes by running the following and going to `http://localhost:5000/` on your browser.
- When you run the command below, don't forget to change the .env file with the correct values.

  ```sh
  docker compose -f docker/local/docker-compose.yml -p reduced-to up
  ```

### 👷 Configuration

For the minimal configuration you can just rename the `.example.env` files to `.env`.

###### General

- **BACKEND_APP_PORT**: Backend port
- **FRONTEND_APP_PORT**: Frontend port
- **NODE_ENV**: Node environment (development / production)

###### Database

- **DATABASE_URL**: Database connection string

###### Rate Limit

- **RATE_LIMIT_TTL**: Rate limit TTL (time to live)
- **RATE_LIMIT_COUNT**: Number of requests within the ttl

###### Logger

- **LOGGER_CONSOLE_THRESHOLD**: Threshold level of the console transporter.

###### Frontend

- **DOMAIN**: Domain of your frontend app
- **API_DOMAIN**: Domain of your backend instance (used for server side requests)
- **CLIENTSIDE_API_DOMAIN**: Domain of your backend instance (used for client side requests)

###### Redis

- **REDIS_ENABLE**: Whether to use external redis store or not
- **REDIS_HOST**: Redis instnace host
- **REDIS_PORT**: Redis instance port
- **REDIS_PASSWORD**: Redis instance password
- **REDIS_TTL**: Redis ttl (in seconds)

###### Auth

- **JWT_ACCESS_SECRET**: Jwt secret (used for access tokens)
- **JWT_REFRESH_SECRET**: Jwt secret (used for refresh tokens)

###### Novu

- **NOVU_API_KEY**: Get it from https://novu.co/, you don't need this when running locally (just verify your email from the database)


11. Make your changes before staging them.

12. Stage your changes

   ```sh
   git add <filename>
   ```

13. Commit your changes

   ```sh
   git commit -m "<your-commit-message>"
   ```

14. Push your changes to your branch

    ```sh
    git push origin "<your_branch_name>"
    ```

15. Create a **Pull Request**


Congratulations! You have successfully contributed to the project.
---
