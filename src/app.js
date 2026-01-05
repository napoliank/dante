import { supabase } from './supabase.js';

export class StudentManagementApp {
  constructor() {
    this.students = [];
    this.filteredStudents = [];
    this.editingStudentId = null;
    this.init();
  }

  async init() {
    this.renderApp();
    this.attachEventListeners();
    await this.loadStudents();
  }

  renderApp() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="header">
        <h1>Student Management System</h1>
        <p>Add, View, Update, and Delete Student Records</p>
      </div>

      <div class="container form-section">
        <h2 id="form-title">Add New Student</h2>
        <div id="message"></div>
        <form id="student-form">
          <div class="form-grid">
            <div class="form-group">
              <label for="student-id">Student ID *</label>
              <input type="text" id="student-id" required>
            </div>
            <div class="form-group">
              <label for="name">Full Name *</label>
              <input type="text" id="name" required>
            </div>
            <div class="form-group">
              <label for="email">Email *</label>
              <input type="email" id="email" required>
            </div>
            <div class="form-group">
              <label for="age">Age *</label>
              <input type="number" id="age" min="1" max="150" required>
            </div>
            <div class="form-group">
              <label for="course">Course *</label>
              <input type="text" id="course" required>
            </div>
            <div class="form-group">
              <label for="year-level">Year Level *</label>
              <select id="year-level" required>
                <option value="">Select Year</option>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </select>
            </div>
          </div>
          <div class="button-group">
            <button type="button" class="btn btn-secondary" id="cancel-btn" style="display: none;">Cancel</button>
            <button type="submit" class="btn btn-primary" id="submit-btn">Add Student</button>
          </div>
        </form>
      </div>

      <div class="container students-list">
        <h2>Student Records</h2>
        <div class="search-bar">
          <input type="text" id="search" placeholder="Search by name, email, student ID, or course...">
        </div>
        <div id="students-container">
          <div class="loading">Loading students...</div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const form = document.getElementById('student-form');
    const searchInput = document.getElementById('search');
    const cancelBtn = document.getElementById('cancel-btn');

    form.addEventListener('submit', (e) => this.handleSubmit(e));
    searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
    cancelBtn.addEventListener('click', () => this.cancelEdit());
  }

  async handleSubmit(e) {
    e.preventDefault();

    const studentData = {
      student_id: document.getElementById('student-id').value.trim(),
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      age: parseInt(document.getElementById('age').value),
      course: document.getElementById('course').value.trim(),
      year_level: parseInt(document.getElementById('year-level').value)
    };

    if (this.editingStudentId) {
      await this.updateStudent(this.editingStudentId, studentData);
    } else {
      await this.addStudent(studentData);
    }
  }

  async addStudent(studentData) {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert([studentData])
        .select()
        .maybeSingle();

      if (error) throw error;

      this.showMessage('Student added successfully!', 'success');
      this.resetForm();
      await this.loadStudents();
    } catch (error) {
      this.showMessage(`Error: ${error.message}`, 'error');
    }
  }

  async updateStudent(id, studentData) {
    try {
      studentData.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('students')
        .update(studentData)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;

      this.showMessage('Student updated successfully!', 'success');
      this.resetForm();
      await this.loadStudents();
    } catch (error) {
      this.showMessage(`Error: ${error.message}`, 'error');
    }
  }

  async deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;

      this.showMessage('Student deleted successfully!', 'success');
      await this.loadStudents();
    } catch (error) {
      this.showMessage(`Error: ${error.message}`, 'error');
    }
  }

  async loadStudents() {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      this.students = data || [];
      this.filteredStudents = this.students;
      this.renderStudentsList();
    } catch (error) {
      this.showMessage(`Error loading students: ${error.message}`, 'error');
      document.getElementById('students-container').innerHTML =
        '<div class="no-students">Failed to load students</div>';
    }
  }

  handleSearch(searchTerm) {
    const term = searchTerm.toLowerCase().trim();

    if (!term) {
      this.filteredStudents = this.students;
    } else {
      this.filteredStudents = this.students.filter(student =>
        student.name.toLowerCase().includes(term) ||
        student.email.toLowerCase().includes(term) ||
        student.student_id.toLowerCase().includes(term) ||
        student.course.toLowerCase().includes(term)
      );
    }

    this.renderStudentsList();
  }

  renderStudentsList() {
    const container = document.getElementById('students-container');

    if (this.filteredStudents.length === 0) {
      container.innerHTML = '<div class="no-students">No students found</div>';
      return;
    }

    container.innerHTML = `
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Course</th>
              <th>Year</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${this.filteredStudents.map(student => `
              <tr>
                <td>${this.escapeHtml(student.student_id)}</td>
                <td>${this.escapeHtml(student.name)}</td>
                <td>${this.escapeHtml(student.email)}</td>
                <td>${student.age}</td>
                <td>${this.escapeHtml(student.course)}</td>
                <td>Year ${student.year_level}</td>
                <td>
                  <div class="actions">
                    <button class="btn btn-small btn-edit" data-id="${student.id}">Edit</button>
                    <button class="btn btn-small btn-delete" data-id="${student.id}">Delete</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    container.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => this.editStudent(btn.dataset.id));
    });

    container.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => this.deleteStudent(btn.dataset.id));
    });
  }

  editStudent(id) {
    const student = this.students.find(s => s.id === id);
    if (!student) return;

    this.editingStudentId = id;

    document.getElementById('student-id').value = student.student_id;
    document.getElementById('name').value = student.name;
    document.getElementById('email').value = student.email;
    document.getElementById('age').value = student.age;
    document.getElementById('course').value = student.course;
    document.getElementById('year-level').value = student.year_level;

    document.getElementById('form-title').textContent = 'Edit Student';
    document.getElementById('submit-btn').textContent = 'Update Student';
    document.getElementById('cancel-btn').style.display = 'block';

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.resetForm();
  }

  resetForm() {
    this.editingStudentId = null;
    document.getElementById('student-form').reset();
    document.getElementById('form-title').textContent = 'Add New Student';
    document.getElementById('submit-btn').textContent = 'Add Student';
    document.getElementById('cancel-btn').style.display = 'none';
  }

  showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = `<div class="${type}">${this.escapeHtml(message)}</div>`;

    setTimeout(() => {
      messageDiv.innerHTML = '';
    }, 5000);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
