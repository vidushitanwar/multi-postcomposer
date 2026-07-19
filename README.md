# Post Composer MERN App

A full-stack MERN application for composing and scheduling posts across multiple platforms (Instagram, Twitter, Reddit).

## Project Structure

The project is structured with a clean separation of concerns:

- **`backend/`**: Express API using Mongoose and MongoDB.
  - CRUD operations for composer posts.
  - Built-in media upload using Multer stored in local filesystem.
  - Automated integration testing with Jest and MongoDB Memory Server.
- **`frontend/`**: React application using standard vanilla CSS for a modern, glassmorphic UI.
  - Supports platform selection (Instagram, Twitter, Reddit).
  - Instagram post creator form (Title, Media upload, Description, Status, Schedule time).
  - Live feed showing currently saved post composer drafts.
  - Extensible structure for future Twitter and Reddit features.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (running locally or in the cloud)

---

### Setup and Running

#### 1. Start the Backend API

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. (Optional) Customize the database URI and Port in `backend/config/config.env`:
   ```env
   PORT=4000
   MONGO_URI=mongodb://127.0.0.1:27017/post-composer
   NODE_ENV=development
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend will run on [http://localhost:4000](http://localhost:4000).

#### 2. Start the Frontend App

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
   The frontend will run on [http://localhost:3000](http://localhost:3000) and proxy requests to the backend at port 4000.

---

## Running Tests

Integration tests run on the backend using an in-memory MongoDB instance:

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Run the test suite:
   ```bash
   npm test
   ```
