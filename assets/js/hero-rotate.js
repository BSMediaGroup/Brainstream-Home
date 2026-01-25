(() => {
  const hero = document.querySelector(".hero");
  if (!hero) {
    return;
  }

  const initialSlides = Array.from(hero.querySelectorAll(".hero-image-slide"));
  const taglineEl = hero.querySelector(".hero-tagline");
  const slidesContainer = hero.querySelector(".hero-image-rotator");

  if (!initialSlides.length || !taglineEl || !slidesContainer) {
    return;
  }

  const heroSlides = [
    {
      key: "brainstream",
      imageSrc: "assets/illustrations/bsmgmetal.webp",
      tagline: "Creator-first media systems, engineered for longevity.",
      accent: null
    },
    {
      key: "streamsuites",
      imageSrc: "assets/illustrations/ssblueshield.webp",
      tagline: "Powering StreamSuites™, the next-generation creator platform.",
      accent: null
    },
    {
      key: "danielclancy",
      imageSrc: "assets/illustrations/dcx.webp",
      tagline: "Professional architectural and structural drafting services.",
      accent: null
    },
    {
      key: "danielclancy-live",
      imageSrc: "assets/illustrations/dcsilver.webp",
      tagline: "Personal podcast hub featuring long-form discussions and media.",
      accent: null
    }
  ];

  if (!heroSlides.length) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const fadeMs = 1200;
  const intervalMs = 7000;
  const enableAccentText = false;

  const templateSlide = initialSlides[0];
  const createSlide = () => {
    const newSlide = templateSlide.tagName === "IMG"
      ? templateSlide.cloneNode(false)
      : document.createElement("img");

    if (templateSlide.getAttributeNames) {
      templateSlide.getAttributeNames().forEach((name) => {
        if (name === "src" || name === "alt") {
          return;
        }
        newSlide.setAttribute(name, templateSlide.getAttribute(name));
      });
    }

    newSlide.classList.add("hero-image-slide");
    newSlide.classList.remove("is-active");
    return newSlide;
  };

  const matchesImageSrc = (slide, imageSrc) => {
    const rawSrc = slide.getAttribute("src") || "";
    const resolvedSrc = slide.src || "";
    return rawSrc.endsWith(imageSrc) || resolvedSrc.endsWith(imageSrc);
  };

  const getAllSlides = () => Array.from(hero.querySelectorAll(".hero-image-slide"));

  heroSlides.forEach((slideData) => {
    const existingSlides = getAllSlides();
    const match = existingSlides.find((slide) => matchesImageSrc(slide, slideData.imageSrc));
    if (!match) {
      const newSlide = createSlide();
      newSlide.src = slideData.imageSrc;
      newSlide.alt = slideData.key;
      slidesContainer.appendChild(newSlide);
    }
  });

  const allSlides = getAllSlides();
  const rotationSlides = [];
  let rotationReady = true;

  for (const slideData of heroSlides) {
    const match = allSlides.find((slide) => matchesImageSrc(slide, slideData.imageSrc));
    if (!match) {
      rotationReady = false;
      break;
    }
    rotationSlides.push(match);
  }

  if (!rotationReady || rotationSlides.length !== heroSlides.length) {
    return;
  }

  allSlides.forEach((slide) => {
    if (!rotationSlides.includes(slide)) {
      slide.classList.remove("is-active");
    }
  });

  const setActive = (index) => {
    rotationSlides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === index);
    });
  };

  const setTagline = (index) => {
    const nextSlide = heroSlides[index % heroSlides.length];
    let nextLine = nextSlide.tagline;

    if (enableAccentText) {
      const accent = typeof nextSlide.accent === "string" ? nextSlide.accent.trim() : "";
      if (accent) {
        nextLine = `${nextLine} — ${accent}`;
      }
    }

    taglineEl.textContent = nextLine;
  };

  let currentIndex = 0;
  setActive(currentIndex);
  setTagline(currentIndex);
  taglineEl.classList.add("is-visible");

  const scheduleNext = (delay) => {
    window.setTimeout(rotate, delay);
  };

  const rotate = () => {
    const nextIndex = (currentIndex + 1) % heroSlides.length;

    if (prefersReducedMotion.matches) {
      currentIndex = nextIndex;
      setActive(currentIndex);
      setTagline(currentIndex);
      scheduleNext(intervalMs);
      return;
    }

    const currentSlide = rotationSlides[currentIndex];
    const nextSlide = rotationSlides[nextIndex];

    nextSlide.classList.add("is-active");
    window.requestAnimationFrame(() => {
      currentSlide.classList.remove("is-active");
    });

    taglineEl.classList.remove("is-visible");
    window.setTimeout(() => {
      currentIndex = nextIndex;
      setTagline(currentIndex);
      taglineEl.classList.add("is-visible");
      scheduleNext(Math.max(0, intervalMs - fadeMs));
    }, fadeMs);
  };

  scheduleNext(intervalMs);
})();

