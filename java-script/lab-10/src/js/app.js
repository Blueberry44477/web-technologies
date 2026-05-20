import { initRouter, navigateTo } from "./router";

import { 
    getToken,
    isAuthenticated,
    removeToken
} from "./utils";

import defaultAvatarUrl from "../assets/default-avatar.png";

if (!isAuthenticated()) {
    window.location.href = "/index.html";
}

window.loadFriends = loadFriends;
window.loadUsers = loadUsers;

const API_URL = "http://localhost:8080/api/v1/secured"

let users = [];
let friends = [];


function logout() {
    removeToken();
    window.location.href = "/index.html";
}

const DOM = {};

async function getPageRequest(url, page = 0, size = 10) {
    const token = getToken();
    try {
        const response = await fetch(`${API_URL}${url}?page=${page}&size=${size}`,{
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
    
        if (!response.ok) {
            throw new Error(response.status);
        }
    
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch data:", error);
        throw error;
    }
}

async function loadUsers(page = 0, size = 10) {
    try {
        const pageData = await getPageRequest("/users", page, size);
        users = pageData.content || [];
        renderUsers(users);
    } catch (error) {
        console.error("Failed to load friends:", error);
        DOM.friendsContainer.innerHTML = 
            `<p class="error-text">Failed to load users list.</p>`;
    }
}

function renderUsers(usersList) {
    const usersContainer = DOM.usersContainer;
    usersContainer.innerHTML = "";

    if (!usersList || usersList.length === 0) {
        usersContainer.innerHTML = `<p class="empty-text">No users to display.</p>`;
        return;
    }

    usersList.forEach(user => {
        const avatarSrc = user.avatar ? `data:image/jpeg;base64,${user.avatar}` : defaultAvatarUrl;
        const age = user.dob ? new Date().getFullYear() - new Date(user.dob).getFullYear() : 'N/A';
        
        const userCard = document.createElement("div");
        userCard.classList.add("users__card");
        userCard.innerHTML = `
            <div class = "users__card-img-wrapper">
                <img src="${avatarSrc}" alt="avatar" class="users__card-img">
            </div>
            <div class="users__card-info">
                <h3 class="users__card-name">${user.firstName} ${user.lastName}</h3>
                <p class="users__card-age">Age: ${age}</p>
                <p class="users__card-email">${user.email}</p>
                <p class="users__card-phone">${user.phone}</p>
                <p class="users__card-location">${user.city ? user.city + ', ' : ''}${user.country}</p>
                <p class="users__card-sex">${user.sex}</p>
            </div>
        `;
        usersContainer.appendChild(userCard);
    })
}

async function loadFriends(page = 0, size = 10) {
    try {
        const pageData = await getPageRequest("/friends", page, size);
        friends = pageData.content || [];
        renderFriends(friends);
    } catch (error) {
        console.error("Failed to load friends:", error);
        DOM.friendsContainer.innerHTML = 
            `<p class="error-text">Failed to load friends list.</p>`;
    }
}

function renderFriends(friendsList) {
    const friendsContainer = DOM.friendsContainer;
    friendsContainer.innerHTML = "";

    if (!friendsList || friendsList.length === 0) {
        friendsContainer.innerHTML = `<p class="empty-text">No friends to display.</p>`;
        return;
    }

    friendsList.forEach(friend => {
        const avatarSrc = friend.avatar ? `data:image/jpeg;base64,${friend.avatar}` : defaultAvatarUrl;
        const age = friend.dob ? new Date().getFullYear() - new Date(friend.dob).getFullYear() : 'N/A';
        
        const friendCard = document.createElement("div");
        friendCard.classList.add("friends__card");
        friendCard.innerHTML = `
            <div class = "friends__card-img-wrapper">
                <img src="${avatarSrc}" alt="avatar" class="friends__card-img">
            </div>
            <div class="friends__card-info">
                <h3 class="friends__card-name">${friend.firstName} ${friend.lastName}</h3>
                <p class="friends__card-age">Age: ${age}</p>
                <p class="friends__card-email">${friend.email}</p>
                <p class="friends__card-phone">${friend.phone}</p>
                <p class="friends__card-location">${friend.city ? friend.city + ', ' : ''}${friend.country}</p>
                <p class="friends__card-sex">${friend.sex}</p>
            </div>
        `;
        friendsContainer.appendChild(friendCard);
    })
}

// By name or email.
function filterFriends(friendsArray, query) {
    const cleanQuery = query.toLowerCase().trim();
    if (!cleanQuery) 
        return [...friendsArray];

    return friendsArray.filter(friend => {
        const fullName = `${friend.firstName} ${friend.lastName}`.toLowerCase();
        const email = (friend.email || "").toLowerCase();
        return fullName.includes(cleanQuery) || email.includes(cleanQuery);
    });
}

function sortFriends(friendsArray, sortOrder) {
    const sortedList = [...friendsArray]; 

    switch (sortOrder) {
        case "name":
            return sortedList.sort((a, b) => {
                const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
                const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
                return nameA.localeCompare(nameB);
            });

        case "age":
            return sortedList.sort((a, b) => {
                const ageA = a.dob ? new Date().getFullYear() - new Date(a.dob).getFullYear() : 0;
                const ageB = b.dob ? new Date().getFullYear() - new Date(b.dob).getFullYear() : 0;
                return ageA - ageB;
            });

        default:
            return sortedList;
    }
}

function updateFriendsUI() {
    const query = DOM.friendsSearchInput.value;
    const sortOrder = DOM.friendsSortSelect.value;

    const filtered = filterFriends(friends, query);
    const sortedAndFiltered = sortFriends(filtered, sortOrder);

    renderFriends(sortedAndFiltered);
}

document.addEventListener("DOMContentLoaded", () => {
    // Elements
    DOM.logoutBtn = document.getElementById("logout-btn");

    DOM.usersContainer = document.getElementById("users-container");
    
    DOM.friendsContainer = document.getElementById("friends-container");
    DOM.friendsSearchInput = document.getElementById("friendsSearchInput");
    DOM.friendsSortSelect = document.getElementById("friendsSortSelect");

    // Event Listeners
    DOM.logoutBtn.addEventListener("click", logout);
    DOM.friendsSearchInput.addEventListener("input", updateFriendsUI);
    DOM.friendsSortSelect.addEventListener("change", updateFriendsUI);

    initRouter();
});