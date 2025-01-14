// Изчаква цялото съдържание на страницата да бъде заредено
// преди изпълнението на кода
window.addEventListener("DOMContentLoaded", () => {
  // Обект, който ще съдържа отговорите на потребителя
  // Шаблона на обекта е следния:
  // { questionIndex: { selected: "Отговор", correct: "Верен отговор" } }
  let answers = {};

  // Функция, която връща стойността на заявения параметър от URL адреса
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  // Обект, който съдържа съответствие между категориите на въпросите и техните ID-та
  // ID-тата са взети от API-то за въпроси
  // и са нужни за извличане на въпросите от съответната категория
  const categoryMap = {
    GeneralKnowledge: 9,
    Mythology: 20,
    Sports: 21,
    Geography: 22,
    History: 23,
    Politics: 24,
    Art: 25,
    Celebrities: 26,
    Animals: 27,
  };

  // С функцията getQueryParam се взима стойността на параметъра selectedCategory
  const selectedCategory = getQueryParam("selectedCategory");

  // Ако стойността на selectedCategory не е валидна или липсва
  // се изписва съобщение за грешка в кознолата и се прекратява изпълнението на кода
  if (!selectedCategory || !categoryMap[selectedCategory]) {
    console.error("Invalid or missing category");
    return;
  }

  // Селектира се елементът с ID quiz-category
  const categoryElement = document.getElementById("quiz-category");
  // Задава се текста на елемента да бъде равен на стойността на selectedCategory
  categoryElement.textContent = selectedCategory;

  // Взима се ID-то на категорията от обекта categoryMap
  const categoryId = categoryMap[selectedCategory];

  // Създава се URL адреса на API-то, от което ще се вземат въпросите
  const apiUrl = `https://opentdb.com/api.php?amount=10&category=${categoryId}&difficulty=easy&type=multiple`;

  // Селектират се елементите, които ще съдържат въпросите и отговорите
  // както и бутоните за преминаване към следващия и предишния въпрос
  const questionElement = document.getElementById("quiz-question");
  const optionsElement = document.getElementById("quiz-options");
  const prevButton = document.getElementById("prev-question");
  const nextButton = document.getElementById("next-question");

  // Задава се начален индекс на въпроса
  let currentQuestionIndex = 0;
  // Масив, който ще съдържа въпросите
  let quizData = [];

  // Извиква се API-то и се взимат въпросите
  // След като въпросите са заредени, се извиква функцията renderQuestion
  // При грешка при извикването на API-то се изписва съобщение за грешка в конзолата
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      quizData = data.results;
      console.log("Quiz data loaded:", quizData);
      renderQuestion();
    })
    .catch((error) => console.error("Failed to load quiz data:", error));

  // Функция, която се използва за показване на въпросите
  function renderQuestion() {
    // Ако няма въпроси, се прекратява изпълнението на функцията
    if (quizData.length === 0) return;

    // Взима се текущия въпрос от масива с въпроси
    const currentQuestion = quizData[currentQuestionIndex];

    // Задава се текста на елемента за въпроса да бъде равен на текста на текущия въпрос
    questionElement.textContent = decodeHTML(
      currentQuestionIndex + 1 + ". " + currentQuestion.question
    );
    // Изчиства се съдържанието на елемента за отговорите
    optionsElement.innerHTML = "";

    // Създава се масив, който съдържа всички отговори на текущия въпрос
    // и се сортират по случаен начин
    const allAnswers = [
      ...currentQuestion.incorrect_answers,
      currentQuestion.correct_answer,
    ].sort(() => Math.random() - 0.5);

    // Обхожда се масива с отговорите
    allAnswers.forEach((answer) => {
      // Създава се нов елемент от тип li
      const li = document.createElement("li");
      // Задава се текста на елемента да бъде равен на текста на отговора
      // чрез извикване на функцията decodeHTML
      li.textContent = decodeHTML(answer);
      // Задава се клас на елемента за стилизиране
      li.classList.add("quiz-option");
      // Добавя се събитие при кликване на елемента
      li.addEventListener("click", () => {
        // Премахват се класовете 'selected' от всички опции, за да се изчисти предишния избор
        document
          .querySelectorAll(".quiz-option")
          .forEach((option) => option.classList.remove("selected"));

        // Добавя се клас 'selected' на текущия избран елемент
        li.classList.add("selected");

        // Записва се информацията за избрания отговор и правилния отговор в обекта answers
        answers[currentQuestionIndex] = {
          selected: answer, // Текущо избран отговор
          correct: currentQuestion.correct_answer, // Правилен отговор
        };
      });
      // Добавя се текущият елемент li като дете на контейнера за опциите
      optionsElement.appendChild(li);
    });

    // Деактивира бутона за предишен въпрос, ако текущият въпрос е първият
    prevButton.disabled = currentQuestionIndex === 0;

    // Проверява дали текущият въпрос не е последният в масива с въпроси
    if (currentQuestionIndex < quizData.length - 1) {
      // Ако не е последният, задава текста на бутона за следващ въпрос да бъде "Next"
      nextButton.textContent = "Next";
    } else {
      // Ако е последният въпрос, променя текста на бутона на "Finish"
      nextButton.textContent = "Finish";
    }
  }

  // Функция за декодиране на HTML ентити
  function decodeHTML(html) {
    // Създава се нов елемент от тип textarea
    const txt = document.createElement("textarea");
    // Задава се HTML съдържанието на елемента да бъде равно на подадения текст
    txt.innerHTML = html;
    // Връща декодирания текст от стойността на textarea
    return txt.value;
  }

  // Добавя събитие за кликване на бутона за предишен въпрос
  prevButton.addEventListener("click", () => {
    // Проверява дали текущият въпрос не е първият
    if (currentQuestionIndex > 0) {
      // Намалява индекса на текущия въпрос с 1
      currentQuestionIndex--;
      // Извиква функцията renderQuestion за показване на предишния въпрос
      renderQuestion();
    }
  });

  // Добавя събитие за кликване на бутона за следващ въпрос
  nextButton.addEventListener("click", () => {
    // Проверява дали текущият въпрос не е последният в теста
    if (currentQuestionIndex < quizData.length - 1) {
      // Увеличава индекса на текущия въпрос с 1
      currentQuestionIndex++;
      // Извиква функцията renderQuestion за показване на следващия въпрос
      renderQuestion();
    } else {
      // Изчислява броя на правилно отговорените въпроси
      const correctAnswers = Object.values(answers).filter(
        (answer) => answer.selected === answer.correct
      ).length;

      // Общо брой въпроси в теста
      const totalQuestions = quizData.length;

      // Записва резултатите в localStorage
      // за да могат да бъдат използвани на страницата с резултатите
      localStorage.setItem(
        "quizResults",
        JSON.stringify({ correctAnswers, totalQuestions })
      );

      // Пренасочва потребителя към страницата с резултатите
      window.location.href = "result.html";
    }
  });
});
