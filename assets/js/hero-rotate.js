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
      key: "thirdrailify",
      imageSrc: "assets/logos/thirdrailify.svg",
      tagline: "Producing long-form podcast networks and media brands."
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
    },
    {
      key: "simpledavy",
      imageSrc: "assets/logos/simpledavy.svg",
      tagline: "An independent podcast platform currently in development."
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

  if (initialSlides.length < heroSlides.length) {
    for (let i = initialSlides.length; i < heroSlides.length; i += 1) {
      const slideData = heroSlides[i];
      const newSlide = createSlide();
      newSlide.src = slideData.imageSrc;
      newSlide.alt = slideData.key;
      slidesContainer.appendChild(newSlide);
    }
  }

  const slides = Array.from(hero.querySelectorAll(".hero-image-slide")).slice(0, heroSlides.length);

  const setActive = (index) => {
    slides.forEach((slide, i) => {
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

    const currentSlide = slides[currentIndex];
    const nextSlide = slides[nextIndex];

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

