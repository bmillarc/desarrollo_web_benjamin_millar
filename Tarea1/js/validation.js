window.AppConfig = {
  memberTypes: ["Estudiante de pregrado", "Estudiante de postgrado", "Funcionario", "Academico"],
  activityTypes: ["Artistica", "Deportiva", "Tecnologica", "Social", "Recreativa"],
  weekDays: ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"],
  extraFieldLabels: {
    "Estudiante de pregrado": "Carrera",
    "Estudiante de postgrado": "Programa",
    Funcionario: "Unidad",
    Academico: "Departamento"
  }
};

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
  return /^@?[a-zA-Z0-9_]{5,32}$/.test(telegramUser.trim());
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

    if (!validateName(payload.fullName)) errors.push("Nombre completo (minimo 4 caracteres).");
    if (!AppConfig.memberTypes.includes(payload.memberType)) errors.push("Tipo de miembro.");
    if (!validateEmail(payload.email)) errors.push("Correo electronico valido (obligatorio).");
    if (!validatePhone(payload.phone)) errors.push("Telefono (si se ingresa, debe tener formato valido).");
    if (!validateTelegram(payload.telegramUser)) {
      errors.push("Usuario de Telegram (si se ingresa, usar formato valido, por ejemplo @usuario).");
    }
    if (!payload.phone && !payload.telegramUser) {
      errors.push("Debes ingresar al menos un dato de contacto: Telegram o telefono.");
    }
    if (!payload.extraData || payload.extraData.trim().length < 2 || payload.extraData.trim().length > 80) {
      errors.push("Dato adicional segun tipo (2 a 80 caracteres).");
    }

    return errors;
  },

  validateActivity(payload, fileList) {
    const errors = [];

    if (!payload.memberId) errors.push("Miembro asociado.");
    if (!payload.title || payload.title.trim().length < 3 || payload.title.trim().length > 80) {
      errors.push("Titulo de actividad (3 a 80 caracteres).");
    }
    if (!AppConfig.activityTypes.includes(payload.activityType)) errors.push("Tipo de actividad.");
    if (!payload.days || payload.days.length === 0) errors.push("Al menos un dia.");
    if (!payload.startTime) errors.push("Hora de inicio.");
    if (!payload.endTime) errors.push("Hora de termino.");
    if (payload.startTime && payload.endTime && payload.endTime <= payload.startTime) {
      errors.push("La hora de termino debe ser mayor que la hora de inicio.");
    }
    if (!payload.description || payload.description.trim().length < 8 || payload.description.trim().length > 300) {
      errors.push("Descripcion (8 a 300 caracteres).");
    }
    if (!validateUrl(payload.contentLink)) errors.push("Enlace valido (http o https).");
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
