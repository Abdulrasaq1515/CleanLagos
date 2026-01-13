# CleanLagos Backend

A Node.js backend for the CleanLagos waste management platform.

## Features

- User authentication with phone verification
- Waste report creation and management
- Task assignment system
- Real-time updates via WebSocket
- Role-based access control (Citizen, PSP Worker, LAWMA Admin)
- File uploads for evidence and proof
- Points and rewards system
- Offline sync support (queue-based)

## Tech Stack

- Node.js & Express
- MongoDB with Mongoose
- Socket.io for real-time communication
- JWT for authentication
- Redis for caching (optional)
- Winston for logging

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cleanlagos-backend.git
cd cleanlagos-backend