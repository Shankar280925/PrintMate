# Campus Xerox Pre-Order & Pickup System

## 1. Project Title
Campus Xerox Pre-Order & Pickup System

## 2. Problem Statement
The college Xerox shop becomes very crowded during short breaks and lunch breaks.
Students have very little time to wait in a queue.

## 3. Project Objective
Reduce waiting time and crowding at the college Xerox shop by allowing students
to submit print requests in advance.

## 4. Features
- Student places an order: name, register number, document upload, pages, copies, print type, side
- Backend validates input and calculates the price (the frontend does not decide the price)
- Unique order IDs (XR1001, XR1002, ...)
- Order confirmation page
- Track order by Order ID with a progress indicator
- Shop dashboard to view all orders and update status
- File validation: PDF, JPG, JPEG, PNG only, maximum 5 MB
- Error handling with clear messages and correct HTTP status codes (400, 404, 500)

## 5. Technology Stack
- Frontend: React (Vite), JavaScript, CSS, React Router
- Backend: Node.js, Express.js, Multer, CORS, dotenv
- Database: MongoDB with Mongoose

## 6. Folder Structure
```
campus-xerox-system/
├── backend/
│   ├── controllers/orderController.js
│   ├── middleware/upload.js, errorHandler.js
│   ├── models/Order.js, Counter.js
│   ├── routes/orderRoutes.js
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/components, pages, services
│   ├── src/App.jsx, main.jsx, index.css
│   └── package.json
├── README.md
└── .gitignore
```

## 7. MongoDB Setup
Option A - Local MongoDB:
1. Install MongoDB Community Edition and start the MongoDB service.
2. Use: `MONGODB_URI=mongodb://127.0.0.1:27017/campus-xerox`

Option B - MongoDB Atlas (free cloud):
1. Create a free cluster at https://www.mongodb.com/atlas
2. Create a database user (username + password).
3. Network Access: add your current IP address.
4. Click Connect > Drivers and copy the connection string.
5. Put your password in it and add the database name, for example:
   `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/campus-xerox?retryWrites=true&w=majority`

## 8. Backend Setup
```
cd backend
npm install
```
Edit `backend/.env` (a template is in `.env.example`) and set your values.

## 9. Frontend Setup
```
cd frontend
npm install
```

## 10. Environment Variables
| Name | Meaning |
|---|---|
| PORT | Port for the backend (5000) |
| MONGODB_URI | MongoDB connection string |

## 11. How to Run
Terminal 1:
```
cd backend
npm run dev
```
Terminal 2:
```
cd frontend
npm run dev
```
Open http://localhost:5173

## 12. API Endpoints
| Method | URL | Description |
|---|---|---|
| POST | /api/orders | Create an order (multipart/form-data) |
| GET | /api/orders | Get all orders |
| GET | /api/orders/:orderId | Get one order |
| PUT | /api/orders/:orderId/status | Update status, body: {"status":"READY"} |

## 13. Database Schema (orders)
orderId, studentName, registerNumber, documentName, documentPath, pages, copies,
printType, printSide, amount, status, createdAt, updatedAt.
A small `counters` collection is used to generate unique order IDs.

## 14. Application Workflow
Student -> React form -> Express API -> MongoDB -> Shop Dashboard -> Status update -> Student pickup.
Status flow: PENDING -> PROCESSING -> READY -> COLLECTED (CANCELLED when needed).

Price = pages x copies x rate (Black & White Rs.1, Color Rs.5), calculated on the backend.

## 15. Future Improvements
- Real login for students and shop staff
- Online payment
- Notifications (SMS/email) when the order is READY
- Count PDF pages automatically
- Cloud file storage
- Auto-delete old files
