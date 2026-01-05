/*
  # Create Students Management System

  1. New Tables
    - `students`
      - `id` (uuid, primary key) - Unique identifier for each student
      - `student_id` (text, unique) - Student ID number
      - `name` (text) - Student's full name
      - `email` (text, unique) - Student's email address
      - `age` (integer) - Student's age
      - `course` (text) - Course/Program enrolled in
      - `year_level` (integer) - Year level (1-4)
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp
  
  2. Security
    - Enable RLS on `students` table
    - Add policy for authenticated users to read all students
    - Add policy for authenticated users to insert students
    - Add policy for authenticated users to update students
    - Add policy for authenticated users to delete students
  
  3. Important Notes
    - All fields are required except updated_at
    - Student ID and email must be unique
    - Age must be positive
    - Year level is between 1 and 4
*/

CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text UNIQUE NOT NULL,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  age integer NOT NULL CHECK (age > 0),
  course text NOT NULL,
  year_level integer NOT NULL CHECK (year_level >= 1 AND year_level <= 4),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read all students"
  ON students
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert students"
  ON students
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update students"
  ON students
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete students"
  ON students
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);