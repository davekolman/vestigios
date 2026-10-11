document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     01. CONFIGURACIÓN GENERAL DE LOS VÍDEOS
  ========================================================= */

  function prepareVideo(video) {
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    video.playsInline = true;

    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("disablepictureinpicture", "");
    video.setAttribute("controlslist", "nodownload noplaybackrate");

    video.controls = false;
    video.removeAttribute("controls");
  }


  function playVideo(video) {
    if (!video) return;

    prepareVideo(video);

    const promise = video.play();

    if (promise && typeof promise.catch === "function") {
      promise.catch(() => {
        // El navegador puede bloquear la reproducción.
      });
    }
  }


  function pauseVideo(video, reset = false) {
    if (!video) return;

    video.pause();

    if (reset) {
      try {
        video.currentTime = 0;
      } catch (error) {
        // El vídeo puede no haber terminado de cargar.
      }
    }
  }


  document.querySelectorAll("video").forEach((video) => {
    prepareVideo(video);
  });


  /* =========================================================
     02. BOTONES PERSONALIZADOS DE REPRODUCCIÓN
  ========================================================= */

  function createPlayButton(className, label) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = `video-play-toggle ${className}`;
    button.setAttribute("aria-label", label);
    button.setAttribute("aria-pressed", "false");

    return button;
  }


  function setPlayButtonState(button, video) {
    if (!button || !video) return;

    const isPlaying = !video.paused && !video.ended;

    button.classList.toggle("is-hidden", isPlaying);

    button.setAttribute(
      "aria-label",
      isPlaying ? "Pausar vídeo" : "Reproducir vídeo"
    );

    button.setAttribute(
      "aria-pressed",
      isPlaying ? "true" : "false"
    );
  }


  function toggleVideo(video) {
    if (!video) return;

    if (video.paused || video.ended) {

      if (video.ended) {
        try {
          video.currentTime = 0;
        } catch (error) {
          // El vídeo puede no haber terminado de cargar.
        }
      }

      playVideo(video);

    } else {
      pauseVideo(video);
    }
  }


  function watchVideoButton(button, video, isActive) {
    if (!button || !video) return;

    const update = () => {
      if (isActive()) {
        setPlayButtonState(button, video);
      }
    };

    ["play", "playing", "pause", "ended", "error"].forEach((eventName) => {
      video.addEventListener(eventName, update);
    });
  }


  /* =========================================================
     03. VÍDEO DE PORTADA
  ========================================================= */

  const heroVideo =
    document.getElementById("hero-video") ||
    document.querySelector(".hero video");

  if (heroVideo) {
    prepareVideo(heroVideo);

    heroVideo.loop = true;
    heroVideo.autoplay = true;

    heroVideo.setAttribute("autoplay", "");
    heroVideo.setAttribute("loop", "");

    const startHeroVideo = () => {
      if (document.hidden) return;
      playVideo(heroVideo);
    };

    if (heroVideo.readyState >= 2) {
      startHeroVideo();
    } else {
      heroVideo.addEventListener("canplay", startHeroVideo, {
        once: true
      });
    }

    window.addEventListener("pageshow", startHeroVideo);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        pauseVideo(heroVideo);
      } else {
        startHeroVideo();
      }
    });
  }


  /* =========================================================
     04. VÍDEO DE PROCESO
  ========================================================= */

  const processVideo =
    document.getElementById("process-video") ||
    document.querySelector(".process video");

  if (processVideo) {
    prepareVideo(processVideo);

    processVideo.loop = true;
    processVideo.autoplay = true;

    processVideo.setAttribute("autoplay", "");
    processVideo.setAttribute("loop", "");

    const startProcessVideo = () => {
      if (document.hidden) return;
      playVideo(processVideo);
    };

    if (processVideo.readyState >= 2) {
      startProcessVideo();
    } else {
      processVideo.addEventListener("canplay", startProcessVideo, {
        once: true
      });
    }

    window.addEventListener("pageshow", startProcessVideo);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        pauseVideo(processVideo);
      } else {
        startProcessVideo();
      }
    });
  }


  /* =========================================================
     05. MENÚ MÓVIL
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
     06. BOTÓN VOLVER ARRIBA
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
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      window.scrollTo({
        top: 0,
        behavior: reduceMotion ? "auto" : "smooth"
      });
    });
  }


  /* =========================================================
     07. VARIABLES DEL LIGHTBOX
  ========================================================= */

  let lightbox = null;
  let lightboxTrack = null;
  let lightboxWindow = null;
  let lightboxSlides = [];
  let lightboxCurrent = 0;
  let lightboxPlayButton = null;

  let lightboxTouchStartX = 0;
  let lightboxTouchStartY = 0;
  let lightboxTouchCurrentX = 0;
  let lightboxTouchCurrentY = 0;
  let lightboxGestureDirection = null;
  let lightboxSuppressClickUntil = 0;


  /* =========================================================
     08. FUNCIONES DE NAVEGACIÓN DEL LIGHTBOX
  ========================================================= */

  function goToLightboxSlide(direction) {
    if (!lightboxSlides.length) return;

    lightboxCurrent += direction;

    if (lightboxCurrent < 0) {
      lightboxCurrent = lightboxSlides.length - 1;
    }

    if (lightboxCurrent >= lightboxSlides.length) {
      lightboxCurrent = 0;
    }

    updateLightbox();
  }


  /* =========================================================
     09. CREAR LIGHTBOX
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

    lightboxTrack = lightbox.querySelector(".lightbox-track");
    lightboxWindow = lightbox.querySelector(".lightbox-window");

    const closeButton =
      lightbox.querySelector(".lightbox-close");

    const prevButton =
      lightbox.querySelector(".lightbox-prev");

    const nextButton =
      lightbox.querySelector(".lightbox-next");


    /* Botón de reproducción del vídeo activo. */

    lightboxPlayButton = createPlayButton(
      "lightbox-video-play",
      "Reproducir vídeo"
    );

    lightboxWindow.appendChild(lightboxPlayButton);


    /*
      CORRECCIÓN IMPORTANTE:
      el botón del lightbox ahora tiene su propia acción.
      Antes se creaba, pero no tenía un controlador que
      reprodujera o pausara el vídeo activo.
    */

    lightboxPlayButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (Date.now() < lightboxSuppressClickUntil) return;

      const activeSlide =
        lightboxTrack.children[lightboxCurrent];

      if (!activeSlide || activeSlide.tagName !== "VIDEO") {
        return;
      }

      toggleVideo(activeSlide);
      updateLightboxPlayButton();
    });


    closeButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      closeLightbox();
    });


    prevButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      goToLightboxSlide(-1);
    });


    nextButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      goToLightboxSlide(1);
    });


    lightbox.addEventListener("click", (event) => {

      if (Date.now() < lightboxSuppressClickUntil) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      if (
        event.target === lightbox ||
        event.target === lightboxWindow
      ) {
        closeLightbox();
      }
    });


    /* =====================================================
       GESTOS TÁCTILES DEL LIGHTBOX
    ===================================================== */

    lightboxWindow.addEventListener("touchstart", (event) => {
      if (!event.touches || !event.touches.length) return;

      const touch = event.touches[0];

      lightboxTouchStartX = touch.clientX;
      lightboxTouchStartY = touch.clientY;

      lightboxTouchCurrentX = touch.clientX;
      lightboxTouchCurrentY = touch.clientY;

      lightboxGestureDirection = null;

    }, { passive: true });


    lightboxWindow.addEventListener("touchmove", (event) => {
      if (!event.touches || !event.touches.length) return;

      const touch = event.touches[0];

      lightboxTouchCurrentX = touch.clientX;
      lightboxTouchCurrentY = touch.clientY;

      const differenceX =
        lightboxTouchCurrentX - lightboxTouchStartX;

      const differenceY =
        lightboxTouchCurrentY - lightboxTouchStartY;

      if (lightboxGestureDirection === null) {
        const absX = Math.abs(differenceX);
        const absY = Math.abs(differenceY);

        if (absX < 8 && absY < 8) return;

        lightboxGestureDirection =
          absX > absY ? "horizontal" : "vertical";
      }

      if (lightboxGestureDirection === "horizontal") {
        event.preventDefault();
      }

    }, { passive: false });


    lightboxWindow.addEventListener("touchend", () => {

      if (lightboxGestureDirection !== "horizontal") {
        lightboxGestureDirection = null;
        return;
      }

      const difference =
        lightboxTouchStartX - lightboxTouchCurrentX;

      if (Math.abs(difference) >= 50) {
        lightboxSuppressClickUntil = Date.now() + 500;

        if (difference > 0) {
          goToLightboxSlide(1);
        } else {
          goToLightboxSlide(-1);
        }
      }

      lightboxGestureDirection = null;

    }, { passive: true });


    lightboxWindow.addEventListener("touchcancel", () => {
      lightboxGestureDirection = null;
    }, { passive: true });


    /* =====================================================
       TECLADO
    ===================================================== */

    document.addEventListener("keydown", (event) => {
      if (!lightbox.classList.contains("active")) return;

      if (event.key === "Escape") {
        closeLightbox();
        return;
      }

      if (event.key === "ArrowRight") {
        goToLightboxSlide(1);
      }

      if (event.key === "ArrowLeft") {
        goToLightboxSlide(-1);
      }
    });
  }


  /* =========================================================
     10. ACTUALIZAR BOTÓN DE REPRODUCCIÓN DEL LIGHTBOX
  ========================================================= */

  function updateLightboxPlayButton() {
    if (!lightboxPlayButton || !lightboxTrack) return;

    const activeSlide =
      lightboxTrack.children[lightboxCurrent];

    const isVideo =
      activeSlide && activeSlide.tagName === "VIDEO";

    lightboxPlayButton.classList.toggle(
      "is-hidden",
      !isVideo
    );

    if (isVideo) {
      setPlayButtonState(lightboxPlayButton, activeSlide);
    } else {
      lightboxPlayButton.setAttribute("aria-pressed", "false");
      lightboxPlayButton.setAttribute(
        "aria-label",
        "Reproducir vídeo"
      );
    }
  }


  /* =========================================================
     11. ABRIR LIGHTBOX
  ========================================================= */

  function openLightbox(slides, startIndex) {
    createLightbox();

    /*
      Pausar y reiniciar los vídeos de las galerías
      antes de abrir el visor.
    */

    document.querySelectorAll(".gallery video").forEach((video) => {
      pauseVideo(video, true);
    });

    lightboxSlides = Array.from(slides);

    lightboxCurrent = Number(startIndex) || 0;

    lightboxTrack.innerHTML = "";

    lightboxSlides.forEach((slide) => {
      const clone = slide.cloneNode(true);

      clone.removeAttribute("style");

      if (clone.tagName === "VIDEO") {
        prepareVideo(clone);

        clone.controls = false;
        clone.loop = false;
        clone.autoplay = false;

        clone.removeAttribute("controls");
        clone.removeAttribute("autoplay");
        clone.removeAttribute("loop");

        clone.pause();

        /*
          Tocar el vídeo en el lightbox reproduce o pausa.
          No abre otro visor ni cambia de diapositiva.
        */

        clone.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();

          if (Date.now() < lightboxSuppressClickUntil) return;

          if (
            lightboxTrack.children[lightboxCurrent] !== clone
          ) {
            return;
          }

          toggleVideo(clone);
          updateLightboxPlayButton();
        });

        watchVideoButton(
          lightboxPlayButton,
          clone,
          () =>
            lightboxTrack &&
            lightboxTrack.children[lightboxCurrent] === clone
        );

      } else {
        clone.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
        });
      }

      lightboxTrack.appendChild(clone);
    });

    lightbox.classList.add("active");
    document.body.classList.add("lightbox-open");

    updateLightbox();
  }


  /* =========================================================
     12. ACTUALIZAR LIGHTBOX
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
      Al cambiar de diapositiva, ningún vídeo anterior
      debe seguir reproduciéndose.
    */

    Array.from(lightboxTrack.children).forEach((slide) => {
      if (slide.tagName === "VIDEO") {
        pauseVideo(slide, true);
      }
    });

    lightboxTrack.style.transform =
      `translate3d(-${lightboxCurrent * 100}%, 0, 0)`;

    updateLightboxPlayButton();
  }


  /* =========================================================
     13. CERRAR LIGHTBOX
  ========================================================= */

  function closeLightbox() {
    if (!lightbox) return;

    lightbox.classList.remove("active");
    document.body.classList.remove("lightbox-open");

    lightbox.querySelectorAll("video").forEach((video) => {
      pauseVideo(video, true);
    });

    if (lightboxPlayButton) {
      lightboxPlayButton.classList.add("is-hidden");
    }
  }


  /* =========================================================
     14. INICIALIZAR GALERÍAS
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
    let suppressClickUntil = 0;

    let touchStartX = 0;
    let touchStartY = 0;
    let touchCurrentX = 0;
    let touchCurrentY = 0;
    let gestureDirection = null;


    /* =====================================================
       BOTÓN PLAY DE LA GALERÍA
    ===================================================== */

    const galleryPlayButton = createPlayButton(
      "gallery-video-play",
      "Reproducir vídeo"
    );

    gallery.appendChild(galleryPlayButton);


    function updateGalleryPlayButton() {
      const activeSlide = slides[current];

      const isVideo =
        activeSlide && activeSlide.tagName === "VIDEO";

      galleryPlayButton.classList.toggle(
        "is-hidden",
        !isVideo
      );

      if (isVideo) {
        setPlayButtonState(galleryPlayButton, activeSlide);
      } else {
        galleryPlayButton.setAttribute("aria-pressed", "false");
        galleryPlayButton.setAttribute(
          "aria-label",
          "Reproducir vídeo"
        );
      }
    }


    galleryPlayButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (Date.now() < suppressClickUntil) return;

      const activeSlide = slides[current];

      if (!activeSlide || activeSlide.tagName !== "VIDEO") {
        return;
      }

      toggleVideo(activeSlide);
      updateGalleryPlayButton();
    });


    /* =====================================================
       ACTUALIZAR GALERÍA
    ===================================================== */

    function updateGallery() {
      /*
        Usamos el índice de la diapositiva, no offsetLeft,
        para mantener el desplazamiento consistente.
      */

      track.style.transform =
        `translate3d(-${current * 100}%, 0, 0)`;

      /*
        Detener y reiniciar los vídeos al cambiar de pieza.
      */

      slides.forEach((slide) => {
        if (slide.tagName === "VIDEO") {
          prepareVideo(slide);
          pauseVideo(slide, true);
        }
      });

      updateGalleryPlayButton();
    }


    /* Mantener actualizado el botón ante eventos del vídeo. */

    slides.forEach((slide) => {
      if (slide.tagName !== "VIDEO") return;

      watchVideoButton(
        galleryPlayButton,
        slide,
        () => slides[current] === slide
      );
    });


    /* =====================================================
       FLECHA SIGUIENTE
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
       FLECHA ANTERIOR
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
       GESTOS TÁCTILES DE LA GALERÍA
    ===================================================== */

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

        gestureDirection =
          absX > absY ? "horizontal" : "vertical";
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

      if (Math.abs(difference) >= 50) {
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

        /*
          Impedir que el mismo gesto táctil termine
          disparando el clic de la imagen o del vídeo.
        */

        suppressClickUntil = Date.now() + 500;

        updateGallery();
      }

      gestureDirection = null;

    }, { passive: true });


    gallery.addEventListener("touchcancel", () => {
      gestureDirection = null;
    }, { passive: true });


    /* =====================================================
       INTERACCIÓN CON FOTOGRAFÍAS Y VÍDEOS
    ===================================================== */

    slides.forEach((slide, index) => {
      slide.style.cursor = "pointer";

      if (slide.tagName === "VIDEO") {
        /*
          Tocar el vídeo de una galería solo reproduce
          o pausa. Nunca abre el lightbox.
        */

        slide.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();

          if (Date.now() < suppressClickUntil) return;

          if (slides[current] !== slide) return;

          toggleVideo(slide);
          updateGalleryPlayButton();
        });

      } else {
        /*
          Las fotografías sí abren el lightbox.
        */

        slide.addEventListener("click", (event) => {
          if (Date.now() < suppressClickUntil) {
            event.preventDefault();
            event.stopPropagation();
            return;
          }

          event.preventDefault();
          event.stopPropagation();

          openLightbox(slides, index);
        });
      }
    });


    /* =====================================================
       INICIALIZAR Y REAJUSTAR
    ===================================================== */

    updateGallery();

    window.addEventListener("resize", updateGallery);

    window.addEventListener("orientationchange", () => {
      requestAnimationFrame(updateGallery);
    });

  });


  /* =========================================================
     15. AL VOLVER A LA PÁGINA
  ========================================================= */

  window.addEventListener("pageshow", () => {
    if (!document.hidden && heroVideo) {
      playVideo(heroVideo);
    }

    if (!document.hidden && processVideo) {
      playVideo(processVideo);
    }

    /*
      Las piezas no se reproducen automáticamente
      al restaurar la página.
    */

    document.querySelectorAll(".gallery video").forEach((video) => {
      prepareVideo(video);
      pauseVideo(video);
    });

    if (lightbox) {
      lightbox.querySelectorAll("video").forEach((video) => {
        pauseVideo(video);
      });

      updateLightboxPlayButton();
    }
  });

});

