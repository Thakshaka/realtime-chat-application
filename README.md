# ChatApp

A real-time chat application built with React and Spring Boot, featuring WebSocket-based messaging with PostgreSQL persistence and Redis caching.

## Features

- Real-time messaging using WebSocket (STOMP protocol)
- PostgreSQL for persistent message storage
- Redis for caching recent messages and tracking online users
- User join/leave notifications
- Message history and persistence
- Responsive React UI
- Docker support for containerized deployment
- CI/CD pipeline with GitHub Actions

## Prerequisites

- Java 21
- Maven 3.6+
- Node.js 18+ and npm
- PostgreSQL 15+ (or use Docker Compose)
- Redis instance (or use Docker Compose)
- Docker and Docker Compose (optional, for containerized deployment)

## Quick Start

### Using Docker Compose

The easiest way to run the application is with Docker Compose:

```bash
docker-compose up --build
```

This starts all services:
- PostgreSQL on port 5432
- Backend API on http://localhost:8080
- Frontend on http://localhost:3000

### Local Development

#### Backend Setup

1. Ensure PostgreSQL is running and create a database:
```sql
CREATE DATABASE chatapp_db;
```

2. Create a `.env` file in the project root:
```bash
cp env.example .env
```

3. Edit `.env` with your database and Redis credentials:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=chatapp_db
DB_USER=postgres
DB_PASSWORD=your_password

REDIS_HOST=your_redis_host
REDIS_PORT=10244
REDIS_USER=default
REDIS_PASSWORD=your_redis_password
```

4. Start the backend:
```bash
./mvnw spring-boot:run
```

The backend will be available at http://localhost:8080

#### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at http://localhost:3000

## Project Structure

```
chatapp/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # React components (ChatRoom, UsernameForm)
│   │   ├── services/      # WebSocket service
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── Dockerfile
│   └── package.json
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/thakshaka/chatapp/
│   │   │       ├── chat/           # Chat controllers and models
│   │   │       ├── config/         # WebSocket, Redis, CORS configuration
│   │   │       ├── entity/         # JPA entities
│   │   │       ├── repository/     # Data repositories
│   │   │       └── service/        # Business logic services
│   │   └── resources/
│   │       ├── application.properties
│   │       └── static/            # Legacy static files
│   └── test/                      # Test files
├── .github/workflows/     # CI/CD workflows
├── Dockerfile              # Backend Docker image
├── docker-compose.yml      # Multi-container setup
├── pom.xml                 # Maven dependencies
└── env.example             # Environment variables template
```

## Configuration

### Environment Variables

All sensitive configuration is managed through environment variables. The application requires the following:

**PostgreSQL:**
- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 5432)
- `DB_NAME` - Database name
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password

**Redis:**
- `REDIS_HOST` - Redis host
- `REDIS_PORT` - Redis port
- `REDIS_USER` - Redis username (optional)
- `REDIS_PASSWORD` - Redis password

For local development, create a `.env` file in the project root. The `.env` file is gitignored and will not be committed to the repository.

### Backend Configuration

The Spring Boot application is configured via `application.properties`. Database and Redis connections are configured through environment variables. The WebSocket endpoint is available at `/ws`.

### Frontend Configuration

The frontend connects to the backend WebSocket at the URL specified in `REACT_APP_API_URL` (defaults to http://localhost:8080). This can be configured via environment variable or by modifying the WebSocket service.

## API Documentation

### WebSocket Endpoints

**Connection:**
```
ws://localhost:8080/ws
```

**Topics:**
- `/topic/public` - Subscribe to receive all public messages

**Message Mappings:**
- `/app/chat.sendMessage` - Send a chat message
- `/app/chat.addUser` - Add a user to the chat

### Message Format

```json
{
  "sender": "username",
  "content": "message content",
  "type": "CHAT" | "JOIN" | "LEAVE"
}
```

## Development

### Running Tests

**Backend:**
```bash
./mvnw test
```

**Frontend:**
```bash
cd frontend
npm test
```

### Building for Production

**Backend:**
```bash
./mvnw clean package
```
The JAR file will be created in the `target/` directory.

**Frontend:**
```bash
cd frontend
npm run build
```
The production build will be in the `build/` directory.

### Docker Builds

**Backend:**
```bash
docker build -t chatapp-backend .
```

**Frontend:**
```bash
cd frontend
docker build -t chatapp-frontend .
```

## CI/CD

The project includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that:
- Builds the application
- Runs tests using service containers (PostgreSQL and Redis)
- Verifies Docker image builds

For CI/CD, the workflow uses GitHub Actions service containers for testing, so no secrets are required for basic test execution.

## Database Schema

The application uses JPA/Hibernate for database management. The schema is automatically created on first run. The main entity is:

**chat_messages:**
- `id` (BIGSERIAL PRIMARY KEY)
- `sender` (VARCHAR NOT NULL)
- `content` (TEXT)
- `type` (VARCHAR NOT NULL) - CHAT, JOIN, or LEAVE
- `created_at` (TIMESTAMP NOT NULL)

## Technology Stack

**Backend:**
- Spring Boot 3.3.3
- Spring WebSocket (STOMP)
- Spring Data JPA
- Spring Data Redis
- PostgreSQL
- Redis

**Frontend:**
- React 18
- @stomp/stompjs for WebSocket client
- SockJS for WebSocket fallback

**Infrastructure:**
- Docker and Docker Compose
- GitHub Actions for CI/CD

## License

This project is open source and available under the MIT License.
