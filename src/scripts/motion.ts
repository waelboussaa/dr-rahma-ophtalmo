import { animate, inView, scroll, stagger } from "motion";

// Respect user's system preferences for reduced motion
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// --------------------------------------------------------------------------
// 1. Scrolling is native
// --------------------------------------------------------------------------
// The Lenis smooth-scroll library was removed. It replaced the browser's own
// scrolling, which this audience - many of them older, cataract-age patients -
// relies on: keyboard paging, find-in-page and scripted jumps all had to route
// through it, and `window.scrollTo` was silently overridden. global.css already
// provides `scroll-behavior: smooth` (off under reduced motion) and a
// `scroll-padding-top` for the sticky header, so anchor links still glide.

// --------------------------------------------------------------------------
// 2. Scroll Progress Bar (Motion `scroll`)
// --------------------------------------------------------------------------
const progressBar = document.getElementById("scroll-progress");
if (progressBar && !prefersReducedMotion) {
  scroll(animate(progressBar, { transform: ["scaleX(0)", "scaleX(1)"] }));
}

// --------------------------------------------------------------------------
// 3. Header Scrolled State (Threshold Detection with Smooth Backdrop)
// --------------------------------------------------------------------------
const header = document.querySelector<HTMLElement>("[data-header]");
const topBar = document.querySelector<HTMLElement>("[data-topbar]");

if (header) {
  const onScroll = () => {
    const offset = topBar && window.innerWidth >= 768 ? topBar.offsetHeight : 0;
    if (window.scrollY > offset + 6) {
      header.setAttribute("data-scrolled", "");
    } else {
      header.removeAttribute("data-scrolled");
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// --------------------------------------------------------------------------
// 4. Hero Section Orchestrated Entrance
// --------------------------------------------------------------------------
if (!prefersReducedMotion) {
  // Eyebrow badge
  const heroEyebrow = document.querySelector("#hero .inline-flex.items-center.gap-2");
  if (heroEyebrow) {
    animate(
      heroEyebrow,
      { opacity: [0, 1], transform: ["translateY(16px)", "translateY(0px)"] },
      { duration: 0.75, ease: [0.16, 1, 0.3, 1] }
    );
  }

  // Display Title (h1)
  const heroTitle = document.querySelector("#hero h1.display");
  if (heroTitle) {
    animate(
      heroTitle,
      { opacity: [0, 1], transform: ["translateY(28px)", "translateY(0px)"] },
      { duration: 0.95, delay: 0.1, ease: [0.16, 1, 0.3, 1] }
    );
  }

  // Lead paragraph
  const heroLead = document.querySelector("#hero p.lead");
  if (heroLead) {
    animate(
      heroLead,
      { opacity: [0, 1], transform: ["translateY(20px)", "translateY(0px)"] },
      { duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }
    );
  }

  // Doctor credential card
  const heroCred = document.querySelector("#hero .rounded-plate.border");
  if (heroCred) {
    animate(
      heroCred,
      { opacity: [0, 1], transform: ["translateY(22px) scale(0.98)", "translateY(0px) scale(1)"] },
      { duration: 0.85, delay: 0.28, ease: [0.16, 1, 0.3, 1] }
    );
  }

  // CTAs
  const heroCtas = document.querySelector("#hero .flex-col.gap-3\\.5, #hero .flex.flex-col.gap-3\\.5");
  if (heroCtas) {
    animate(
      heroCtas,
      { opacity: [0, 1], transform: ["translateY(20px)", "translateY(0px)"] },
      { duration: 0.8, delay: 0.36, ease: [0.16, 1, 0.3, 1] }
    );
  }

  // Trust indicator items below CTAs
  const heroBadges = document.querySelectorAll("#hero .flex.flex-wrap.items-center > *");
  if (heroBadges.length) {
    animate(
      Array.from(heroBadges),
      { opacity: [0, 1], transform: ["translateY(14px)", "translateY(0px)"] },
      { delay: stagger(0.07, { startDelay: 0.44 }), duration: 0.65, ease: [0.16, 1, 0.3, 1] }
    );
  }

  // Right column: Brand plate & Portrait
  const heroPlate = document.querySelector("#hero .lg\\:col-span-5");
  if (heroPlate) {
    animate(
      heroPlate,
      { opacity: [0, 1], transform: ["scale(0.93) translateY(24px)", "scale(1) translateY(0px)"] },
      { duration: 1.1, delay: 0.22, ease: [0.16, 1, 0.3, 1] }
    );
  }

  // Hero background decorative arc parallax
  const heroArc = document.querySelector("#hero .hero-arc");
  if (heroArc) {
    scroll(animate(heroArc, { transform: ["translateY(0px) rotate(0deg)", "translateY(24px) rotate(15deg)"] }));
  }
}

// --------------------------------------------------------------------------
// 5. Rich Section & Element Motion with `inView` and `stagger`
// --------------------------------------------------------------------------
if (!prefersReducedMotion) {
  // A. Section Headers: Staggered Eyebrow, Title, and Lead
  document.querySelectorAll<HTMLElement>(".reveal.flex-col.items-center").forEach((headerEl) => {
    inView(
      headerEl,
      () => {
        headerEl.classList.add("is-in");
        const children = Array.from(headerEl.children);
        animate(
          children,
          { opacity: [0, 1], transform: ["translateY(24px)", "translateY(0px)"] },
          { delay: stagger(0.09), duration: 0.85, ease: [0.22, 1, 0.36, 1] }
        );
      },
      { margin: "-8% 0px -8% 0px" }
    );
  });

  // B. Quick Info 4 Cards Grid
  const quickInfoGrid = document.querySelector("#hero + section .grid, section .grid.sm\\:grid-cols-2.lg\\:grid-cols-4");
  if (quickInfoGrid) {
    inView(
      quickInfoGrid,
      () => {
        (quickInfoGrid.parentElement || quickInfoGrid).classList.add("is-in");
        const cards = Array.from(quickInfoGrid.children);
        animate(
          cards,
          { opacity: [0, 1], transform: ["translateY(32px) scale(0.97)", "translateY(0px) scale(1)"] },
          { delay: stagger(0.08), duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        );
      },
      { margin: "-8% 0px -8% 0px" }
    );
  }

  // C. Specialties (The 6 Medical Treatment Cards)
  const specSection = document.getElementById("specialites");
  if (specSection) {
    const specGrid = specSection.querySelector(".grid.gap-6");
    if (specGrid) {
      inView(
        specGrid,
        () => {
          (specGrid.parentElement || specGrid).classList.add("is-in");
          const cards = Array.from(specGrid.children);
          animate(
            cards,
            { opacity: [0, 1], transform: ["translateY(40px) scale(0.97)", "translateY(0px) scale(1)"] },
            { delay: stagger(0.09), duration: 0.85, ease: [0.22, 1, 0.36, 1] }
          );

          // Subtle zoom-settle on the newly generated real medical images
          const photos = specGrid.querySelectorAll("picture img");
          if (photos.length) {
            animate(
              Array.from(photos),
              { transform: ["scale(1.08)", "scale(1)"] },
              { delay: stagger(0.09, { startDelay: 0.15 }), duration: 1.1, ease: [0.16, 1, 0.3, 1] }
            );
          }
        },
        { margin: "-8% 0px -8% 0px" }
      );
    }
  }

  // D. Stats Banner: Cards & Counters
  const statsSection = document.getElementById("chiffres");
  if (statsSection) {
    const statsGrid = statsSection.querySelector(".grid");
    if (statsGrid) {
      inView(
        statsGrid,
        () => {
          (statsGrid.parentElement || statsGrid).classList.add("is-in");
          const cards = Array.from(statsGrid.children);
          animate(
            cards,
            { opacity: [0, 1], transform: ["translateY(32px) scale(0.96)", "translateY(0px) scale(1)"] },
            { delay: stagger(0.09), duration: 0.85, ease: [0.22, 1, 0.36, 1] }
          );
        },
        { margin: "-8% 0px -8% 0px" }
      );
    }
  }

  // E. Trust Pillars (4 Cards)
  const trustSection = document.getElementById("confiance");
  if (trustSection) {
    const trustGrid = trustSection.querySelector(".grid");
    if (trustGrid) {
      inView(
        trustGrid,
        () => {
          (trustGrid.parentElement || trustGrid).classList.add("is-in");
          const cards = Array.from(trustGrid.children);
          animate(
            cards,
            { opacity: [0, 1], transform: ["translateY(32px)", "translateY(0px)"] },
            { delay: stagger(0.08), duration: 0.8, ease: [0.22, 1, 0.36, 1] }
          );
        },
        { margin: "-8% 0px -8% 0px" }
      );
    }
  }

  // F. Journey (5 Step Timeline)
  const journeySection = document.getElementById("parcours");
  if (journeySection) {
    const journeyGrid = journeySection.querySelector(".grid");
    if (journeyGrid) {
      inView(
        journeyGrid,
        () => {
          (journeyGrid.parentElement || journeyGrid).classList.add("is-in");
          const steps = Array.from(journeyGrid.children);
          animate(
            steps,
            { opacity: [0, 1], transform: ["translateY(32px) scale(0.96)", "translateY(0px) scale(1)"] },
            { delay: stagger(0.1), duration: 0.85, ease: [0.22, 1, 0.36, 1] }
          );
        },
        { margin: "-8% 0px -8% 0px" }
      );
    }
  }

  // G. Technologies & Explorations (6 Cards)
  const techSection = document.getElementById("technologies");
  if (techSection) {
    const techGrid = techSection.querySelector(".grid.gap-6");
    if (techGrid) {
      inView(
        techGrid,
        () => {
          (techGrid.parentElement || techGrid).classList.add("is-in");
          const cards = Array.from(techGrid.children);
          animate(
            cards,
            { opacity: [0, 1], transform: ["translateY(34px) scale(0.97)", "translateY(0px) scale(1)"] },
            { delay: stagger(0.08), duration: 0.8, ease: [0.22, 1, 0.36, 1] }
          );
        },
        { margin: "-8% 0px -8% 0px" }
      );
    }
  }

  // H. About Doctor Section
  const aboutSection = document.getElementById("docteur");
  if (aboutSection) {
    inView(
      aboutSection,
      () => {
        aboutSection.querySelectorAll(".reveal").forEach((r) => r.classList.add("is-in"));
        const leftCol = aboutSection.querySelector(".lg\\:col-span-5");
        const rightCol = aboutSection.querySelector(".lg\\:col-span-7");
        if (leftCol) {
          animate(
            leftCol,
            { opacity: [0, 1], transform: ["translateX(-24px) translateY(16px)", "translateX(0px) translateY(0px)"] },
            { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
          );
        }
        if (rightCol) {
          animate(
            rightCol,
            { opacity: [0, 1], transform: ["translateX(24px) translateY(16px)", "translateX(0px) translateY(0px)"] },
            { duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }
          );
        }
      },
      { margin: "-8% 0px -8% 0px" }
    );
  }

  // I. Cabinet & Interactive Map
  const cabinetSection = document.getElementById("cabinet");
  if (cabinetSection) {
    inView(
      cabinetSection,
      () => {
        cabinetSection.querySelectorAll(".reveal").forEach((r) => r.classList.add("is-in"));
        const cols = cabinetSection.querySelectorAll(".grid.lg\\:grid-cols-12 > div");
        if (cols.length) {
          animate(
            Array.from(cols),
            { opacity: [0, 1], transform: ["translateY(32px)", "translateY(0px)"] },
            { delay: stagger(0.12), duration: 0.85, ease: [0.22, 1, 0.36, 1] }
          );
        }
      },
      { margin: "-8% 0px -8% 0px" }
    );
  }

  // J. Booking Consultation Section
  const bookingSection = document.getElementById("rendez-vous");
  if (bookingSection) {
    const bookingCard = bookingSection.querySelector(".rounded-3xl, .wrap > div");
    if (bookingCard) {
      inView(
        bookingCard,
        () => {
          bookingCard.classList.add("is-in");
          animate(
            bookingCard,
            { opacity: [0, 1], transform: ["scale(0.97) translateY(32px)", "scale(1) translateY(0px)"] },
            { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
          );
        },
        { margin: "-8% 0px -8% 0px" }
      );
    }
  }

  // K. FAQ Accordion Items
  const faqSection = document.getElementById("faq");
  if (faqSection) {
    const faqContainer = faqSection.querySelector(".max-w-3xl");
    if (faqContainer) {
      inView(
        faqContainer,
        () => {
          faqContainer.classList.add("is-in");
          const items = faqContainer.querySelectorAll("details");
          animate(
            Array.from(items),
            { opacity: [0, 1], transform: ["translateY(22px)", "translateY(0px)"] },
            { delay: stagger(0.07), duration: 0.75, ease: [0.22, 1, 0.36, 1] }
          );
        },
        { margin: "-8% 0px -8% 0px" }
      );
    }
  }

  // L. Contact Cards Grid
  const contactSection = document.getElementById("contact");
  if (contactSection) {
    const contactGrid = contactSection.querySelector(".grid.gap-6");
    if (contactGrid) {
      inView(
        contactGrid,
        () => {
          (contactGrid.parentElement || contactGrid).classList.add("is-in");
          const cards = Array.from(contactGrid.children);
          animate(
            cards,
            { opacity: [0, 1], transform: ["translateY(30px)", "translateY(0px)"] },
            { delay: stagger(0.08), duration: 0.75, ease: [0.22, 1, 0.36, 1] }
          );
        },
        { margin: "-8% 0px -8% 0px" }
      );
    }
  }

  // M. Vision Guide Section
  const visionSection = document.getElementById("guide-visuel");
  if (visionSection) {
    const tabsContainer = visionSection.querySelector("[data-vision-tabs]");
    const panelsContainer = visionSection.querySelector("[data-vision-panels]");
    if (tabsContainer) {
      inView(
        tabsContainer,
        () => {
          tabsContainer.classList.add("is-in");
          animate(
            tabsContainer,
            { opacity: [0, 1], transform: ["translateY(20px)", "translateY(0px)"] },
            { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
          );
        },
        { margin: "-8% 0px -8% 0px" }
      );
    }
    if (panelsContainer) {
      inView(
        panelsContainer,
        () => {
          panelsContainer.classList.add("is-in");
          animate(
            panelsContainer,
            { opacity: [0, 1], transform: ["translateY(24px) scale(0.99)", "translateY(0px) scale(1)"] },
            { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
          );
        },
        { margin: "-8% 0px -8% 0px" }
      );
    }
  }

  // N. Stat Counter Number Roll
  const statCards = document.querySelectorAll<HTMLElement>("[data-stat-card]");
  statCards.forEach((card) => {
    const valEl = card.querySelector<HTMLElement>("[data-stat-val]");
    if (!valEl) return;

    const rawVal = valEl.getAttribute("data-stat-val") || valEl.innerText.trim();
    // Only a bare count ("6+") rolls up. "6 j / 7" used to count from "0 j / 7",
    // showing opening days that are not true on the way; "CNAM" and "A2-16"
    // are not numbers at all.
    const match = rawVal.match(/^(\d+)(\+?)$/);
    if (!match) return;

    const targetNum = parseInt(match[1], 10);
    const suffix = match[2];

    let hasAnimated = false;
    inView(
      card,
      () => {
        if (hasAnimated) return;
        hasAnimated = true;

        const startTime = performance.now();
        const duration = 1500; // ms

        function updateCounter(now: number) {
          const elapsed = now - startTime;
          const progress = Math.min(1, elapsed / duration);
          // Easing: outExpo
          const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const currentCount = Math.floor(easeProgress * targetNum);

          if (valEl) {
            valEl.innerHTML = `<bdi>${currentCount}${suffix}</bdi>`;
          }

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else if (valEl) {
            valEl.innerHTML = `<bdi>${targetNum}${suffix}</bdi>`;
          }
        }
        requestAnimationFrame(updateCounter);
      },
      { margin: "-8% 0px -8% 0px" }
    );
  });

  // O. Universal fallback for any remaining .reveal elements
  document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
    inView(
      el,
      () => {
        if (!el.classList.contains("is-in")) {
          el.classList.add("is-in");
          animate(
            el,
            { opacity: [0, 1], transform: ["translateY(24px)", "translateY(0px)"] },
            { duration: 0.75, ease: [0.22, 1, 0.36, 1] }
          );
        }
      },
      { margin: "-6% 0px -6% 0px" }
    );
  });
} else {
  // If reduced motion is preferred, ensure all reveals are visible immediately
  document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
    el.classList.add("is-in");
  });
}

// Tells the inline fallback in Base.astro that reveals are now owned here.
// Set only after the block above ran, so a throw anywhere earlier in this
// module still leaves the fallback in charge.
document.documentElement.dataset.motion = "ready";

// --------------------------------------------------------------------------
// 6. Live Clinic Availability Status (Tunisia UTC+1)
// --------------------------------------------------------------------------
function updateClinicStatus() {
  const statusEl = document.querySelector<HTMLElement>("[data-clinic-status]");
  if (!statusEl) return;

  const textEl = statusEl.querySelector<HTMLElement>("[data-status-text]");
  const pulseEl = statusEl.querySelector<HTMLElement>(".status-pulse");
  const dotEl = statusEl.querySelector<HTMLElement>(".status-dot");

  const now = new Date();
  // Tunisia is UTC+1 year-round
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const tunisiaTime = new Date(utcMs + 3600000 * 1);
  const day = tunisiaTime.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
  const hour = tunisiaTime.getHours();
  const minute = tunisiaTime.getMinutes();
  const currentMinutes = hour * 60 + minute;

  // Practice hours: Mon - Sat, 08:00 (480 min) - 18:00 (1080 min)
  const isWorkDay = day >= 1 && day <= 6;
  const isOpen = isWorkDay && currentMinutes >= 480 && currentMinutes < 1080;

  const isArabic = document.documentElement.lang === "ar";
  // Revealed only now that the status is computed from the real clock.
  statusEl.hidden = false;

  if (isOpen) {
    if (textEl) {
      textEl.textContent = isArabic ? "مفتوح الآن · حتى 18:00" : "Ouvert actuellement · jusqu'à 18:00";
    }
    if (dotEl) {
      dotEl.className = "status-dot relative inline-flex h-2 w-2 rounded-full bg-emerald-500";
    }
    if (pulseEl) {
      pulseEl.classList.remove("hidden");
    }
  } else {
    if (textEl) {
      if ((day === 6 && currentMinutes >= 1080) || day === 0) {
        textEl.textContent = isArabic ? "مغلق · يفتح الإثنين 08:00" : "Fermé · Réouverture lundi à 08:00";
      } else {
        textEl.textContent = isArabic ? "مغلق · يفتح 08:00" : "Fermé · Réouverture à 08:00";
      }
    }
    if (dotEl) {
      dotEl.className = "status-dot relative inline-flex h-2 w-2 rounded-full bg-amber-500";
    }
    if (pulseEl) {
      pulseEl.classList.add("hidden");
    }
  }
}
updateClinicStatus();
setInterval(updateClinicStatus, 60000);

// --------------------------------------------------------------------------
// 7. Toast Notification & One-Click Copy
// --------------------------------------------------------------------------
let toastTimer: number | null = null;
function showToast(message?: string) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  const toastText = document.getElementById("toast-text");
  if (toastText && message) {
    toastText.textContent = message;
  }

  if (toastTimer) clearTimeout(toastTimer);

  toast.classList.remove("opacity-0", "translate-y-4", "pointer-events-none");
  toast.classList.add("opacity-100", "translate-y-0", "pointer-events-auto");

  toastTimer = window.setTimeout(() => {
    toast.classList.remove("opacity-100", "translate-y-0", "pointer-events-auto");
    toast.classList.add("opacity-0", "translate-y-4", "pointer-events-none");
  }, 2600);
}

document.querySelectorAll<HTMLElement>("[data-copy-target]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const text = trigger.getAttribute("data-copy-target") || trigger.innerText.trim();
    if (text) {
      try {
        navigator.clipboard.writeText(text);
        const isArabic = document.documentElement.lang === "ar";
        showToast(isArabic ? `تم نسخ: ${text}` : `Copié : ${text}`);
      } catch {
        // Fallback if clipboard API is restricted
      }
    }
  });
});

// --------------------------------------------------------------------------
// 8. VisionGuide Interactive Tabs
// --------------------------------------------------------------------------
const visionTabButtons = document.querySelectorAll<HTMLButtonElement>("[data-vision-tabs] button");
const visionPanels = document.querySelectorAll<HTMLElement>("[data-vision-panels] .vision-panel");

if (visionTabButtons.length > 0 && visionPanels.length > 0) {
  visionTabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      if (!targetId) return;

      // Update button styles
      visionTabButtons.forEach((b) => {
        if (b === btn) {
          b.className =
            "vision-tab-btn inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[0.88rem] font-semibold transition-all duration-300 bg-ink text-cream shadow-sm scale-100";
        } else {
          b.className =
            "vision-tab-btn inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[0.88rem] font-semibold transition-all duration-300 bg-surface border border-line text-ink hover:border-bronze hover:bg-sand-soft/60";
        }
      });

      // Switch panels
      visionPanels.forEach((panel) => {
        if (panel.id === `panel-${targetId}`) {
          panel.classList.remove("hidden");
          panel.classList.add("block");
          if (!prefersReducedMotion) {
            animate(
              panel,
              { opacity: [0, 1], transform: ["translateY(12px)", "translateY(0px)"] },
              { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
            );
          }
        } else {
          panel.classList.remove("block");
          panel.classList.add("hidden");
        }
      });
    });
  });
}

// --------------------------------------------------------------------------
// 9. FAQ Category Filtering
// --------------------------------------------------------------------------
const faqFilterButtons = document.querySelectorAll<HTMLButtonElement>("[data-faq-filters] button");
const allFaqItems = document.querySelectorAll<HTMLElement>("[data-faq-list] .faq-item");

if (faqFilterButtons.length > 0 && allFaqItems.length > 0) {
  faqFilterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter") || "all";

      // Update active button classes
      faqFilterButtons.forEach((b) => {
        if (b === btn) {
          b.className =
            "faq-filter-btn rounded-full px-4 py-2 text-[0.84rem] font-semibold transition-all duration-200 bg-ink text-cream shadow-xs";
        } else {
          b.className =
            "faq-filter-btn rounded-full px-4 py-2 text-[0.84rem] font-semibold transition-all duration-200 bg-surface border border-line text-ink hover:border-bronze hover:bg-sand-soft";
        }
      });

      // Filter FAQ items
      const matchingItems: HTMLElement[] = [];
      allFaqItems.forEach((item) => {
        const itemCat = item.getAttribute("data-category");
        if (filter === "all" || itemCat === filter) {
          item.style.display = "";
          matchingItems.push(item);
        } else {
          item.style.display = "none";
        }
      });

      if (!prefersReducedMotion && matchingItems.length > 0) {
        animate(
          matchingItems,
          { opacity: [0, 1], transform: ["translateY(12px)", "translateY(0px)"] },
          { delay: stagger(0.04), duration: 0.4, ease: [0.16, 1, 0.3, 1] }
        );
      }
    });
  });
}

// --------------------------------------------------------------------------
// 10. Scroll-To-Top Floating Button
// --------------------------------------------------------------------------
const scrollTopBtn = document.getElementById("scroll-to-top");
if (scrollTopBtn) {
  const toggleScrollTop = () => {
    if (window.scrollY > 450) {
      scrollTopBtn.classList.remove("opacity-0", "translate-y-3", "pointer-events-none");
      scrollTopBtn.classList.add("opacity-100", "translate-y-0", "pointer-events-auto");
    } else {
      scrollTopBtn.classList.remove("opacity-100", "translate-y-0", "pointer-events-auto");
      scrollTopBtn.classList.add("opacity-0", "translate-y-3", "pointer-events-none");
    }
  };

  window.addEventListener("scroll", toggleScrollTop, { passive: true });
  toggleScrollTop();

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });
}

// --------------------------------------------------------------------------
// 11. Visual Comfort & Accessibility Hub
// --------------------------------------------------------------------------
const a11yModal = document.getElementById("a11y-modal");
const a11yCard = document.getElementById("a11y-dialog-card");
const readingGuide = document.getElementById("reading-guide");

// The dialog is `inert` while closed. It used to be hidden with opacity alone,
// which left every control in it focusable and announced: keyboard and
// screen-reader users tabbed through an invisible panel. Focus now moves in on
// open and returns to whatever opened it on close.
let a11yReturnFocus: HTMLElement | null = null;

function openA11yModal() {
  if (!a11yModal) return;
  a11yReturnFocus = document.activeElement as HTMLElement | null;
  a11yModal.inert = false;
  a11yModal.classList.remove("opacity-0", "pointer-events-none");
  a11yModal.classList.add("opacity-100", "pointer-events-auto");
  if (a11yCard && !prefersReducedMotion) {
    animate(
      a11yCard,
      { opacity: [0, 1], transform: ["scale(0.94) translateY(16px)", "scale(1) translateY(0px)"] },
      { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
    );
  }
  document.body.classList.add("overflow-hidden");
  a11yModal.querySelector<HTMLElement>("button[data-a11y-close]")?.focus();
}

function closeA11yModal() {
  if (!a11yModal) return;
  a11yModal.classList.remove("opacity-100", "pointer-events-auto");
  a11yModal.classList.add("opacity-0", "pointer-events-none");
  a11yModal.inert = true;
  document.body.classList.remove("overflow-hidden");
  // The mobile-menu trigger disappears once the menu closes; fall back to the
  // menu button so focus never drops to <body>.
  const back =
    a11yReturnFocus?.isConnected && a11yReturnFocus.offsetParent !== null
      ? a11yReturnFocus
      : document.querySelector<HTMLElement>("[data-nav-toggle]");
  back?.focus();
  a11yReturnFocus = null;
}

document.querySelectorAll("[data-a11y-trigger]").forEach((el) => {
  el.addEventListener("click", openA11yModal);
});

document.querySelectorAll("[data-a11y-close]").forEach((el) => {
  el.addEventListener("click", closeA11yModal);
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && a11yModal && !a11yModal.classList.contains("pointer-events-none")) {
    closeA11yModal();
  }
});

// Font Scaling
const fontButtons = document.querySelectorAll<HTMLButtonElement>("[data-a11y-font-btn]");
function applyFontScale(scale: string | null) {
  if (scale === "lg") {
    document.documentElement.setAttribute("data-font-scale", "lg");
  } else if (scale === "xl") {
    document.documentElement.setAttribute("data-font-scale", "xl");
  } else {
    document.documentElement.removeAttribute("data-font-scale");
  }

  fontButtons.forEach((btn) => {
    const val = btn.getAttribute("data-a11y-font-btn");
    const isActive = (val === "normal" && !scale) || val === scale;
    if (isActive) {
      btn.className =
        "flex items-center justify-center rounded-xl py-2.5 text-[0.88rem] font-bold transition-all bg-surface text-ink shadow-2xs border border-line/60";
    } else {
      btn.className =
        "flex items-center justify-center rounded-xl py-2.5 text-[0.88rem] font-bold transition-all text-ink-muted hover:bg-sand-soft hover:text-ink";
    }
  });

  try {
    if (scale) localStorage.setItem("doc_font_scale", scale);
    else localStorage.removeItem("doc_font_scale");
  } catch {}
}

fontButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const scale = btn.getAttribute("data-a11y-font-btn") || "normal";
    applyFontScale(scale === "normal" ? null : scale);
    const isArabic = document.documentElement.lang === "ar";
    showToast(isArabic ? "تم تحديث حجم الخط" : "Taille du texte modifiée");
  });
});

// Contrast & Themes
const contrastButtons = document.querySelectorAll<HTMLButtonElement>("[data-a11y-contrast-btn]");
function applyContrast(contrast: string | null) {
  if (contrast === "high") {
    document.documentElement.setAttribute("data-contrast", "high");
  } else if (contrast === "dark") {
    document.documentElement.setAttribute("data-contrast", "dark");
  } else {
    document.documentElement.removeAttribute("data-contrast");
  }

  contrastButtons.forEach((btn) => {
    const val = btn.getAttribute("data-a11y-contrast-btn");
    const isActive = (val === "normal" && !contrast) || val === contrast;
    if (isActive) {
      btn.className =
        "flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-bronze bg-sand-soft/50 p-3.5 text-center transition-all shadow-xs";
    } else {
      btn.className =
        "flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-line bg-surface p-3.5 text-center transition-all hover:border-line/90 opacity-70 hover:opacity-100";
    }
  });

  try {
    if (contrast) localStorage.setItem("doc_contrast", contrast);
    else localStorage.removeItem("doc_contrast");
  } catch {}
}

contrastButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const contrast = btn.getAttribute("data-a11y-contrast-btn") || "normal";
    applyContrast(contrast === "normal" ? null : contrast);
    const isArabic = document.documentElement.lang === "ar";
    showToast(isArabic ? "تم تحديث نمط العرض والتباين" : "Mode d'affichage mis à jour");
  });
});

// Reading Guide Ruler
const guideToggle = document.querySelector<HTMLButtonElement>('[data-a11y-toggle="guide"]');
function applyReadingGuide(enabled: boolean) {
  if (enabled) {
    document.documentElement.setAttribute("data-reading-guide", "true");
  } else {
    document.documentElement.removeAttribute("data-reading-guide");
  }

  if (guideToggle) {
    guideToggle.setAttribute("aria-checked", String(enabled));
    const handle = guideToggle.querySelector<HTMLElement>("[data-toggle-handle]");
    if (enabled) {
      guideToggle.classList.remove("bg-sand-ink/40");
      guideToggle.classList.add("bg-bronze");
      handle?.classList.remove("translate-x-0");
      handle?.classList.add("translate-x-5", "rtl:-translate-x-5");
    } else {
      guideToggle.classList.remove("bg-bronze");
      guideToggle.classList.add("bg-sand-ink/40");
      handle?.classList.remove("translate-x-5", "rtl:-translate-x-5");
      handle?.classList.add("translate-x-0");
    }
  }

  try {
    localStorage.setItem("doc_reading_guide", String(enabled));
  } catch {}
}

if (guideToggle) {
  guideToggle.addEventListener("click", () => {
    const isCurrently = document.documentElement.getAttribute("data-reading-guide") === "true";
    applyReadingGuide(!isCurrently);
    const isArabic = document.documentElement.lang === "ar";
    showToast(
      !isCurrently
        ? isArabic
          ? "تم تفعيل مسطرة القراءة"
          : "Guide de lecture activé"
        : isArabic
          ? "تم إيقاف مسطرة القراءة"
          : "Guide de lecture désactivé"
    );
  });
}

// Move reading guide on pointer move
window.addEventListener(
  "pointermove",
  (e) => {
    if (readingGuide && document.documentElement.getAttribute("data-reading-guide") === "true") {
      readingGuide.style.top = `${e.clientY}px`;
    }
  },
  { passive: true }
);

// Enhanced Spacing Toggle
const spacingToggle = document.querySelector<HTMLButtonElement>('[data-a11y-toggle="spacing"]');
function applySpacing(enabled: boolean) {
  if (enabled) {
    document.documentElement.setAttribute("data-enhanced-spacing", "true");
  } else {
    document.documentElement.removeAttribute("data-enhanced-spacing");
  }

  if (spacingToggle) {
    spacingToggle.setAttribute("aria-checked", String(enabled));
    const handle = spacingToggle.querySelector<HTMLElement>("[data-toggle-handle]");
    if (enabled) {
      spacingToggle.classList.remove("bg-sand-ink/40");
      spacingToggle.classList.add("bg-bronze");
      handle?.classList.remove("translate-x-0");
      handle?.classList.add("translate-x-5", "rtl:-translate-x-5");
    } else {
      spacingToggle.classList.remove("bg-bronze");
      spacingToggle.classList.add("bg-sand-ink/40");
      handle?.classList.remove("translate-x-5", "rtl:-translate-x-5");
      handle?.classList.add("translate-x-0");
    }
  }

  try {
    localStorage.setItem("doc_enhanced_spacing", String(enabled));
  } catch {}
}

if (spacingToggle) {
  spacingToggle.addEventListener("click", () => {
    const isCurrently = document.documentElement.getAttribute("data-enhanced-spacing") === "true";
    applySpacing(!isCurrently);
    const isArabic = document.documentElement.lang === "ar";
    showToast(
      !isCurrently
        ? isArabic
          ? "تم تفعيل تباعد الأسطر"
          : "Espacement amélioré activé"
        : isArabic
          ? "تم إيقاف تباعد الأسطر"
          : "Espacement standard"
    );
  });
}

// Reset All Settings Button
const resetButton = document.querySelector<HTMLButtonElement>("[data-a11y-reset]");
if (resetButton) {
  resetButton.addEventListener("click", () => {
    applyFontScale(null);
    applyContrast(null);
    applyReadingGuide(false);
    applySpacing(false);
    try {
      localStorage.removeItem("doc_font_scale");
      localStorage.removeItem("doc_contrast");
      localStorage.removeItem("doc_reading_guide");
      localStorage.removeItem("doc_enhanced_spacing");
    } catch {}
    const isArabic = document.documentElement.lang === "ar";
    showToast(isArabic ? "تمت إعادة ضبط جميع الإعدادات" : "Réglages réinitialisés");
  });
}

// Load saved preferences on page load
try {
  const savedFont = localStorage.getItem("doc_font_scale");
  if (savedFont) applyFontScale(savedFont);

  const savedContrastVal = localStorage.getItem("doc_contrast");
  if (savedContrastVal) applyContrast(savedContrastVal);

  const savedGuide = localStorage.getItem("doc_reading_guide") === "true";
  if (savedGuide) applyReadingGuide(true);

  const savedSpacing = localStorage.getItem("doc_enhanced_spacing") === "true";
  if (savedSpacing) applySpacing(true);
} catch {}

// --------------------------------------------------------------------------
// 12. Floating WhatsApp Widget Interactive Flyout
// --------------------------------------------------------------------------
const waTrigger = document.getElementById("whatsapp-bubble-trigger");
const waCard = document.getElementById("whatsapp-chat-card");
const waClose = document.getElementById("whatsapp-card-close");

function toggleWhatsAppCard(open?: boolean) {
  if (!waCard) return;
  const isCurrentlyOpen = !waCard.classList.contains("pointer-events-none");
  const shouldOpen = open !== undefined ? open : !isCurrentlyOpen;

  if (shouldOpen) {
    waCard.classList.remove("pointer-events-none", "opacity-0", "scale-95");
    waCard.classList.add("pointer-events-auto", "opacity-100", "scale-100");
    waCard.setAttribute("aria-hidden", "false");
    waTrigger?.setAttribute("aria-expanded", "true");
    if (!prefersReducedMotion) {
      animate(
        waCard,
        { opacity: [0, 1], transform: ["scale(0.92) translateY(10px)", "scale(1) translateY(0px)"] },
        { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
      );
    }
  } else {
    waCard.classList.remove("pointer-events-auto", "opacity-100", "scale-100");
    waCard.classList.add("pointer-events-none", "opacity-0", "scale-95");
    waCard.setAttribute("aria-hidden", "true");
    waTrigger?.setAttribute("aria-expanded", "false");
  }
}

if (waTrigger) {
  waTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleWhatsAppCard();
  });
}

if (waClose) {
  waClose.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleWhatsAppCard(false);
  });
}

document.addEventListener("click", (e) => {
  const target = e.target as HTMLElement | null;
  if (waCard && !waCard.contains(target) && waTrigger && !waTrigger.contains(target)) {
    toggleWhatsAppCard(false);
  }
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    toggleWhatsAppCard(false);
  }
});



