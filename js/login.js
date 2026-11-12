import { auth } from "./auth.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const emailInput = document.getElementById("email");
const passInput = document.getElementById("password");
const msg = document.getElementById("msg");

async function handleAuth(action) {
  msg.textContent = "Aguarde...";
  msg.className = "msg";

  try {
    let cred;
    
    if (action === "login") {
      cred = await signInWithEmailAndPassword(
        auth,
        emailInput.value,
        passInput.value,
      );
    } else {
      cred = await createUserWithEmailAndPassword(
        auth,
        emailInput.value,
        passInput.value,
      );
    }

    const token = await cred.user.getIdToken();
    
    localStorage.setItem("token", token);
    window.location.href = "dashboard.html";
  } catch (err) {
    msg.textContent = "Erro de autenticação. Verifique os dados.";
    msg.className = "msg msg-error";
  }
}

document
  .getElementById("btnLogin")
  .addEventListener("click", () => handleAuth("login"));

document
  .getElementById("btnRegister")
  .addEventListener("click", () => handleAuth("register"));
