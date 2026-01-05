# Student Management System

A modern web application for managing student records with full CRUD operations. Built for the SIT302 Mobile Applications Development course.

## Features

- **Add Students**: Create new student records with comprehensive information
- **View Students**: Display all student records in an organized table
- **Update Students**: Edit existing student information
- **Delete Students**: Remove student records with confirmation
- **Search**: Filter students by name, email, student ID, or course
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technologies Used

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Build Tool**: Vite
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth

## Database Schema

The application uses a `students` table with the following fields:
- `id` (UUID): Unique identifier
- `student_id` (Text): Student ID number (unique)
- `name` (Text): Full name
- `email` (Text): Email address (unique)
- `age` (Integer): Age
- `course` (Text): Course/Program
- `year_level` (Integer): Year level (1-4)
- `created_at` (Timestamp): Record creation time
- `updated_at` (Timestamp): Last update time

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
├── src/
│   ├── main.js          # Application entry point
│   ├── app.js           # Main application logic
│   ├── supabase.js      # Supabase client configuration
│   └── style.css        # Application styles
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
└── package.json         # Project dependencies
```

## Security

- Row Level Security (RLS) is enabled on the database
- All student data is protected with authentication policies
- Input validation on both client and server side
- XSS protection through HTML escaping

## License

This project is created for educational purposes as part of the SIT302 course.
