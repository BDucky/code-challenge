# Problem 6: Live Scoreboard Module Specification

This document outlines the specification for a live scoreboard module from a frontend perspective. It details the required API endpoints, data structures, and interaction flow for a backend team to implement.

---

## 1. How to Run This Frontend Prototype

This project was built with Vite. To run it locally, follow these steps:

1.  **Navigate to the project directory:**
    ```bash
    cd src/problem6
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

This will start the application, and you can view it in your browser at the URL provided (usually `http://localhost:5173`).

A working frontend prototype with mock data can be found in `src/Scoreboard.tsx`.

---

## 2. Functional Requirements

- The system must display a scoreboard showing the top 10 user scores.
- The scoreboard must update in real-time for all connected users when any user's score changes.
- A user must be able to perform an action that increases their score.
- The score update mechanism must be secure to prevent unauthorized changes.

---

## 3. API Specification (for Backend Team)

The frontend requires the following data models and API endpoints.

### Data Models

**`UserScore`**: Represents a user's score.
```json
{
  "id": "string",       // Unique user identifier
  "username": "string",  // User's display name
  "score": "number"       // User's total score
}
```

### REST API Endpoints

#### A. Get Top Scores

Fetches the initial list of the top 10 scores.

- **Endpoint**: `GET /api/scores/top`
- **Response Body**: `UserScore[]`
  ```json
  [
    { "id": "user-1", "username": "Alice", "score": 1050 },
    { "id": "user-2", "username": "Bob", "score": 980 },
    ...
  ]
  ```

#### B. Update User Score

Allows an authenticated user to report a score increase after completing an action.

- **Endpoint**: `POST /api/scores/update`
- **Authentication**: Required. The request should include a JWT or session cookie to identify the user.
- **Request Body**:
  ```json
  {
    "scoreIncrease": "number" // The amount to increase the score by
  }
  ```
- **Response Body**: The user's new total score `UserScore`.

### Real-time Updates (WebSocket API)

To enable live updates, a WebSocket connection is required.

- **Endpoint**: `ws://your-api-domain.com/live-updates`
- **Server-to-Client Message**: When any user's score is updated, the server should push the updated `UserScore` object to all connected clients.
  ```json
  // Example message from server
  {
    "event": "SCORE_UPDATED",
    "payload": {
      "id": "user-5",
      "username": "Eve",
      "score": 895
    }
  }
  ```

---

## 4. System Flow Diagrams

### A. Target Backend Interaction Flow

This diagram illustrates the data flow for the final implementation with a real backend server.

```
+----------+      1. GET /api/scores/top      +----------------+
| Frontend | ------------------------------> |    Backend     |
| (Client) | <------------------------------ | (API Server)   |
+----------+      2. Returns Top 10 Scores  +----------------+
     |                                              ^
     | 3. Establishes WebSocket connection          |
     |--------------------------------------------->|
     |
     V
+----------+      4. User performs action     +----------------+
| User A   | ------------------------------> |    Backend     |
|          |      5. POST /api/scores/update | (API Server)   |
+----------+ <------------------------------ +----------------+
             6. Returns updated score for User A      |
                                                      |
                                                      V
                                             +-----------------+
                                             | WebSocket Server|
                                             +-----------------+
                                                      |
                                                      | 7. Pushes 'SCORE_UPDATED' event
                                                      | to all connected clients
     +----------------------------------------------------+
     |                                                    |
     V                                                    V
+----------+                                        +----------+
| Client A |                                        | Client B |
| (Updates UI)                                      | (Updates UI)
+----------+                                        +----------+
```

### B. Frontend Prototype Flow (with Mock Data)

This diagram shows how the current frontend prototype simulates the backend interaction.

```
+---------------------+      1. Calls getTopScores()     +-------------------+
|                     | -------------------------------> |                   |
|  Scoreboard.tsx     |      2. Returns Promise with     |      mockApi      |
|  (React Component)  | <------------------------------- | (Simulation Layer)| 
|                     |      initialScores               |                   |
+---------------------+      3. Calls onScoreUpdate()    +-------------------+
          |            -------------------------------> |  - Starts         |
          |                                              |    setInterval()  |
          |            <------------------------------- |  - Periodically   |
          |            4. Callback with random update    |    sends updates  |
          |                                              +-------------------+
          |
          V
+---------------------+      5. User clicks button,      +-------------------+
|                     |      calls updateMyScore()       |                   |
|  Scoreboard.tsx     | -------------------------------> |      mockApi      |
|  (React Component)  |      6. Returns Promise with     | (Simulation Layer)|
|                     | <------------------------------- |                   |
+---------------------+      updated user score          +-------------------+
```

---

## 5. Additional Comments & Improvements

- **Optimistic UI Updates**: On the frontend, when a user performs an action, their score can be updated in the UI immediately (`optimistically`) while the API call is in flight. The UI can then be reconciled once the server confirms the new score.
- **Scalability**: For a large number of users, the backend could use a message queue (e.g., RabbitMQ) or a pub/sub system (e.g., Redis) to handle score updates asynchronously and broadcast them via WebSockets.
- **Error Handling**: The frontend should handle API errors gracefully (e.g., show a notification if a score update fails). It should also manage WebSocket connection states (connecting, open, closed).
- **Alternative to WebSockets**: If WebSockets are not feasible, **Server-Sent Events (SSE)** or **long-polling** could be used as alternatives for real-time updates, although WebSockets are generally preferred for bidirectional communication.
