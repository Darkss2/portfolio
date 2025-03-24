document.addEventListener('DOMContentLoaded', () => {
    const themeSwitcher = document.querySelector('.theme-switcher');
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav a');
    const copyMessage = document.getElementById('copyMessage');
    const popup = document.getElementById('linkPopup');
    const popupText = document.getElementById('popupText');
    const copyBtn = document.getElementById('copyBtn');
    const goBtn = document.getElementById('goBtn');
    const closeBtn = document.getElementById('closeBtn');
    const body = document.body;

    // Theme Switcher
    themeSwitcher.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        body.classList.toggle('light-theme');
        localStorage.setItem('theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
    });

    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.classList.add(savedTheme + '-theme');

    // Mobile Menu Toggle
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
    });

    // Smooth Scroll and Nav Update
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            window.scrollTo({
                top: targetId === '#home' ? 0 : targetSection.offsetTop,
                behavior: 'smooth'
            });
            nav.classList.remove('active');
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Scroll Animations
    const sections = document.querySelectorAll('section');
    const updateVisibility = () => {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.8) {
                section.querySelector('.section-heading')?.classList.add('visible');
                section.querySelectorAll('.skill-level').forEach(bar => bar.classList.add('visible'));
            }
        });
    };
    window.addEventListener('scroll', updateVisibility);
    updateVisibility();

    // Popup for Contact Items and Social Links
    const contactItems = document.querySelectorAll('.contact-item');
    const socialIcons = document.querySelectorAll('.social-icon');
    let currentValue = '';

    const showPopup = (value, isLink = false) => {
        currentValue = value;
        popupText.textContent = isLink ? `Link: ${value}` : `Value: ${value}`;
        popup.style.display = 'block';
        goBtn.style.display = isLink ? 'inline-block' : 'none';
    };

    const hidePopup = () => {
        popup.style.display = 'none';
    };

    contactItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const value = item.getAttribute('data-value');
            showPopup(value);
        });
    });

    socialIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            const link = icon.getAttribute('data-link');
            showPopup(link, true);
        });
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(currentValue).then(() => {
            copyMessage.style.opacity = '1';
            setTimeout(() => copyMessage.style.opacity = '0', 1500);
            hidePopup();
        });
    });

    goBtn.addEventListener('click', () => {
        window.open(currentValue, '_blank');
        hidePopup();
    });

    closeBtn.addEventListener('click', hidePopup);
});