// Изчаква цялото съдържание на страницата да бъде заредено
// преди изпълнението на кода
document.addEventListener("DOMContentLoaded", () => {
  // Взема елемента за показване на резултата по неговото ID
  const resultContainer = document.getElementById("result-score");

  // Взема бутона за рестартиране на теста по неговото ID
  const restartButton = document.getElementById("restart-quiz");

  // Извлича резултатите от теста, записани в localStorage
  const results = JSON.parse(localStorage.getItem("quizResults"));

  // Проверява дали има налични резултати в localStorage
  if (results) {
    // Показва резултатите в контейнера
    resultContainer.textContent = `You got ${results.correctAnswers} out of ${results.totalQuestions} correct!`;
  } else {
    // Ако няма резултати, показва съобщение
    resultContainer.textContent = "No results to display.";
  }

  // Добавя слушател за събитие "click" върху бутона за рестартиране
  restartButton.addEventListener("click", () => {
    // Премахва резултатите от localStorage
    localStorage.removeItem("quizResults");

    // Пренасочва потребителя към началната страница
    window.location.href = "index.html";
  });
});