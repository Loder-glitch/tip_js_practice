# Практическая работа № 9 — отчёт

**Тема:** Создание собственного HTTP API

- ФИО: Хажикаров Темир
- Группа: ЭФБО-15-25
- Вариант: 3
- Node.js / npm: 24.x / 11.x
- Коммит: `Add pr9`

## Цель и результат

Цель — освоить приём HTTP-запроса, выбор обработчика, проверку параметров и формирование ответа.

Реализовано: `GET /api/health`, `/categories`, `/tasks` (фильтры AND), `/tasks/:id`; `HEAD`, `OPTIONS`, `405`, `404`, единый формат ошибок. Данные в памяти.

## Установка и запуск

```bash
npm ci
npm start
API: http://127.0.0.1:5505/api. Другой порт: npm start -- 5515. Dev: npm run dev.
Реализация
validation.js — parsePositiveId, parseFilters;
task-service.js — selectTasks, findTask;
store.js — копии данных, listTasks(filters) сам фильтрует;
routes.js — HTTP-связь, 405 после GET;
app.js — CORS, OPTIONS, Router, 404, errorHandler;
server.js — порт и запуск.

Нормализация false — через raw === 'false'. Дубликаты query — searchParams.keys() + Set. id — /^[1-9]\d*$/ + Number.isSafeInteger. Порядок: OPTIONS → GET → 405 → 404 → errorHandler.
Контракт
Маршрут	Успех
GET /api/health	200, {data:{status:"ok"}}
GET /api/categories	200, {data, meta:{total}}
GET /api/tasks	200, {data, meta:{total, filters}}
GET /api/tasks/:id	200, {data: task}

Ошибки: INVALID_QUERY (400), INVALID_ID (400), TASK_NOT_FOUND (404), ROUTE_NOT_FOUND (404), METHOD_NOT_ALLOWED (405 + Allow: GET, HEAD, OPTIONS).

meta.total — размер выборки. Запись и интеграция с клиентом — ПР10.
Индивидуальный вариант
Запрос	Ожидаемо	Факт
GET /api/tasks?priority=high	200, id 4, 13, 16, 25, 34; total:5	Совпало
GET /api/tasks?priority=urgent	400 INVALID_QUERY	Совпало
GET /api/tasks/13	200, задача id 13	Совпало
GET /api/tasks/999	404 TASK_NOT_FOUND	Совпало
Автоматические проверки
Набор	Успешно	Неуспешно
check:unit	38	0
check:api	52	0
npm test	90	0
Ручной протокол
№	Сценарий	Факт
1	GET /health	200, ok
2	GET /categories	200, 3 категории
3	GET /tasks	200, 12 задач
4	?priority=high	200, 5 задач
5	?q=not-found-xyz	200, []
6	GET /tasks/4	200
7	/tasks/999, /tasks/4abc	404, 400
8	?q=a&q=b	400
9	POST /tasks	405, Allow
10	GET /missing	404 ROUTE_NOT_FOUND
11	HEAD /tasks	200, без тела
12	OPTIONS /tasks	204
13	Перезапуск	Снова 12 задач

Клиент ПР8 не проверялся (ПР10).
Исправленный дефект

?priority=high возвращал 12 задач. Причина: selectTasks(store.listTasks(), filters) — store.listTasks(filters) уже фильтрует, второй вызов с undefined возвращал всё. Исправлено на store.listTasks(filters). Проверка: npm test → 90/0.


## Контрольные вопросы
Node.js vs браузер: нет DOM/window; есть process, файловая система, node:test.
Что определяет маршрут: метод + путь; query — не часть маршрута.
req.params vs query: параметры пути (/tasks/:id) vs ?a=1.
'false': Boolean('false') === true; нужно явное сравнение.
id: регулярка на всю строку + Number.isSafeInteger (parseInt('4abc') = 4).
200 vs 404: пустой список — валидный результат; /tasks/:id без ресурса — 404.
TASK_NOT_FOUND vs ROUTE_NOT_FOUND: ресурс отсутствует vs маршрута нет.
405 и Allow: маршрут есть, метод нет; Allow перечисляет допустимые.
meta.total: размер выборки, не хранилища.
Порядок middleware: неправильный порядок ломает ответы.
4 параметра errorHandler: Express по арности узнаёт обработчик ошибок.
createApp() отдельно: тесты открывают/закрывают сервер на свободном порту.
При 500: только {code, message}, без стека.
CORS: правило доступа браузерного JS, не авторизация.
ПР10: добавятся POST/PATCH/DELETE, проверка полей и категории при записи, клиент ПР8 — на запись.

## Вывод

Реализован Express-сервер чтения с фильтрами и единым форматом ошибок. Освоены проверка query и id, 400/404/405, HEAD, OPTIONS, Allow. Пройдено 90 проверок, ручной протокол и вариант 3 совпали. Исправлена двойная фильтрация в routes.js. Ограничение — запись и интеграция с клиентом в ПР10.
text
 