import { ApiError } from './errors.js';

const ALLOWED_QUERY = new Set(['completed', 'priority', 'categoryId', 'q']);
const ALLOWED_PRIORITY = new Set(['low', 'medium', 'high']);
const MAX_Q_LENGTH = 100;

// raw: строка; результат: безопасное положительное целое либо null.
export function parsePositiveId(raw) {
  if (typeof raw !== 'string') return null;
  if (!/^[1-9]\d*$/.test(raw)) return null;
  const value = Number(raw);
  return Number.isSafeInteger(value) ? value : null;
}

// URLSearchParams -> { completed, priority, categoryId, q }.
// Ошибка: ApiError(400, 'INVALID_QUERY', ...).
export function parseFilters(searchParams) {
  // 1. Разрешённые имена (без повторов).
  const seen = new Set();
  for (const name of searchParams.keys()) {
    if (!ALLOWED_QUERY.has(name)) {
      throw new ApiError(400, 'INVALID_QUERY', `Неизвестный параметр: ${name}.`);
    }
    if (seen.has(name)) {
      throw new ApiError(400, 'INVALID_QUERY', `Повторяющийся параметр: ${name}.`);
    }
    seen.add(name);
  }

  // 2. Значения.
  const result = { completed: null, priority: null, categoryId: null, q: '' };

  if (searchParams.has('completed')) {
    const raw = searchParams.get('completed');
    if (raw === 'true') result.completed = true;
    else if (raw === 'false') result.completed = false;
    else throw new ApiError(400, 'INVALID_QUERY', 'Некорректный статус.');
  }

  if (searchParams.has('priority')) {
    const raw = searchParams.get('priority');
    if (!ALLOWED_PRIORITY.has(raw)) {
      throw new ApiError(400, 'INVALID_QUERY', 'Некорректный приоритет.');
    }
    result.priority = raw;
  }

  if (searchParams.has('categoryId')) {
    const raw = searchParams.get('categoryId');
    const id = parsePositiveId(raw);
    if (id === null) {
      throw new ApiError(400, 'INVALID_QUERY', 'Некорректный идентификатор категории.');
    }
    result.categoryId = id;
  }

  if (searchParams.has('q')) {
    const raw = searchParams.get('q');
    const trimmed = raw.trim();
    if (trimmed.length > MAX_Q_LENGTH) {
      throw new ApiError(400, 'INVALID_QUERY', 'Слишком длинный поисковый запрос.');
    }
    result.q = trimmed;
  }

  return result;
}