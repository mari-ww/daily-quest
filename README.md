# ⚔ Daily Quest

> A dark gamified daily planner that combines everyday productivity with RPG-style progression.

[![Demo](https://img.shields.io/badge/✦_Interactive_Demo-6B8F71?style=for-the-badge)](https://mari-ww.github.io/daily-quest/demo/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square\&logo=python\&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square\&logo=fastapi\&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square\&logo=react\&logoColor=61DAFB)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square\&logo=postgresql\&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square\&logo=docker\&logoColor=white)](https://www.docker.com/)

Daily Quest is a full-stack application that turns daily planning into a small RPG experience.

I originally built this project **for fun and as a way to challenge myself**. I wanted to take something I would actually enjoy using and use it as an excuse to go deeper into technologies and concepts I was learning.

Instead of building another simple to-do list, I experimented with **gamification, date-based data, progression systems, statistics, asynchronous frontend state, and custom UI interactions**.

Users organize their day through tasks and activities while completing them affects RPG-inspired resources such as **HP, Mana, XP, Levels, and Stats**.

The project became a practical way for me to test what I knew, find the parts I didn't understand well enough, and learn by actually building them.

## What it does

A daily entry acts as the center of the planner.

From there, users can:

* Create and complete daily tasks
* Add optional activities
* Earn XP and level up
* Manage HP and Mana
* Improve character stats
* Track their mood
* Navigate through a calendar
* Use a focus timer
* Play YouTube music while working
* Customize parts of the interface

The application combines these features into a single dashboard instead of treating planning, tracking, and progression as separate tools.

## ✦ Features

### ⚔ Daily Tasks

Tasks can include:

* Title
* Scheduled time
* XP reward
* Important task status
* Associated character stats
* Completion tracking

Completing tasks contributes to the user's daily progression.

### ✧ Mana Activities

Activities represent optional actions such as rest, hobbies, or other rewarding moments.

Each activity can provide:

* Mana
* A selected character stat reward
* Completion tracking

Completing an activity restores Mana and contributes to the selected stat.

### ♡ HP System

Important tasks are connected to the daily HP system.

The application tracks the user's HP throughout the day, creating a simple consequence and reward mechanic around completing important tasks.

### ✦ XP & Level Progression

Completed tasks provide XP and contribute to character progression.

The application calculates the current level from accumulated XP.

### ◇ Character Stats

Daily Quest tracks five RPG-inspired stats:

* Intelligence
* Physical
* Creativity
* Social
* Mental

Monthly stat progress is calculated from completed tasks and activities.

### ◌ Mood Tracker

Users can record their mood for each day using a set of visual mood states.

Mood history is displayed through the calendar.

### Calendar

The calendar provides an overview of the month and displays daily information such as:

* Mood
* Daily progress
* Selected date

Users can navigate between dates and manage the planner for each day.

### ⏱ Focus Timer

A built-in focus timer allows users to work in focused sessions without leaving the application.

The timer supports customizable durations and visual progress feedback.

### ♪ YouTube Music

Users can load a YouTube video directly into the application and use it as background music while planning or working.

### ⋆ Personalization

The interface supports visual customization, including:

* Custom avatar
* Avatar background
* Calendar background
* Quote background
* Focus clock background

Background images use overlays to preserve readability while keeping the visual style of the application.

### ✦ Daily Completion

When all tasks for the selected day are completed, Daily Quest triggers a custom celebration animation with monochrome symbols rising from the bottom edges of the screen.

---

## Demo

The project has a static interactive demo so the interface can be explored without running the full application.

**[✦ Open Interactive Demo](https://mari-ww.github.io/daily-quest/demo/)**

> The demo is a visual preview of the application and does not connect to the full backend.

---

## Preview

![Dashboard](demo/dashboard.png)

![Dashboard 2](demo/dashboard2.png)

---

## ◈ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* CSS

### Backend

* Python
* FastAPI
* SQLAlchemy
* Alembic
* PostgreSQL

### Other

* Docker
* Docker Compose
* Pytest
* Git

---

## How It Works

The frontend and backend communicate through a REST API.

```text
React + TypeScript
        │
        │ REST API
        ▼
     FastAPI
        │
        ▼
   PostgreSQL
```

The backend is organized around routers, services, models, schemas, and database migrations.

The frontend handles planner state, API communication, daily interactions, personalization, and the RPG-inspired interface.

### Creating a Task

A user creates a daily task and can assign:

* An XP reward
* One or more character stats
* An important-task status

The task is then associated with the selected daily entry.

### Completing a Task

When a task is completed, the backend updates its state and applies the corresponding progression logic.

```text
Task completed
      ↓
Update task state
      ↓
Apply progression
      ↓
Update daily information
      ↓
Refresh statistics
```

### Completing an Activity

Activities restore Mana when completed and contribute to their selected character stat.

```text
Activity completed
        ↓
Restore Mana
        ↓
Increase selected stat progress
        ↓
Update daily entry
```

### Monthly Statistics

The statistics endpoint aggregates tasks and activities across the selected month.

```text
Monthly entries
      ↓
Find associated tasks
      ↓
Group tasks by stat
      ↓
Calculate completion progress
      ↓
Add completed activity rewards
      ↓
Return monthly stat progress
```

### Daily Completion

When the final incomplete task is completed, the frontend detects that all tasks for the selected day are complete and triggers the celebration animation.

The animation uses React rendering and CSS without an external animation library.

---

## Project Structure

```text
daily-quest/
│
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   └── services/
│   │
│   └── tests/
│
├── frontend/
│   └── src/
│       ├── api/
│       ├── types/
│       ├── App.tsx
│       └── App.css
│
├── demo/
│   ├── index.html
│   ├── demo.js
│   └── demo.css
│
├── docker-compose.yml
└── README.md
```

---

## ▶ Running Locally

### Requirements

* Docker
* Docker Compose
* Node.js
* npm

### Clone the repository

```bash
git clone https://github.com/mari-ww/daily-quest.git
cd daily-quest
```

### Start the application

```bash
docker compose up --build
```

This starts the application services using Docker Compose.

FastAPI's interactive API documentation is available at:

```text
/docs
```

---

## ◈ Testing

The backend uses Pytest for automated tests.

Run the tests with:

```bash
pytest
```

The tests cover application behavior including API functionality and gamification logic.

---

## ⋆ Design

I wanted Daily Quest to feel more like a **character dashboard** than a traditional productivity app.

The interface uses:

* Dark backgrounds
* High-contrast typography
* Thin borders
* Monochrome decorative elements
* Subtle gradients and shadows
* Minimal accent colors
* RPG-inspired progression indicators

The goal was to make everyday planning feel more like managing a character's daily progression than using a traditional to-do list.

---

## What I Learned

Daily Quest started as a fun personal project, but it ended up being one of the projects where I experimented the most.

Rather than following a tutorial and reproducing an existing application, I used the project to **test my own understanding and push myself into areas I hadn't worked with as much before**.

While building it, I practiced:

* Designing a REST API with FastAPI
* Structuring backend logic with services, routers, models, and schemas
* Working with PostgreSQL and SQLAlchemy
* Managing database migrations with Alembic
* Building a React + TypeScript application
* Managing asynchronous API calls and frontend state
* Designing relational data around dates, tasks, activities, and progression
* Building a gamification system with XP, levels, HP, Mana, and character stats
* Calculating monthly statistics from relational data
* Working with date-based planner behavior
* Creating interactive UI states with React
* Building custom animations with CSS instead of relying on an animation library
* Using Docker Compose to manage the development environment

One of the main things I wanted to understand better was **how different parts of an application interact when the logic becomes more complex**.

For example, completing a task is not just a boolean change. It can affect XP, character progression, daily information, monthly statistics, and the visual state of the application.

Working through those relationships helped me better understand how to structure application logic and keep responsibilities separated between the frontend, API, services, and database.

I also used the project to experiment with the frontend beyond basic CRUD interfaces. The calendar, focus timer, mood tracking, personalization, progression indicators, and completion animation gave me a reason to work with **state, asynchronous behavior, visual feedback, and user interaction** in a more practical way.

Most importantly, this project reinforced something I find useful when learning: **building something I actually care about makes me much more willing to investigate the details instead of stopping at "I know how to make it work."**

---

## Author

**Mariana Carneiro**

Computer Science graduate focused on backend and full-stack development.

[GitHub](https://github.com/mari-ww) · [LinkedIn](https://www.linkedin.com/in/mariana-carneiro-573888254/)
