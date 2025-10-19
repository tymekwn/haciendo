import { useState, useEffect } from 'react';
import { Task } from '../../server/src/Task';
import TaskItem from './components/TaskItem';
import AddTaskForm from './components/AddTaskForm';
import './App.css';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleTaskComplete = (id: number) => {
    // Send completion to server
    console.log('Completing task', id);
    fetch(`http://localhost:3001/api/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ complete: true }),
    })
      .then(res => res.json())
      .then(updatedTask => {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === updatedTask.id ? Task.fromJSON(updatedTask) : task
          )
        );
      })
      .catch(error => {
        console.error('Error completing task:', error);
      });
    console.log(tasks)
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

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
                <TaskItem key={task.id} task={task} onComplete={handleTaskComplete}/>
              ))}
            </ul>
          )}
        </div>

        <div className="column">
          <AddTaskForm onTaskAdded={fetchTasks}/>

          <h2>Completed ({completedTasks.length})</h2>
          {completedTasks.length === 0 ? (
            <p>No completed tasks yet</p>
          ) : (
            <ul className="task-list">
              {completedTasks.map(task => (
                <TaskItem key={task.id} task={task} isCompleted />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
