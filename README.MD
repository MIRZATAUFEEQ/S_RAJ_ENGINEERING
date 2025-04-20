# S_RAJ_ENGINEERING Backend

This is the backend for the **S_RAJ_ENGINEERING** project, built using Node.js, Express, and MongoDB. It provides APIs for user authentication, employee management, feedback handling, and more.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [License](#license)

---

## Features

- User authentication (register, login, logout, profile management)
- Employee management (add, delete employees)
- Feedback handling (add, view, delete feedback)
- Secure password handling with bcrypt
- JWT-based authentication
- File uploads using Cloudinary
- Centralized error handling
- Logging with Winston

---

## Technologies Used

- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **MongoDB**: Database
- **Mongoose**: MongoDB ORM
- **Cloudinary**: File uploads
- **Winston**: Logging
- **JWT**: Authentication
- **Nodemailer**: Email handling

---

## Project Structure
BACKEND/ ├── app.js ├── server.js ├── config/ │ ├── cloudinary.js │ └── db.js ├── controllers/ │ ├── employee.controller.js │ ├── feedback.controller.js │ └── user.controller.js ├── middlewares/ │ ├── auth.middleware.js │ ├── errorHandler.middleware.js │ └── requestLogger.js ├── models/ │ ├── employee.model.js │ ├── feedback.model.js │ └── user.model.js ├── routes/ │ ├── employee.route.js │ ├── feedback.route.js │ └── user.route.js ├── utils/ │ ├── ApiError.js │ ├── asyncHandler.js │ ├── forgotPasswordEmail.js │ ├── generateToken.js │ └── logger.js ├── .env ├── .gitignore ├── package.json └── README.md

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/s_raj_engineering.git
   cd BACKEND
   npm install
   npm start
   ```

---

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```ini
PORT=5000
MONGO_URI=your_mongo_connection_string
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret
JWT_EXPIRES=7d
COOKIE_EXPIRES=7
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SERVICE=your_email_service
SMTP_EMAIL=your_email@example.com
SMTP_PASSWORD=your_email_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
DASHBOARD_URL=http://localhost:3000
```

---

## Error Handling

The application uses a centralized error handling mechanism. Errors are returned in the following format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

---
`````markdown