import { Task } from '../../../server/src/Task';

interface TaskItemProps {
  task: Task;
  isCompleted?: boolean;
  onComplete?: (id: number, dateComplete: Date) => void;
}

function TaskItem({ task, isCompleted = false, onComplete }: TaskItemProps) {
  const handleComplete = () => {
    if (!isCompleted) {
      onComplete?.(task.id, new Date());
    }
  }

  return (
    <li
      key={task.id}
      className={isCompleted ? 'task-item completed' : `task-item priority-${task.priority.toString()}`}
    >
      <strong>{task.title}</strong>
      {task.description && <p>{task.description}</p>}
      <small>
        {isCompleted
          ? `Completed: ${task.dateComplete ? task.dateComplete.toLocaleDateString() : ''}`
          : `Created: ${task.dateCreated.toLocaleDateString()}`
        }
      </small>
        {!isCompleted && (
          <button
            onClick={handleComplete}
            className="ml-3 flex items-center gap-1 p-1 text-green-600 hover:text-white hover:bg-green-600 rounded-full transition"
            title="Mark as complete"
          >
          </button>
      )}
    </li>

  );
}

export default TaskItem;
