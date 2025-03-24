if (/Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  window.location.href = "mobile.html";
}
document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    const themeSwitcher = document.querySelector('.theme-switcher');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    const copyMessage = document.getElementById('copyMessage');
    const body = document.body;

    // Theme Switcher
    themeSwitcher.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        body.classList.toggle('light-theme');
        localStorage.setItem('theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.classList.add(savedTheme + '-theme');

    // Debounce function for scroll events
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    // Smooth scrolling and navbar update
    const updateNavAndSections = debounce(() => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
            const sectionTopVisible = section.offsetTop - window.innerHeight * 0.8;
            if (scrollY >= sectionTopVisible) {
                section.querySelector('.section-heading')?.classList.add('visible');
                section.querySelectorAll('.skill-level').forEach(bar => bar.classList.add('visible'));
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, 10);

    window.addEventListener('scroll', updateNavAndSections);

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            window.scrollTo({
                top: targetId === '#home' ? 0 : targetSection.offsetTop,
                behavior: 'smooth'
            });
        });
    });

    // Video slider drag-to-slide and arrows
    document.querySelectorAll('.video-section').forEach(section => {
        const slider = section.querySelector('.video-slider');
        const leftArrow = section.querySelector('.left-arrow');
        const rightArrow = section.querySelector('.right-arrow');
        let isDragging = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
            slider.style.cursor = 'grabbing';
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        });

        slider.addEventListener('mouseup', () => {
            isDragging = false;
            slider.style.cursor = 'grab';
        });

        slider.addEventListener('mouseleave', () => {
            isDragging = false;
            slider.style.cursor = 'grab';
        });

        leftArrow.addEventListener('click', () => {
            slider.scrollLeft -= 200;
        });

        rightArrow.addEventListener('click', () => {
            slider.scrollLeft += 200;
        });

        slider.addEventListener('scroll', () => {
            leftArrow.style.opacity = slider.scrollLeft > 0 ? '1' : '0.5';
            rightArrow.style.opacity = slider.scrollLeft + slider.clientWidth < slider.scrollWidth ? '1' : '0.5';
        });
    });

    // Testimonial slider with arrows
    const testimonials = document.querySelectorAll('.testimonial');
    const leftArrow = document.querySelector('#testimonials .left-arrow');
    const rightArrow = document.querySelector('#testimonials .right-arrow');
    let currentIndex = 0;

    function updateTestimonials() {
        testimonials.forEach((t, i) => {
            const offset = (i - currentIndex + 5) % 5;
            t.classList.remove('position-1', 'position-2', 'position-3', 'position-4', 'position-5');
            if (offset === 0) t.classList.add('position-1');
            else if (offset === 1) t.classList.add('position-2');
            else if (offset === 2) t.classList.add('position-3');
            else if (offset === 3) t.classList.add('position-4');
            else if (offset === 4) t.classList.add('position-5');
        });

        setTimeout(() => {
            const middleCard = document.querySelector('.testimonial.position-3');
            const stars = middleCard.querySelectorAll('.stars span');
            stars.forEach((star, i) => {
                setTimeout(() => star.classList.add('active'), i * 100);
            });
        }, 500);
    }

    function resetStars() {
        testimonials.forEach(t => {
            t.querySelectorAll('.stars span').forEach(star => star.classList.remove('active'));
        });
    }

    leftArrow.addEventListener('click', () => {
        resetStars();
        currentIndex = (currentIndex - 1 + 5) % 5;
        updateTestimonials();
    });

    rightArrow.addEventListener('click', () => {
        resetStars();
        currentIndex = (currentIndex + 1) % 5;
        updateTestimonials();
    });

    setInterval(() => {
        resetStars();
        currentIndex = (currentIndex + 1) % 5;
        updateTestimonials();
    }, 5000);

    updateTestimonials();

    // Copy contact info to clipboard with message
    document.querySelectorAll('.contact-item').forEach(item => {
        item.addEventListener('click', () => {
            const text = item.getAttribute('data-copy');
            navigator.clipboard.writeText(text).then(() => {
                copyMessage.style.opacity = '1';
                setTimeout(() => copyMessage.style.opacity = '0', 2000);
            });
        });
    });
});
