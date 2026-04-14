const activityForm = document.getElementById("activityForm");
const memberSelect = document.getElementById("memberId");
const activityTypeSelect = document.getElementById("activityType");
const daysContainer = document.getElementById("daysContainer");
const activityNotice = document.getElementById("activityNotice");

const mockMembers = [
  { id: "1", fullName: "Camila Soto", memberType: "Estudiante de pregrado" },
  { id: "2", fullName: "Juan Perez", memberType: "Estudiante de postgrado" },
  { id: "3", fullName: "Tomas Rojas", memberType: "Funcionario" },
  { id: "4", fullName: "Paula Vera", memberType: "Academico" },
  { id: "5", fullName: "Sergio Mena", memberType: "Funcionario" },
  { id: "6", fullName: "Daniela Pino", memberType: "Estudiante de pregrado" },
  { id: "7", fullName: "Nicolas Araya", memberType: "Estudiante de postgrado" },
  { id: "8", fullName: "Maria Baeza", memberType: "Academico" },
  { id: "9", fullName: "Alvaro Diaz", memberType: "Funcionario" },
  { id: "10", fullName: "Beatriz Campos", memberType: "Estudiante de pregrado" }
];

const showActivityNotice = (message, isError) => {
  activityNotice.className = isError ? "notice error" : "notice success";
  activityNotice.textContent = message;
  activityNotice.style.color = isError ? "#d1223a" : "";
  activityNotice.style.fontWeight = isError ? "700" : "";
  activityNotice.hidden = false;
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

  const errors = AppValidation.validateActivity(payload, files);
  if (errors.length > 0) {
    showActivityNotice(`Revisa estos campos: ${errors.join(" ")}`, true);
    return;
  }

  activityForm.reset();
  showActivityNotice("Actividad agregada correctamente", false);
});

window.addEventListener("DOMContentLoaded", () => {
  renderMembers();
  renderActivityTypes();
  renderDays();
});
