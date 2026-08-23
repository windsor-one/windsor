/* =========================================================
   WINDSOR
   INTERACTIONS
========================================================= */

function hidePreloader() {
    const preloader = document.querySelector(".preloader");
    if (!preloader || preloader.classList.contains("loaded")) return;
    preloader.classList.add("loaded");
}

window.addEventListener("load", () => {
    setTimeout(hidePreloader, 450);
});

// Fallback: ningún recurso externo debe dejar la interfaz bloqueada.
setTimeout(hidePreloader, 2000);

/* HEADER — Ocultar al bajar, mostrar al subir */
const header = document.querySelector(".header");
let lastScrollY = window.scrollY;

function updateHeader() {
    if (!header) return;
    const currentScrollY = window.scrollY;
    if (currentScrollY <= 40) {
        header.classList.remove("scrolled", "hidden");
        lastScrollY = currentScrollY;
        return;
    }
    if (currentScrollY > lastScrollY) {
        header.classList.add("hidden");
    } else {
        header.classList.remove("hidden");
    }
    header.classList.add("scrolled");
    lastScrollY = currentScrollY;
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

/* MOBILE MENU */
const menuButton = document.querySelector(".menu-button");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileLinks = document.querySelectorAll(".mobile-menu a");

function closeMobileMenu() {
    if (!mobileMenu || !menuButton) return;
    mobileMenu.classList.remove("active");
    document.body.classList.remove("menu-active");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menú");
}

if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
        const isActive = mobileMenu.classList.toggle("active");
        document.body.classList.toggle("menu-active", isActive);
        menuButton.setAttribute("aria-expanded", String(isActive));
        menuButton.setAttribute("aria-label", isActive ? "Cerrar menú" : "Abrir menú");
    });
}

mobileLinks.forEach(link => {
    link.addEventListener("click", closeMobileMenu);
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMobileMenu();
});

/* FAQ ACCORDION */
const faqItems = document.querySelectorAll(".faq-item");
faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");
    if (!question) return;
    question.setAttribute("aria-expanded", "false");
    question.addEventListener("click", () => {
        const isActive = item.classList.contains("active");
        faqItems.forEach(other => {
            other.classList.remove("active");
            const q = other.querySelector(".faq-question");
            if (q) q.setAttribute("aria-expanded", "false");
        });
        if (!isActive) {
            item.classList.add("active");
            question.setAttribute("aria-expanded", "true");
        }
    });
});

/* SCROLL REVEAL */
const revealElements = document.querySelectorAll(
    ".intro-layout, .seed-main, .service-card, .method-row, .principles-grid > div, .cide-cards article, .careers-layout, .faq-item, .hook-grid, .hook-content, .hook-visual"
);
revealElements.forEach(el => el.setAttribute("data-reveal", ""));
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll("[data-reveal]").forEach(el => observer.observe(el));
} else {
    document.querySelectorAll("[data-reveal]").forEach(el => el.classList.add("visible"));
}

/* STAGGERED CARD ANIMATIONS */
const cardGroups = [
    document.querySelectorAll(".service-card"),
    document.querySelectorAll(".cide-cards article"),
    document.querySelectorAll(".principles-grid > div"),
    document.querySelectorAll(".method-row")
];
cardGroups.forEach(group => {
    group.forEach((el, i) => {
        if (!prefersReducedMotion) el.style.transitionDelay = `${i * 0.08}s`;
    });
});

/* HERO PARALLAX */
const hero = document.querySelector(".hero");
const heroContent = document.querySelector(".hero-content");
let ticking = false;
function updateHeroParallax() {
    if (!hero || !heroContent || prefersReducedMotion || window.innerWidth <= 800) return;
    const scrollPosition = window.scrollY;
    if (scrollPosition < window.innerHeight) {
        heroContent.style.transform = `translate3d(0, ${scrollPosition * 0.12}px, 0)`;
    } else {
        heroContent.style.transform = "";
    }
    ticking = false;
}
window.addEventListener("scroll", () => {
    if (!ticking) {
        window.requestAnimationFrame(updateHeroParallax);
        ticking = true;
    }
}, { passive: true });

/* SERVICE CARD MOUSE MOVEMENT */
const serviceCards = document.querySelectorAll(".service-card");
serviceCards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
        if (prefersReducedMotion || window.innerWidth <= 800) return;
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotateX = (0.5 - y) * 4;
        const rotateY = (x - 0.5) * 4;
        card.style.transform = `translateY(-10px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; });
});

/* ACTIVE NAVIGATION */
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".desktop-nav a");
if ("IntersectionObserver" in window && sections.length) {
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            navLinks.forEach(link => {
                link.classList.remove("active");
                if (link.getAttribute("href") === `#${entry.target.id}`) {
                    link.classList.add("active");
                }
            });
        });
    }, { threshold: 0.25, rootMargin: "-10% 0px -60% 0px" });
    sections.forEach(section => navObserver.observe(section));
}

/* CLOSE MENU ON RESIZE */
window.addEventListener("resize", () => {
    if (window.innerWidth > 800) closeMobileMenu();
});

/* SMOOTH INTERNAL LINKS */
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", (e) => {
        const targetId = link.getAttribute("href");
        if (!targetId || targetId === "#") return;
        const target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "start"
        });
    });
});
