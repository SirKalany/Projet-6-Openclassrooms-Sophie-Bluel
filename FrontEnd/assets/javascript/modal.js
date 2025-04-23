// Initialisation des éléments du DOM pour la modale gallerie

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

// Création dynamique des éléments dans la modal

async function createModalFigure(work) {
  const figure = document.createElement("figure");

  const wrapper = document.createElement("div");
  wrapper.classList.add("figureWrapper");

  const img = document.createElement("img");
  img.src = work.imageUrl; // Nous avons déjà les éléments "work" car déclaré dans index.js
  img.alt = work.title;

  // Création de l'icone de supression

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

// Fonction de supression des travaux

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

// Changement de display de la Gallerie au Formulaire d'upload

const addButton = document.getElementById("addButton");
const modalGallery = document.querySelector(".modalGallery");
const modalForm = document.querySelector(".modalForm");

addButton.addEventListener("click", function () {
  modalGallery.classList.add("hidden");
  modalForm.classList.remove("hidden");
  categorySelect();
});

// Retour vers la modal gallery

const backToGallery = document.getElementById("backToGallery");

backToGallery.addEventListener("click", function () {
  modalForm.classList.add("hidden");
  modalGallery.classList.remove("hidden");
});

// Création des catégories dans le select de form

async function categorySelect() {
  const select = document.getElementById("photoCategory");

  select.innerHTML = '<option value="">Choisir une catégorie</option>';
  const categories = await getCategories();
  categories.forEach(function (category) {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
  });
}

// Initialisation des éléments du DOM pour le formulaire d'upload

const form = document.querySelector(".uploadForm");
const imageInput = document.getElementById("imageInput");
const uploadButton = document.getElementById("uploadTrigger");
const uploadPreview = document.querySelector(".uploadPreview");
const submitButton = document.querySelector(".submitButton");

let selectedFile = null;

submitButton.classList.add("submitButtonInvalid"); // Bouton désactivé au départ

// Clic sur le bouton "Ajouter photo" pour ouvrir le sélecteur de fichiers

uploadButton.addEventListener("click", function () {
  imageInput.click();
});

// Mise à jour du visuel quand une image est sélectionnée

imageInput.addEventListener("change", function () {
  selectedFile = imageInput.files[0] || null;
  validateFormFields();

  if (selectedFile) {
    var reader = new FileReader();
    reader.onload = function (e) {
      uploadPreview.innerHTML = `<img src="${e.target.result}" style="max-height: 200px" />`;
    };
    reader.readAsDataURL(selectedFile);
  }
});

// Validation des champs du formulaire

function validateFormFields() {
  var title = document.getElementById("photoTitle").value.trim();
  var category = document.getElementById("photoCategory").value;
  var isValid = selectedFile && title && category;

  submitButton.disabled = !isValid; // Désactive le bouton si invalide
  submitButton.classList.toggle("submitButtonInvalid", !isValid); // Applique la classe d'invalidité
}

// Ajoute les listeners aux champs texte et select

const titleInput = document.getElementById("photoTitle");
titleInput.addEventListener("input", validateFormFields);

const photoCategory = document.getElementById("photoCategory");
photoCategory.addEventListener("input", validateFormFields);

// Soumission du formulaire

form.addEventListener("submit", function (event) {
  event.preventDefault();

  var title = document.getElementById("photoTitle").value.trim();
  var category = document.getElementById("photoCategory").value;

  // Vérification si les champs sont remplis

  if (!selectedFile || !title || !category) {
    return; // Ne rien faire si le formulaire est incomplet
  }

  var formData = new FormData();
  formData.append("image", selectedFile);
  formData.append("title", title);
  formData.append("category", category);

  var token = localStorage.getItem("token");

  // Utilisation de XMLHttpRequest pour envoyer le formulaire

  var workUpload = new XMLHttpRequest();
  workUpload.open("POST", "http://localhost:5678/api/works", true);
  workUpload.setRequestHeader("Authorization", `Bearer ${token}`);

  // Lors de la réussite de l'envoi

  workUpload.onload = function () {
    if (workUpload.status === 201) {

      // Réinitialise le formulaire après succès

      console.log("Image ajoutée!");

      form.reset();
      selectedFile = null;
      uploadPreview.innerHTML = `
        <i class="fa-regular fa-image fa-5x"></i>
        <div id="previewZone"></div>
        <button type="button" class="uploadButton" id="uploadTrigger">+ Ajouter photo</button>
        <p>jpg, png : 4mo max</p>
      `;
      validateFormFields(); // Revalide après l'ajout d'image

      // Réattache le listener au nouveau bouton

      const uploadButton = document.getElementById("uploadTrigger");
      uploadButton.addEventListener("click", function () {
        imageInput.click();
      });

      categorySelect(); // Recharger les catégories
      displayWorks(); // Recharger la galerie principale
      displayModalWorks(); // Recharger la modale
      document.querySelector(".modalForm").classList.add("hidden"); // Cache la modale d'upload
      document.querySelector(".modalGallery").classList.remove("hidden"); // Charge la modale gallerie
    } else {
      console.log("Erreur lors de l'envoi. Veuillez réessayer.");
    }
  };

  // Envoie la requête avec les données du formulaire
  workUpload.send(formData);
});