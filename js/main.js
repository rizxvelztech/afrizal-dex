function dragCard() {
  return {
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    isDragging: false,
    startX: 0,
    startY: 0,

    startDrag(event) {
      this.isDragging = true;
      const touch = event.touches ? event.touches[0] : event;
      this.startX = touch.clientX - this.x;
      this.startY = touch.clientY - this.y;
      this.scale = 1.05;
      this.$el.style.transition = 'none';
    },

    onDrag(event) {
      if (!this.isDragging) return;
      event.preventDefault();
      const touch = event.touches ? event.touches[0] : event;
      this.x = touch.clientX - this.startX;
      this.y = touch.clientY - this.startY;
      this.rotate = this.x * 0.03;
    },

    endDrag() {
      if (this.isDragging) {
        this.isDragging = false;
        this.scale = 1;
        this.$el.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        this.x = 0;
        this.y = 0;
        this.rotate = 0;
      }
    }
  }
}

function app() {
  return {
    dark: false,
    mobileMenu: false,
    scrolled: false,
    activeSection: 'hero',
    activeTab: 'projects',
    currentAge: 0,

    init() {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
      this.lenis = lenis;

      this.dark = localStorage.getItem('theme') === 'dark';
      this.$watch('dark', v => localStorage.setItem('theme', v ? 'dark' : 'light'));
      
      this.updateAge();
      setInterval(() => this.updateAge(), 86400000);

      window.addEventListener('scroll', () => {
        this.scrolled = window.scrollY > 50;
        this.updateActiveSection();
      });

      const observer = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
      }, { threshold: 0.1, rootMargin: '-50px 0px -50px 0px' });
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

      const yearEl = document.getElementById('copyrightYear');
      if (yearEl) yearEl.textContent = new Date().getFullYear();
    },

    updateAge() {
      const birth = new Date(2011, 4, 12);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
      this.currentAge = age;
    },

    updateActiveSection() {
      const sections = ['contact', 'portfolio', 'about', 'hero'];
      for (const sec of sections) {
        const el = document.getElementById(sec);
        if (el && window.scrollY >= el.offsetTop - 150) {
          this.activeSection = sec;
          return;
        }
      }
      this.activeSection = 'hero';
    }
  }
}
