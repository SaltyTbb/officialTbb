# Personal Website

A modern personal website built with React and Spring Boot, featuring a chatbot, blog system, and admin panel.

## Features

- Modern, minimalist design with light blue and white color scheme
- Interactive chatbot on the main page
- About me page with personal information
- Blog system with image support
- Secure admin panel for managing blog posts
- Responsive design for all devices

## Tech Stack

### Frontend
- React 18
- Material-UI
- React Router
- Styled Components
- Axios for API calls

### Backend
- Spring Boot 3
- Spring Security
- Spring Data JPA
- H2 Database
- JWT Authentication
- Maven

## Prerequisites

- Node.js 16+ and npm
- Java 17+
- Maven 3.6+

## Setup Instructions

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Build the project:
   ```bash
   mvn clean install
   ```

3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

The backend API will be available at `http://localhost:8080`

## Default Admin Credentials

- Username: admin
- Password: password

**Note:** Make sure to change these credentials in production!

## API Documentation

The backend provides the following main endpoints:

- `POST /api/auth/login` - Authentication endpoint
- `GET /api/posts` - Get all blog posts
- `POST /api/posts` - Create a new blog post (requires authentication)
- `PUT /api/posts/{id}` - Update a blog post (requires authentication)
- `DELETE /api/posts/{id}` - Delete a blog post (requires authentication)

## Development

- The frontend is configured with hot-reloading for development
- The backend uses H2 database in file mode for persistence
- CORS is configured to allow frontend-backend communication
- JWT is used for secure authentication

## Production Deployment

Before deploying to production:

1. Update the JWT secret key in `application.properties`
2. Configure a proper database (e.g., PostgreSQL)
3. Set up proper security measures
4. Update CORS settings for your domain
5. Build the frontend for production: `npm run build`

## License

MIT License 