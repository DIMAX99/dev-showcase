# DevPost Blog Platform

A full-stack blog platform with authentication, built with Next.js and Node.js.

## 🚀 Project Structure

```
devpost/
├── frontend/          # Next.js React application
│   ├── app/
│   │   ├── components/    # Reusable components
│   │   ├── login/         # Login page
│   │   ├── register/      # Registration page
│   │   └── page.tsx       # Home page
├── backend/           # Node.js Express API
│   ├── config/           # Database configuration
│   ├── controllers/      # Route handlers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── server.js         # Main server file
```

## 🛠️ Setup Instructions

### Backend Setup

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   
   Note: You'll need to install additional packages:
   ```bash
   npm install bcryptjs jsonwebtoken
   ```

3. **Environment Setup:**
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your configuration
   ```bash
   cp .env.example .env
   ```

4. **Start MongoDB:**
   - Make sure MongoDB is running on your system
   - Default connection: `mongodb://localhost:27017/devpost-blog`

5. **Start the backend server:**
   ```bash
   npm run dev
   # or
   node server.js
   ```
   Server will run on: http://localhost:5000

### Frontend Setup

1. **Navigate to frontend folder:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Frontend will run on: http://localhost:3000

## 📱 Pages Created

### 🏠 Home Page (`/`)
- Simple "Hello World" landing page
- Navigation to login/register
- Clean design with quick action buttons

### 🔐 Login Page (`/login`)
- Dark theme with tech background
- Email/password authentication form
- Responsive design with glass morphism effect
- Background: Dark tech servers/data center image

### 📝 Register Page (`/register`)
- Dark theme with tech background  
- Full registration form (name, email, password, confirm password)
- Form validation and error handling
- Background: Digital/coding related tech image

## 🔧 Current Features

### ✅ Completed
- **Frontend:** Login/Register pages with dark themes
- **Frontend:** Navigation component
- **Frontend:** Responsive design with Tailwind CSS
- **Backend:** User authentication API endpoints
- **Backend:** Blog CRUD API endpoints
- **Backend:** MongoDB integration with Mongoose
- **Backend:** JWT token authentication
- **Backend:** Password hashing with bcrypt

### 🚧 To Do (Connect the pieces)
- **API Integration:** Connect frontend forms to backend APIs
- **Authentication State:** Implement user session management
- **Blog Features:** Create blog listing and creation pages
- **Middleware:** Add JWT verification middleware
- **Error Handling:** Enhance error handling and validation

## 🎨 Customization Guide

### Change Background Images
**Login Page:** Edit `/frontend/app/login/page.tsx`
```javascript
backgroundImage: `url('YOUR_NEW_IMAGE_URL')`
```

**Register Page:** Edit `/frontend/app/register/page.tsx`
```javascript
backgroundImage: `url('YOUR_NEW_IMAGE_URL')`
```

### Add New API Endpoints
1. Create controller in `/backend/controllers/`
2. Create route in `/backend/routes/`
3. Import and use in `/backend/server.js`

### Add New Frontend Pages
1. Create folder in `/frontend/app/PAGENAME/`
2. Add `page.tsx` file in the folder
3. Update navigation in `/frontend/app/components/Navigation.tsx`

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Blogs
- `POST /api/blogs` - Create blog post
- `GET /api/blogs` - Get all blog posts

## 🤝 Contributing

1. Make sure both frontend and backend servers are running
2. Test your changes on both localhost:3000 (frontend) and localhost:5000 (backend)
3. Follow the existing code structure and commenting style
4. Update this README if you add new features

## 📞 Need Help?

- Check the detailed comments in each file for specific customization instructions
- Each component has clear documentation about what it does and how to modify it
- Environment variables are documented in `.env.example`
