export default function TaskStats({ stats }) {
  return (
    <section aria-label="Статистика по задачам">
      <h2>Статистика</h2>
      <ul>
        <li>Всего: {stats.total}</li>
        <li>Выполнено: {stats.completed}</li>
        <li>В работе: {stats.active}</li>
      </ul>
    </section>
  );
}