import { useState, useEffect } from 'react';
import { Task } from '../../server/src/Task';
import './App.css';
function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <h1>Tasks ({tasks.length})</h1>
      {tasks.length === 0 ? (
        <p>No tasks yet</p>
      ) : (
        <ul className="task-list">
          {tasks.map(task => (
            <li key={task.id} className={`task-item priority-${task.priority.toString()}`}>
              <strong>{task.title}</strong>
              {task.description && <p>{task.description}</p>}
              <small>
                Created: {task.dateCreated.toLocaleDateString()}
                {task.dateComplete && ` | Completed: ${task.dateComplete.toLocaleDateString()}`}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;