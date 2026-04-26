
/* ════════════════════════════════════
   MOBILE MENU — bouton <button> accessible
════════════════════════════════════ */
const menuBtn  = document.getElementById('menu-icon');
const navList  = document.getElementById('nav-list');

menuBtn.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('active');
    menuBtn.setAttribute('aria-expanded', isOpen);
    // Icône hamburger ↔ croix
    menuBtn.querySelector('i').classList.toggle('bx-menu', !isOpen);
    menuBtn.querySelector('i').classList.toggle('bx-x',    isOpen);
});

// Fermer le menu au clic sur un lien
document.querySelectorAll('#nav-list a').forEach(link => {
    link.addEventListener('click', () => {
        navList.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.querySelector('i').classList.replace('bx-x', 'bx-menu');
    });
});

/* ════════════════════════════════════
   3D SECTION TRANSITIONS
════════════════════════════════════ */
const sections   = document.querySelectorAll('section');
const navAnchors = document.querySelectorAll('#nav-list a');
const barsAnim   = document.querySelector('.bars-animation');

const BARS_COVER = 600 + 6 * 70;  // ms avant que les barres couvrent l'écran
const BARS_TOTAL = 1100 + 6 * 70; // ms avant que les barres disparaissent

let currentSection = 'home';
let isAnimating    = false;

function activateSection(targetId) {
    if (isAnimating || targetId === currentSection) return;
    isAnimating = true;

    // 1 — barres vers le bas (couvrent l'écran)
    barsAnim.classList.remove('up', 'down', 'active');
    void barsAnim.offsetWidth; // force reflow
    barsAnim.classList.add('active', 'down');

    setTimeout(() => {
        // 2 — changer la section
        sections.forEach(s => s.classList.remove('active'));
        const target = document.querySelector('#' + targetId);
        if (target) { target.classList.add('active'); target.scrollTop = 0; }

        navAnchors.forEach(a => {
            const isActive = a.getAttribute('href') === '#' + targetId;
            a.classList.toggle('active', isActive);
            a.setAttribute('aria-current', isActive ? 'page' : 'false');
        });
        currentSection = targetId;

        // 3 — barres vers le haut (révèlent la nouvelle section)
        barsAnim.classList.remove('down');
        void barsAnim.offsetWidth;
        barsAnim.classList.add('up');

        setTimeout(() => {
            barsAnim.classList.remove('active', 'up');
            isAnimating = false;
        }, BARS_TOTAL);

    }, BARS_COVER);
}

navAnchors.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        activateSection(link.getAttribute('href').replace('#', ''));
    });
});

// Activer Home au chargement
document.querySelector('#home').classList.add('active');

// Navigation clavier ← →
document.addEventListener('keydown', e => {
    const order = ['home', 'Services', 'resume', 'portfolio', 'contact'];
    const idx   = order.indexOf(currentSection);
    if ((e.key === 'ArrowRight' || e.key === 'ArrowDown') && idx < order.length - 1) {
        activateSection(order[idx + 1]);
    }
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowUp') && idx > 0) {
        activateSection(order[idx - 1]);
    }
});

/* ════════════════════════════════════
   ONGLETS RESUME — tablist accessible
════════════════════════════════════ */
const resumeBtns    = document.querySelectorAll('.resume-btn[role="tab"]');
const resumeDetails = document.querySelectorAll('.resume-detail');

function activateTab(idx) {
    resumeBtns.forEach((b, i) => {
        const isActive = i === idx;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-selected', isActive);
    });
    resumeDetails.forEach((d, i) => {
        const isActive = i === idx;
        d.classList.toggle('active', isActive);
        // hidden pour les lecteurs d'écran
        if (isActive) d.removeAttribute('hidden');
        else d.setAttribute('hidden', '');
    });
}

resumeBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => activateTab(i));
    // Navigation clavier dans le tablist
    btn.addEventListener('keydown', e => {
        if (e.key === 'ArrowDown') { e.preventDefault(); resumeBtns[Math.min(i + 1, resumeBtns.length - 1)].focus(); }
        if (e.key === 'ArrowUp')   { e.preventDefault(); resumeBtns[Math.max(i - 1, 0)].focus(); }
        if (e.key === 'Home')      { e.preventDefault(); resumeBtns[0].focus(); }
        if (e.key === 'End')       { e.preventDefault(); resumeBtns[resumeBtns.length - 1].focus(); }
    });
});

// Premier panneau visible par défaut
activateTab(0);

/* ════════════════════════════════════
   CAROUSEL PORTFOLIO
════════════════════════════════════ */
const arrowRight       = document.querySelector('.navigation .arrow-right');
const arrowLeft        = document.querySelector('.navigation .arrow-left');
const imgSlide         = document.querySelector('.portfolio-carousel .img-slide');
const portfolioDetails = document.querySelectorAll('.portfolio-detail');
const totalSlides      = portfolioDetails.length;
let   pIdx             = 0;

function updateCarousel() {
    imgSlide.style.transform = `translateX(calc(${pIdx * -100}% - ${pIdx * 2}rem))`;
    portfolioDetails.forEach((d, i) => d.classList.toggle('active', i === pIdx));

    const atStart = pIdx === 0;
    const atEnd   = pIdx === totalSlides - 1;

    arrowLeft.classList.toggle('disabled', atStart);
    arrowLeft.setAttribute('aria-disabled', atStart);

    arrowRight.classList.toggle('disabled', atEnd);
    arrowRight.setAttribute('aria-disabled', atEnd);
}

arrowRight.addEventListener('click', () => {
    if (pIdx < totalSlides - 1) { pIdx++; updateCarousel(); }
});
arrowLeft.addEventListener('click', () => {
    if (pIdx > 0) { pIdx--; updateCarousel(); }
});

/* ════════════════════════════════════
   BOUTON SCROLL TO TOP
════════════════════════════════════ */
const scrollBtn = document.createElement('button');
scrollBtn.className = 'scroll-top';
scrollBtn.setAttribute('aria-label', 'Retour en haut de la page');
scrollBtn.innerHTML = "<i class='bx bx-chevron-up' aria-hidden='true'></i>";
document.body.appendChild(scrollBtn);

sections.forEach(sec => {
    sec.addEventListener('scroll', () => {
        scrollBtn.classList.toggle('visible', sec.scrollTop > 250);
    });
});
scrollBtn.addEventListener('click', () => {
    document.querySelector('section.active')?.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ════════════════════════════════════
   NETLIFY FORMS — soumission AJAX
   (sans rechargement de page)
════════════════════════════════════ */
/*
- Utilise fetch() pour envoyer les données du formulaire à Netlify.
- Affiche un message de succès ou d'erreur sans recharger la page.
- Gère l'état du bouton de soumission (chargement, désactivé).
- Valide le formulaire avec HTML5 avant l'envoi.*/
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
const formError   = document.getElementById('form-error');
const formFields  = document.getElementById('form-fields');
const submitBtn   = document.getElementById('submit-btn');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validation HTML5
    if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
    }

    // État chargement
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').style.display    = 'none';
    submitBtn.querySelector('.btn-icon').style.display    = 'none';
    submitBtn.querySelector('.btn-loading').style.display = 'inline-flex';
    formError.classList.remove('visible');

    const formData = new FormData(contactForm);

    fetch('/', {
        method:  'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body:    new URLSearchParams(formData).toString(),
    })
    .then((res) => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        // ✅ Succès
        formFields.style.display = 'none';
        submitBtn.style.display  = 'none';
        formSuccess.classList.add('visible');
        contactForm.reset();
    })
    .catch(() => {
        // ❌ Erreur
        formError.classList.add('visible');
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').style.display    = 'inline';
        submitBtn.querySelector('.btn-icon').style.display    = 'inline';
        submitBtn.querySelector('.btn-loading').style.display = 'none';
    });
});
