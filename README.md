

# CSV Data Upload and Management Application

[Technical Assessement Link](https://github.com/tqwdan82/Technical_Assessment)

This repository contains a React/Svelte frontend and a NodeJS backend application for uploading, storing, listing, and searching data from a CSV file.

## Requirements

* Node.js (version >= 18)
* Docker
* Docker Compose

## Setup and Run Instructions

1.  **Clone the Repository:**

    ```bash
    git clone <your_repository_url>
    cd <your_repository_directory>
    ```

2.  **Run with Docker Compose:**

    * Ensure Docker and Docker Compose are installed.
    * Run the following command in the root directory of the project:

        ```bash
        docker compose up --build
        ```

    * This command will:
        * Build the backend and frontend Docker images.
        * Start a PostgreSQL database container.
        * Start the backend and frontend containers, linking them to the database.
        * The backend will be accessible at `http://localhost:3000`.
        * The frontend will be accessible at `http://localhost:5173`.

3.  **Database Configuration:**

    * The application uses PostgreSQL as the database.
    * The database connection string is configured in the backend's `Dockerfile` via the `DATABASE_URL` environment variable: `postgres://postgres:postgres@postgres:5432/postgres`.
    * The database is persisted in the `db_data` Docker volume.

4.  **Backend Setup Details:**

    * The backend is a NodeJS application built using TypeScript.
    * It uses PostgreSQL for data storage.
    * It provides API endpoints for:
        * Uploading a CSV file.
        * Listing data with pagination.
        * Searching data.
    * The backend code is located in the `backend/src` directory.
    * The backend runs on port `3000`.
    * The backend docker file is located in the backend folder.
    * The backend volume maps the local ./backend/src directory to the /app/src directory inside the container, enabling code changes to be reflected without rebuilding the container.

5.  **Frontend Setup Details:**

    * The frontend is a React/Svelte application built using TypeScript.
    * It provides a user interface for uploading a CSV file, viewing data, and searching.
    * The frontend code is located in the `frontend/src` directory.
    * The frontend runs on port `5173`.
    * The frontend docker file is located in the frontend folder.
    * The environment variable CHOKIDAR_USEPOLLING=true is set to fix file watching issues that can occur in docker.

6.  **Unit Tests:**

    * Unit tests are included for both the backend and frontend.
    * To run the backend tests, navigate to the `backend` directory and run:

        ```bash
        npm install
        npm test
        ```

    * To run the frontend tests, navigate to the `frontend` directory and run:

        ```bash
        npm install
        npm test
        ```

    * The tests cover various scenarios, including edge cases.

7.  **CSV File:**

    * Use the provided CSV file for testing the upload functionality.

## Usage

1.  Open your browser and navigate to `http://localhost:5173`.
2.  Use the provided user interface to upload the CSV file.
3.  View the uploaded data in the table.
4.  Use the search functionality to filter the data.
5.  Use the pagination to navigate the data.