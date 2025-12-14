// support-form.js
(function () {
  console.log("Форма поддержки загружается...");

  // Конфигурация
  const CONFIG = {
    STORAGE_KEY: "supportFormData",
    FORM_ENDPOINT: "https://formcarry.com/s/vaL5ZkR9U6F",
    DEBOUNCE_DELAY: 500,
    NOTIFICATION_TIMEOUT: 5000,
  };

  // Элементы формы
  const elements = {
    form: document.getElementById("support-form"),
    notification: document.getElementById("form-notification"),
    charCount: document.getElementById("char-count"),
    fields: {
      fullname: document.getElementById("fullname"),
      email: document.getElementById("email"),
      phone: document.getElementById("phone"),
      organization: document.getElementById("organization"),
      message: document.getElementById("message"),
      agreement: document.getElementById("agreement"),
    },
    errors: {
      fullname: document.getElementById("fullname-error"),
      email: document.getElementById("email-error"),
      phone: document.getElementById("phone-error"),
      organization: document.getElementById("organization-error"),
      message: document.getElementById("message-error"),
      agreement: document.getElementById("agreement-error"),
    },
  };

  let saveTimeout;
  let isSubmitting = false;

  // Инициализация
  function init() {
    console.log("Инициализация формы...");

    // Проверяем элементы
    if (!elements.form) {
      console.error("Форма не найдена!");
      return;
    }

    // Восстанавливаем сохраненные данные
    restoreFormData();

    // Настраиваем обработчики
    setupEventListeners();

    // Инициализируем счетчик символов
    updateCharCount();

    console.log("Форма готова к работе");
  }

  // Настройка обработчиков событий
  function setupEventListeners() {
    // Отправка формы
    elements.form.addEventListener("submit", handleSubmit);

    // Сохранение данных
    Object.values(elements.fields).forEach((field) => {
      if (field.type === "checkbox") {
        field.addEventListener("change", () => saveFormDataDebounced());
      } else {
        field.addEventListener("input", () => {
          saveFormDataDebounced();
          if (field.id === "message") updateCharCount();
        });
      }

      // Валидация при потере фокуса
      field.addEventListener("blur", () => validateField(field));

      // Сброс ошибок при фокусе
      field.addEventListener("focus", () => clearError(field.id));
    });

    // Валидация при изменении
    elements.fields.message.addEventListener("input", updateCharCount);
  }

  // Обновление счетчика символов
  function updateCharCount() {
    if (elements.charCount && elements.fields.message) {
      const count = elements.fields.message.value.length;
      elements.charCount.textContent = count;

      // Меняем цвет при приближении к лимиту
      if (count > 450) {
        elements.charCount.style.color = "#e74c3c";
      } else if (count > 400) {
        elements.charCount.style.color = "#f39c12";
      } else {
        elements.charCount.style.color = "#7f8c8d";
      }
    }
  }

  // Валидация поля
  function validateField(field) {
    if (!field.checkValidity()) {
      showError(field.id, getValidationMessage(field));
      return false;
    }
    clearError(field.id);
    return true;
  }

  // Получение сообщения об ошибке
  function getValidationMessage(field) {
    if (field.validity.valueMissing) {
      return "Это поле обязательно для заполнения";
    }

    if (field.validity.typeMismatch) {
      if (field.type === "email") return "Введите корректный email адрес";
      if (field.type === "tel") return "Введите корректный номер телефона";
    }

    if (field.validity.patternMismatch) {
      return field.title || "Неверный формат данных";
    }

    if (field.validity.tooShort) {
      return `Минимальная длина: ${field.minLength} символов`;
    }

    if (field.validity.tooLong) {
      return `Максимальная длина: ${field.maxLength} символов`;
    }

    return "Неверное значение";
  }

  // Показ ошибки
  function showError(fieldId, message) {
    const errorElement = elements.errors[fieldId];
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add("show");

      // Анимация поля
      const field = elements.fields[fieldId];
      if (field) {
        field.classList.add("shake");
        setTimeout(() => field.classList.remove("shake"), 500);
      }
    }
  }

  // Очистка ошибки
  function clearError(fieldId) {
    const errorElement = elements.errors[fieldId];
    if (errorElement) {
      errorElement.textContent = "";
      errorElement.classList.remove("show");
    }
  }

  // Валидация всей формы
  function validateForm() {
    let isValid = true;

    Object.keys(elements.fields).forEach((fieldId) => {
      if (!validateField(elements.fields[fieldId])) {
        isValid = false;
      }
    });

    return isValid;
  }

  // Сохранение данных с задержкой
  function saveFormDataDebounced() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveFormData, CONFIG.DEBOUNCE_DELAY);
  }

  // Сохранение данных в localStorage
  function saveFormData() {
    try {
      const formData = {};
      Object.keys(elements.fields).forEach((key) => {
        const field = elements.fields[key];
        formData[key] = field.type === "checkbox" ? field.checked : field.value;
      });

      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(formData));
      console.log("Данные формы сохранены");
    } catch (error) {
      console.error("Ошибка при сохранении данных:", error);
    }
  }

  // Восстановление данных из localStorage
  function restoreFormData() {
    try {
      const savedData = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (savedData) {
        const formData = JSON.parse(savedData);

        Object.keys(formData).forEach((key) => {
          if (elements.fields[key]) {
            if (elements.fields[key].type === "checkbox") {
              elements.fields[key].checked = formData[key];
            } else {
              elements.fields[key].value = formData[key];
            }
          }
        });

        console.log("Данные формы восстановлены");
        updateCharCount();
      }
    } catch (error) {
      console.error("Ошибка при восстановлении данных:", error);
      localStorage.removeItem(CONFIG.STORAGE_KEY);
    }
  }

  // Очистка сохраненных данных
  function clearFormData() {
    localStorage.removeItem(CONFIG.STORAGE_KEY);
    console.log("Данные формы очищены");
  }

  // Обработка отправки формы
  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) {
      console.log("Форма уже отправляется...");
      return;
    }

    // Валидация
    if (!validateForm()) {
      showNotification("Пожалуйста, исправьте ошибки в форме", "error");
      return;
    }

    // Блокируем повторную отправку
    isSubmitting = true;
    const submitBtn = elements.form.querySelector(".submit-btn");
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> ОТПРАВЛЯЕТСЯ...';

    try {
      // Подготавливаем данные
      const formData = new FormData(elements.form);

      // Логирование для отладки
      console.log("Отправляемые данные:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      // Отправка на Formcarry
      const response = await fetch(CONFIG.FORM_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      console.log("Статус ответа:", response.status);

      if (response.ok) {
        // Успех
        showNotification(
          "Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.",
          "success"
        );

        // Очищаем форму
        elements.form.reset();
        clearFormData();
        updateCharCount();

        // Сбрасываем ошибки
        Object.keys(elements.errors).forEach((key) => clearError(key));
      } else {
        // Ошибка сервера
        const responseText = await response.text();
        console.error("Ошибка сервера:", responseText);
        throw new Error(`Ошибка сервера: ${response.status}`);
      }
    } catch (error) {
      // Ошибка сети или сервера
      console.error("Ошибка при отправке формы:", error);
      showNotification(
        "Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз или свяжитесь с нами по телефону.",
        "error"
      );
    } finally {
      // Разблокируем форму
      isSubmitting = false;
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  }

  // Показ уведомления
  function showNotification(message, type = "info") {
    if (!elements.notification) return;

    elements.notification.textContent = message;
    elements.notification.className = `notification ${type}`;
    elements.notification.classList.add("show");

    // Автоматическое скрытие
    setTimeout(() => {
      elements.notification.classList.remove("show");
    }, CONFIG.NOTIFICATION_TIMEOUT);
  }

  // Запуск при загрузке DOM
  document.addEventListener("DOMContentLoaded", init);

  // Экспорт для отладки
  window.supportForm = {
    saveFormData,
    restoreFormData,
    clearFormData,
    validateForm,
    showNotification,
  };

  console.log("Модуль формы поддержки загружен");
})();
