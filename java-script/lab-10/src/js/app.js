import { 
    getToken,
    isAuthenticated,
    removeToken
} from "./utils";

function logout() {
    removeToken();
    window.location.href = "/index.html";
}

const DOM = {
    friendsBtn: document.getElementById("friends-btn"),
    logoutBtn: document.getElementById("logout-btn")
}

DOM.logoutBtn.addEventListener("click", logout);

