const memberTypeSelect = document.getElementById("memberType");
const extraDataLabel = document.getElementById("extraDataLabel");
const extraDataInput = document.getElementById("extraData");
const memberForm = document.getElementById("memberForm");
const memberNotice = document.getElementById("memberNotice");

const fieldIds = ["fullName", "memberType", "email", "telegramUser", "phone", "extraData"];

const clearFieldError = (fieldId) => {
  const field = document.getElementById(fieldId);
  if (!field) return;

  field.classList.remove("input-error");
  const errorElement = document.getElementById(`${fieldId}Error`);
  if (errorElement) {
    errorElement.remove();
  }
};

const setFieldError = (fieldId, message) => {
  const field = document.getElementById(fieldId);
  if (!field) return;

  field.classList.add("input-error");
  let errorElement = document.getElementById(`${fieldId}Error`);
  if (!errorElement) {
    errorElement = document.createElement("p");
    errorElement.id = `${fieldId}Error`;
    errorElement.className = "field-error-msg";
    field.closest(".field").appendChild(errorElement);
  }
  errorElement.textContent = message;
};

const clearMemberErrors = () => {
  fieldIds.forEach(clearFieldError);
};

const validateMemberFields = (payload) => {
  const errors = {};

  if (!payload.fullName || payload.fullName.trim().length < 4 || payload.fullName.trim().length > 80) {
    errors.fullName = "Nombre entre 4 y 80 caracteres.";
  }

  if (!payload.memberType) {
    errors.memberType = "Selecciona un tipo de miembro.";
  }

  if (!payload.email || !AppValidation || !/^[\w.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(payload.email)) {
    errors.email = "Correo electronico invalido.";
  }

  if (payload.telegramUser && !/^@?[a-zA-Z0-9_]{5,32}$/.test(payload.telegramUser)) {
    errors.telegramUser = "Telegram invalido.";
  }

  if (payload.phone && !/^\+?\d[\d\s-]{7,14}$/.test(payload.phone)) {
    errors.phone = "Telefono invalido.";
  }

  if (!payload.telegramUser && !payload.phone) {
    errors.telegramUser = "Debes ingresar al menos Telegram o telefono.";
    errors.phone = "Debes ingresar al menos Telegram o telefono.";
  }

  if (!payload.extraData || payload.extraData.trim().length < 2 || payload.extraData.trim().length > 80) {
    errors.extraData = "Dato adicional entre 2 y 80 caracteres.";
  }

  return errors;
};

const renderMemberTypes = () => {
  AppConfig.memberTypes.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    memberTypeSelect.appendChild(option);
  });
};

const updateExtraLabel = () => {
  const labelText = AppConfig.extraFieldLabels[memberTypeSelect.value] || "Dato adicional";
  extraDataLabel.textContent = `${labelText} *`;
  extraDataInput.placeholder = `Ingresa ${labelText.toLowerCase()}`;
};

const showNotice = (message, isError) => {
  memberNotice.className = isError ? "notice error" : "notice success";
  memberNotice.textContent = message;
  memberNotice.style.color = isError ? "#d1223a" : "";
  memberNotice.style.fontWeight = isError ? "700" : "";
  memberNotice.hidden = false;
};

memberTypeSelect.addEventListener("change", updateExtraLabel);

memberForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearMemberErrors();

  const payload = {
    fullName: document.getElementById("fullName").value.trim(),
    memberType: memberTypeSelect.value,
    email: document.getElementById("email").value.trim(),
    telegramUser: document.getElementById("telegramUser").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    extraData: extraDataInput.value.trim()
  };

  const errors = validateMemberFields(payload);
  const errorEntries = Object.entries(errors);
  if (errorEntries.length > 0) {
    errorEntries.forEach(([fieldId, message]) => setFieldError(fieldId, message));
    showNotice("Corrige los campos marcados en rojo.", true);
    return;
  }

  memberForm.reset();
  updateExtraLabel();
  showNotice("Agregado correctamente", false);
});

window.addEventListener("DOMContentLoaded", () => {
  renderMemberTypes();
  updateExtraLabel();
  fieldIds.forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener("input", () => clearFieldError(fieldId));
      field.addEventListener("change", () => clearFieldError(fieldId));
    }
  });
});
