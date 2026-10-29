/**
 * КОРПОРАЙТ.РУ — Скрипт интерактивности приватного дома
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ==========================
    // 1. Адаптивное поведение хедера
    // ==========================
    const header = document.getElementById('header');
    const scrollThreshold = 50;

    const handleScroll = () => {
        const isScrolled = window.scrollY > scrollThreshold;
        header.classList.toggle('scrolled', isScrolled);
        document.documentElement.style.setProperty('--is-scrolled', isScrolled ? '1' : '0');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ==========================
    // 2. Плавное появление элементов при прокрутке
    // ==========================
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -60px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('active'));
    }

    // ==========================
    // 3. Подсветка активного пункта меню при скролле
    // ==========================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');

    if (sections.length && navLinks.length) {
        const handleNavHighlight = () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 150;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', handleNavHighlight, { passive: true });
    }

    // ==========================
    // 4. Маска для телефона и валидация форм
    // ==========================
    const phoneInput = document.querySelector('input[name="phone"]');
    const emailInput = document.querySelector('input[type="email"]');

    // Маска телефона: +7 (___) ___-__-__
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value[0] === '8') {
                    value = '7' + value.slice(1);
                }
                if (value[0] !== '7') {
                    value = '7' + value;
                }
                value = value.substring(0, 10);
                let formatted = '+7';
                if (value.length > 1) formatted += ` (${value.substring(1, 4)}`;
                if (value.length > 4) formatted += `) ${value.substring(4, 7)}`;
                if (value.length > 7) formatted += `-${value.substring(7, 9)}`;
                if (value.length > 9) formatted += `-${value.substring(9, 11)}`;
                e.target.value = formatted;
            }
        });
    }

    // Валидация email
    const validateEmail = (email) => {
        const validateResult = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!validateResult && email) {
            emailInput.setCustomValidity('Пожалуйста, введите корректный email');
        } else {
            emailInput.setCustomValidity('');
        }
    };

    if (emailInput) {
        emailInput.addEventListener('blur', () => validateEmail(emailInput.value));
        emailInput.addEventListener('input', () => {
            if (emailInput.value) {
                emailInput.setCustomValidity('');
            }
        });
    }

    // ==========================
    // 5. Управление модальными окнами
    // ==========================
    const accessModal = document.getElementById('accessModal');
    const triggers = document.querySelectorAll('[data-modal-trigger]');
    const closers = document.querySelectorAll('[data-modal-close]');

    const openModal = (modal) => {
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.body.classList.add('modal-open');
    };

    const closeModal = (modal) => {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
        document.body.classList.remove('modal-open');
    };

    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const target = trigger.getAttribute('data-modal-trigger');

            if (target === 'access') {
                openModal(accessModal);
            } else if (target === 'consultation') {
                const contactSection = document.getElementById('contacts');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => {
                        const firstInput = contactSection.querySelector('input');
                        if (firstInput) firstInput.focus();
                    }, 800);
                }
            }
        });
    });

    // Закрытие модалки по клику на overlay
    const modalOverlay = document.querySelector('.modal__overlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', () => {
            closeModal(accessModal);
        });
    }

    // ==========================
    // 5. Управление мобильным меню
    // ==========================
    const mobileMenu = document.getElementById('mobileMenu');
    const hamburger = document.querySelector('.header__hamburger');
    const mobileMenuClosers = document.querySelectorAll('[data-mobile-menu-close]');

    const toggleMobileMenu = () => {
        const isActive = mobileMenu.classList.toggle('active');
        hamburger.classList.toggle('active', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    };

    const closeMobileMenu = () => {
        mobileMenu.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    mobileMenuClosers.forEach(closer => {
        closer.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (accessModal.classList.contains('active')) {
                closeModal(accessModal);
            } else if (mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        }
    });

    // ==========================
    // 6. Обработка форм
    // ==========================

    // Форма личной аудиенции
    const consultationForm = document.getElementById('consultationForm');
    const formFeedback = document.getElementById('formFeedback');

    if (consultationForm) {
        consultationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = consultationForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;

            const name = consultationForm.querySelector('input[type="text"]').value.trim();
            const email = consultationForm.querySelector('input[type="email"]').value.trim();
            const phone = consultationForm.querySelector('input[name="phone"]').value.trim();

            if (!name || !email || !phone) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                return;
            }

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Шифрование и отправка...</span>';
            submitBtn.style.opacity = '0.8';

            setTimeout(() => {
                consultationForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                submitBtn.style.opacity = '1';

                formFeedback.classList.remove('hidden');
                formFeedback.classList.add('active');
            }, 1500);
        });
    }

    // Форма закрытого доступа
    const accessForm = document.getElementById('accessForm');
    const accessFeedback = document.getElementById('accessFeedback');

    if (accessForm) {
        accessForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = accessForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Проверка домена...</span>';

            setTimeout(() => {
                accessForm.style.display = 'none';
                accessFeedback.classList.remove('hidden');
                accessFeedback.classList.add('active');
            }, 1200);
        });
    }

    // ==========================
    // 7. Плавная навигация по якорным ссылкам
    // ==========================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();

                const sectionId = targetElement.getAttribute('id');
                const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');

                const offset = header.classList.contains('scrolled') ? 80 : 120;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================
    // 8. Дополнительные эффекты
    // ==========================
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            document.body.classList.remove('scrolling');
        }, 100);
    }, { passive: true });
});