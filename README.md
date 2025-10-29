````md
# 🧠 Collaborative Document Annotation System (Backend)

This project is the backend of a **Collaborative Document Annotation System** built using the **MERN stack**.  
It allows users to upload text or PDF documents, annotate them collaboratively in real-time, and view annotations instantly synced across clients.

---

## 🚀 Tech Stack
**Backend:** Node.js, Express, TypeScript  
**Database:** MongoDB (Mongoose ORM)  
**File Storage:** MongoDB GridFS (for PDFs)  
**Real-Time:** Socket.IO  
**Validation:** Zod  
**Deployment:** Render  
**Environment Management:** dotenv  

---

## ⚙️ Core Features

### 1. 📄 Document Upload & Storage
- Supports **Text** and **PDF** document uploads.
- PDF files are stored in **MongoDB GridFS** for scalability and streaming access.
- Extracted or raw text content (`linearText`) is stored for fast annotation indexing.

### 2. 📝 Annotation System
- Each annotation is linked to:
  - The **document ID**
  - A **user ID** (or anonymous guest)
  - **Start/End text offsets**
  - The **exact quoted text**
  - A **timestamp**
- Duplicate annotations for the same range by the same user are prevented using MongoDB unique indexes.

### 3. ⚡ Real-Time Collaboration
- Implemented via **Socket.IO** rooms (one room per document).
- When one user adds or deletes an annotation, all other clients connected to the same document receive updates instantly (`annotation:new`, `annotation:deleted`).

### 4. 🔍 Optimized MongoDB Schema Design
#### Document Schema
- Stores the `linearText` for efficient substring slicing and annotation range validation.
- Indexed by `createdAt` for quick retrieval.

#### Annotation Schema
- Indexed on `(documentId, userId, start, end)` to enforce uniqueness and avoid duplicates.
- Range indexes (`start`, `end`) support fast overlap checks.
- `quoteHash` helps deduplicate similar text fragments.

---

## 🧠 Design Choices & Rationale

| Design Aspect | Choice | Reason |
|----------------|---------|--------|
| **File Storage** | GridFS | Scales to large PDF sizes (>16MB), streams efficiently, and integrates with MongoDB Atlas |
| **Annotation Positioning** | Character offset (`start`, `end`) | Simple, fast, and consistent across users and devices |
| **Real-Time Sync** | Socket.IO + document-based rooms | Low-latency bi-directional communication for collaborative editing |
| **Validation** | Zod schemas | Prevent invalid ranges, missing fields, or malformed annotations early |
| **Data Access** | Mongoose models with indexes | Fast CRUD and prevents duplicate annotation entries |

---

## ⚡ Performance Optimizations
- **Indexes**: Indexed annotation fields (`documentId`, `userId`, `start`, `end`) for fast lookup and uniqueness enforcement.
- **Streaming Uploads**: Files are streamed directly to GridFS (no memory overload).
- **Chunked Annotation Fetching**: Supports pagination via `cursor` and `limit` for documents with 1000+ annotations.
- **Minimal Payloads**: Socket.IO events emit only the updated annotation object, not the entire dataset.

---

## 🧩 Edge Case Handling
| Edge Case | Handling |
|------------|-----------|
| Invalid annotation range | Validated against document text length before saving |
| Duplicate annotation (same range, same user) | Prevented with unique MongoDB compound index |
| Large file uploads | Streamed to GridFS with memory-safe Multer setup |
| Concurrent annotations | Indexed and atomic `create` operations avoid conflicts |
| Missing document | Returns `404 Document not found` |
| No file in request | Returns `400 No file uploaded` |

---

## 📡 API Overview

| Method | Endpoint | Description |
|---------|-----------|-------------|
| `POST` | `/api/documents/text` | Upload a text document |
| `POST` | `/api/documents/pdf` | Upload a PDF document (form-data with `file`) |
| `GET` | `/api/documents` | List all documents |
| `GET` | `/api/annotations?documentId=<id>` | Fetch annotations for a document |
| `POST` | `/api/annotations` | Create a new annotation |
| `DELETE` | `/api/annotations/:id` | Delete an annotation |

---

## 🧰 Environment Variables

| Variable | Description |
|-----------|--------------|
| `PORT` | Server port (default: 4000) |
| `MONGO_URI` | MongoDB connection string (with database name) |

Example `.env`:
```env
PORT=4000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/annotator
````

---

## 🚀 Deployment (Render)

**Build Command:**

```bash
npm install && npm run build
```

**Start Command:**

```bash
npm start
```

---

## 🧑‍💻 Author

**Pal Bijewar**
Full-Stack Developer | Node.js, React, AWS, MongoDB
📍 [GitHub](https://github.com/palbijewar)

---

```
