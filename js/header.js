document.addEventListener("DOMContentLoaded", function () {
  // Создаем оверлей
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  document.body.appendChild(overlay);

  // Получаем элементы
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const mainNav = document.querySelector(".main-nav");

  // Обработчик для гамбургера
  mobileMenuToggle.addEventListener("click", function () {
    mainNav.classList.toggle("active");
    overlay.classList.toggle("active");
  });

  // Обработчик для оверлея
  overlay.addEventListener("click", function () {
    mainNav.classList.remove("active");
    overlay.classList.remove("active");
  });

  // Обработчик для выпадающих меню
  document.querySelectorAll(".nav-item.dropdown .nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const dropdown = this.closest(".dropdown");
      const menu = dropdown.querySelector(".dropdown-menu");
      const arrow = dropdown.querySelector(".dropdown-arrow");
      menu.classList.toggle("active");
      arrow.classList.toggle("rotated");
    });
  });

  // Обработчик для обычных ссылок в меню
  document
    .querySelectorAll(".nav-link:not(.dropdown .nav-link), .dropdown-link")
    .forEach((link) => {
      link.addEventListener("click", function () {
        mainNav.classList.remove("active");
        overlay.classList.remove("active");
      });
    });
});
