import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { Task, Priority } from '../src/Task';

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(process.cwd(), 'tasks.json');
let tasks: Task[] = [];

app.use(cors());
app.use(express.json());

async function initializeDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
  }
}

// Load tasks from JSON file
async function loadTasks(): Promise<Task[]> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const json = JSON.parse(data);
    return json.map((item: any) => Task.fromJSON(item));
  } catch (error) {
    console.error('Error reading tasks:', error);
    return [];
  }
}

// Write tasks to JSON file
async function writeTasks(tasks: Task[]): Promise<void> {
  try {
    const json = tasks.map(task => task.toJSON());
    await fs.writeFile(DATA_FILE, JSON.stringify(json, null, 2));
  } catch (error) {
    console.error('Error writing tasks:', error);
    throw error;
  }
}

// Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await loadTasks();
    res.json(tasks.map(task => task.toJSON()));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create new task
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, priority, description } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const tasks = await loadTasks();
    const newTask = new Task(title, priority, description);
    tasks.push(newTask);
    await writeTasks(tasks);
    res.status(201).json(newTask.toJSON());
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update task dateComplete, priority, or description
app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const tasks = await loadTasks();
    const taskIndex = tasks.findIndex(t => t.id === id);
    
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = tasks[taskIndex];

    if (req.body.complete === true) {
      task.complete();
    }
    
    if (req.body.description !== undefined) {
      task.description = req.body.description;
    }

    if (req.body.priority !== undefined) {
      task.priority = req.body.priority;
    }
    
    await writeTasks(tasks);
    res.json(task.toJSON());
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const tasks = await loadTasks();
    const filteredTasks = tasks.filter(t => t.id !== id);
    
    if (tasks.length === filteredTasks.length) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    await writeTasks(filteredTasks);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Initialize and start server
initializeDataFile().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});