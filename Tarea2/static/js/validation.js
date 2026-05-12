/* Validation functions for client-side validation */

const validateName = (name) => !!name && name.trim().length >= 4 && name.trim().length <= 80;

const validateEmail = (email) => {
  if (!email) return false;
  if (email.length < 6 || email.length > 100) return false;
  return /^[\w.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
};

const validatePhone = (phone) => {
  if (!phone) return true;
  return /^\+?\d[\d\s-]{7,14}$/.test(phone.trim());
};

const validateTelegram = (telegramUser) => {
  if (!telegramUser) return true;
  user = telegramUser.trim();
  // Debe comenzar con "@" - no lo removemos
  return /^@[a-zA-Z0-9_]{5,32}$/.test(user);
};

const validateUrl = (urlValue) => {
  if (!urlValue) return false;
  try {
    const parsed = new URL(urlValue);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (_error) {
    return false;
  }
};

const validateFiles = (fileList) => {
  if (!fileList || fileList.length < 1 || fileList.length > 5) {
    return false;
  }

  return Array.from(fileList).every((file) => {
    return file.type.startsWith("image/") || file.type.startsWith("video/");
  });
};

window.AppValidation = {
  validateMember(payload) {
    const errors = [];

    if (!validateName(payload.fullName)) errors.push("Nombre completo (mínimo 4 caracteres).");
    if (!payload.memberType) errors.push("Tipo de miembro.");
    if (!validateEmail(payload.email)) errors.push("Correo electrónico válido (obligatorio).");
    if (!validatePhone(payload.phone)) errors.push("Teléfono (si se ingresa, debe tener formato válido).");
    if (!validateTelegram(payload.telegramUser)) {
      errors.push("Usuario de Telegram (si se ingresa, usar formato válido, por ejemplo @usuario).");
    }
    if (!payload.phone && !payload.telegramUser) {
      errors.push("Debes ingresar al menos un dato de contacto: Telegram o teléfono.");
    }
    if (!payload.extraData || payload.extraData.trim().length < 2 || payload.extraData.trim().length > 80) {
      errors.push("Dato adicional según tipo (2 a 80 caracteres).");
    }
    if (!payload.comunaId) {
      errors.push("Comuna es requerida.");
    }

    return errors;
  },

  validateActivity(payload, fileList) {
    const errors = [];

    if (!payload.memberId) errors.push("Miembro asociado.");
    if (!payload.title || payload.title.trim().length < 3 || payload.title.trim().length > 80) {
      errors.push("Título de actividad (3 a 80 caracteres).");
    }
    if (!payload.activityType) errors.push("Tipo de actividad.");
    if (!payload.days || payload.days.length === 0) errors.push("Al menos un día.");
    if (!payload.startTime) errors.push("Hora de inicio.");
    if (!payload.endTime) errors.push("Hora de término.");
    if (payload.startTime && payload.endTime && payload.endTime <= payload.startTime) {
      errors.push("La hora de término debe ser mayor que la hora de inicio.");
    }
    if (!payload.description || payload.description.trim().length < 8 || payload.description.trim().length > 300) {
      errors.push("Descripción (8 a 300 caracteres).");
    }
    if (!validateUrl(payload.contentLink)) errors.push("Enlace válido (http o https).");
    if (!validateFiles(fileList)) errors.push("Adjuntar entre 1 y 5 archivos de imagen o video.");

    return errors;
  },

  mapFilesMetadata(fileList) {
    return Array.from(fileList).map((file) => ({
      name: file.name,
      type: file.type,
      sizeKb: Math.round(file.size / 1024)
    }));
  }
};
