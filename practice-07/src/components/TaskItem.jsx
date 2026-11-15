const PRIORITY_LABELS = { low: 'Низкий', medium: 'Средний', high: 'Высокий' };

export default function TaskItem({ task, categoryName, onToggle, onEdit, onDelete }) {
  return (
    <li>
      <strong>{task.title}</strong>
      <div>Статус: {task.completed ? 'Выполнена' : 'В работе'}</div>
      <div>Приоритет: {PRIORITY_LABELS[task.priority] ?? task.priority}</div>
      <div>Категория: {categoryName}</div>
      <div className="actions">
        <button type="button" onClick={() => onToggle(task.id)}>
          {task.completed ? 'Вернуть в работу' : 'Завершить'}
        </button>
        <button type="button" onClick={() => onEdit(task.id)}>Редактировать</button>
        <button type="button" onClick={() => onDelete(task.id)}>Удалить</button>
      </div>
    </li>
  );
}