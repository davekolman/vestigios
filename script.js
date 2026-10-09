
document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     VIDEO DE PORTADA
  ========================================================= */

  const heroVideo = document.getElementById("hero-video");

  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;

    heroVideo.setAttribute("muted", "");
    heroVideo.setAttribute("autoplay", "");
    heroVideo.setAttribute("loop", "");
    heroVideo.setAttribute("playsinline", "");
    heroVideo.setAttribute("webkit-playsinline", "");

    heroVideo.controls = false;
    heroVideo.removeAttribute("controls");

    const startHeroVideo = () => {
      heroVideo.muted = true;
      heroVideo.controls = false;
      heroVideo.removeAttribute("controls");
      heroVideo.loop = true;

      const playPromise = heroVideo.play();

      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    };

    startHeroVideo();

    window.addEventListener("load", startHeroVideo, {
      once: true
    });

    heroVideo.addEventListener("canplay", startHeroVideo, {
      once: true
    });

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        startHeroVideo();
      }
    });
  }


  /* =========================================================
     MENÚ MÓVIL
  ========================================================= */

  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.getElementById("main-nav");
  const siteHeader = document.querySelector(".site-header");

  function closeMenu() {
    if (!menuToggle || !mainNav) return;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
    mainNav.classList.remove("open");
    document.body.classList.remove("menu-open");
  }

  function openMenu() {
    if (!menuToggle || !mainNav) return;

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Cerrar menú");
    mainNav.classList.add("open");
    document.body.classList.add("menu-open");
  }

  if (menuToggle && mainNav) {

    menuToggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const isExpanded =
        menuToggle.getAttribute("aria-expanded") === "true";

      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    mainNav.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
      if (
        mainNav.classList.contains("open") &&
        siteHeader &&
        !siteHeader.contains(event.target)
      ) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 700) {
        closeMenu();
      }
    });
  }


  /* =========================================================
     BOTÓN VOLVER ARRIBA
  ========================================================= */

  const backToTop = document.getElementById("back-to-top");

  if (backToTop) {

    const updateBackToTop = () => {
      const scrollPosition =
        window.scrollY ||
        document.documentElement.scrollTop ||
        0;

      backToTop.classList.toggle(
        "visible",
        scrollPosition > 120
      );
    };

    window.addEventListener("scroll", updateBackToTop, {
      passive: true
    });

    window.addEventListener("resize", updateBackToTop, {
      passive: true
    });

    window.addEventListener("pageshow", updateBackToTop);

    updateBackToTop();

    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches ? "auto" : "smooth"
      });
    });
  }


  /* =========================================================
     VARIABLES DEL LIGHTBOX
  ========================================================= */

  let lightbox = null;
  let lightboxTrack = null;
  let lightboxSlides = [];
  let lightboxCurrent = 0;


  /* =========================================================
     CREAR LIGHTBOX
  ========================================================= */

  function createLightbox() {

    if (lightbox) return;

    lightbox = document.createElement("div");
    lightbox.className = "lightbox";

    lightbox.innerHTML = `
      <button
        class="lightbox-close"
        type="button"
        aria-label="Cerrar visor"
      >×</button>

      <button
        class="lightbox-arrow lightbox-prev"
        type="button"
        aria-label="Imagen anterior"
      >‹</button>

      <div class="lightbox-window">
        <div class="lightbox-track"></div>
      </div>

      <button
        class="lightbox-arrow lightbox-next"
        type="button"
        aria-label="Siguiente imagen"
      >›</button>
    `;

    document.body.appendChild(lightbox);

    lightboxTrack =
      lightbox.querySelector(".lightbox-track");

    const closeButton =
      lightbox.querySelector(".lightbox-close");

    const prevButton =
      lightbox.querySelector(".lightbox-prev");

    const nextButton =
      lightbox.querySelector(".lightbox-next");


    /* Cerrar */

    closeButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      closeLightbox();
    });


    /* Anterior */

    prevButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (!lightboxSlides.length) return;

      lightboxCurrent--;

      if (lightboxCurrent < 0) {
        lightboxCurrent = lightboxSlides.length - 1;
      }

      updateLightbox();
    });


    /* Siguiente */

    nextButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (!lightboxSlides.length) return;

      lightboxCurrent++;

      if (lightboxCurrent >= lightboxSlides.length) {
        lightboxCurrent = 0;
      }

      updateLightbox();
    });


    /* Clic en el fondo */

    lightbox.addEventListener("click", (event) => {
      if (
        event.target === lightbox ||
        event.target ===
          lightbox.querySelector(".lightbox-window")
      ) {
        closeLightbox();
      }
    });


    /* Teclado */

    document.addEventListener("keydown", (event) => {

      if (!lightbox.classList.contains("active")) return;

      if (event.key === "Escape") {
        closeLightbox();
        return;
      }

      if (!lightboxSlides.length) return;

      if (event.key === "ArrowRight") {
        lightboxCurrent++;

        if (lightboxCurrent >= lightboxSlides.length) {
          lightboxCurrent = 0;
        }

        updateLightbox();
      }

      if (event.key === "ArrowLeft") {
        lightboxCurrent--;

        if (lightboxCurrent < 0) {
          lightboxCurrent = lightboxSlides.length - 1;
        }

        updateLightbox();
      }
    });
  }


  /* =========================================================
     ABRIR LIGHTBOX
  ========================================================= */

  function openLightbox(slides, startIndex) {

    createLightbox();

    lightboxSlides = Array.from(slides);

    lightboxCurrent = Number(startIndex) || 0;

    lightboxTrack.innerHTML = "";

    lightboxSlides.forEach((slide) => {

      const clone = slide.cloneNode(true);

      clone.removeAttribute("style");

      if (clone.tagName === "VIDEO") {
        clone.muted = true;
        clone.defaultMuted = true;
        clone.controls = false;
        clone.loop = true;

        clone.setAttribute("muted", "");
        clone.setAttribute("playsinline", "");
        clone.setAttribute("webkit-playsinline", "");
        clone.removeAttribute("controls");
      }

      clone.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
      });

      lightboxTrack.appendChild(clone);
    });

    lightbox.classList.add("active");
    document.body.classList.add("lightbox-open");

    updateLightbox();
  }


  /* =========================================================
     ACTUALIZAR LIGHTBOX
  ========================================================= */

  function updateLightbox() {

    if (!lightboxTrack || !lightboxSlides.length) return;

    if (lightboxCurrent < 0) {
      lightboxCurrent = lightboxSlides.length - 1;
    }

    if (lightboxCurrent >= lightboxSlides.length) {
      lightboxCurrent = 0;
    }

    /*
      El lightbox conserva su desplazamiento porcentual.
      Su funcionamiento depende del ancho definido en
      las reglas CSS de .lightbox-track y sus elementos.
    */

    lightboxTrack.style.transform =
      `translate3d(-${lightboxCurrent * 100}%, 0, 0)`;

    const slides = Array.from(lightboxTrack.children);

    slides.forEach((slide, index) => {

      if (slide.tagName !== "VIDEO") return;

      if (index === lightboxCurrent) {

        slide.muted = true;

        const playPromise = slide.play();

        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }

      } else {

        slide.pause();

        try {
          slide.currentTime = 0;
        } catch (error) {}
      }
    });
  }


  /* =========================================================
     CERRAR LIGHTBOX
  ========================================================= */

  function closeLightbox() {

    if (!lightbox) return;

    lightbox.classList.remove("active");
    document.body.classList.remove("lightbox-open");

    lightbox.querySelectorAll("video").forEach((video) => {
      video.pause();

      try {
        video.currentTime = 0;
      } catch (error) {}
    });
  }


  /* =========================================================
     INICIALIZAR GALERÍAS
  ========================================================= */

  const galleries = document.querySelectorAll(".gallery");

  galleries.forEach((gallery) => {

    const track = gallery.querySelector(".gallery-track");

    const prevButton =
      gallery.querySelector(".gallery-arrow.prev");

    const nextButton =
      gallery.querySelector(".gallery-arrow.next");

    if (!track) return;

    const slides = Array.from(
      track.querySelectorAll("img, video")
    );

    const total = slides.length;

    if (!total) return;

    let current = 0;


    /* =====================================================
       ACTUALIZAR CARRUSEL
    ===================================================== */

    function updateGallery() {

      /*
        CORRECCIÓN:
        El desplazamiento se calcula en píxeles usando
        el ancho visible de la galería, no el porcentaje
        del ancho total de la pista.
      */

      const slideWidth = gallery.clientWidth;

      track.style.transform =
        `translate3d(-${current * slideWidth}px, 0, 0)`;

      slides.forEach((slide, index) => {

        if (slide.tagName !== "VIDEO") return;

        if (index === current) {

          slide.muted = true;
          slide.setAttribute("muted", "");
          slide.setAttribute("playsinline", "");

          const playPromise = slide.play();

          if (playPromise !== undefined) {
            playPromise.catch(() => {});
          }

        } else {

          slide.pause();

          try {
            slide.currentTime = 0;
          } catch (error) {}
        }
      });
    }


    /* =====================================================
       SIGUIENTE
    ===================================================== */

    if (nextButton) {
      nextButton.addEventListener("click", (event) => {

        event.preventDefault();
        event.stopPropagation();

        current++;

        if (current >= total) {
          current = 0;
        }

        updateGallery();
      });
    }


    /* =====================================================
       ANTERIOR
    ===================================================== */

    if (prevButton) {
      prevButton.addEventListener("click", (event) => {

        event.preventDefault();
        event.stopPropagation();

        current--;

        if (current < 0) {
          current = total - 1;
        }

        updateGallery();
      });
    }


    /* =====================================================
       GESTOS TÁCTILES
    ===================================================== */

    let touchStartX = 0;
    let touchStartY = 0;
    let touchCurrentX = 0;
    let touchCurrentY = 0;
    let gestureDirection = null;

    gallery.addEventListener("touchstart", (event) => {

      if (!event.touches || !event.touches.length) return;

      const touch = event.touches[0];

      touchStartX = touch.clientX;
      touchStartY = touch.clientY;

      touchCurrentX = touchStartX;
      touchCurrentY = touchStartY;

      gestureDirection = null;

    }, { passive: true });


    gallery.addEventListener("touchmove", (event) => {

      if (!event.touches || !event.touches.length) return;

      const touch = event.touches[0];

      touchCurrentX = touch.clientX;
      touchCurrentY = touch.clientY;

      const differenceX = touchCurrentX - touchStartX;
      const differenceY = touchCurrentY - touchStartY;

      if (gestureDirection === null) {

        const absX = Math.abs(differenceX);
        const absY = Math.abs(differenceY);

        if (absX < 8 && absY < 8) return;

        if (absY > absX) {
          gestureDirection = "vertical";
          return;
        }

        gestureDirection = "horizontal";
      }

      if (gestureDirection === "horizontal") {
        event.preventDefault();
      }

    }, { passive: false });


    gallery.addEventListener("touchend", () => {

      if (gestureDirection !== "horizontal") {
        gestureDirection = null;
        return;
      }

      const difference = touchStartX - touchCurrentX;

      if (Math.abs(difference) < 50) {
        gestureDirection = null;
        return;
      }

      if (difference > 0) {

        current++;

        if (current >= total) {
          current = 0;
        }

      } else {

        current--;

        if (current < 0) {
          current = total - 1;
        }
      }

      updateGallery();

      gestureDirection = null;

    }, { passive: true });


    gallery.addEventListener("touchcancel", () => {
      gestureDirection = null;
    }, { passive: true });


    /* =====================================================
       ABRIR VISOR AL TOCAR UNA IMAGEN O VIDEO
    ===================================================== */

    slides.forEach((slide, index) => {

      slide.style.cursor = "pointer";

      slide.addEventListener("click", (event) => {

        event.preventDefault();
        event.stopPropagation();

        openLightbox(slides, index);
      });
    });


    /* =====================================================
       INICIALIZAR Y REAJUSTAR AL CAMBIAR EL ANCHO
    ===================================================== */

    updateGallery();

    window.addEventListener("resize", updateGallery);
  });

});
