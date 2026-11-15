const PRIORITIES = ['low', 'medium', 'high'];

export function validateTaskDraft(draft, categories) {
  const errors = {};

  const rawTitle = draft?.title;
  let title = '';
  if (typeof rawTitle !== 'string') {
    errors.title = 'Название должно быть строкой';
  } else {
    title = rawTitle.trim();
    if (title.length === 0) {
      errors.title = 'Название не может быть пустым';
    } else if (title.length > 100) {
      errors.title = 'Название не должно превышать 100 символов';
    }
  }

  const priority = draft?.priority;
  if (!PRIORITIES.includes(priority)) {
    errors.priority = 'Недопустимый приоритет';
  }

  const rawCat = draft?.categoryId;
  let categoryId = NaN;
  if (typeof rawCat === 'number') {
    categoryId = rawCat;
  } else if (typeof rawCat === 'string' && /^\d+$/.test(rawCat)) {
    categoryId = Number(rawCat);
  }

  const categoryExists =
    Number.isInteger(categoryId) &&
    Array.isArray(categories) &&
    categories.some(c => c.id === categoryId);

  if (!categoryExists) {
    errors.categoryId = 'Выберите существующую категорию';
  }

  const valid = Object.keys(errors).length === 0;
  return {
    valid,
    value: valid ? { title, priority, categoryId } : {},
    errors,
  };
}

export function selectTasks(tasks, filters) {
  const { q = '', completed = '', priority = '', categoryId = '' } = filters || {};
  const needle = typeof q === 'string' ? q.trim().toLowerCase() : '';

  return tasks.filter(task => {
    if (needle && !task.title.toLowerCase().includes(needle)) return false;

    if (completed === 'true' && task.completed !== true) return false;
    if (completed === 'false' && task.completed !== false) return false;

    if (priority && task.priority !== priority) return false;

    if (categoryId && String(task.categoryId) !== String(categoryId)) return false;

    return true;
  });
}

export function getTaskStats(tasks) {
  const total = tasks.length;
  const completed = tasks.reduce((acc, t) => acc + (t.completed ? 1 : 0), 0);
  return { total, completed, active: total - completed };
}

export function addTask(tasks, value, id) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('id должен быть положительным целым числом');
  }
  if (tasks.some(t => t.id === id)) {
    throw new Error(`id ${id} уже занят`);
  }
  const next = {
    id,
    title: value.title,
    completed: false,
    priority: value.priority,
    categoryId: value.categoryId,
  };
  return [...tasks, next];
}

export function updateTask(tasks, id, value) {
  let changed = false;
  const next = tasks.map(task => {
    if (task.id !== id) return task;
    changed = true;
    return {
      ...task,
      title: value.title,
      priority: value.priority,
      categoryId: value.categoryId,
    };
  });
  return changed ? next : tasks;
}

export function toggleTask(tasks, id) {
  let changed = false;
  const next = tasks.map(task => {
    if (task.id !== id) return task;
    changed = true;
    return { ...task, completed: !task.completed };
  });
  return changed ? next : tasks;
}

export function removeTask(tasks, id) {
  const next = tasks.filter(task => task.id !== id);
  return next.length === tasks.length ? tasks : next;
}