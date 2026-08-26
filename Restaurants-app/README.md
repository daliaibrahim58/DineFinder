# 🍽️ DineFinder

DineFinder is a full-stack restaurant discovery platform built with **Next.js**, **Node.js/Express**, **MongoDB**, **Redux Toolkit**, **Gemini**, and **MongoDB Vector Search**.

The project combines traditional restaurant filtering with **semantic search**, **RAG (Retrieval-Augmented Generation)**, and an **AI restaurant chatbot with conversation history**.

## ✨ Features

### 👤 Authentication

- User registration
- Email OTP verification
- Login / logout
- JWT authentication
- Persistent authentication state
- Role-based access (`user` / `admin`)

### 🍴 Restaurant Discovery

- Browse restaurants
- Restaurant details page
- Cuisine and area filters
- Rating filters
- Price filters
- Sorting
- Nearby restaurant search using geolocation
- Similar restaurants section

### ❤️ Favorites

- User-specific favorites
- Add/remove favorites
- Favorites displayed in the Navbar
- Favorites persisted through the backend

### 🤖 AI Restaurant Search

Users can search naturally, for example:

> "I want a Japanese restaurant in Zamalek with a rating above 4 and a quiet atmosphere."

The system can extract:

- cuisine
- area
- minimum/maximum price
- minimum rating
- sorting preference

### 🔎 Semantic Search + RAG

```text
User Query
    ↓
Gemini Query Understanding / Filters
    ↓
Query Embedding
    ↓
MongoDB Vector Search
    ↓
Structured Filters + Semantic Similarity
    ↓
Relevant Restaurants
    ↓
Restaurant Context
    ↓
Gemini
    ↓
Final AI Recommendation
```

### 💬 AI Chatbot

- Multi-turn restaurant conversations
- Conversation history
- Context-aware follow-up questions
- Saved conversations for authenticated users
- Open previous conversations
- Delete conversations

### 🛠️ Admin Dashboard

Admins can:

- Add restaurants
- Edit restaurants
- Delete restaurants
- View restaurant statistics
- Access the dashboard through role-based authorization

## 🧱 Project Architecture

```text
DineFinder
│
├── Frontend
│   ├── Next.js App Router
│   ├── React
│   ├── TypeScript
│   ├── Material UI
│   ├── Redux Toolkit
│   └── RTK Query
│
├── Backend
│   ├── Node.js
│   ├── Express
│   ├── MongoDB
│   ├── Mongoose
│   └── JWT Authentication
│
└── AI / RAG
    ├── Gemini
    ├── Gemini Embeddings
    ├── MongoDB Vector Search
    └── Conversation History
```

## 🧠 RAG Architecture

### 1. Retrieval

MongoDB Vector Search retrieves restaurants semantically related to the user's request.

Structured filters such as cuisine, area, price, and rating can also be applied during retrieval.

### 2. Augmentation

The retrieved restaurants are converted into context containing:

- Restaurant name
- Cuisine
- Area
- Address
- Price
- Rating
- Rating count
- Opening hours

### 3. Generation

Gemini receives the user query and retrieved restaurant context and generates a natural-language recommendation without inventing restaurant information.

## 🔢 Embeddings

The project uses Gemini embeddings with **768 dimensions** and MongoDB Vector Search configured with **cosine similarity**.

Restaurant documents use a retrieval-document embedding task, while user queries use a retrieval-query task.

## 🗄️ MongoDB Vector Search

The Vector Search index contains:

```text
embedding
cuisine
area
price
rating
```

This allows:

```text
Semantic Similarity
+
Structured MongoDB Filters
```

Example:

```text
"Japanese restaurants in Zamalek rated above 4"
```

becomes:

```text
cuisine = Japanese
area = Zamalek
rating >= 4
```

while semantic embeddings handle concepts such as:

```text
quiet
romantic
good for a date
```

## 🔐 Authentication Flow

```text
Register
   ↓
OTP Sent
   ↓
OTP Verification
   ↓
Verified User
   ↓
Login
   ↓
JWT Token
   ↓
Redux + Local Storage
```

Roles:

```text
user
admin
```

Frontend role checks control navigation and UI visibility, while backend authorization protects admin operations.

## 🌐 API Overview

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/verify-otp
POST /api/auth/resend-otp
```

### Restaurants

```http
GET    /api/restaurants
GET    /api/restaurants/:id
GET    /api/restaurants/nearby
POST   /api/restaurants
PUT    /api/restaurants/:id
DELETE /api/restaurants/:id
```

### AI / RAG

```http
POST   /api/ai/rag
POST   /api/ai/chat
GET    /api/ai/chat
GET    /api/ai/chat/:conversationId
DELETE /api/ai/chat/:conversationId
```

`/api/ai/rag` is public, while conversation endpoints require authentication.

## 🖥️ Frontend Pages

```text
/
├── Home
├── Restaurants
├── Restaurant Details
├── Login
├── Signup
└── Admin Dashboard
```

The home page includes:

- Hero section
- Restaurant section
- AI restaurant search
- AI recommendations
- Restaurant result dropdown
- AI chatbot

## ⚙️ Tech Stack

### Frontend

- Next.js 16
- React
- TypeScript
- Material UI
- Redux Toolkit
- RTK Query
- Swiper

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs

### AI

- Google Gemini
- Gemini Embeddings
- MongoDB Atlas Vector Search

## 🚀 Getting Started

### 1. Clone

```bash
git clone <your-repository-url>
cd restaurants-app
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
npm install
```

### 4. Environment Variables

Frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Backend:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Add the email/OTP environment variables required by your email utility.

### 5. Start Backend

```bash
npm run dev
```

### 6. Start Frontend

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## 👑 Admin Setup

Public registration should not allow arbitrary users to submit:

```json
{
  "role": "admin"
}
```

Admins should be created or promoted through a secure database/setup process.

After login, admins can access:

```text
/admin
```

The Navbar displays the Admin link only for users with:

```text
role = admin
```

## 💬 Chatbot Conversation Flow

```text
User Message
    ↓
Load Conversation
    ↓
Retrieve Recent History
    ↓
Build Contextual Retrieval Query
    ↓
Gemini Filter Parsing
    ↓
Vector Search
    ↓
Restaurant Context
    ↓
Gemini Answer
    ↓
Save User Message
    ↓
Save Assistant Message
```

Example:

```text
User: I want Italian restaurants in Zamalek.
Assistant: ...

User: Which one is the highest rated?
Assistant: ...
```

## 🛡️ Error Handling

The project handles:

- Invalid credentials
- Duplicate emails
- Expired OTPs
- Invalid OTPs
- Unauthorized requests
- Missing conversations
- Empty search queries
- Unavailable geolocation
- AI temporary failures
- Gemini quota/rate-limit responses

Gemini free-tier quota limits can affect AI-heavy features during development. This is an external API quota limitation.

## 📌 Example AI Queries

```text
I want a Japanese restaurant in Zamalek.
```

```text
Show me restaurants rated above 4.
```

```text
I want a quiet romantic place.
```

```text
Find restaurants near me.
```

```text
I want something cheap in Maadi.
```

## 📸 Screenshots

Add screenshots before publishing:

```text
screenshots/
├── home.png
├── restaurant-details.png
├── rag-search.png
├── chatbot.png
├── conversations.png
└── admin-dashboard.png
```

Example:

```md
![Home](screenshots/home.png)
![AI Search](screenshots/rag-search.png)
![Chatbot](screenshots/chatbot.png)
![Admin Dashboard](screenshots/admin-dashboard.png)
```

## 👩‍💻 Author

**Dalia Ibrahim**

- GitHub: https://github.com/daliaibrahim58
- LinkedIn: https://www.linkedin.com/in/dalia-ibrahim-5883782b0

## 📄 License

This project is for educational and portfolio purposes.
