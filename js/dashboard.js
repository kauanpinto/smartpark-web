import { requireAuth } from "./auth.js";
import { apiFetch } from "./api.js";

requireAuth();

const map = L.map("map").setView([-23.5505, -46.6333], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

function selecionarLot(id) {
  document.getElementById("lotSelecionado").value = id;
  
  const selectVaga = document.getElementById("vaga");
  
  selectVaga.textContent = "";

  const prefixo = id === "lot_centro" ? "A" : "B";
  
  for (let i = 1; i <= 5; i++) {
    const option = document.createElement("option");
    
    option.value = `${id}_${prefixo}-0${i}`;
    option.textContent = `Vaga ${prefixo}-0${i}`;
    selectVaga.appendChild(option);
  }
}

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

      const btn = document.createElement("button");
      
      btn.className = "btn btn-small";
      btn.textContent = "Selecionar";
      btn.addEventListener("click", () => selecionarLot(lot.id));

      li.appendChild(span);
      li.appendChild(btn);
      lista.appendChild(li);
    });
  } catch (err) {
    console.error(err);
  }
}

document.getElementById("btnReservar").addEventListener("click", async () => {
  const lotId = document.getElementById("lotSelecionado").value;
  const spaceId = document.getElementById("vaga").value;
  const arr = document.getElementById("entrada").value;
  const dep = document.getElementById("saida").value;
  const msg = document.getElementById("msgReserva");

  if (!lotId || !arr || !dep) {
    msg.textContent = "Preencha todos os campos!";
    msg.className = "msg msg-error";
    return;
  }

  msg.textContent = "Processando...";
  msg.className = "msg";

  try {
    const reserva = await apiFetch("/reservations", {
      method: "POST",
      body: JSON.stringify({
        parkingLotId: lotId,
        spaceId: spaceId,
        arrivalExpected: new Date(arr).toISOString(),
        departureExpected: new Date(dep).toISOString(),
      }),
    });

    const checkout = await apiFetch(`/reservations/${reserva.id}/checkout`, {
      method: "POST",
    });
    window.location.href = checkout.checkoutUrl;
  } catch (err) {
    msg.textContent = err.message;
    msg.className = "msg msg-error";
  }
});

document.getElementById("btnLogout").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
});

init();
