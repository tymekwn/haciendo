import { useState } from 'react';

interface AddTaskFormProps {
  onTaskAdded: () => void;
}

function AddTaskForm({ onTaskAdded }: AddTaskFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 1,
  });

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
        onTaskAdded();
      } else {
        console.error('Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <>
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
    </>
  );
}

export default AddTaskForm;
