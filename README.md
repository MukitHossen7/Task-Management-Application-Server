## Task Management API

## Description

- This is the backend server for the **Task Management Application**, providing a RESTful API to handle task-related operations such as adding, editing, deleting tasks. The server is built using **Node.js, Express.js, and MongoDB**, ensuring real-time task synchronization and persistent data storage.

## Server Site Link :

-- https://task-management-server-two-omega.vercel.app/

## Technologies

- Node.js
- Express.js
- MongoDB
- JWT

## API Endpoints

- POST /tasks – Add a new task
- GET /tasks – Retrieve all tasks
- PUT /tasks/:id – Update task details
- DELETE /tasks/:id – Delete a task

## Installation and Setup

### git clone

- https://github.com/MukitHossen7/Task-Management-Application-Server.git

### Install dependencies

- npm install

### Start the server

- nodemon index.js / npm run dev

## dependencies

- "cookie-parser": "^1.4.7",
- "cors": "^2.8.5",
- "dotenv": "^16.4.7",
- "express": "^4.21.2",
- "jsonwebtoken": "^9.0.2",
- "mongodb": "^6.13.0"
