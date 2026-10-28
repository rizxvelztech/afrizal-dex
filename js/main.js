(function () {
    const loadingScreen = document.getElementById('loadingScreen');
    const mainContent = document.getElementById('mainContent');
    const barFill = document.getElementById('loadingBarFill');
    const percentEl = document.getElementById('loadingPercent');
    const loadingText = document.getElementById('loadingText');

    const loadingMessages = [
        'Initializing portfolio...',
        'Loading components...',
        'Preparing experience...',
        'Almost ready...',
        'Welcome!'
    ];
    let msgIndex = 0, charIndex = 0, isDeleting = false;

    function typeLoadingMessage() {
        const current = loadingMessages[msgIndex];
        if (!isDeleting) {
            loadingText.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === current.length) {
                isDeleting = true;
                setTimeout(typeLoadingMessage, 1200);
                return;
            }
            setTimeout(typeLoadingMessage, 60);
        } else {
            loadingText.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                msgIndex = (msgIndex + 1) % loadingMessages.length;
                setTimeout(typeLoadingMessage, 300);
                return;
            }
            setTimeout(typeLoadingMessage, 30);
        }
    }
    setTimeout(typeLoadingMessage, 400);

    let progress = 0;
    const interval = setInterval(() => {
        const increment = Math.floor(Math.random() * 10) + 3;
        progress = Math.min(progress + increment, 100);
        barFill.style.width = progress + '%';
        percentEl.textContent = progress + '%';
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.classList.add('hide');
                document.body.classList.remove('loading');
                mainContent.classList.add('show');
                
                if (typeof initAudio === 'function') initAudio();
                window.dispatchEvent(new Event('scroll'));

                setTimeout(() => {
                    window.dispatchEvent(new Event('loadingSelesai'));
                }, 300);

            }, 400);
        }
    }, 300);

    setTimeout(() => {
        if (!loadingScreen.classList.contains('hide')) {
            loadingScreen.classList.add('hide');
            document.body.classList.remove('loading');
            mainContent.classList.add('show');
            window.dispatchEvent(new Event('scroll'));
            
            setTimeout(() => {
                window.dispatchEvent(new Event('loadingSelesai'));
            }, 300);
        }
    }, 10000);
})();

const audio = document.getElementById('bgAudio');
const btn = document.getElementById('audioToggle');
let isPlaying = false;
let started = false;

function toggleAudio() {
    if (audio.paused) {
        audio.play().then(() => {
            isPlaying = true;
            started = true;
            btn.classList.add('playing');
        }).catch(() => {});
    } else {
        audio.pause();
        isPlaying = false;
        btn.classList.remove('playing');
    }
}

function startAudio() {
    if (started) return;
    audio.play().then(() => {
        isPlaying = true;
        started = true;
        btn.classList.add('playing');
    }).catch(() => {});
}

function initAudio() {
    window.addEventListener('scroll', startAudio, { once: true, passive: true });
    document.addEventListener('click', startAudio, { once: true });
    document.addEventListener('touchstart', startAudio, { once: true, passive: true });
}

const descText = "A passionate developer and programmer creating digital solutions through innovative code.";
const descElement = document.getElementById('typing-desc');
let descIndex = 0;
let isTypingStarted = false;

function removeDescCursor() {
    const c = document.querySelector('.typing-cursor-desc');
    if (c) c.style.display = 'none';
}

function typeDesc() {
    if (isTypingStarted) return;
    isTypingStarted = true;

    function type() {
        if (descIndex < descText.length) {
            descElement.textContent += descText.charAt(descIndex);
            descIndex++;
            setTimeout(type, 30);
        } else {
            removeDescCursor();
        }
    }
    type();
}

window.addEventListener('loadingSelesai', typeDesc);

const textName1 = "Afrizal";
const textName2 = "Maulana";
const elName1 = document.getElementById('typing-hero-1');
const elName2 = document.getElementById('typing-hero-2');
const heroTitleContainer = document.getElementById('hero-title-container');

let heroTypingTimer1 = null;
let heroTypingTimer2 = null;
let isHeroTyping = false;

function resetAndTypeHero() {
    if (heroTypingTimer1) clearTimeout(heroTypingTimer1);
    if (heroTypingTimer2) clearTimeout(heroTypingTimer2);
    
    elName1.textContent = "";
    elName2.textContent = "";
    isHeroTyping = true;
    
    let i1 = 0;
    let i2 = 0;

    function typeName1() {
        if (i1 < textName1.length) {
            elName1.textContent += textName1.charAt(i1);
            i1++;
            heroTypingTimer1 = setTimeout(typeName1, 80);
        } else {
            typeName2();
        }
    }

    function typeName2() {
        if (i2 < textName2.length) {
            elName2.textContent += textName2.charAt(i2);
            i2++;
            heroTypingTimer2 = setTimeout(typeName2, 80);
        } else {
            isHeroTyping = false;
        }
    }

    typeName1();
}

window.addEventListener('loadingSelesai', resetAndTypeHero);

document.addEventListener('alpine:init', () => {
    Alpine.data('dragCard', () => ({
        x: 0, y: 0, rotate: 0, scale: 1,
        startX: 0, startY: 0, isDragging: false,
        startDrag(e) {
            this.isDragging = true;
            this.scale = 1.05;
            const point = e.touches ? e.touches[0] : e;
            this.startX = point.clientX - this.x;
            this.startY = point.clientY - this.y;
        },
        onDrag(e) {
            if (!this.isDragging) return;
            const point = e.touches ? e.touches[0] : e;
            this.x = point.clientX - this.startX;
            this.y = point.clientY - this.startY;
            this.rotate = this.x * 0.05;
        },
        endDrag() {
            if (!this.isDragging) return;
            this.isDragging = false;
            this.scale = 1;
            this.rotate = 0;
            setTimeout(() => {
                this.x = 0;
                this.y = 0;
            }, 100);
        }
    }));
});

document.addEventListener('alpine:init', () => {
    Alpine.data('app', () => ({
        dark: true, // ✅ DEFAULT HITAM
        scrolled: false,
        mobileMenu: false,
        activeTab: 'projects',
        activeSection: 'hero',
        currentAge: 14,

        init() {
            // ✅ Default dark, kecuali user pernah pilih 'light'
            const saved = localStorage.getItem('theme');
            this.dark = saved !== 'light';

            this.applyTheme();
            this.$watch('dark', () => this.applyTheme());

            // Hanya ikuti OS kalau user belum pernah pilih
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    this.dark = e.matches;
                }
            });

            const birthDate = new Date(2011, 4, 12);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
            this.currentAge = age;

            window.addEventListener('scroll', () => {
                this.scrolled = window.scrollY > 50;
                const sections = ['hero', 'about', 'portfolio', 'contact'];
                let current = 'hero';
                for (const s of sections) {
                    const el = document.getElementById(s);
                    if (el && el.getBoundingClientRect().top <= 100) current = s;
                }
                this.activeSection = current;
            }, { passive: true });

            const lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: 'vertical',
                smoothWheel: true,
            });

            let isTicking = false;
            
            function checkReveal() {
                const reveals = document.querySelectorAll('.reveal');
                const windowHeight = window.innerHeight;
                
                reveals.forEach(el => {
                    const rect = el.getBoundingClientRect();
                    if (rect.top < windowHeight - 50 && rect.bottom > 0) {
                        el.classList.add('visible');
                    } else {
                        el.classList.remove('visible'); 
                    }
                });

                if (heroTitleContainer) {
                    const rectHero = heroTitleContainer.getBoundingClientRect();
                    if (rectHero.top < windowHeight - 50 && rectHero.bottom > 0 && !isHeroTyping) {
                        if (elName1.textContent.length === 0) {
                            resetAndTypeHero();
                        }
                    } 
                    else if (rectHero.bottom < -100) {
                        elName1.textContent = "";
                        elName2.textContent = "";
                    }
                }

                isTicking = false;
            }

            function onScroll() {
                if (!isTicking) {
                    window.requestAnimationFrame(checkReveal);
                    isTicking = true;
                }
            }

            setTimeout(checkReveal, 100);
            window.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('resize', onScroll, { passive: true });
            lenis.on('scroll', onScroll);

            const raf = (time) => {
                lenis.raf(time);
                requestAnimationFrame(raf);
            };
            requestAnimationFrame(raf);
        },

        applyTheme() {
            document.documentElement.classList.toggle('dark', this.dark);
            localStorage.setItem('theme', this.dark ? 'dark' : 'light');
            const meta = document.getElementById('metaThemeColor');
            if (meta) meta.setAttribute('content', this.dark ? '#0a0a0a' : '#ffffff');
        }
    }));
});

/* ============================================
   CONTACT FORM - FormSubmit.co Integration
   ============================================
   GANTI EMAIL DI BAWAH dengan email Gmail kamu.
   Setelah submit pertama kali, FormSubmit akan
   kirim email verifikasi -> klik link verifikasi.
   Setelah itu 100% berfungsi.
   ============================================ */
const CONTACT_EMAIL = "afrizalsecurity99@gmail.com"; // ← GANTI DENGAN GMAIL KAMU!

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const nameInput = document.getElementById('cf-name');
    const emailInput = document.getElementById('cf-email');
    const messageInput = document.getElementById('cf-message');
    const submitBtn = document.getElementById('cf-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnIcon = submitBtn.querySelector('.btn-icon');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');

    // ---- TOAST HELPER ----
    function showToast(message, type = 'success') {
        const old = document.querySelector('.toast');
        if (old) old.remove();

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i><span>${message}</span>`;
        document.body.appendChild(toast);

        requestAnimationFrame(() => toast.classList.add('show'));

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }

    // ---- VALIDATION HELPERS ----
    function setError(input, msgEl, message) {
        input.classList.add('input-error');
        msgEl.textContent = message;
        msgEl.classList.add('show');
    }
    function clearError(input, msgEl) {
        input.classList.remove('input-error');
        msgEl.textContent = '';
        msgEl.classList.remove('show');
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    }

    function validateForm() {
        let valid = true;

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        // Name
        if (name.length < 2) {
            setError(nameInput, document.getElementById('err-name'), 'Nama minimal 2 karakter.');
            valid = false;
        } else clearError(nameInput, document.getElementById('err-name'));

        // Email
        if (!validateEmail(email)) {
            setError(emailInput, document.getElementById('err-email'), 'Format email tidak valid.');
            valid = false;
        } else clearError(emailInput, document.getElementById('err-email'));

        // Message
        if (message.length < 5) {
            setError(messageInput, document.getElementById('err-message'), 'Pesan minimal 5 karakter.');
            valid = false;
        } else clearError(messageInput, document.getElementById('err-message'));

        return valid;
    }

    // Live-clear error saat user mengetik
    nameInput.addEventListener('input', () => clearError(nameInput, document.getElementById('err-name')));
    emailInput.addEventListener('input', () => clearError(emailInput, document.getElementById('err-email')));
    messageInput.addEventListener('input', () => clearError(messageInput, document.getElementById('err-message')));

    // ---- SUBMIT HANDLER ----
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            showToast('Periksa kembali form kamu.', 'error');
            return;
        }

        // Loading state
        submitBtn.disabled = true;
        btnText.textContent = 'Mengirim...';
        btnIcon.classList.add('hidden');
        btnSpinner.classList.remove('hidden');

        try {
            // FormSubmit.co — kirim via fetch (AJAX, tanpa reload)
            const endpoint = `https://formsubmit.co/${CONTACT_EMAIL}`;

            const payload = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                message: messageInput.value.trim(),
                _subject: `Portfolio Contact: ${nameInput.value.trim()}`,
                _template: 'table',
                _captcha: 'false'
            };

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Network error');

            const data = await res.json();

            if (data.success === 'true' || data.success === true) {
                showToast('Pesan berhasil dikirim! Saya akan balas secepatnya.', 'success');
                form.reset();
            } else {
                throw new Error(data.message || 'Gagal mengirim');
            }
        } catch (err) {
            console.error(err);
            showToast('Gagal mengirim. Coba lagi atau email langsung.', 'error');
        } finally {
            submitBtn.disabled = false;
            btnText.textContent = 'Send Message';
            btnIcon.classList.remove('hidden');
            btnSpinner.classList.add('hidden');
        }
    });
});