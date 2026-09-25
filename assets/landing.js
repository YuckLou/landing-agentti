/**
 * Agentti — landing pública (www.agentti.ia.br)
 * Login e cadastro acontecem em app.agentti.ia.br; aqui não há sessão.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeEngine();
  initNavbarScroll();
  initMetricCounters();
  initFaqAccordion();
  initSmoothScroll();
  initPricingSwitcher();
});

/**
 * Navbar background blur and border on scroll
 */
function initNavbarScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/**
 * Animated metric counters triggering on viewport entry
 */
function initMetricCounters() {
  const metricElements = document.querySelectorAll('[data-counter-target]');
  if (!metricElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-counter-target'));
        const prefix = el.getAttribute('data-counter-prefix') || '';
        const suffix = el.getAttribute('data-counter-suffix') || '';
        const decimals = parseInt(el.getAttribute('data-counter-decimals') || '0', 10);
        const duration = 1800; // ms

        animateNumber(el, target, duration, prefix, suffix, decimals);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  metricElements.forEach(el => observer.observe(el));
}

function formatNumber(value, decimals) {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function animateNumber(element, target, duration, prefix, suffix, decimals) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease-out cubic
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentVal = formatNumber(target * easeProgress, decimals);

    element.textContent = `${prefix}${currentVal}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = `${prefix}${formatNumber(target, decimals)}${suffix}`;
    }
  }

  requestAnimationFrame(update);
}

/**
 * FAQ Accordion handling
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherAns = otherItem.querySelector('.faq-answer');
          if (otherAns) otherAns.style.maxHeight = null;
        }
      });

      // Toggle current
      if (isActive) {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/**
 * Smooth scrolling for in-page anchors
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 85;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Alternador de ciclo de faturamento (Mensal / Anual) na seção de preços
 */
function initPricingSwitcher() {
  const toggle = document.getElementById('pricing-billing-toggle');
  if (!toggle) return;

  const amounts = document.querySelectorAll('[data-amount-monthly]');
  const labelMonthly = document.getElementById('label-billing-monthly');
  const labelAnnual = document.getElementById('label-billing-annual');
  const hints = document.querySelectorAll('[data-billing-hint]');

  toggle.addEventListener('change', () => {
    const isAnnual = toggle.checked;

    if (labelMonthly && labelAnnual) {
      if (isAnnual) {
        labelMonthly.style.color = 'var(--text-dim)';
        labelMonthly.style.fontWeight = '500';
        labelAnnual.style.color = 'var(--text-main)';
        labelAnnual.style.fontWeight = '700';
      } else {
        labelMonthly.style.color = 'var(--text-main)';
        labelMonthly.style.fontWeight = '700';
        labelAnnual.style.color = 'var(--text-dim)';
        labelAnnual.style.fontWeight = '500';
      }
    }

    amounts.forEach(el => {
      const monthly = el.getAttribute('data-amount-monthly');
      const annual = el.getAttribute('data-amount-annual');
      if (monthly && annual) {
        el.textContent = isAnnual ? annual : monthly;
      }
    });

    hints.forEach(hint => {
      const monthlyHint = hint.getAttribute('data-hint-monthly') || '';
      const annualHint = hint.getAttribute('data-hint-annual') || '';
      hint.textContent = isAnnual ? annualHint : monthlyHint;
    });
  });
}

/**
 * =============================================================================
 * Gerenciador de Tema Visual da Landing Page (Dark / Light / Auto)
 * Padrão inicial: Automático (sincronizado com o sistema operacional)
 * =============================================================================
 */
function initThemeEngine() {
  const control = document.getElementById('theme-switcher-control');
  const buttons = control ? control.querySelectorAll('.theme-btn') : [];

  // 1. Recupera preferência armazenada ou 'auto' como padrão oficial
  let currentPref = 'auto';
  try { currentPref = localStorage.getItem('agentti_landing_theme') || 'auto'; } catch (_) { }

  function applyTheme(pref) {
    currentPref = pref;
    try { localStorage.setItem('agentti_landing_theme', pref); } catch (_) { }

    let effectiveTheme = pref;
    if (pref === 'auto') {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      effectiveTheme = prefersDark ? 'dark' : 'light';
    }

    // Aplica atributos no elemento raiz HTML
    document.documentElement.setAttribute('data-theme', effectiveTheme);
    document.documentElement.setAttribute('data-theme-preference', pref);

    // 2. Sincroniza estado visual ativo nos botões
    buttons.forEach(btn => {
      const val = btn.getAttribute('data-theme-val');
      if (val === pref) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Aplicação inicial
  applyTheme(currentPref);

  // 3. Registra eventos de clique nos botões
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTheme = btn.getAttribute('data-theme-val');
      if (targetTheme) {
        applyTheme(targetTheme);
      }
    });
  });

  // 4. Observador dinâmico de mudanças no tema do SO (para quando estiver em 'auto')
  if (window.matchMedia) {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handleOsChange = () => {
      if (currentPref === 'auto') {
        applyTheme('auto');
      }
    };
    if (mql.addEventListener) {
      mql.addEventListener('change', handleOsChange);
    } else if (mql.addListener) {
      mql.addListener(handleOsChange);
    }
  }
}
