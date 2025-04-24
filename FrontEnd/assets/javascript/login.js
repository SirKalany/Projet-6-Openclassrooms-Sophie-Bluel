const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", async function (event) {
  // Attend l'évenement Submit
  event.preventDefault(); // Empêche le rechargement de la page par défaut

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("errorMessage");
  const loginData = { email, password };
  const jsonBody = JSON.stringify(loginData);

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsonBody,
    });

    if (!response.ok) {
      throw new Error("Email ou mot de passe incorrect.");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token); // Stocke le token dans le localStorage

    window.location.href = "index.html"; // Redirection vers l'index après connexion
  } catch (error) {
    errorMessage.textContent = error.message; // Affiche l'erreur dans le message d'erreur
    console.error("Erreur lors de la connexion:", error); // Affiche l'erreur dans la console pour débogage
  }
});
