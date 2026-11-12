import { requireAuth } from "./auth.js";
import { apiFetch } from "./api.js";

requireAuth();

const map = L.map("map").setView([-23.5505, -46.6333], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

async function init() {
  try {
    const lots = await apiFetch("/parking-lots");
    const lista = document.getElementById("lista-lots");
    
    lista.textContent = "";

    lots.forEach((lot) => {
      L.marker([lot.latitude, lot.longitude])
        .addTo(map)
        .bindPopup(`<b>${lot.name}</b><br>R$ ${lot.hourly_rate}/h`);

      const li = document.createElement("li");
      const span = document.createElement("span");
      const strong = document.createElement("strong");
      
      strong.textContent = lot.name;
      span.appendChild(strong);

      li.appendChild(span);
      lista.appendChild(li);
    });
  } catch (err) {
    console.error(err);
  }
}

document.getElementById("btnLogout").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
});

init();
