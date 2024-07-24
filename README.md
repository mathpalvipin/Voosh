# Web Application

## Description

This web application is designed to manage tasks and features a responsive design, user authentication, and CRUD operations. The application is built with a modern tech stack and follows best practices for web development.

## Function Stack

### Frontend

- **React**: A JavaScript library for building user interfaces.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **React Query**: For data fetching and synchronization.
- **Dnd Kit**: For drag-and-drop functionality.
- **Axios**: For making HTTP requests.

### Backend

- **Node.js**: JavaScript runtime for server-side operations.
- **Express.js**: Web framework for Node.js.
- **MongoDB**: NoSQL database for storing data.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.
- **JWT**: JSON Web Tokens for authentication.

### Authentication

- **Google OAuth**: For user authentication.

## Installation and Setup

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later) or yarn
- MongoDB (local installation or MongoDB Atlas)

### Clone the Repository

1. Clone the repository from GitHub:

   ```sh
   git clone https://github.com/your-username/your-repository.git
   ```

2.Navigate to the project directory:

```sh
cd your-repository
```
3.Backend Setup
Navigate to the server directory:
```
sh
cd backend
```
4.Install backend dependencies:
```
sh
npm install
```

5.Create a .env file in the server directory with the following environment variables:

```
PORT=5000
MONGO_URI=your-mongodb-uri
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
JWT_SECRET=your-jwt-secret
```

6.Start the backend server:
```

```sh
npm start
```

### Frontend Setup

1.Navigate to the client directory:

```sh
cd frontend
```

2.Install frontend dependencies:

```sh
npm install
```

3.Create a .env file in the client directory with the following environment variables (if needed):

```
REACT_APP_API_URL=http://localhost:5000
```

4.Start the frontend development server:

```sh
npm start
```
Running the Application Locally
Ensure you have a connection to a MongoDB Atlas cluster.
Start the backend server (npm start in the server directory).
Start the frontend server (npm start in the client directory).
Open your web browser and navigate to http://localhost:3000 to view the application.
Usage
Login: Use Google OAuth to log in.
Manage Tasks: Create, edit, view, delete, and drag tasks between columns ("To Do", "In Progress", "Done").
Logout: Click the logout button to end your session.
Contributing
Contributions are welcome! Please open an issue or submit a pull request with your changes.

Issues
If you encounter any issues or have questions, please check the Issues section on GitHub or create a new issue.
