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
      
      td.colSpan = 5;
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

      const tdAcao = document.createElement("td");

      if (r.status === "PENDING_PAYMENT") {
        const btnPagar = document.createElement("button");
        btnPagar.className = "btn btn-small";
        btnPagar.textContent = "Pagar";

        btnPagar.addEventListener("click", async () => {
          try {
            btnPagar.textContent = "...";
            btnPagar.disabled = true;

            const checkout = await apiFetch(`/reservations/${r.id}/checkout`, {
              method: "POST",
            });
            
            window.location.href = checkout.checkoutUrl;
          } catch (err) {
            alert(err.message);
            btnPagar.textContent = "Pagar";
            btnPagar.disabled = false;
          }
        });

        tdAcao.appendChild(btnPagar);
      } else {
        tdAcao.textContent = "-";
      }

      tr.appendChild(tdVaga);
      tr.appendChild(tdChegada);
      tr.appendChild(tdStatus);
      tr.appendChild(tdValor);
      tr.appendChild(tdAcao);
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    alert("Erro ao carregar reservas.");
  }
}

carregarReservas();
