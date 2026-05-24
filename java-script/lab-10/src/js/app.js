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

const STATE = {
    users: {
        data: [],
        page: 0,
        size: 30,
        totalPages: 0
    },
    friends: {
        data: [],
        page: 0,
        size: 30,
        totalPages: 0
    }
}

window.loadFriends = loadFriends;
window.loadUsers = loadUsers;

const API_URL = "http://localhost:8080/api/v1/secured"

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
    }
}

async function loadUsers() {
    try {
        const pageData = await getPageRequest("/users", STATE.users.page, STATE.users.size);
        STATE.users.data = pageData.content || [];
        STATE.users.totalPages = pageData.page.totalPages || 0;
        renderUsers(STATE.users.data);
    } catch (error) {
        console.error("Failed to load friends:", error);
        DOM.friendsContainer.innerHTML = 
            `<p class="error-text">No users to display.</p>`;
    }
}

function renderUsers(usersList) {
    if (!DOM.usersContainer) 
        return;

    DOM.usersContainer.innerHTML = ""

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

            <div class="users__card-controls">
                <button type="button" class="action-btn action-btn--primary send-friend-request-btn" data-user-email="${user.email}">
                    Be Friends
                </button>
            </div>
        `;
        DOM.usersContainer.appendChild(userCard);
    });

    DOM.usersPaginationControls.classList.remove("hidden");

    DOM.usersPreviousPageBtn.disabled = STATE.users.page === 0;
    DOM.usersNextPageBtn.disabled = STATE.users.page >= STATE.users.totalPages - 1;
    DOM.usersCurrentPage.textContent = `Page ${STATE.users.page + 1} of ${STATE.users.totalPages || 1}`;
}

async function sendFriendRequest(targetUserEmail) {
    if (typeof targetUserEmail !== 'string') {
        throw new TypeError('Target user email must be a string');
    }

    const friendShipRequest = {
        friend_email: targetUserEmail
    };

    const response = await fetch(`${API_URL}/friendship`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${getToken()}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(friendShipRequest)
    });

    if (!response.ok) { 
        throw new Error(`${response.message}`);
    }
}

async function loadFriends() {
    try {
        const pageData = await getPageRequest("/friends", STATE.friends.page, STATE.friends.size);
        
        if (pageData.content.length === 0)
            throw new Error("You have zero friends.");

        console.log(pageData);
        STATE.friends.data = pageData.content || [];
        STATE.friends.totalPages = pageData.page.totalPages || 0;

        updateFriendsUI();
    } catch (error) {
        // console.error("Failed to load friends:", error);
        DOM.friendsContainer.innerHTML = 
            `<p class="error-text">${error.message}</p>`;
    }
}

function renderFriends(friendsList) {
    if (!DOM.friendsContainer)
        return;

    DOM.friendsContainer.innerHTML = "";

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
        DOM.friendsContainer.appendChild(friendCard);
    });
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

    const filtered = filterFriends(STATE.friends.data, query);
    const sortedAndFiltered = sortFriends(filtered, sortOrder);

    renderFriends(sortedAndFiltered);

    DOM.friendsPaginationControls.classList.remove("hidden");
    DOM.friendsPreviousPageBtn.disabled = STATE.friends.page === 0;
    DOM.friendsNextPageBtn.disabled = STATE.friends.page >= STATE.friends.totalPages - 1;
    DOM.friendsCurrentPage.textContent = `Page ${STATE.friends.page + 1} of ${STATE.friends.totalPages || 1}`;
}


document.addEventListener("DOMContentLoaded", () => {
    // Elements.
    DOM.logoutBtn = document.getElementById("logout-btn");

    DOM.usersContainer = document.getElementById("users-container");
    
    DOM.friendsContainer = document.getElementById("friends-container");
    DOM.friendsSearchInput = document.getElementById("friendsSearchInput");
    DOM.friendsSortSelect = document.getElementById("friendsSortSelect");

    // Friends pagination controls.
    DOM.friendsPaginationControls = document.getElementById("friends-pagination-controls");
    DOM.friendsPreviousPageBtn = document.getElementById("friends-previous");
    DOM.friendsCurrentPage = document.getElementById("friends-page");
    DOM.friendsNextPageBtn = document.getElementById("friends-next");

    // Users pagination controls.
    DOM.usersPaginationControls = document.getElementById("users-pagination-controls");
    DOM.usersPreviousPageBtn = document.getElementById("users-previous");
    DOM.usersCurrentPage = document.getElementById("users-page");
    DOM.usersNextPageBtn = document.getElementById("users-next");

    // Event Listeners --------------------------------------------------------
    DOM.logoutBtn.addEventListener("click", logout);
    DOM.friendsSearchInput.addEventListener("input", updateFriendsUI);
    DOM.friendsSortSelect.addEventListener("change", updateFriendsUI);

    DOM.usersContainer.addEventListener("click", async (event) => {
        const friendRequestBtn = event.target.closest(".send-friend-request-btn");

        if (!friendRequestBtn)
            return;

        const targetEmail = friendRequestBtn.dataset.userEmail;
        try {
            friendRequestBtn.disabled = true;
            await sendFriendRequest(targetEmail);
            friendRequestBtn.innerText = "Request Sent!";
        } catch (error) {
            // TODO SNACKBAR
            friendRequestBtn.innerText = "Be Friends";
            friendRequestBtn.disabled = false;
        }
    });

    DOM.friendsPreviousPageBtn.addEventListener("click", () => {
        STATE.friends.page--;
        loadFriends();
    });

    DOM.friendsNextPageBtn.addEventListener("click", () => {
        STATE.friends.page++;
        loadFriends();
    });

    DOM.usersPreviousPageBtn.addEventListener("click", () => {
        STATE.users.page--;
        loadUsers();
    });

    DOM.usersNextPageBtn.addEventListener("click", () => {
        STATE.users.page++;
        loadUsers();
    });

    initRouter();
});