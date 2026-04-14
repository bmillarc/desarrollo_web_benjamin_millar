const membersTableBody = document.getElementById("membersTableBody");
const membersEmpty = document.getElementById("membersEmpty");
const filterMemberType = document.getElementById("filterMemberType");
const sortMembers = document.getElementById("sortMembers");
const prevPageBtn = document.getElementById("prevPage");
const nextPageBtn = document.getElementById("nextPage");
const pageInfo = document.getElementById("pageInfo");
const pageSize = 5;
let currentPage = 1;

const mockMembers = [
  {
    fullName: "Camila Soto",
    memberType: "Estudiante de pregrado",
    email: "camila.soto@gmail.com",
    telegramUser: "@cami_soto",
    phone: "+569 11111111",
    extraData: "Ingenieria Civil",
    createdAt: "2026-04-10T11:30:00"
  },
  {
    fullName: "Juan Perez",
    memberType: "Estudiante de postgrado",
    email: "juan.perez@gmail.com",
    telegramUser: "",
    phone: "+569 33333333",
    extraData: "Magister en Computacion",
    createdAt: "2026-04-11T16:00:00"
  },
  {
    fullName: "Tomas Rojas",
    memberType: "Funcionario",
    email: "tomas.rojas@gmail.com",
    telegramUser: "@tomas_rr",
    phone: "+569 44444444",
    extraData: "Auxiliar de Aseo",
    createdAt: "2026-04-12T09:10:00"
  },
  {
    fullName: "Paula Vera",
    memberType: "Academico",
    email: "paula.vera@gmail.com",
    telegramUser: "@paula_vera",
    phone: "",
    extraData: "Departamento de Matematicas",
    createdAt: "2026-04-12T10:25:00"
  },
  {
    fullName: "Sergio Mena",
    memberType: "Funcionario",
    email: "sergio.mena@gmail.com",
    telegramUser: "",
    phone: "+569 55556666",
    extraData: "Finanzas",
    createdAt: "2026-04-12T13:40:00"
  },
  {
    fullName: "Daniela Pino",
    memberType: "Estudiante de pregrado",
    email: "daniela.pino@gmail.com",
    telegramUser: "@dani_pino",
    phone: "",
    extraData: "Trabajo Social",
    createdAt: "2026-04-13T08:10:00"
  },
  {
    fullName: "Nicolas Araya",
    memberType: "Estudiante de postgrado",
    email: "nicolas.araya@gmail.com",
    telegramUser: "@nico_araya",
    phone: "+569 77778888",
    extraData: "Doctorado en Fisica",
    createdAt: "2026-04-13T09:50:00"
  },
  {
    fullName: "Maria Baeza",
    memberType: "Academico",
    email: "maria.baeza@gmail.com",
    telegramUser: "",
    phone: "+569 88889999",
    extraData: "Departamento de Historia",
    createdAt: "2026-04-13T11:00:00"
  },
  {
    fullName: "Alvaro Diaz",
    memberType: "Funcionario",
    email: "alvaro.diaz@gmail.com",
    telegramUser: "@alvaro_d",
    phone: "",
    extraData: "Biblioteca",
    createdAt: "2026-04-13T14:15:00"
  },
  {
    fullName: "Beatriz Campos",
    memberType: "Estudiante de pregrado",
    email: "beatriz.campos@gmail.com",
    telegramUser: "",
    phone: "+569 12344321",
    extraData: "Arquitectura",
    createdAt: "2026-04-13T16:45:00"
  }
];

const formatDate = (isoDate) => {
  const d = new Date(isoDate);
  return d.toLocaleString("es-CL");
};

const getPrimaryContact = (member) => {
  return member.telegramUser || member.phone || "-";
};

const populateTypeFilter = () => {
  const types = [...new Set(mockMembers.map((member) => member.memberType))].sort((a, b) => a.localeCompare(b));
  types.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    filterMemberType.appendChild(option);
  });
};

const getFilteredAndSortedMembers = () => {
  const filterValue = filterMemberType.value;
  const sortValue = sortMembers.value;

  let result = [...mockMembers];

  if (filterValue) {
    result = result.filter((member) => member.memberType === filterValue);
  }

  result.sort((a, b) => {
    if (sortValue === "contact") {
      return getPrimaryContact(a).localeCompare(getPrimaryContact(b), "es", { sensitivity: "base" });
    }
    return a.fullName.localeCompare(b.fullName, "es", { sensitivity: "base" });
  });

  return result;
};

const renderMembersTable = () => {
  const members = getFilteredAndSortedMembers();

  if (members.length === 0) {
    membersEmpty.hidden = false;
    membersTableBody.innerHTML = "";
    pageInfo.textContent = "Pagina 0 de 0";
    prevPageBtn.disabled = true;
    nextPageBtn.disabled = true;
    return;
  }

  membersEmpty.hidden = true;
  membersTableBody.innerHTML = "";

  const totalPages = Math.ceil(members.length / pageSize);
  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pagedMembers = members.slice(start, end);

  pagedMembers.forEach((member) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${member.fullName}</td>
      <td>${member.memberType}</td>
      <td>${member.telegramUser || "-"}</td>
      <td>${member.phone || "-"}</td>
      <td>${member.email}</td>
      <td>${member.extraData}</td>
      <td>${formatDate(member.createdAt)}</td>
    `;
    membersTableBody.appendChild(row);
  });

  pageInfo.textContent = `Pagina ${currentPage} de ${totalPages}`;
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;
};

const resetAndRender = () => {
  currentPage = 1;
  renderMembersTable();
};

prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage -= 1;
    renderMembersTable();
  }
});

nextPageBtn.addEventListener("click", () => {
  const members = getFilteredAndSortedMembers();
  const totalPages = Math.ceil(members.length / pageSize);
  if (currentPage < totalPages) {
    currentPage += 1;
    renderMembersTable();
  }
});

filterMemberType.addEventListener("change", resetAndRender);
sortMembers.addEventListener("change", resetAndRender);

window.addEventListener("DOMContentLoaded", () => {
  populateTypeFilter();
  renderMembersTable();
});
