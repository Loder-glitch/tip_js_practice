// Все фильтры объединяются через И. Исходный массив не изменяется.
export function selectTasks(tasks, filters) {
  const { completed = null, priority = null, categoryId = null, q = '' } = filters || {};
  const needle = typeof q === 'string' ? q.toLocaleLowerCase('ru-RU') : '';

  return tasks.filter(task => {
    if (completed !== null && task.completed !== completed) return false;
    if (priority !== null && task.priority !== priority) return false;
    if (categoryId !== null && task.categoryId !== categoryId) return false;
    if (needle && !task.title.toLocaleLowerCase('ru-RU').includes(needle)) return false;
    return true;
  });
}

// Поиск по полю id, не по индексу. Возвращает задачу или null.
export function findTask(tasks, id) {
  return tasks.find(task => task.id === id) ?? null;
}