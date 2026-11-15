import { useState } from 'react';
import { validateTaskDraft } from '../domain/task-service.js';

const EMPTY_DRAFT = { title: '', priority: 'medium', categoryId: '' };

export default function TaskForm({ categories, initialTask, onSave, onCancel }) {
  const isEditing = initialTask != null;

  const [draft, setDraft] = useState(() =>
    initialTask
      ? {
          title: initialTask.title,
          priority: initialTask.priority,
          categoryId: String(initialTask.categoryId),
        }
      : { ...EMPTY_DRAFT, categoryId: categories[0] ? String(categories[0].id) : '' }
  );
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  function updateField(field, value) {
    setDraft(previous => ({ ...previous, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setMessage('');

    const { valid, value, errors: nextErrors } = validateTaskDraft(draft, categories);
    setErrors(nextErrors);

    if (!valid) {
      return;
    }

    const saved = onSave(value);

    if (saved) {
      setMessage(isEditing ? 'Изменения сохранены.' : 'Задача добавлена.');
      // После создания App сбросит editingId, форма пересоздастся через key.
      if (!isEditing) {
        setDraft({
          ...EMPTY_DRAFT,
          categoryId: categories[0] ? String(categories[0].id) : '',
        });
      }
    } else {
      setMessage('Не удалось сохранить: запись уже отсутствует.');
    }
  }

  function handleCancel() {
    onCancel();
  }

  return (
    <section aria-label={isEditing ? 'Редактирование задачи' : 'Создание задачи'}>
      <h2>{isEditing ? 'Редактировать задачу' : 'Новая задача'}</h2>

      <form noValidate onSubmit={handleSubmit}>
        <label htmlFor="task-title">Название</label>
        <input
          id="task-title"
          type="text"
          value={draft.title}
          onChange={event => updateField('title', event.target.value)}
          aria-invalid={errors.title ? 'true' : 'false'}
          aria-describedby={errors.title ? 'task-title-error' : undefined}
        />
        {errors.title && (
          <p id="task-title-error" className="error" role="alert">{errors.title}</p>
        )}

        <label htmlFor="task-priority">Приоритет</label>
        <select
          id="task-priority"
          value={draft.priority}
          onChange={event => updateField('priority', event.target.value)}
          aria-invalid={errors.priority ? 'true' : 'false'}
          aria-describedby={errors.priority ? 'task-priority-error' : undefined}
        >
          <option value="low">Низкий</option>
          <option value="medium">Средний</option>
          <option value="high">Высокий</option>
        </select>
        {errors.priority && (
          <p id="task-priority-error" className="error" role="alert">{errors.priority}</p>
        )}

        <label htmlFor="task-category">Категория</label>
        <select
          id="task-category"
          value={draft.categoryId}
          onChange={event => updateField('categoryId', event.target.value)}
          aria-invalid={errors.categoryId ? 'true' : 'false'}
          aria-describedby={errors.categoryId ? 'task-category-error' : undefined}
        >
          <option value="">— выберите —</option>
          {categories.map(category => (
            <option key={category.id} value={String(category.id)}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p id="task-category-error" className="error" role="alert">{errors.categoryId}</p>
        )}

        <div className="actions">
          <button type="submit">{isEditing ? 'Сохранить' : 'Добавить'}</button>
          {isEditing && (
            <button type="button" onClick={handleCancel}>Отмена</button>
          )}
        </div>
      </form>

      {message && <p role="status">{message}</p>}
    </section>
  );
}