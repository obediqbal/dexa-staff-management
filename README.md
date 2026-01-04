# Staff Microservice

A NestJS-based microservice for managing staff information including CRUD operations and profile management.

## Endpoints

### User Endpoints (Authenticated)

- `GET /staff/me` - Get current user's profile

### Admin Endpoints (Admin Only)

- `POST /staff` - Create new staff member
- `GET /staff` - Get all staff with filtering and sorting
- `GET /staff/:id` - Get specific staff member by ID
- `PATCH /staff/:id` - Update staff member information
- `DELETE /staff/:id` - Delete staff member

## Installation (Dev)

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Run database migrations:
```bash
npx prisma migrate dev
```

## Usage (Dev)

Start the development server:
```bash
npm run start:dev
```

The service will be available at `http://localhost:3002` (or the port specified in your `.env` file).