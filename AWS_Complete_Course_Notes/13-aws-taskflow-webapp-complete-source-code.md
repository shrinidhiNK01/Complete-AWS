# Taskflow Complete Source Code: React Frontend, FastAPI Backend, PostgreSQL, Docker

## Phase 1: What Are We Building?

We are building the actual application that will run on AWS:

1. FastAPI backend.
2. PostgreSQL data model.
3. SQLAlchemy database layer.
4. Alembic migrations.
5. React frontend.
6. Production Docker image.
7. Docker Compose local environment.
8. Health and readiness endpoints for AWS load balancer health checks.

## Phase 2: Why Does It Exist?

AWS infrastructure without a real app is incomplete. This module gives you the application code that ECR, ECS, ALB, RDS, S3, CloudFront, and CI/CD will deploy.

## Phase 3: Real World Use Case

`taskflow` is a simple task management app. It is intentionally small enough to understand but realistic enough to deploy like a production app.

## Phase 4: Local Architecture Diagram

```mermaid
flowchart LR
    Browser["Browser"] --> React["React Frontend"]
    React --> API["FastAPI Backend"]
    API --> Postgres["PostgreSQL"]
```

## Phase 5: Folder Structure

```text
taskflow/
  backend/
    app/
      __init__.py
      main.py
      config.py
      database.py
      models.py
      schemas.py
      repository.py
    alembic/
      env.py
      versions/
        0001_create_tasks.py
    tests/
      test_health.py
      test_tasks.py
    alembic.ini
    requirements.txt
    requirements-dev.txt
    Dockerfile
    .dockerignore
  frontend/
    index.html
    package.json
    vite.config.js
    src/
      main.jsx
      App.jsx
      api.js
      styles.css
    Dockerfile
    nginx.conf
  docker-compose.yml
  README.md
```

## Phase 6: Backend Code

### backend/requirements.txt

```text
fastapi==0.115.6
uvicorn[standard]==0.32.1
sqlalchemy==2.0.36
psycopg[binary]==3.2.3
alembic==1.14.0
pydantic-settings==2.6.1
python-json-logger==2.0.7
```

### backend/requirements-dev.txt

```text
-r requirements.txt
pytest==8.3.4
httpx==0.28.1
ruff==0.8.3
```

### backend/app/config.py

```python
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "taskflow-api"
    environment: str = "dev"
    database_url: str = "postgresql+psycopg://taskflow:taskflow@localhost:5432/taskflow"
    cors_origin: str = "http://localhost:5173"
    log_level: str = "INFO"


settings = Settings()
```

Explanation:

1. `BaseSettings` reads environment variables.
2. `database_url` changes between local Docker and AWS RDS.
3. `cors_origin` allows the frontend to call the API.

### backend/app/database.py

```python
from collections.abc import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker
from app.config import settings


class Base(DeclarativeBase):
    pass


engine = create_engine(settings.database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

Explanation:

1. `Base` is the parent class for SQLAlchemy models.
2. `create_engine` connects to PostgreSQL.
3. `pool_pre_ping=True` checks old database connections before reuse.
4. `get_db` creates one database session per request.

### backend/app/models.py

```python
from datetime import datetime, timezone
from sqlalchemy import Boolean, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(String(1000), nullable=False, default="")
    completed: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
```

### backend/app/schemas.py

```python
from datetime import datetime
from pydantic import BaseModel, Field


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(default="", max_length=1000)


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=1000)
    completed: bool | None = None


class TaskRead(BaseModel):
    id: int
    title: str
    description: str
    completed: bool
    created_at: datetime

    model_config = {"from_attributes": True}
```

### backend/app/repository.py

```python
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models import Task
from app.schemas import TaskCreate, TaskUpdate


def list_tasks(db: Session) -> list[Task]:
    return list(db.scalars(select(Task).order_by(Task.created_at.desc())).all())


def create_task(db: Session, payload: TaskCreate) -> Task:
    task = Task(**payload.model_dump())
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def get_task(db: Session, task_id: int) -> Task | None:
    return db.get(Task, task_id)


def update_task(db: Session, task: Task, payload: TaskUpdate) -> Task:
    updates = payload.model_dump(exclude_unset=True)
    for key, value in updates.items():
        setattr(task, key, value)
    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task: Task) -> None:
    db.delete(task)
    db.commit()
```

### backend/app/main.py

```python
import logging
import time
from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.repository import create_task, delete_task, get_task, list_tasks, update_task
from app.schemas import TaskCreate, TaskRead, TaskUpdate

logging.basicConfig(level=settings.log_level)
logger = logging.getLogger("taskflow-api")

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.cors_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def request_logging(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    duration_ms = round((time.perf_counter() - start) * 1000, 2)
    logger.info(
        "request completed method=%s path=%s status=%s duration_ms=%s",
        request.method,
        request.url.path,
        response.status_code,
        duration_ms,
    )
    return response


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/ready")
def ready(db: Session = Depends(get_db)) -> dict[str, str]:
    db.execute(text("select 1"))
    return {"status": "ready"}


@app.get("/tasks", response_model=list[TaskRead])
def tasks(db: Session = Depends(get_db)):
    return list_tasks(db)


@app.post("/tasks", response_model=TaskRead, status_code=201)
def create(payload: TaskCreate, db: Session = Depends(get_db)):
    return create_task(db, payload)


@app.patch("/tasks/{task_id}", response_model=TaskRead)
def patch(task_id: int, payload: TaskUpdate, db: Session = Depends(get_db)):
    task = get_task(db, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return update_task(db, task, payload)


@app.delete("/tasks/{task_id}", status_code=204)
def delete(task_id: int, db: Session = Depends(get_db)):
    task = get_task(db, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    delete_task(db, task)
    return None
```

### backend/alembic.ini

```ini
[alembic]
script_location = alembic
prepend_sys_path = .

[loggers]
keys = root,sqlalchemy,alembic

[handlers]
keys = console

[formatters]
keys = generic

[logger_root]
level = WARN
handlers = console

[logger_sqlalchemy]
level = WARN
handlers =
qualname = sqlalchemy.engine

[logger_alembic]
level = INFO
handlers =
qualname = alembic

[handler_console]
class = StreamHandler
args = (sys.stderr,)
level = NOTSET
formatter = generic

[formatter_generic]
format = %(levelname)-5.5s [%(name)s] %(message)s
```

### backend/alembic/env.py

```python
from logging.config import fileConfig
from alembic import context
from sqlalchemy import engine_from_config, pool

from app.config import settings
from app.database import Base
from app import models

config = context.config
config.set_main_option("sqlalchemy.url", settings.database_url)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    context.configure(url=settings.database_url, target_metadata=target_metadata, literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
```

### backend/alembic/versions/0001_create_tasks.py

```python
from alembic import op
import sqlalchemy as sa

revision = "0001_create_tasks"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "tasks",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("description", sa.String(length=1000), nullable=False, server_default=""),
        sa.Column("completed", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_tasks_id", "tasks", ["id"])


def downgrade() -> None:
    op.drop_index("ix_tasks_id", table_name="tasks")
    op.drop_table("tasks")
```

### backend/tests/test_health.py

```python
from fastapi.testclient import TestClient
from app.main import app


def test_health():
    client = TestClient(app)
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
```

### backend/tests/test_tasks.py

```python
from app.schemas import TaskCreate, TaskUpdate


def test_create_task_schema():
    payload = TaskCreate(title="Ship AWS app", description="Deploy taskflow")
    assert payload.title == "Ship AWS app"


def test_update_task_schema():
    payload = TaskUpdate(completed=True)
    assert payload.completed is True
```

### backend/Dockerfile

```dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends libpq5 curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY alembic ./alembic
COPY alembic.ini .

RUN adduser --disabled-password --gecos "" appuser
USER appuser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### backend/.dockerignore

```text
.venv
__pycache__
*.pyc
.pytest_cache
.ruff_cache
.env
```

## Phase 7: Frontend Code

### frontend/package.json

```json
{
  "name": "taskflow-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "vite build",
    "preview": "vite preview --host 0.0.0.0"
  },
  "dependencies": {
    "@vitejs/plugin-react": "latest",
    "vite": "latest",
    "react": "latest",
    "react-dom": "latest",
    "lucide-react": "latest"
  },
  "devDependencies": {}
}
```

### frontend/vite.config.js

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
});
```

### frontend/index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Taskflow</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### frontend/src/api.js

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function listTasks() {
  const response = await fetch(`${API_BASE_URL}/tasks`);
  if (!response.ok) throw new Error("Failed to load tasks");
  return response.json();
}

export async function createTask(payload) {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error("Failed to create task");
  return response.json();
}

export async function updateTask(taskId, payload) {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error("Failed to update task");
  return response.json();
}

export async function deleteTask(taskId) {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: "DELETE"
  });
  if (!response.ok) throw new Error("Failed to delete task");
}
```

### frontend/src/main.jsx

```jsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(<App />);
```

### frontend/src/App.jsx

```jsx
import { useEffect, useState } from "react";
import { Check, Plus, RefreshCw, Trash2 } from "lucide-react";
import { createTask, deleteTask, listTasks, updateTask } from "./api";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadTasks() {
    setLoading(true);
    setError("");
    try {
      setTasks(await listTasks());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function submitTask(event) {
    event.preventDefault();
    if (!title.trim()) return;
    try {
      await createTask({ title, description });
      setTitle("");
      setDescription("");
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleTask(task) {
    await updateTask(task.id, { completed: !task.completed });
    await loadTasks();
  }

  async function removeTask(taskId) {
    await deleteTask(taskId);
    await loadTasks();
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <main className="shell">
      <section className="toolbar">
        <div>
          <h1>Taskflow</h1>
          <p>Production AWS webapp exercise</p>
        </div>
        <button className="iconButton" onClick={loadTasks} title="Refresh tasks">
          <RefreshCw size={18} />
        </button>
      </section>

      <form className="taskForm" onSubmit={submitTask}>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Task title"
          aria-label="Task title"
        />
        <input
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Description"
          aria-label="Description"
        />
        <button className="primaryButton" type="submit">
          <Plus size={18} />
          Add
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">Loading tasks...</p>}

      <section className="taskList">
        {tasks.map((task) => (
          <article className="taskItem" key={task.id}>
            <button
              className={task.completed ? "checkButton complete" : "checkButton"}
              onClick={() => toggleTask(task)}
              title="Toggle complete"
            >
              <Check size={18} />
            </button>
            <div className="taskText">
              <h2>{task.title}</h2>
              <p>{task.description || "No description"}</p>
            </div>
            <button className="iconButton danger" onClick={() => removeTask(task.id)} title="Delete task">
              <Trash2 size={18} />
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}
```

### frontend/src/styles.css

```css
:root {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #18202f;
  background: #f4f7fb;
}

body {
  margin: 0;
}

button,
input {
  font: inherit;
}

.shell {
  width: min(920px, calc(100vw - 32px));
  margin: 32px auto;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

h1 {
  margin: 0;
  font-size: 32px;
}

.toolbar p,
.muted {
  color: #607089;
  margin: 6px 0 0;
}

.taskForm {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 10px;
  margin-bottom: 20px;
}

input {
  min-width: 0;
  border: 1px solid #c8d2e1;
  border-radius: 6px;
  padding: 11px 12px;
  background: white;
}

.primaryButton,
.iconButton,
.checkButton {
  border: 1px solid #c8d2e1;
  border-radius: 6px;
  background: white;
  color: #18202f;
  cursor: pointer;
}

.primaryButton {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  background: #0f766e;
  color: white;
  border-color: #0f766e;
}

.iconButton,
.checkButton {
  width: 40px;
  height: 40px;
  display: inline-grid;
  place-items: center;
}

.danger {
  color: #b42318;
}

.taskList {
  display: grid;
  gap: 10px;
}

.taskItem {
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  gap: 12px;
  align-items: center;
  background: white;
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  padding: 12px;
}

.taskText h2 {
  font-size: 16px;
  margin: 0 0 4px;
}

.taskText p {
  color: #607089;
  margin: 0;
}

.complete {
  background: #dcfce7;
  color: #166534;
  border-color: #86efac;
}

.error {
  color: #b42318;
}

@media (max-width: 720px) {
  .taskForm {
    grid-template-columns: 1fr;
  }

  .primaryButton {
    height: 42px;
    justify-content: center;
  }
}
```

### frontend/nginx.conf

```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /health {
        access_log off;
        return 200 "ok\n";
    }
}
```

### frontend/Dockerfile

```dockerfile
FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Phase 8: Docker Compose

### docker-compose.yml

```yaml
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql+psycopg://taskflow:taskflow@postgres:5432/taskflow
      CORS_ORIGIN: http://localhost:5173
      ENVIRONMENT: dev
    depends_on:
      - postgres

  frontend:
    image: node:22-alpine
    working_dir: /app
    command: sh -c "npm install && npm run dev"
    ports:
      - "5173:5173"
    environment:
      VITE_API_BASE_URL: http://localhost:8000
    volumes:
      - ./frontend:/app
    depends_on:
      - backend

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: taskflow
      POSTGRES_USER: taskflow
      POSTGRES_PASSWORD: taskflow
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Phase 9: Run Locally

Start:

```bash
docker compose up --build
```

Run migrations:

```bash
docker compose exec backend alembic upgrade head
```

Open frontend:

```text
http://localhost:5173
```

Test API:

```bash
curl http://localhost:8000/health
curl http://localhost:8000/ready
curl -X POST http://localhost:8000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Deploy to AWS","description":"Build ECR, ECS, RDS, ALB, CloudFront"}'
curl http://localhost:8000/tasks
```

Expected output:

```json
{"status":"ok"}
```

Possible error:

```text
connection refused
```

Fix:

1. Confirm containers are running:

```bash
docker compose ps
```

2. Read backend logs:

```bash
docker compose logs backend
```

3. Confirm PostgreSQL is healthy:

```bash
docker compose exec postgres pg_isready -U taskflow
```

## Phase 10: Run Tests

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
pytest
ruff check app tests
```

Windows:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements-dev.txt
pytest
ruff check app tests
```

## Phase 11: Build Production Images Locally

Backend:

```bash
docker build -t taskflow-api:local ./backend
docker run --rm -p 8000:8000 \
  -e DATABASE_URL=postgresql+psycopg://taskflow:taskflow@host.docker.internal:5432/taskflow \
  taskflow-api:local
```

Frontend:

```bash
docker build -t taskflow-frontend:local ./frontend
docker run --rm -p 8080:80 taskflow-frontend:local
```

## Phase 12: Production Changes For AWS

When deploying to AWS:

1. Backend image goes to ECR.
2. Backend runs on ECS Fargate.
3. Backend reads `DATABASE_URL` from Secrets Manager.
4. Backend logs go to CloudWatch Logs.
5. RDS replaces local PostgreSQL.
6. Frontend runs as static files in S3.
7. CloudFront serves the frontend.
8. `VITE_API_BASE_URL` is set to the API ALB or `https://api.example.com` at build time.

## Phase 13: Debugging

Backend cannot connect to database:

```bash
docker compose logs backend
docker compose exec postgres pg_isready -U taskflow
```

Frontend cannot call API:

1. Open browser DevTools.
2. Check Network tab.
3. Confirm API URL is correct.
4. Confirm CORS origin matches frontend URL.

Migration fails:

```bash
docker compose exec backend alembic current
docker compose exec backend alembic upgrade head
```

## Phase 14: Interview Questions

1. Why does the backend need `/health` and `/ready`?
2. What is CORS?
3. Why use Alembic?
4. Why run the container as non-root?
5. What changes between local PostgreSQL and RDS?
6. Why is `VITE_API_BASE_URL` a build-time frontend value?

