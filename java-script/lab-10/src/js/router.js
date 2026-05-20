const ROUTES = {
    "/browse": "browse-section",
    "/friends": "friends-section"
}

const DEFAULT_ROUTE = "/browse";

export function initRouter() {
    document.querySelectorAll(".header__nav-btn[data-target]").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const targetSectionId = btn.getAttribute("data-target");
            const path = Object.keys(ROUTES).find(key => ROUTES[key] === targetSectionId);

            if (path) {
                navigateTo(path);
            }
        });
    });

    window.addEventListener("popstate", () => {
        handleRouting(window.location.pathname);
    });

    let initialPath = window.location.pathname;
    if (!ROUTES[initialPath]) {
        initialPath = DEFAULT_ROUTE;
        window.history.replaceState(null, "", initialPath);
    }
    handleRouting(initialPath);
}

export function navigateTo(path) {
    if (window.location.pathname === path) 
        return;
    // Update browser URL history bar without triggering a reload
    window.history.pushState(null, "", path);
    handleRouting(path);
}

function handleRouting(path) {
    const activeSectionId = ROUTES[path] || ROUTES[DEFAULT_ROUTE];

    Object.values(ROUTES).forEach(sectionId => {
        const section = document.getElementById(sectionId);
        
        if (!section)
            return;

        if (sectionId === activeSectionId) {
            section.classList.remove("hidden");
            triggerSectionLoad(sectionId);
        } else {
            section.classList.add("hidden");
        }
    });
}

function triggerSectionLoad(sectionId) {
    switch (sectionId) {
        case "browse-section":
            if (typeof window.loadUsers === "function") {
                window.loadUsers(0, 10);
            }

        case "friends-section":
            if (typeof window.loadFriends === "function") {
                window.loadFriends(0, 10);
            }
            break;
    }
}