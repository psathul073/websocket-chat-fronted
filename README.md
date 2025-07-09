# 💬 Real-Time Chat App

A secure, modern real-time web chat application built with:

* 🔒 Google Authentication (Firebase Auth)
* 🗨️ Public & Private Chat Rooms with bcrypt password protection
* 🔁 Real-Time Messaging (WebSocket)
* 📷 Image & GIF Sharing (Cloudinary)
* 🎙️ Voice Message Recording & Upload
* ↩️ Reply Threads & Message Delete
* 🚀 Responsive UI with React

---

## 🚀 Features

* **Google Sign-In:** Secure OAuth login with Firebase Auth.
* **Create, Join & Delete Rooms:** Public or password-protected using bcrypt.
* **Live Messaging:** Powered by native WebSocket server for instant updates.
* **File Uploads:** Images, GIFs, and voice messages stored securely on Cloudinary.
* **Reply & Delete:** Reply to specific messages or delete your own messages.
* **Room Ownership:** Only the creator can delete a room.
* **Real-Time Room List:** New rooms show up instantly for all connected clients.
* **Responsive UI:** Works great on both desktop and mobile devices.

---

## 🔒 Secure Room Passwords (bcrypt)

Private rooms are protected using **bcrypt** hashing:

* When a user **creates** a private room, the server **hashes** the password with bcrypt.
* Plain-text passwords are **never stored**.
* When another user **joins**, the entered password is verified with `bcrypt.compare`.
* This ensures strong privacy and follows real-world secure practices.

---

## ⚙️ Tech Stack

| Layer             | Tech                               |
| ----------------- | ---------------------------------- |
| Frontend          | React, Saas, firebase             |
| Backend           | Node.js, Express, WebSocket (`ws`) |
| Auth              | Firebase Authentication            |
| File Uploads      | Multer                             |
| Media Storage     | Cloudinary                         |
| Password Security | bcrypt                             |
| Public API`s | giphy.com                             |
---

## 📂 Project Structure

```
root/
 ├── client/        # React frontend
 ├── server/        # Node.js backend + WebSocket + REST

```

---

## 📦 Installation

```bash
# 1️⃣ Clone the repositories
--Frontend--
gh repo clone psathul073/websocket-chat-fronted

--Backend--
gh repo clone psathul073/websocket-chat-backend

# 2️⃣ Install frontend dependencies
cd client
npm install

# 3️⃣ Install backend dependencies
cd server
npm install

# 4️⃣ Configure environment variables in server/.env:
#   CLOUDINARY_CLOUD_NAME=
#   CLOUDINARY_API_KEY=
#   CLOUDINARY_API_SECRET=
#   FIREBASE_API_KEY=
#   FIREBASE_AUTH_DOMAIN=
#   ...

# 5️⃣ Start backend server
npm start

# 6️⃣ Start frontend dev server
cd client
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file in the `server/` directory with:

```env
# Firebase
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
...

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## ⚡ How It Works

1️⃣ Users log in securely with Google.
2️⃣ Users create or join chat rooms — public or password-protected.
3️⃣ The app uses **WebSocket** for real-time communication.
4️⃣ Users can send text, images, GIFs, and voice recordings.
5️⃣ Media files are uploaded to **Cloudinary** and deleted automatically if a room or message is deleted.
6️⃣ Users can **reply** to messages and **delete** their own messages.
7️⃣ Only the room creator can delete the room.

---

## 🧹 Cloudinary Media Cleanup

When:

* A **room** is deleted
* Or a **user account** is deleted

👉 The server deletes all related Cloudinary media (images, GIFs, voice messages) using each file’s `public_id` to keep storage clean.

---

## 🗂️ Message Features

* **Reply Threads:** Users can reply to specific messages. Replies display the original message text inline.
* **Message Delete:** Users can delete their own messages — media files are removed from Cloudinary too.
* **Image view:** The user can see a full view of an image by clicking on it.

---



## 🚀 Next Improvements

✅ Emoji reactions.
✅ Push notifications.
✅ User avatars.
✅ Typing indicators.
✅ Admin features for moderation.
✅ Full message history with Firestore or PostgreSQL.
