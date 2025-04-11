const imagesContainer = document.querySelector(".gallery");

// Fonction pour récupérer les travaux depuis l'API

async function getWorks() {
  const answer = await fetch("http://localhost:5678/api/works");
  return answer.json();
}

// Fonction pour créer les figures avec les données récupérées

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
  imagesContainer.appendChild(figure);

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
  const categories = await getCategories();

  categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.textContent = category.name;
    btn.classList.add("category");
    btn.id = category.id; // Peut être utilisé pour filtrer plus tard
    filtersContainer.appendChild(btn);
  });
}

createCategoryButtons(); // Crée les boutons dynamiquement