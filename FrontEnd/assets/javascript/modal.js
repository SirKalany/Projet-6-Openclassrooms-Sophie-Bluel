const adminLink = document.querySelector("#adminModification a");
const modal = document.getElementById("modal1");
const closeModal = document.getElementById("closeModal");

adminLink.addEventListener("click", function (event) {
  event.preventDefault(); // Empêche le scroll vers #modal1
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
});

closeModal.addEventListener("click", function (event) {
    event.preventDefault();
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  });