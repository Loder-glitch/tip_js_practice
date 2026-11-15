import { Router } from 'express';
import { ApiError } from './errors.js';
import { parseFilters, parsePositiveId } from './validation.js';

export function createRouter(store) {
  const router = Router({ caseSensitive: true });

  router.get('/health', (req, res) => {
    res.status(200).json({ data: { status: 'ok' } });
  });

  router.get('/categories', (req, res) => {
    const data = store.listCategories();
    res.status(200).json({ data, meta: { total: data.length } });
  });

  router.get('/tasks', (req, res) => {
    const url = new URL(req.originalUrl, 'http://localhost');
    const filters = parseFilters(url.searchParams);
    const data = store.listTasks(filters);
    res.status(200).json({
      data,
      meta: { total: data.length, filters },
    });
  });

  router.get('/tasks/:id', (req, res) => {
    const id = parsePositiveId(req.params.id);
    if (id === null) {
      throw new ApiError(400, 'INVALID_ID', 'Некорректный идентификатор задачи.');
    }
    const task = store.getTask(id);
    if (task === null) {
      throw new ApiError(404, 'TASK_NOT_FOUND', 'Задача не найдена.', { id });
    }
    res.status(200).json({ data: task });
  });

  // 405 для известных путей — после GET, до 404 в app.js.
  const allow = 'GET, HEAD, OPTIONS';
  const deny = (req, res, next) => {
    res.set('Allow', allow);
    next(new ApiError(405, 'METHOD_NOT_ALLOWED', 'Метод не поддерживается.'));
  };
  router.all('/health', deny);
  router.all('/categories', deny);
  router.all('/tasks', deny);
  router.all('/tasks/:id', deny);

  return router;
}