// =================================
// DARK MODE
// =================================
const themeButtons = document.querySelectorAll(
    '.header-theme-button, .ap-theme-button'
);

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}

const savedTheme = localStorage.getItem('aralkap-theme') || 'light';
applyTheme(savedTheme);

themeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const currentTheme =
            document.documentElement.getAttribute('data-theme');

        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        localStorage.setItem('aralkap-theme', newTheme);
        applyTheme(newTheme);
    });
});


// =================================
// SIDEBAR COLLAPSE
// =================================

const sidebarToggle = document.getElementById('sidebar-toggle');

if (sidebarToggle) {

    const mobileView = window.matchMedia('(max-width: 700px)');

    function syncSidebar() {
        if (mobileView.matches) {
            // Mobile starts with drawer closed
            sidebarToggle.checked = false;
        } else {
            // Restore saved desktop sidebar state
            sidebarToggle.checked =
                localStorage.getItem('sidebarCollapsed') === 'true';
        }

        document.documentElement.classList.add('sidebar-ready');
    }

    syncSidebar();

    sidebarToggle.addEventListener('change', function () {
        // Save collapsed state only on desktop
        if (!mobileView.matches) {
            localStorage.setItem('sidebarCollapsed', this.checked);
        }
    });

    // Handle switching between mobile and desktop sizes
    mobileView.addEventListener('change', syncSidebar);
}

/* ==========================================================================
LOGIN PAGE JAVASCRIPT
   ========================================================================== */

(() => {
    const authPage = document.querySelector('.auth-page');

    if (!authPage) return;

    const views = authPage.querySelectorAll('.auth-view');

    function showView(viewId) {
        views.forEach(view => {
            view.hidden = view.id !== viewId;
        });

        authPage.querySelectorAll('.form-message').forEach(message => {
            message.textContent = '';
        });
    }

    // Switch authentication views
    authPage.querySelectorAll('[data-show]').forEach(button => {
        button.addEventListener('click', () => {
            showView(button.dataset.show);
        });
    });

    // Password visibility
    authPage.querySelectorAll('[data-toggle-password]').forEach(button => {
    button.addEventListener('click', () => {
        const input = authPage.querySelector(
            `#${button.dataset.togglePassword}`
        );

        if (!input) return;

        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';

        button.querySelector('img').src = show
            ? 'Icons/hide.png'
            : 'Icons/show.png';

        button.setAttribute(
            'aria-label',
            show ? 'Hide password' : 'Show password'
            );
        });
    });

        // Regular login
    const loginForm = authPage.querySelector('#login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async event => {
            event.preventDefault();

            const message = authPage.querySelector('#login-message');
            const submitButton = loginForm.querySelector(
                'button[type="submit"]'
            );

            message.textContent = '';

            submitButton.disabled = true;
            submitButton.textContent = 'Logging in...';

            try {
                const response = await fetch('#PRE-DITO-PHP-FILE', {
                    method: 'POST',
                    body: new FormData(loginForm)
                });

                const result = await response.json();

                message.textContent = result.message;

                if (result.success) {
                    window.location.href = result.redirect;
                }

            } catch (error) {
                message.textContent = 'Unable to connect to the server.';
            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Log In <span>→</span>';
            }
        });
    }

    // Registration
    const signupForm = authPage.querySelector('#signup-form');

    if (signupForm) {
        signupForm.addEventListener('submit', async event => {
            event.preventDefault();

            const message = authPage.querySelector('#signup-message');
            const submitButton = signupForm.querySelector(
                'button[type="submit"]'
            );

            message.textContent = '';

            submitButton.disabled = true;
            submitButton.textContent = 'Creating account...';

            try {
                const response = await fetch('#PRE-DITO-PHP-FILE', {
                    method: 'POST',
                    body: new FormData(signupForm)
                });

                const result = await response.json();

                message.textContent = result.message;

                if (result.success) {
                    window.location.href = 'login.html';
                }

            } catch (error) {
                message.textContent = 'Unable to connect to the server.';
            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Create Account <span>→</span>';
            }
        });
    }

    // Forgot password
    const forgotForm = authPage.querySelector('#forgot-form');

    if (forgotForm) {
        forgotForm.addEventListener('submit', event => {
            event.preventDefault();

            authPage.querySelector('#forgot-message').textContent =
                'Password recovery is not connected yet. Email verification will be implemented next.';
        });
    }

    // Google Sign-In
const GOOGLE_CLIENT_ID = '243717404650-7qon8b91ttet6ut512gmr13jc7dkfl82.apps.googleusercontent.com';

function handleGoogleCredential(response) {
    const message = authPage.querySelector('#google-message');

    if (!message || !response.credential) return;

    message.textContent =
        'Google account selected. Backend verification is not connected yet.';
}

function initializeGoogleSignIn() {
    const googleButton = authPage.querySelector('#google-signin-button');

    if (!googleButton || !window.google?.accounts?.id) return;

    google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential
    });

    google.accounts.id.renderButton(googleButton, {
        theme: 'outline',
        size: 'large',
        shape: 'rectangular',
        text: 'continue_with',
        width: 350
    });
}

const googleScript = document.querySelector(
    'script[src="https://accounts.google.com/gsi/client"]'
);

if (window.google?.accounts?.id) {
    initializeGoogleSignIn();
} else if (googleScript) {
    googleScript.addEventListener('load', initializeGoogleSignIn, {
        once: true
    });
}

    // Wait for Google's library to load
    if (window.google?.accounts?.id) {
        initializeGoogleSignIn();
    } else {
        window.addEventListener('load', initializeGoogleSignIn, {
            once: true
        });
    }

})();


// =================================
// TASK CREATION FORM FUNCTIONALITY
// =================================

document.addEventListener("DOMContentLoaded", function () {

    const taskModal = document.getElementById("task-modal");

    // Only run on the My Tasks page
    if (!taskModal) return;

    const addTaskButtons = document.querySelectorAll(".add-task-button");
    const closeButtons = taskModal.querySelectorAll("[data-close-modal]");
    const taskForm = document.getElementById("task-form");

    // Open modal
    addTaskButtons.forEach(button => {
        button.addEventListener("click", function () {
            taskModal.hidden = false;
        });
    });

    // Close modal
    closeButtons.forEach(button => {
        button.addEventListener("click", function () {
            taskModal.hidden = true;
        });
    });

    // Close with Escape key
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !taskModal.hidden) {
            taskModal.hidden = true;
        }
    });

    // Prevent form from refreshing the page for now
    taskForm.addEventListener("submit", function (event) {
        event.preventDefault();

        alert("Task form is working!");

    });

});


// =================================
// BAON TRACKER FORM FUNCTIONALITY
// =================================

document.addEventListener("DOMContentLoaded", function () {

    const baonModal = document.getElementById("baon-modal");

    // Only run on the Baon Tracker page
    if (!baonModal) return;

    const addTransactionButton = document.querySelector(
        ".baon-primary-button"
    );

    const closeButtons = baonModal.querySelectorAll("[data-close-modal]");

    const baonForm = document.getElementById("baon-form");

    // Open modal
    if (addTransactionButton) {
        addTransactionButton.addEventListener("click", function () {
            baonModal.hidden = false;
        });
    }

    // Close modal
    closeButtons.forEach(button => {
        button.addEventListener("click", function () {
            baonModal.hidden = true;
        });
    });

    // Close using Escape
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !baonModal.hidden) {
            baonModal.hidden = true;
        }
    });

    // Temporary form test
    baonForm.addEventListener("submit", function (event) {
        event.preventDefault();

        alert("Transaction form is working!");

    });

});


// =================================
// ACASSISTANT FRONTEND DEMO
// =================================

document.addEventListener("DOMContentLoaded", function () {

    const chatMessages = document.querySelector(".aa-chat-messages");
    const messageInput = document.getElementById("aa-message-input");
    const sendButton = document.getElementById("aa-send-button");
    const suggestionCards = document.querySelectorAll(".aa-suggestion-card");

    
    if (!chatMessages || !messageInput || !sendButton) return;

    
    function addMessage(message, sender) {

        const messageWrapper = document.createElement("div");
        messageWrapper.classList.add("aa-message");

        if (sender === "user") {
            messageWrapper.classList.add("aa-user-message");
        }

        const avatar = document.createElement("div");
        avatar.classList.add("aa-message-avatar");
        avatar.textContent = sender === "user" ? "👤" : "🤖";

        const content = document.createElement("div");
        content.classList.add("aa-message-content");

        const name = document.createElement("span");
        name.textContent = sender === "user" ? "You" : "Acassistant";

        const paragraph = document.createElement("p");
        paragraph.textContent = message;

        content.appendChild(name);
        content.appendChild(paragraph);

        messageWrapper.appendChild(avatar);
        messageWrapper.appendChild(content);

        chatMessages.appendChild(messageWrapper);

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    
    function getResponse(message) {

        const text = message.toLowerCase();

        if (text.includes("study schedule") ||
            text.includes("study plan") ||
            text.includes("schedule")) {

            return "Let's organize your study time! Start by listing your subjects, identifying your upcoming deadlines, and setting aside focused study periods. Remember to include short breaks.";

        }

        if (text.includes("homework") ||
            text.includes("assignment")) {

            return "I'd be happy to help with your homework! Send me the question or instructions, and we'll work through it step by step.";

        }

        if (text.includes("writing") ||
            text.includes("essay") ||
            text.includes("report")) {

            return "I can help improve your writing! Send me your paragraph, essay, or report. I'll help you improve its grammar, clarity, and organization.";

        }

        if (text.includes("explain") ||
            text.includes("lesson") ||
            text.includes("understand") ||
            text.includes("study")) {

            return "Of course! Tell me the specific subject or topic you're studying. I'll help explain it in simpler terms and provide examples.";

        }

        return "Thanks for your message! I'm currently running in frontend demo mode, so my responses are simulated. In the actual AI version, I'll be able to understand and answer your questions.";
    }

    function sendMessage(message = messageInput.value) {

        const trimmedMessage = message.trim();

        if (!trimmedMessage) return;

        addMessage(trimmedMessage, "user");

        messageInput.value = "";

        
        setTimeout(function () {
            const response = getResponse(trimmedMessage);
            addMessage(response, "assistant");
        }, 500);
    }

    
    sendButton.addEventListener("click", function () {
        sendMessage();
    });

    
    messageInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    });

    
    suggestionCards.forEach(card => {

        card.style.cursor = "pointer";

        card.addEventListener("click", function () {

            const prompt = card.dataset.prompt;

            if (prompt) {
                sendMessage(prompt);
                messageInput.focus();
            }

        });

    });

});

// =================================
// LOGOUT FUNCTIONALITY
// =================================

document.addEventListener("DOMContentLoaded", function () {

    const logoutButtons = document.querySelectorAll(".logout-button");

    logoutButtons.forEach(button => {

        button.addEventListener("click", function () {

            const confirmLogout = confirm(
                "Are you sure you want to log out?"
            );
            if (confirmLogout) {

                const loginPath =
                    window.location.pathname.includes("/Pages/")
                        ? "../login.html"
                        : "login.html";

                window.location.href = loginPath;
            }

        });

    });

});


document.addEventListener("DOMContentLoaded", function () {

    // MOBILE NAVIGATION
    const menuToggle = document.getElementById("landing-menu-toggle");
    const navLinks = document.getElementById("landing-nav-links");

    menuToggle.addEventListener("click", function () {
        const isOpen = navLinks.classList.toggle("show");
        menuToggle.setAttribute("aria-expanded", isOpen);
    });

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", function () {
            navLinks.classList.remove("show");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });


   // 3D FEATURE CAROUSEL

const track = document.getElementById("landing-carousel-track");
const slides = document.querySelectorAll(".landing-feature-slide");
const dots = document.querySelectorAll(".carousel-dot");
const prev = document.getElementById("carousel-prev");
const next = document.getElementById("carousel-next");

let currentSlide = 0;

function showSlide(index) {
    if (!track || slides.length === 0) return;

    currentSlide = (index + slides.length) % slides.length;

    const previousSlide =
        (currentSlide - 1 + slides.length) % slides.length;

    const nextSlide =
        (currentSlide + 1) % slides.length;

    slides.forEach((slide, i) => {
        slide.classList.remove(
            "is-active",
            "is-prev",
            "is-next"
        );

        if (i === currentSlide) {
            slide.classList.add("is-active");
        } else if (i === previousSlide) {
            slide.classList.add("is-prev");
        } else if (i === nextSlide) {
            slide.classList.add("is-next");
        }
    });

    dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentSlide);
    });
}

// Initialize even if arrow buttons don't exist
if (track && slides.length > 0) {

    if (next) {
        next.addEventListener("click", () => {
            showSlide(currentSlide + 1);
        });
    }

    if (prev) {
        prev.addEventListener("click", () => {
            showSlide(currentSlide - 1);
        });
    }

    dots.forEach(dot => {
        dot.addEventListener("click", () => {
            showSlide(Number(dot.dataset.slide));
        });
    });

    // Show the first slide immediately
    showSlide(0);
}
});

// SCROLL FADE IN
const revealElements = document.querySelectorAll(
    '.landing-section-heading, .landing-carousel-window, .landing-cta, .landing-footer, .about-story, .about-cta, .about-purpose, .about-offers, .landing-hero, .about-hero, .about-team'
);

revealElements.forEach(element => {
    element.classList.add('scroll-reveal');
});

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.35
});

revealElements.forEach(element => {
    revealObserver.observe(element);
});
