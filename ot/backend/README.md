# Singers Voting System

## Start Locally

1. Navigate to the backend directory:
   ```sh
   cd ot/backend
   ```
2. Install dependencies:
   ```sh
   npm ci
   ```
3. Install the microservices dependencies:
   ```sh
   npm run ci
   ```
4. Start the server:
   ```sh
   npm run dev
   ```

## Frontend

Follow the steps described in the `README.md` file:

#### [Frontend Repository](https://github.com/klou17/web-project)

## Docker

1. Navigate to the backend directory:
   ```sh
   cd ot/backend
   ```
2. Install dependencies:
   ```sh
   npm ci
   ```
3. Install the microservices dependencies:
   ```sh
   npm run ci
   ```
4. Build the distributables:
   ```sh
   npm run build
   ```
5. Configure your environment variables (See [.env_example](.env_example))
6. In order for loggers to work properly create a log folder following this struture:<br>
   logs<br>
   ├── auth-service<br>
   ├── singer-service<br>
   ├── vote-service<br>
   └── user-service<br>
   Don't forget to give it proper permises for the containers to be able to write in them!
7. Start the application:
   `sh
    docker compose up --build
    `
   Your application will be available at http://localhost:your_api_gateway_port.
