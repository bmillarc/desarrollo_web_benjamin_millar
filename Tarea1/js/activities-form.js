const activityForm = document.getElementById("activityForm");
const memberSelect = document.getElementById("memberId");
const activityTypeSelect = document.getElementById("activityType");
const daysContainer = document.getElementById("daysContainer");
const activityNotice = document.getElementById("activityNotice");
const fieldIds = ["memberId", "activityTitle", "activityType", "daysContainer", "startTime", "endTime", "description", "mediaFiles", "contentLink"];

const mockMembers = [
  { id: "MEM-001", fullName: "Camila Soto", memberType: "Estudiante de pregrado" },
  { id: "MEM-002", fullName: "Tomas Rojas", memberType: "Funcionario" },
  { id: "MEM-003", fullName: "Paula Vera", memberType: "Academico" }
];

const showActivityNotice = (message, isError) => {
  activityNotice.className = isError ? "notice error" : "notice success";
  activityNotice.textContent = message;
  activityNotice.style.color = isError ? "#d1223a" : "";
  activityNotice.style.fontWeight = isError ? "700" : "";
  activityNotice.hidden = false;
};

const clearFieldError = (fieldId) => {
  const field = document.getElementById(fieldId);
  if (field) {
    field.classList.remove("input-error");
  }

  const errorElement = document.getElementById(`${fieldId}Error`);
  if (errorElement) {
    errorElement.remove();
  }
};

const setFieldError = (fieldId, message) => {
  const field = document.getElementById(fieldId);
  const container = fieldId === "daysContainer" ? daysContainer.parentElement : field?.closest(".field");

  if (field) {
    field.classList.add("input-error");
  }

  if (!container) return;

  let errorElement = document.getElementById(`${fieldId}Error`);
  if (!errorElement) {
    errorElement = document.createElement("p");
    errorElement.id = `${fieldId}Error`;
    errorElement.className = "field-error-msg";
    container.appendChild(errorElement);
  }

  errorElement.textContent = message;
};

const clearActivityErrors = () => {
  fieldIds.forEach(clearFieldError);
};

const validateActivityFields = (payload, files) => {
  const errors = {};

  if (!payload.memberId) errors.memberId = "Selecciona un miembro.";
  if (!payload.title || payload.title.trim().length < 3 || payload.title.trim().length > 80) {
    errors.activityTitle = "Titulo entre 3 y 80 caracteres.";
  }
  if (!payload.activityType) errors.activityType = "Selecciona un tipo de actividad.";
  if (!payload.days || payload.days.length === 0) errors.daysContainer = "Selecciona al menos un dia.";
  if (!payload.startTime) errors.startTime = "Ingresa hora de inicio.";
  if (!payload.endTime) errors.endTime = "Ingresa hora de termino.";
  if (payload.startTime && payload.endTime && payload.endTime <= payload.startTime) {
    errors.endTime = "La hora de termino debe ser mayor a la de inicio.";
  }
  if (!payload.description || payload.description.trim().length < 8 || payload.description.trim().length > 300) {
    errors.description = "Descripcion entre 8 y 300 caracteres.";
  }
  if (!payload.contentLink || !/^https?:\/\//.test(payload.contentLink)) {
    errors.contentLink = "Enlace invalido.";
  }
  if (!files || files.length < 1 || files.length > 5) {
    errors.mediaFiles = "Adjunta entre 1 y 5 archivos.";
  } else if (!Array.from(files).every((file) => file.type.startsWith("image/") || file.type.startsWith("video/"))) {
    errors.mediaFiles = "Solo imagenes o videos.";
  }

  return errors;
};

const renderMembers = () => {
  memberSelect.innerHTML = '<option value="">Selecciona un miembro</option>';
  const members = mockMembers;

  members.forEach((member) => {
    const option = document.createElement("option");
    option.value = member.id;
    option.textContent = `${member.fullName} (${member.memberType})`;
    memberSelect.appendChild(option);
  });

};

const renderActivityTypes = () => {
  AppConfig.activityTypes.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    activityTypeSelect.appendChild(option);
  });
};

const renderDays = () => {
  daysContainer.innerHTML = "";
  AppConfig.weekDays.forEach((day) => {
    const item = document.createElement("label");
    item.className = "inline";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = day;
    input.name = "days";

    const text = document.createElement("span");
    text.textContent = day;

    item.appendChild(input);
    item.appendChild(text);
    daysContainer.appendChild(item);
  });
};

const getSelectedDays = () => {
  return Array.from(document.querySelectorAll('input[name="days"]:checked')).map((item) => item.value);
};

activityForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearActivityErrors();

  const files = document.getElementById("mediaFiles").files;
  const payload = {
    memberId: memberSelect.value,
    title: document.getElementById("activityTitle").value.trim(),
    activityType: activityTypeSelect.value,
    days: getSelectedDays(),
    startTime: document.getElementById("startTime").value,
    endTime: document.getElementById("endTime").value,
    description: document.getElementById("description").value.trim(),
    contentLink: document.getElementById("contentLink").value.trim(),
    files: AppValidation.mapFilesMetadata(files)
  };

  const errors = validateActivityFields(payload, files);
  const errorEntries = Object.entries(errors);
  if (errorEntries.length > 0) {
    errorEntries.forEach(([fieldId, message]) => setFieldError(fieldId, message));
    showActivityNotice("Corrige los campos marcados en rojo.", true);
    return;
  }

  activityForm.reset();
  showActivityNotice("Actividad agregada correctamente", false);
});

window.addEventListener("DOMContentLoaded", () => {
  renderMembers();
  renderActivityTypes();
  renderDays();
  fieldIds.forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    if (!field) return;
    const eventName = field.tagName === "SELECT" || field.type === "file" ? "change" : "input";
    field.addEventListener(eventName, () => clearFieldError(fieldId));
  });
  daysContainer.addEventListener("change", () => clearFieldError("daysContainer"));
});
