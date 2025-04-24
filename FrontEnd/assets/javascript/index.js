// Fonction pour récupérer les travaux depuis l'API

async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  return response.json();
}

// Fonction pour créer les figures avec les données récupérées

const workContainer = document.querySelector(".gallery");
function createFigure(work) {
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
  workContainer.innerHTML = ""; // On vide la galerie
  works.forEach((work) => createFigure(work)); // On remplie la galerie avec nos travaux
}

displayWorks(); // Afficher les travaux

// Function pour récuperer les catégories depuis l'API

async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  return response.json();
}

// Fonction pour créer dynamiquement les boutons de filtre

const filtersContainer = document.querySelector(".filtres");
async function createCategoryButtons() {
  
  // Création du bouton "Tous"

  const defaultButton = document.createElement("button");
  defaultButton.textContent = "Tous";
  defaultButton.classList.add("category", "active");
  defaultButton.id = 0;
  filtersContainer.appendChild(defaultButton);

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

  buttons.forEach(function (button) {
    button.addEventListener("click", async function () {
      const categoryId = parseInt(button.id); // Récupère l'ID du bouton cliqué
      const works = await getWorks();

      // Met à jour le bouton actif

      buttons.forEach(function (btn) {
        btn.classList.remove("active");
      });
      button.classList.add("active");

      // Filtrage avec "Tous", on affiche tout

      let filteredWorks = []; // On assigne un tableau vide à la variable

      if (categoryId === 0) {
        filteredWorks = works; // On assigne tous les travaux
      } else {
        filteredWorks = works.filter(function (work) { // On assigne les travaux selon leur categorie
          return work.categoryId === categoryId;
        });
      }

      workContainer.innerHTML = ""; // On vide la galerie
      filteredWorks.forEach(function (work) {
        createFigure(work); // On remplit la galerie avec nos éléments filtrés
      });
    });
  });
}

createCategoryButtons().then(() => {
  const token = localStorage.getItem("token");
  const filtersContainer = document.querySelector(".filtres");

  if (token) {
    // L'utilisateur est connecté : on cache les filtres
    if (filtersContainer) {
      filtersContainer.classList.add("hidden");
    }
  } else {
    // L'utilisateur n'est pas connecté : on ne cache pas les filtres
    setupFilters();
  }
});

window.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  const editBanner = document.getElementById("editBanner");
  const adminModification = document.getElementById("adminModification");
  const logoutLink = document.getElementById("logoutLink");

  if (token) {
    if (editBanner) editBanner.classList.remove("hidden"); // Affiche le bandeau "Mode édition" si l'élément existe

    if (adminModification) adminModification.classList.remove("hidden"); // Affiche l'élément admin si connecté

    // Remplace "login" par "logout"

    if (logoutLink) {
      logoutLink.textContent = "logout";
      logoutLink.href = "#";

      // Déconnexion au clic de logout

      logoutLink.addEventListener("click", function (event) {
        event.preventDefault();
        localStorage.removeItem("token");
        window.location.reload();
      });
    }
  } else {
    console.warn("Aucun token trouvé. L'utilisateur n'est pas connecté."); // Message d'erreur
  }
});
