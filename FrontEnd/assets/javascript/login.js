const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", async function (event) {   // Attend l'évenement Submit
  event.preventDefault(); // Empêche le rechargement de la page par défaut

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("errorMessage");
  const loginData = { email, password };

  const jsonBody = JSON.stringify(loginData);

  const response = await fetch("http://localhost:5678/api/users/login", { // On demande à l'API de comparer les informations
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: jsonBody,
  });

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem("token", data.token); // Stocke le token dans le localStorage

    // Redirection vers l'index après connexion

    window.location.href = "index.html";
    
  } else {
    errorMessage.textContent = "Email ou mot de passe incorrect.";  // Message si on se trompe
  }
});
