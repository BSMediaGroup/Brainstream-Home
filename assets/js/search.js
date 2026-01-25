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

        const ensureSearchWrap = () => {
          const form = document.querySelector(".pagefind-ui__form");
          if (!form) return;

          const input = form.querySelector(
            ":scope > .pagefind-ui__search-input, :scope > input.pagefind-ui__search-input",
          );
          const clear = form.querySelector(
            ":scope > .pagefind-ui__search-clear, :scope > button.pagefind-ui__search-clear",
          );
          const drawer = form.querySelector(":scope > .pagefind-ui__drawer");

          const anyInput = input || form.querySelector(".pagefind-ui__search-input");
          const anyClear = clear || form.querySelector(".pagefind-ui__search-clear");
          if (!anyInput || !anyClear) return;

          let wrap = form.querySelector(":scope > .search-input-wrap");
          if (!wrap) {
            wrap = document.createElement("div");
            wrap.className = "search-input-wrap";
            if (drawer) form.insertBefore(wrap, drawer);
            else form.appendChild(wrap);
          }

          if (anyInput.parentElement !== wrap) wrap.appendChild(anyInput);
          if (anyClear.parentElement !== wrap) wrap.appendChild(anyClear);

          if (drawer && drawer.previousElementSibling !== wrap) {
            form.insertBefore(wrap, drawer);
          }
        };

        ensureSearchWrap();

        const pfObserver = new MutationObserver(() => ensureSearchWrap());
        pfObserver.observe(document.getElementById("search") || document.body, {
          childList: true,
          subtree: true,
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
