// Изчаква цялото съдържание на страницата да бъде заредено
// преди изпълнението на кода
document.addEventListener("DOMContentLoaded", () => {
  // Взема елемента на модала по неговото ID
  const modal = document.getElementById("category-modal");

  // Взема бутона за отваряне на модала по неговото ID
  const openModalButton = document.getElementById("start-game-button");

  // Взема бутона за затваряне на модала по неговото ID
  const closeModalButton = document.getElementById("close-modal-button");

  // Взема основния елемент на страницата <body>
  const body = document.body;

  // Добавя слушател за събитие "click" върху бутона за отваряне на модала
  openModalButton.addEventListener("click", () => {
    // Премахва класа "hidden" от модала, за да го покаже
    modal.classList.remove("hidden");
  });

  // Добавя слушател за събитие "click" върху бутона за затваряне на модала
  closeModalButton.addEventListener("click", () => {
    // Добавя класа "hidden" на модала, за да го скрие
    modal.classList.add("hidden");
  });

  // Добавя слушател за събитие "click" върху самия модал
  modal.addEventListener("click", (e) => {
    // Проверява дали кликнатата цел е самият модал (а не съдържанието му)
    if (e.target === modal) {
      // Добавя класа "hidden" на модала, за да го скрие
      modal.classList.add("hidden");
    }
  });
});