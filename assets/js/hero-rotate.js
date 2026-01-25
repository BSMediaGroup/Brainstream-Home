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
      imageSrc: "assets/logos/xbsmgmainx1.svg",
      tagline: "Creator-first media systems, engineered for longevity."
    },
    {
      key: "streamsuites",
      imageSrc: "assets/logos/logocircle.png",
      tagline: "Powering StreamSuites™, the next-generation creator platform."
    },
    {
      key: "danielclancy",
      imageSrc: "assets/logos/DCX.svg",
      tagline: "Professional architectural and structural drafting services."
    },
    {
      key: "danielclancy-live",
      imageSrc: "assets/logos/dcliveblack.svg",
      tagline: "Personal podcast hub featuring long-form discussions and media."
    }
  ];

  if (!heroSlides.length) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const fadeMs = 1200;
  const intervalMs = 7000;

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
    const nextLine = heroSlides[index % heroSlides.length].tagline;
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

