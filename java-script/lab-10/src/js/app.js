import { 
    getToken,
    isAuthenticated,
    removeToken
} from "./utils";

import defaultAvatarUrl from "../assets/default-avatar.png";

const API_URL = "http://localhost:8080/api/v1/secured"

let friends = [];

function logout() {
    removeToken();
    window.location.href = "/index.html";
}

const DOM = {
    friendsBtn: document.getElementById("friends-btn"),
    logoutBtn: document.getElementById("logout-btn"),

    friendsContainer: document.getElementById("friends-container"),
    friendsSearchInput: document.getElementById("friendsSearchInput"),
    friendsSortSelect: document.getElementById("friendsSortSelect")
}

async function loadFriends(page = 0, size = 10) {
    const token = getToken();
    try {
        const response = await fetch(`${API_URL}/friends?page=${page}&size=${size}`,{
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(response.status);
        }

        const pageData = await response.json();
        friends = pageData.content || [];
        renderFriends(friends);
    } catch (error) {
        console.error("Failed to load friends:", error);
        document.getElementById("friends-container").innerHTML = 
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

DOM.friendsBtn.addEventListener("click", () => loadFriends(0, 10));
DOM.logoutBtn.addEventListener("click", logout);
DOM.friendsSearchInput.addEventListener("input", updateFriendsUI);
DOM.friendsSortSelect.addEventListener("change", updateFriendsUI);