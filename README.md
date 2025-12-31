Pastebin-Lite is a lightweight, production-ready Pastebin clone built using Next.js App Router and MongoDB. The application allows users to create and share text snippets through short, unique URLs, with optional controls such as time-based expiration (TTL) and maximum view limits.

The project is designed with serverless architecture best practices, where server-rendered pages interact directly with the database for optimal performance, while RESTful API endpoints handle paste creation and retrieval. MongoDB is used to store paste data securely, with atomic operations ensuring accurate view counting and reliable expiration enforcement.

Pastebin-Lite is fully deployable on Vercel, includes a health-check endpoint for monitoring database connectivity, and supports automated testing to validate core functionality. The project focuses on clean architecture, scalability, and real-world production considerations, making it suitable for both learning and portfolio demonstration.


Project Architecture & Working

This project follows the Next.js App Router architecture, with a clear separation between UI pages, API routes, database utilities, and data models. This structure improves maintainability, scalability, and production readiness.

📄 src/app/page.js — Home Page (Create Paste)

Description:
This file implements the main user interface for creating a new paste.

Working:

Renders a form for users to enter paste content

Supports optional parameters such as time-to-live (TTL) and maximum views

Sends a POST request to /api/pastes to create a new paste

Displays the generated shareable paste URL after successful creation

Provides a copy-to-clipboard feature for convenience

Manages loading and error states on the client side

This page is implemented as a Client Component because it relies on React state and browser APIs.

📄 src/app/p/[id]/page.js — Paste View Page

Description:
This file handles rendering an individual paste using a short URL (/p/:id).

Working:

Extracts the paste ID from the URL parameters

Connects directly to MongoDB on the server

Fetches paste data securely without making internal HTTP calls

Validates:

Paste existence

Expiration time (TTL)

Maximum view count

Atomically increments the paste view count

Displays the paste content and current view count

Returns a 404 page if the paste is expired, over the view limit, or not found

This page is implemented as a Server Component for improved performance and security.

📄 src/app/api/pastes/route.js — Create Paste API

Description:
This API route is responsible for creating new pastes.

Working:

Accepts POST requests containing paste content

Validates request input

Generates a short unique ID using nanoid

Calculates expiration time when TTL is provided

Stores the paste data in MongoDB

Returns the paste ID along with a shareable URL

This endpoint is used by the frontend and external tools such as Postman.

📄 src/app/api/pastes/[id]/route.js — Get Paste API

Description:
This API route retrieves an existing paste programmatically.

Working:

Accepts a paste ID as a route parameter

Checks whether the paste exists

Validates TTL and maximum view constraints

Atomically increments the view count

Returns paste content and metadata

Responds with 404 if the paste is expired or invalid

This route is useful for programmatic access and automated testing.

📄 src/app/api/healthz/route.js — Health Check API

Description:
Provides a health check endpoint to verify database connectivity.

Working:

Attempts to establish a MongoDB connection

Checks the Mongoose connection state

Returns:

{ ok: true } when the database is connected

{ ok: false } with HTTP 503 when the database is unavailable

This endpoint is intended for monitoring, CI pipelines, and deployment validation.

📄 src/app/lib/db.js — Database Connection Utility

Description:
Handles MongoDB connection management.

Working:

Reads the MongoDB connection string from environment variables

Uses connection caching to avoid reconnecting on every request

Designed for serverless environments such as Vercel

Ensures stable and efficient database access

📄 src/app/models/Paste.js — Paste Data Model

Description:
Defines the MongoDB schema for storing pastes.

Schema Fields:

_id — Short unique paste identifier

content — Paste text content

createdAt — Creation timestamp

expiresAt — Optional expiration timestamp

maxViews — Optional maximum view limit

currentViews — Current number of views

This schema ensures consistent and reliable data storage across the application.

🔄 Overall Application Flow

The user creates a paste on the home page

The paste is stored in MongoDB via the API

A short URL (/p/:id) is generated

Visiting the URL renders the paste page

The view count is incremented atomically

Expired or over-limit pastes return a 404 response

✅ Key Architectural Highlights

Server-side rendering for paste pages

Atomic MongoDB updates for view tracking

Clear separation of concerns

Serverless-ready database handling

Production-safe health monitoring