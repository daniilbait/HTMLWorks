// Функция для инициализации мобильного меню
function initMobileMenu() {
  // Создаем оверлей
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  document.body.appendChild(overlay);

  // Получаем элементы
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const mainNav = document.querySelector(".main-nav");

  // Обработчик для гамбургера
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", function () {
      mainNav.classList.toggle("active");
      overlay.classList.toggle("active");
      document.body.classList.toggle("no-scroll");
    });
  }

  // Обработчик для оверлея
  overlay.addEventListener("click", function () {
    mainNav.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("no-scroll");
  });

  // Обработчик для выпадающих меню
  document.querySelectorAll(".nav-item.dropdown .nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const dropdown = this.closest(".dropdown");
      dropdown.classList.toggle("active");
    });
  });

  // Обработчик для обычных ссылок в меню
  document
    .querySelectorAll(".nav-link:not(.dropdown .nav-link), .dropdown-link")
    .forEach((link) => {
      link.addEventListener("click", function () {
        mainNav.classList.remove("active");
        overlay.classList.remove("active");
        document.body.classList.remove("no-scroll");
      });
    });
}

// Функция для инициализации десктопного меню
function initDesktopMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("active");
    });
  }

  // Закрытие меню при клике на ссылку
  document.querySelectorAll(".nav a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("active");
    });
  });
}

// Основная функция инициализации
document.addEventListener("DOMContentLoaded", function () {
  // Проверяем ширину экрана
  const isMobile = window.innerWidth <= 768;

  // Инициализируем соответствующее меню
  if (isMobile) {
    initMobileMenu();
  } else {
    initDesktopMenu();
  }

  // Обработчик изменения размера окна
  window.addEventListener("resize", function () {
    const currentIsMobile = window.innerWidth <= 768;

    // Переключаем меню при изменении размера
    if (currentIsMobile !== isMobile) {
      location.reload(); // или можно сделать более сложную логику переключения
    }
  });
});

// Простой аккордеон для FAQ
document.querySelectorAll(".faq-question").forEach((question) => {
  question.addEventListener("click", () => {
    const item = question.parentElement;
    item.classList.toggle("active");
  });
});
