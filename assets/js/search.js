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

        const wrapSearchControls = () => {
          const form = document.querySelector(".pagefind-ui__form");
          const input = form?.querySelector(".pagefind-ui__search-input");
          const clear = form?.querySelector(".pagefind-ui__search-clear");

          if (!form || !input || !clear) return;

          if (input.parentElement?.classList.contains("search-input-wrap")) return;

          const wrap = document.createElement("div");
          wrap.className = "search-input-wrap";

          input.before(wrap);
          wrap.appendChild(input);
          wrap.appendChild(clear);
        };

        const observer = new MutationObserver(wrapSearchControls);
        observer.observe(document.body, { childList: true, subtree: true });

        wrapSearchControls();
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
