
// Fonction pour récupérer les travaux depuis l'API

async function getWorks() {
  const answer = await fetch("http://localhost:5678/api/works");
  return answer.json();
}

// Fonction pour créer les figures avec les données récupérées

const workContainer = document.querySelector(".gallery");
async function createFigure(work) {
  const figure = document.createElement("figure");
  const figureCaption = document.createElement("figurecaption");
  const figureImage = document.createElement("img");

  // Assignation des sources de contenu

  figureImage.src = work.imageUrl;
  figureImage.alt = work.title;
  figureCaption.innerHTML = work.title;

  // Assignation des parents/enfants

  figure.appendChild(figureImage);
  figure.appendChild(figureCaption);
  workContainer.appendChild(figure);

  return figure;
}

// Fonction pour afficher les figures en utilisant la fonction au dessus

async function displayWorks() {
  const works = await getWorks();
  works.forEach((work) => {
    const figure = createFigure(work);
  });
}

displayWorks(); // Afficher les travaux

// Function pour récuperer les catégories depuis l'API

async function getCategories() {
  const answer = await fetch("http://localhost:5678/api/categories");
  return answer.json();
}

// Fonction pour créer dynamiquement les boutons de filtre

const filtersContainer = document.querySelector(".filtres");
async function createCategoryButtons() {

  // Création du bouton "Tous"

  const defaultButton = document.createElement("button");
  defaultButton.textContent = "Tous";
  defaultButton.classList.add("category", "active");
  defaultButton.id = 0;
  filtersContainer.appendChild(defaultButton)

  // Création des boutons avec les données de l'API

  const categories = await getCategories();
  categories.forEach((category) => {
    const filter = document.createElement("button");
    filter.textContent = category.name;
    filter.classList.add("category");
    filter.id = category.id; // Utilisé pour le filtre en dessous
    filtersContainer.appendChild(filter);
  });
}

function setupFilters() {
  const buttons = document.querySelectorAll(".category");

  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      const categoryId = parseInt(button.id); // Récupère l'ID du bouton cliqué
      const works = await getWorks();

      // Met à jour le boutton actif

      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Filtrage avec "Tous", on affiche tout

      let filteredWorks = [];

      if (categoryId === 0) {
        filteredWorks = works; // Afficher tous les travaux
      } else {
        filteredWorks = works.filter((work) => work.categoryId === categoryId);
      }

      // Affichage

      workContainer.innerHTML = ""; // On vide la gallerie
      filteredWorks.forEach((work) => createFigure(work)); // On remplie la gallerie avec nos éléments filtrés
    });
  });
}

createCategoryButtons().then(() => {
  setupFilters(); // Active les filtres une fois les boutons prêts
});

