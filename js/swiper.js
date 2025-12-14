// swiper.js
(function () {
  let swiperInstance = null;
  let isInitialized = false;

  function initSwiperSlider() {
    // Защита от повторной инициализации
    if (isInitialized) {
      console.log("Swiper уже инициализирован");
      return;
    }

    const reviewsSlider = document.querySelector(".reviews-slider");

    if (!reviewsSlider) {
      console.error("Слайдер .reviews-slider не найден в DOM");
      return;
    }

    if (typeof Swiper === "undefined") {
      console.error("Библиотека Swiper не загружена");
      return;
    }

    // Уничтожаем старый экземпляр, если есть
    if (reviewsSlider.swiper) {
      console.log("Уничтожаем старый Swiper...");
      reviewsSlider.swiper.destroy(true, true);
      delete reviewsSlider.swiper;
    }

    console.log("Инициализация Swiper...");

    try {
      // Инициализируем Swiper
      swiperInstance = new Swiper(reviewsSlider, {
        slidesPerView: 1,
        spaceBetween: 20,

        breakpoints: {
          768: {
            slidesPerView: 3,
            spaceBetween: 30,
            slidesPerGroup: 1, // Изменено с 3 на 1
          },
        },

        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },

        pagination: false,
        autoplay: false,
        speed: 500,
        slidesPerGroup: 1,
        touchRatio: 1,
        touchAngle: 45,
        grabCursor: true,
        centeredSlides: false,
        initialSlide: 0,
        loop: false,
        resizeObserver: true,
        watchOverflow: true,
        observer: true,
        observeParents: true,
        observeSlideChildren: true,

        // Ключевое изменение для 3 слайдов:
        slideToClickedSlide: false,
        allowTouchMove: true,
      });

      console.log("Swiper инициализирован успешно!");
      console.log("Количество слайдов:", swiperInstance.slides.length);
      console.log("Активный слайд:", swiperInstance.activeIndex);

      // Сохраняем ссылку на инстанс
      reviewsSlider.swiper = swiperInstance;
      isInitialized = true;

      // Визуальная проверка
      reviewsSlider.style.border = "2px solid #4CAF50";
      reviewsSlider.style.borderRadius = "8px";
      reviewsSlider.style.padding = "5px";
    } catch (error) {
      console.error("Ошибка инициализации Swiper:", error);
      reviewsSlider.style.border = "2px solid #f44336";
    }
  }

  // Основная инициализация
  function initialize() {
    console.log("Инициализация Swiper...");

    // Если Swiper уже загружен
    if (typeof Swiper !== "undefined") {
      initSwiperSlider();
    } else {
      // Ждем загрузки Swiper
      console.log("Ожидание загрузки Swiper...");
      const checkSwiper = setInterval(function () {
        if (typeof Swiper !== "undefined") {
          clearInterval(checkSwiper);
          initSwiperSlider();
        }
      }, 100);

      // Таймаут на случай проблем
      setTimeout(function () {
        if (!isInitialized) {
          clearInterval(checkSwiper);
          console.error("Таймаут загрузки Swiper");
        }
      }, 5000);
    }
  }

  // Запускаем когда DOM готов и Swiper загружен
  document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM загружен");
    initialize();
  });

  // Дополнительная проверка при полной загрузке
  window.addEventListener("load", function () {
    console.log("Страница полностью загружена");
    // Если еще не инициализирован, пробуем снова
    if (!isInitialized) {
      console.log("Повторная попытка инициализации...");
      initialize();
    }
  });

  // Переинициализация при изменении размера окна
  window.addEventListener("resize", function () {
    if (swiperInstance) {
      setTimeout(() => {
        swiperInstance.update();
      }, 300);
    }
  });

  // Экспорт для отладки
  window.debugSwiper = {
    getInstance: function () {
      return swiperInstance;
    },
    reinit: function () {
      isInitialized = false;
      initSwiperSlider();
    },
  };
})();
