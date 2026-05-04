# 🍽 Recipely — AI-Powered Recipe App

A full-stack recipe management app powered by Claude AI. Save your recipes, discover new ones based on what's in your fridge, and generate smart shopping lists — all in one place.

![Recipely](https://img.shields.io/badge/stack-Node.js%20%7C%20Express%20%7C%20SQLite%20%7C%20Claude%20AI-c97d4e?style=flat-square)
![Auth](https://img.shields.io/badge/auth-JWT-green?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

---

## ✨ Features

- **User Authentication** — secure register/login with bcrypt password hashing and JWT tokens
- **Recipe Management** — add, view, and delete recipes with ingredients, steps, cuisine and diet tags
- **Search & Filter** — search recipes by title, filter by cuisine and diet in real time
- **AI Recipe Suggestions** — tell Claude what's in your fridge and get 3 instant recipe ideas
- **AI Shopping List** — Claude generates a categorized shopping list from any recipe with checkboxes
- **Save AI Recipes** — one click saves any AI-suggested recipe directly to your collection
- **Persistent Storage** — SQLite database keeps your data safe across server restarts

---

## 🖥 Screenshots

> Add your screenshots here after running the app locally.
> Tip: Press `Win + Shift + S` to take a screenshot on Windows.

| Login | Dashboard | Recipe Detail |
|-------|-----------|---------------|
| ![login](#) | ![dashboard](#) | ![detail](#) |

| Add Recipe | AI Suggest |
|------------|------------|
| ![add](#) | ![ai](#) |

---

## 🛠 Tech Stack

### Frontend
- Vanilla HTML, CSS, JavaScript
- No framework — demonstrates core web fundamentals
- Responsive warm Notion-inspired UI

### Backend
- **Node.js** + **Express** — REST API
- **SQLite** via `better-sqlite3` — relational database
- **bcrypt** — secure password hashing
- **JSON Web Tokens (JWT)** — stateless authentication
- **Anthropic Claude API** — AI recipe suggestions and shopping lists

### Database Schema
```
users         — id, name, email, password, createdAt
recipes       — id, userId, title, cuisine, diet, time, servings, imageUrl
ingredients   — id, recipeId, name, amount, unit
steps         — id, recipeId, stepOrder, instruction
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm

### 1. Clone the repo
```bash
git clone https://github.com/Aishascreations/recipe-app.git
cd recipe-app
```

### 2. Install backend dependencies
```bash
cd backend
npm install
```

### 3. Set up environment variables
Create a `.env` file inside the `backend` folder:
```
PORT=3001
JWT_SECRET=your-secret-key-here
ANTHROPIC_API_KEY=your-anthropic-api-key-here
```

> Get your Anthropic API key at [console.anthropic.com](https://console.anthropic.com)

### 4. Start the backend
```bash
node server.js
```

You should see:
```
Database ready: recipes.db
Server running at http://localhost:3001
```

### 5. Open the frontend
Open `frontend/index.html` in your browser — no build step needed.

---

## 📡 API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Create a new account |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/me` | Verify current token |

### Recipes
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/recipes` | Get all recipes (supports `?search=` `?cuisine=` `?diet=`) |
| GET | `/api/recipes/:id` | Get a single recipe with ingredients and steps |
| POST | `/api/recipes` | Create a new recipe |
| DELETE | `/api/recipes/:id` | Delete a recipe |

### AI
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/ai/suggest` | Get recipe suggestions from ingredients |
| POST | `/api/ai/shopping-list` | Generate a shopping list from recipe IDs |

---

## 📁 Project Structure

```
recipe-app/
├── backend/
│   ├── routes/
│   │   ├── auth.js        ← register, login, token verify
│   │   ├── recipes.js     ← CRUD for recipes
│   │   └── ai.js          ← Claude AI integration
│   ├── database.js        ← SQLite setup and schema
│   ├── middleware.js       ← JWT auth middleware
│   ├── server.js          ← Express app entry point
│   └── .env               ← environment variables (not committed)
└── frontend/
    ├── pages/
    │   ├── dashboard.html  ← recipe grid with search and filters
    │   ├── add-recipe.html ← recipe creation form
    │   ├── recipe.html     ← recipe detail and shopping list
    │   └── ai.html         ← AI fridge-to-recipe suggester
    ├── css/
    │   └── style.css       ← all styles
    └── index.html          ← login and register
```

---

## 🔐 Security

- Passwords hashed with **bcrypt** (10 salt rounds) — never stored in plain text
- **JWT tokens** expire after 7 days
- All recipe routes protected by auth middleware
- Users can only access their own recipes
- Environment variables kept out of version control via `.gitignore`

---

## 🗺 Roadmap

- [ ] Recipe editing
- [ ] Favourite recipes
- [ ] Recipe ratings and notes
- [ ] Meal planner
- [ ] Deploy to Render + Netlify

---

## 👩‍💻 Author

**Aisha** — [@Aishascreations](https://github.com/Aishascreations)

---

## 📄 License

MIT — feel free to use this project for learning or inspiration.