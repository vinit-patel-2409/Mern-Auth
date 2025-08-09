# MERN Authentication Boilerplate

A full-stack authentication boilerplate built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring user registration, login, password reset, and protected routes.

## Features

- User registration and login with JWT authentication
- Password reset functionality with email verification
- Protected routes and role-based access control
- Responsive design with Tailwind CSS
- Client-side form validation
- Secure password hashing with bcrypt

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account or local MongoDB instance
- Vercel account (for deployment)

## Project Structure

```
mern-auth/
├── client/          # Frontend React application
├── server/          # Backend Express application
├── .gitignore       # Git ignore file
└── README.md        # Project documentation
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/mern-auth.git
cd mern-auth
```

### 2. Set up the Backend (Server)

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory and add your environment variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   JWT_COOKIE_EXPIRE=30
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_EMAIL=your_email@gmail.com
   SMTP_PASSWORD=your_email_password
   CLIENT_URL=http://localhost:3000
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### 3. Set up the Frontend (Client)

1. Navigate to the client directory:
   ```bash
   cd ../client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the client directory and add your environment variables:
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment Guide

### Frontend Deployment on Vercel

1. Push your frontend code to GitHub (make sure to include the `vercel.json` file in the client directory)

2. Go to [Vercel](https://vercel.com/) and sign in with your GitHub account

3. Click on "New Project" and import your repository

4. Configure the project settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `client` (if your frontend is in a client folder)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add environment variables:
   ```
   VITE_API_URL=your_render_backend_url
   ```
   (e.g., `https://your-backend.onrender.com`)

6. Click "Deploy"

7. After deployment, make sure to set up the correct CORS settings in your Render backend by updating the `CLIENT_URL` environment variable to match your Vercel frontend URL (e.g., `https://your-frontend.vercel.app`)

### Backend Deployment on Render

1. Push your backend code to a GitHub repository (can be the same or different from the frontend)

2. Go to [Render](https://render.com/) and sign up/sign in

3. Click on "New" and select "Web Service"

4. Connect your GitHub repository containing the backend code

5. Configure the web service:
   - **Name**: your-backend-name
   - **Region**: Choose the one closest to your users
   - **Branch**: main (or your preferred branch)
   - **Runtime**: Node
   - **Build Command**: `npm run render-build`
   - **Start Command**: `npm start`
   - **Root Directory**: (leave empty if your server files are in the root, otherwise specify the directory containing server.js)
   - **Environment**: Node (select the version specified in your package.json, e.g., 14.x or higher)

6. Add environment variables:
   ```
   PORT=10000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   JWT_COOKIE_EXPIRE=30
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_EMAIL=your_email@gmail.com
   SMTP_PASSWORD=your_email_app_password
   CLIENT_URL=your_vercel_frontend_url
   NODE_ENV=production
   ```

7. Click "Create Web Service"

8. After deployment, update your frontend's `VITE_API_URL` in Vercel with your Render backend URL (e.g., `https://your-backend.onrender.com`)

### Setting up Custom Domain (Optional)

1. **Vercel (Frontend)**:
   - In your Vercel project, go to Settings > Domains
   - Add your custom domain and follow the DNS verification steps

2. **Render (Backend)**:
   - In your Render dashboard, go to your web service
   - Click on "Settings" tab
   - Under "Custom Domains", add your subdomain (e.g., `api.yourdomain.com`)
   - Update your DNS settings to point the subdomain to Render's provided DNS target

### Environment Variables Reference

Make sure to update all environment variables with your production values before deploying.

## Environment Variables

### Server
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT
- `JWT_EXPIRE` - JWT expiration time (e.g., '30d')
- `JWT_COOKIE_EXPIRE` - JWT cookie expiration in days
- `SMTP_HOST` - SMTP server host
- `SMTP_PORT` - SMTP server port
- `SMTP_EMAIL` - Email address for sending emails
- `SMTP_PASSWORD` - Email password or app password
- `CLIENT_URL` - Frontend URL for CORS and password reset links

### Client
- `VITE_API_URL` - Backend API URL

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with MERN stack
- Authentication flow inspired by modern web security practices
