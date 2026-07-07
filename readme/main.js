A full-stack web app — React frontend + Node.js/Express backend + in-memory MongoDB — for managing tasks with authentication.

📁 Two Halves
Backend (/backend) — The Server
Runs on port 5000
server.js — starts Express and creates a MongoDB database automatically in RAM (no MongoDB install needed)
models/User.js — defines user schema (username + hashed password)
models/Task.js — defines task schema (title, description, status, category, priority, dueDate, reminder, completedAt)
routes/auth.js — handles /api/auth/register and /api/auth/login
routes/tasks.js — handles all task CRUD (GET, POST, PUT, DELETE) for /api/tasks
middleware/authMiddleware.js — verifies JWT tokens on every task request
Frontend (/frontend) — The UI
Runs on port 5173 via Vite
context/AuthContext — manages logged-in user + token, stores in localStorage
context/ThemeContext — manages dark/light mode, persists in localStorage
pages/Dashboard — main page with 3 tabs: Active tasks, History, Charts
components/TaskForm — add task form with category, priority, due date, reminder
components/TaskItem — individual task card with badges, inline editing, overdue indicator
components/ProgressChart — SVG donuts + progress bars + 7-day bar chart
components/ReminderNotifier — silent background poller that shows toast popups for reminders
🔐 Auth Flow
Register → password hashed → JWT returned → stored in browser → sent with every API call → backend verifies it before touching any task data

🎨 Theming
All colours are CSS variables — toggle dark/light by setting data-theme on <html>, everything switches instantly.

database
userid:Arivoli_42
password:LegnjH8Jbv9kkh8m