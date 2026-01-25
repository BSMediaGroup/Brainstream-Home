(() => {
  const initSearch = () => {
    const mount = document.querySelector("#search");
    if (!mount) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      mount.classList.add("pagefind-reduced-motion");
    }

    const loadPagefind = () => new Promise((resolve) => {
      if (window.PagefindUI) {
        resolve(window.PagefindUI);
        return;
      }

      const script = document.createElement("script");
      script.src = "/pagefind/pagefind-ui.js";
      script.async = true;
      script.onload = () => resolve(window.PagefindUI || null);
      script.onerror = () => resolve(null);
      document.head.appendChild(script);
    });

    loadPagefind().then((PagefindUI) => {
      if (!PagefindUI) {
        return;
      }

      try {
        new PagefindUI({
          element: "#search",
          showImages: false,
          resetStyles: false,
          translations: {
            placeholder: "Search Brainstream Media",
          },
        });
      } catch (error) {
        return;
      }
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSearch, { once: true });
  } else {
    initSearch();
  }
})();
