const adminLink = document.querySelector("#adminModification a");
const modal = document.getElementById("modal1");
const closeModal = document.getElementById("closeModal");

// Ouverture de la modal

adminLink.addEventListener("click", function (event) {
  event.preventDefault(); // Empêche le scroll vers #modal1
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  displayModalWorks(); // Affiche les travaux dans la modale à chaque ouverture
});

// Fermer en cliquant sur le bouton "x"

closeModal.addEventListener("click", function (event) {
  event.preventDefault();
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
});

// Fermer en cliquant à l'extérieur de la modal-wrapper

modal.addEventListener("click", function (event) {
  if (event.target === modal) {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  }
});

// Récupération des travaux via l'API

async function getWorks() {
  const answer = await fetch("http://localhost:5678/api/works");
  return answer.json();
}

// Création dynamique des éléments dans la modal

async function createModalFigure(work) {
  const figure = document.createElement("figure");

  const wrapper = document.createElement("div");
  wrapper.classList.add("figure-wrapper");

  const img = document.createElement("img");
  img.src = work.imageUrl;
  img.alt = work.title;

  const trashIcon = document.createElement("i");
  trashIcon.classList.add("fa-solid", "fa-trash", "trash-icon");

  trashIcon.addEventListener("click", function () {
    deleteWork(work.id, figure);
  });

  wrapper.appendChild(img);
  wrapper.appendChild(trashIcon);
  figure.appendChild(wrapper);

  return figure;
}

// Affichage des travaux dans la modale

async function displayModalWorks() {
  const modalWorks = document.querySelector(".modalWorks");
  
  modalWorks.innerHTML = ""; // Nettoyage à chaque ouverture

  const works = await getWorks();
  works.forEach(async (work) => {
    const figure = await createModalFigure(work);
    modalWorks.appendChild(figure);
  });
}

async function deleteWork(workId, figure) {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    figure.remove();
    displayWorks();
  }
}