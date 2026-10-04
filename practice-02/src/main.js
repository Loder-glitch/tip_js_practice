"use strict";

import { demoTasks, variantTasks, variantNumber } from "./data.js";
import {
  createTask, findTaskById, getPendingTasks, getTaskTitles, getTaskStats,
  addTask, setTaskCompleted, renameTask, removeTask,
} from "./task-service.js";



function printStats(tasks, label) {
  const { total, completed, pending, progress } = getTaskStats(tasks);
  console.log(`\n${label}`);
  console.log(`Всего: ${total}; выполнено: ${completed}; осталось: ${pending}`);
  if (total === 0) {
    console.log("Задач пока нет");
  } else {
    console.log(`Прогресс: ${progress.toFixed(1)}%`);
  }
}

function printTasks(tasks, label) {
  console.log(`\n${label}`);
  for (const task of tasks) {
    const mark = task.completed ? "[x]" : "[ ]";
    console.log(`${mark} id ${task.id} — ${task.title} (${task.priority})`);
  }
}



console.log("=== Общий демонстрационный сценарий ===");

let currentTasks = demoTasks;

printTasks(currentTasks, "Исходные задачи:");
console.log(`Названия: ${getTaskTitles(currentTasks).join(", ")}`);
console.log(`Невыполненные id: [${getPendingTasks(currentTasks).map((t) => t.id).join(", ")}]`);
printStats(currentTasks, "Исходная сводка:");

const added = addTask(currentTasks, 20, "Добавить проверку", "high");
if (added.ok) {
  currentTasks = added.tasks;
  console.log("\nДобавлена задача id 20");
} else {
  console.error(`Ошибка: ${added.error}`);
}
printStats(currentTasks, "После добавления id 20:");

const completedResult = setTaskCompleted(currentTasks, 4, true);
if (completedResult.ok) {
  currentTasks = completedResult.tasks;
  console.log("\nЗадача id 4 выполнена");
} else {
  console.error(`Ошибка: ${completedResult.error}`);
}
printStats(currentTasks, "После выполнения id 4:");

const renamed = renameTask(currentTasks, 10, "Подготовить инструкцию запуска");
if (renamed.ok) {
  currentTasks = renamed.tasks;
  console.log("\nЗадача id 10 переименована");
} else {
  console.error(`Ошибка: ${renamed.error}`);
}
printStats(currentTasks, "После переименования id 10:");

const removed = removeTask(currentTasks, 7);
if (removed.ok) {
  currentTasks = removed.tasks;
  console.log("\nЗадача id 7 удалена");
} else {
  console.error(`Ошибка: ${removed.error}`);
}
printStats(currentTasks, "После удаления id 7:");

const duplicate = addTask(currentTasks, 20, "Дубликат");
if (!duplicate.ok) {
  console.log(`\nПоказанная ошибка: ${duplicate.error}`);
  console.log("Состояние не изменено");
}
printStats(currentTasks, "После отказа:");

console.log(`\nИтоговые идентификаторы: [${currentTasks.map((t) => t.id).join(", ")}]`);

const demoIds = demoTasks.map((t) => t.id).join(", ");
console.log(`demoTasks сохранён: [${demoIds}], длина ${demoTasks.length}`);











console.log(`\n=== Индивидуальный вариант № ${variantNumber} ===`);

let variantCurrent = variantTasks;

printTasks(variantCurrent, "Исходные задачи варианта:");
printStats(variantCurrent, "Исходная сводка варианта:");

const v80 = addTask(variantCurrent, 80, "Оформить футер сайта", "low");
if (v80.ok) {
  variantCurrent = v80.tasks;
  console.log("\nДобавлена задача id 80");
} else {
  console.error(`Ошибка: ${v80.error}`);
}
printStats(variantCurrent, "После добавления id 80:");

const v11 = setTaskCompleted(variantCurrent, 11, true);
if (v11.ok) {
  variantCurrent = v11.tasks;
  console.log("\nЗадача id 11 выполнена");
} else {
  console.error(`Ошибка: ${v11.error}`);
}
printStats(variantCurrent, "После выполнения id 11:");

const v23 = renameTask(variantCurrent, 23, "Главная страница портфолио");
if (v23.ok) {
  variantCurrent = v23.tasks;
  console.log("\nЗадача id 23 переименована");
} else {
  console.error(`Ошибка: ${v23.error}`);
}
printStats(variantCurrent, "После переименования id 23:");

const v37 = removeTask(variantCurrent, 37);
if (v37.ok) {
  variantCurrent = v37.tasks;
  console.log("\nЗадача id 37 удалена");
} else {
  console.error(`Ошибка: ${v37.error}`);
}
printStats(variantCurrent, "После удаления id 37:");

const v80again = addTask(variantCurrent, 80, "Повтор");
if (!v80again.ok) {
  console.log(`\nПоказанная ошибка: ${v80again.error}`);
}

printTasks(variantCurrent, "Итоговые задачи варианта:");
printStats(variantCurrent, "Итоговая сводка варианта:");

const variantIds = variantTasks.map((t) => t.id).join(", ");
console.log(`variantTasks сохранён: [${variantIds}], длина ${variantTasks.length}`);