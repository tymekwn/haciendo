import { useState, useEffect } from 'react';
import { Task } from '../../server/src/Task';
import './App.css';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 1,
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    setLoading(true);
    fetch('http://localhost:3001/api/tasks')
      .then(res => res.json())
      .then(data => {
        const loadedTasks = data.map((item: any) => Task.fromJSON(item));
        setTasks(loadedTasks);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
        setLoading(false);
      });
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTask.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        setNewTask({ title: '', description: '', priority: 1 });
        setShowForm(false);
        fetchTasks();
      } else {
        console.error('Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const activeTasks = tasks.filter(t => !t.dateComplete);
  const completedTasks = tasks.filter(t => t.dateComplete);

  return (
    <div className="app-container">
      <h1>Haciendo</h1>

      <div className="columns">
        <div className="column">
          <h2>Active Tasks ({activeTasks.length})</h2>
          {activeTasks.length === 0 ? (
            <p>No active tasks</p>
          ) : (
            <ul className="task-list">
              {activeTasks.map(task => (
                <li key={task.id} className={`task-item priority-${task.priority.toString()}`}>
                  <strong>{task.title}</strong>
                  {task.description && <p>{task.description}</p>}
                  <small>
                    Created: {task.dateCreated.toLocaleDateString()}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="column">
          <button className="add-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add Task'}
          </button>

          {showForm && (
            <form className="task-form" onSubmit={handleAddTask}>
              <input
                type="text"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
              />

              <textarea
                placeholder="Description (optional)"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />

              <div className="priority-toggle">
                <span>Priority:</span>
                {[1, 2, 3].map((level) => (
                  <button
                    key={level}
                    type="button"
                    className={newTask.priority === level ? 'active' : ''}
                    onClick={() => setNewTask({ ...newTask, priority: level })}
                  >
                    {level === 1 ? 'Low' : level === 2 ? 'Medium' : 'High'}
                  </button>
                ))}
              </div>

              <button type="submit" className="submit-btn">Save Task</button>
            </form>
          )}

          <h2>Completed ({completedTasks.length})</h2>
          {completedTasks.length === 0 ? (
            <p>No completed tasks yet</p>
          ) : (
            <ul className="task-list">
              {completedTasks.map(task => (
                <li key={task.id} className="task-item completed">
                  <strong>{task.title}</strong>
                  {task.description && <p>{task.description}</p>}
                  <small>
                    Completed: {task.dateComplete ? task.dateComplete.toLocaleDateString() : ''}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
