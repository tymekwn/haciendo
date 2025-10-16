import { Task } from '../../../server/src/Task';

interface TaskItemProps {
  task: Task;
  isCompleted?: boolean;
}

function TaskItem({ task, isCompleted = false }: TaskItemProps) {
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
    </li>
  );
}

export default TaskItem;
