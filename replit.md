# Yndu Fountain Farms Project Guide

## Overview

This project is a web application for Yndu Fountain Farms, a sustainable crop and seed growing company in Kenya. The application serves as their marketing website with features for displaying information about their farming practices, showcasing produce, and collecting newsletter subscriptions.

The project uses a modern web stack with React for the frontend and Express for the backend. It's set up with Drizzle ORM for database operations, although the actual database integration is minimal in the current state.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with clear separation between client and server code:

### Frontend

- **React**: The primary UI library
- **Tailwind CSS**: For styling components
- **Wouter**: A minimal router for React applications
- **shadcn/ui**: A collection of reusable UI components
- **React Hook Form**: For form handling and validation
- **Zod**: For schema validation
- **Framer Motion**: For animations
- **React Query**: For data fetching and state management

### Backend

- **Express.js**: The web server framework
- **Drizzle ORM**: For database schema definition and operations
- **TypeScript**: Used throughout the codebase for type safety

### Data Storage

- **Postgres**: The project is configured for PostgreSQL through Drizzle ORM
- A memory-based storage implementation is currently used as a fallback/development option

## Key Components

### Frontend Components

1. **Page Components**: 
   - `Home`: Main landing page
   - `NotFound`: 404 error page

2. **UI Components**:
   - Multiple Radix UI based components (shadcn/ui)
   - Custom components for specific sections (Hero, Footer, Gallery, etc.)

3. **Utility Components**:
   - `Lightbox`: For image gallery viewing
   - `Subscribe`: For newsletter subscription form

### Backend Components

1. **Server**:
   - Express application with API routes
   - Static file serving
   - Error handling middleware

2. **Storage**:
   - Drizzle ORM schema definitions
   - In-memory storage implementation for development

3. **API Routes**:
   - `/api/subscribe`: Endpoint for newsletter subscriptions

## Data Flow

1. **Client-Side Rendering**:
   - React components render the UI
   - Data is fetched via React Query
   - Forms handled with React Hook Form + Zod validation

2. **API Requests**:
   - Client makes requests to the Express backend
   - Server processes the request and returns JSON responses
   - Logging middleware records all API interactions

3. **Database Operations**:
   - Drizzle ORM provides a type-safe interface to the database
   - Currently defined schema for users, but minimal actual database usage

## External Dependencies

### Frontend Dependencies
- React and React DOM
- TanStack Query (React Query)
- Framer Motion
- Radix UI Components
- Tailwind CSS
- Zod
- React Hook Form

### Backend Dependencies
- Express
- Drizzle ORM
- TypeScript

## Deployment Strategy

The application is configured for deployment on Replit with:

1. **Build Process**:
   - Frontend: Vite bundles React code
   - Backend: esbuild bundles server code

2. **Environment Configuration**:
   - Development mode: `npm run dev` for local development
   - Production mode: `npm run build` and `npm run start`

3. **Database**:
   - Currently set up for PostgreSQL
   - Uses `DATABASE_URL` environment variable for connection

4. **Port Configuration**:
   - Local port 5000
   - Exposed on port 80 in deployment

## Getting Started

1. Ensure Postgres is properly configured in the Replit environment
2. Set the `DATABASE_URL` environment variable
3. Run `npm run dev` to start the development server
4. For database schema changes, run `npm run db:push` to update the database

## Next Steps

1. Complete the database integration using Drizzle ORM
2. Expand the API endpoints for additional functionality
3. Implement proper authentication if needed
4. Enhance frontend components with actual data from the backend