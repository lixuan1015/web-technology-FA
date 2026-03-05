// LOGIN
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await res.json();

  if (res.ok) {
    localStorage.setItem("userId", result.userId);
    localStorage.setItem("userName", result.name);
    window.location.href = "home.html";
  } else {
    alert(result.message);
  }
});

// SIGNUP
document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await res.json();

  if (res.ok) {
    alert("Signup successful! Please login.");
    window.location.href = "login.html";
  } else {
    alert(result.message);
  }
});