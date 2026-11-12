import { requireAuth } from "./auth.js";
import { apiFetch } from "./api.js";

requireAuth();

async function carregarReservas() {
  const tbody = document.getElementById("tabela-reservas");
  
  try {
    const reservas = await apiFetch("/reservations");
    
    tbody.textContent = "";

    if (reservas.length === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      
      td.colSpan = 4;
      td.textContent = "Nenhuma reserva encontrada.";
      tr.appendChild(td);
      tbody.appendChild(tr);
      
      return;
    }

    reservas.forEach((r) => {
      const tr = document.createElement("tr");

      const tdVaga = document.createElement("td");
      tdVaga.textContent = r.space_id;

      const tdChegada = document.createElement("td");
      tdChegada.textContent = new Date(r.arrival_expected).toLocaleString(
        "pt-BR",
      );

      const tdStatus = document.createElement("td");
      tdStatus.textContent = r.status;

      const tdValor = document.createElement("td");
      tdValor.textContent = r.final_amount
        ? `R$ ${r.final_amount.toFixed(2)}`
        : `Est. R$ ${r.price_estimate.toFixed(2)}`;

      tr.appendChild(tdVaga);
      tr.appendChild(tdChegada);
      tr.appendChild(tdStatus);
      tr.appendChild(tdValor);
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    alert("Erro ao carregar reservas.");
  }
}

carregarReservas();
