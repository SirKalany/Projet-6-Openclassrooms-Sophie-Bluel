const adminLink = document.querySelector("#adminModification a");
const modal = document.getElementById("modal1");
const closeModal = document.getElementById("closeModal");

adminLink.addEventListener("click", function (event) {
  event.preventDefault(); // Empêche le scroll vers #modal1
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  displayModalWorks(); // Affiche les travaux dans la modale à chaque ouverture
});

closeModal.addEventListener("click", function (event) {
  event.preventDefault();
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
});

// Récupération des travaux via l'API
async function getWorks() {
  const answer = await fetch("http://localhost:5678/api/works");
  return answer.json();
}

// Création dynamique des éléments dans la modale (sans caption)
async function createModalFigure(work) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");

  img.src = work.imageUrl;
  img.alt = work.title;

  figure.appendChild(img);
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