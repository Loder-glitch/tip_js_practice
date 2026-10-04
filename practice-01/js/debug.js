"use strict";

const plannedText = "8";
const completedText = "3";
const additionalText = "2";

// ОШИБКА 1 была: "3" + "2" = "32" (конкатенация)
// ИСПРАВЛЕНО: явное приведение к числу
const completedTotal = Number(completedText) + Number(additionalText);
const remainingTasks = Number(plannedText) - completedTotal;

console.log("Выполнено:", completedTotal);
console.log("Осталось:", remainingTasks);

let controlSum = 0;

// ОШИБКА 2 была: taskNumber < 4 (не включало 4)
// ИСПРАВЛЕНО: taskNumber <= 4
for (let taskNumber = 1; taskNumber <= 4; taskNumber += 1) {
  controlSum += taskNumber;
}

console.log("Контрольная сумма:", controlSum);