# SIWE Demo

## Description
A simple web application that integrates Sign-In with Ethereum (SIWE) functionality. Users can create and modify their profile, and the data is persisted in a PostgreSQL database.

## Technologies
- Next.js
- Next Auth
- TypeScript
- Tailwind CSS
- RainbowKit
- Prisma
- PostgreSQL
- Docker
- SIWE

## Setup Instructions

### Prerequisites
- Node.js (>=v18)
- Docker and Docker Compose

### Running Locally

1. Clone the repository:
```bash
git clone git@github.com:msiric/siwe-demo.git
cd siwe-demo
```

2. Copy example secrets to .env:
```bash
cp .env.example .env
```

3. Run the application:
```bash
yarn run docker:dev
```

The application will be accessible at `http://localhost:3000`.

## Deployment
The application is deployed on [Vercel](https://siwe-demo-ten.vercel.app/)

## Design Choices
- **Next.js**: Used for its ease of setup and full-stack capabilities.
- **RainbowKit**: Chosen for its seamless SIWE integration.
- **Prisma**: Provides a type-safe database client.
- **PostgreSQL**: A reliable and powerful relational database.
- **Docker**: Ensures a consistent deployment environment.
