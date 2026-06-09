# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SwiftTalk is a real-time chat application built as a monorepo with:
- **Frontend**: React 19 + Vite with Tailwind CSS
- **Backend**: Express.js + Node.js with MongoDB
- **Real-time**: Socket.IO for instant messaging
- **Deployment**: Vercel (separate builds for client and server)

## Architecture

### Frontend (`client/`)
- **Context API**: Two main contexts manage application state
  - `AuthContext`: User authentication, socket connection, and online users
  - `ChatContext`: Messages, users, selected user, and unseen messages count
- **Pages**: HomePage (main chat UI), LoginPage (auth), ProfilePage (user settings)
- **Components**: Sidebar (user list), ChatContainer (message thread), RightSidebar (user info)
- **Styling**: Tailwind CSS with TailwindCSS v4 Vite plugin
- **HTTP Client**: Axios with dynamic backend URL from `VITE_BACKEND_URL` env var

### Backend (`server/`)
- **Database**: MongoDB with Mongoose for User and Message models
- **Authentication**: JWT tokens stored in `Authorization` header (passed as `token`)
- **Real-time**: Socket.IO manages online user tracking and message broadcasting
- **Route Structure**:
  - `/api/auth`: Signup, login, profile updates, auth check
  - `/api/messages`: Fetch users, get messages, send messages, mark as seen
- **Middleware**: `protectRoute` middleware validates JWT tokens on protected routes
- **Images**: Cloudinary integration for profile pics and message attachments

## Development Workflow

### Client Development
```bash
cd client
npm install
npm run dev        # Start Vite dev server (default: localhost:5173)
npm run build      # Production build
npm run lint       # ESLint checks
npm run preview    # Preview production build
```

### Server Development
```bash
cd server
npm install
npm run server     # Start with nodemon (watches for changes, default: localhost:5000)
npm start          # Start production server
```

### Environment Setup
- **Client**: Create `client/.env` with `VITE_BACKEND_URL`
- **Server**: Create `server/.env` with:
  - `MONGODB_URI`: MongoDB connection string
  - `JWT_SECRET`: Secret for JWT signing
  - `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Image upload
  - `PORT`: Server port (default: 5000)
  - `NODE_ENV`: Set to "production" for Vercel

## Key Data Models

### User
- email, fullName, password (hashed), profilePic, bio
- Timestamps created/updated automatically

### Message
- senderId, receiverId (references to User)
- text or image (at least one required)
- seen flag (default: false)
- Timestamps

## Socket.IO Events

### Server → Client
- `getOnlineUsers`: Array of online user IDs (emitted on connect/disconnect)

### Client → Server
- `disconnect`: Built-in event when user disconnects

### Real-time Messaging Flow
1. Frontend calls `axios.post("/api/messages/send/:id")`
2. Backend broadcasts via Socket.IO to all connected clients
3. Frontend listener in ChatContext catches `newMessage` event
4. If message is from selected user, mark as seen; otherwise increment unseen count

## CORS Configuration

Server allows localhost ports 5173, 5174, 3000 in development. Update `server.js` line 41-46 for new dev ports.

## Common Development Tasks

### Adding a New Route
1. Create controller function in `server/controllers/`
2. Add route in `server/routes/`
3. Import and mount in `server.js`
4. Use `protectRoute` middleware for auth-required endpoints

### Adding a New Page
1. Create component in `client/src/pages/`
2. Add Route in `client/src/App.jsx`
3. Wrap with auth check (authUser context)

### Real-time Feature
Always use Socket.IO listeners in `ChatContext.subscribeToMessages()` and clean up with `socket.off()` in `unsubscribeFromMessages()`.

## Testing Backend

Use the test endpoints:
- `GET /api/status`: Returns "Server is live"
- `GET /api/test`: Returns `{success: true, message: "Backend is working!"}`


## Deployment

Both client and server have `vercel.json` configs:
- **Client**: Standard Vite build output
- **Server**: Node.js runtime with `server.js` as entry point
