const memberTypeSelect = document.getElementById("memberType");
const extraDataLabel = document.getElementById("extraDataLabel");
const extraDataInput = document.getElementById("extraData");
const memberForm = document.getElementById("memberForm");
const memberNotice = document.getElementById("memberNotice");

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

  const payload = {
    fullName: document.getElementById("fullName").value.trim(),
    memberType: memberTypeSelect.value,
    email: document.getElementById("email").value.trim(),
    telegramUser: document.getElementById("telegramUser").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    extraData: extraDataInput.value.trim()
  };

  const errors = AppValidation.validateMember(payload);
  if (errors.length > 0) {
    showNotice(`Revisa estos campos: ${errors.join(" ")}`, true);
    return;
  }

  memberForm.reset();
  updateExtraLabel();
  showNotice("Agregado correctamente", false);
});

window.addEventListener("DOMContentLoaded", () => {
  renderMemberTypes();
  updateExtraLabel();
});
