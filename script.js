document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     CONFIGURACIÓN GENERAL DE LOS VÍDEOS
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


  /*
    Los vídeos de la página no utilizan controles nativos.
    Los controles de reproducción de las piezas se crean
    mediante botones propios.
  */

  document.querySelectorAll("video").forEach((video) => {
    prepareVideo(video);
  });


  /* =========================================================
     BOTÓN PERSONALIZADO DE REPRODUCCIÓN
  ========================================================= */

  function createPlayButton(className, label) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = `video-play-toggle ${className}`;
    button.setAttribute("aria-label", label);
    button.setAttribute("aria-pressed", "false");

    /*
      El símbolo visual se construye mediante CSS.
      El botón no depende de controles nativos del navegador.
    */

    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
    });

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


  function bindPlayButton(button, video) {
    if (!button || !video) return;

    const updateButton = () => {
      setPlayButtonState(button, video);
    };

    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

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

      updateButton();
    });

    video.addEventListener("play", updateButton);
    video.addEventListener("playing", updateButton);
    video.addEventListener("pause", updateButton);
    video.addEventListener("ended", updateButton);

    updateButton();
  }


  /* =========================================================
     VIDEO DE PORTADA
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
      if (!document.hidden) {
        startHeroVideo();
      } else {
        pauseVideo(heroVideo);
      }
    });
  }


  /* =========================================================
     VIDEO DE PROCESO
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
      if (!document.hidden) {
        startProcessVideo();
      } else {
        pauseVideo(processVideo);
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
     VARIABLES DEL LIGHTBOX
  ========================================================= */

  let lightbox = null;
  let lightboxTrack = null;
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

    lightboxTrack = lightbox.querySelector(".lightbox-track");

    const closeButton =
      lightbox.querySelector(".lightbox-close");

    const prevButton =
      lightbox.querySelector(".lightbox-prev");

    const nextButton =
      lightbox.querySelector(".lightbox-next");

    const lightboxWindow =
      lightbox.querySelector(".lightbox-window");


    /*
      El botón se superpone al vídeo activo.
      No se añade a las fotografías.
    */

    lightboxPlayButton = createPlayButton(
      "lightbox-video-play",
      "Reproducir vídeo"
    );

    lightboxWindow.appendChild(lightboxPlayButton);


    closeButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      closeLightbox();
    });


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


    /*
      Navegación táctil dentro del visor.
      Un toque normal no cambia de diapositiva.
    */

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

      if (Math.abs(difference) >= 50 && lightboxSlides.length) {

        if (difference > 0) {
          lightboxCurrent++;

          if (lightboxCurrent >= lightboxSlides.length) {
            lightboxCurrent = 0;
          }

        } else {
          lightboxCurrent--;

          if (lightboxCurrent < 0) {
            lightboxCurrent = lightboxSlides.length - 1;
          }
        }

        lightboxSuppressClickUntil = Date.now() + 500;

        updateLightbox();
      }

      lightboxGestureDirection = null;

    }, { passive: true });


    lightboxWindow.addEventListener("touchcancel", () => {
      lightboxGestureDirection = null;
    }, { passive: true });


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
     ACTUALIZAR BOTÓN DEL LIGHTBOX
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

    if (!isVideo) return;

    setPlayButtonState(
      lightboxPlayButton,
      activeSlide
    );
  }


  /* =========================================================
     ABRIR LIGHTBOX
  ========================================================= */

  function openLightbox(slides, startIndex) {

    createLightbox();

    /*
      Al abrir el visor, los vídeos de la galería se pausan
      y reinician. La reproducción continúa siendo voluntaria.
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
          En el visor, tocar el área del vídeo también
          permite reproducirlo o pausarlo.
        */

        clone.addEventListener("click", (event) => {

          event.preventDefault();
          event.stopPropagation();

          if (Date.now() < lightboxSuppressClickUntil) {
            return;
          }

          if (clone.paused || clone.ended) {

            if (clone.ended) {
              try {
                clone.currentTime = 0;
              } catch (error) {
                // El vídeo puede no haber terminado de cargar.
              }
            }

            playVideo(clone);

          } else {
            pauseVideo(clone);
          }

          updateLightboxPlayButton();
        });


        /*
          Actualizar el botón al comenzar, pausar o terminar.
        */

        ["play", "playing", "pause", "ended"].forEach((eventName) => {
          clone.addEventListener(eventName, () => {

            if (
              lightboxTrack.children[lightboxCurrent] === clone
            ) {
              updateLightboxPlayButton();
            }

          });
        });

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
      Al cambiar de diapositiva, pausar y reiniciar
      todos los vídeos del visor.
    */

    const slides = Array.from(lightboxTrack.children);

    slides.forEach((slide) => {

      if (slide.tagName === "VIDEO") {
        pauseVideo(slide, true);
      }

    });


    lightboxTrack.style.transform =
      `translate3d(-${lightboxCurrent * 100}%, 0, 0)`;


    updateLightboxPlayButton();
  }


  /* =========================================================
     CERRAR LIGHTBOX
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
    let suppressClickUntil = 0;


    /*
      Un único botón superpuesto por galería.
      Solo se muestra cuando la diapositiva activa es un vídeo.
    */

    const galleryPlayButton = createPlayButton(
      "gallery-video-play",
      "Reproducir vídeo"
    );

    gallery.appendChild(galleryPlayButton);


    /* =====================================================
       ACTUALIZAR BOTÓN DE GALERÍA
    ===================================================== */

    function updateGalleryPlayButton() {

      const activeSlide = slides[current];

      const isVideo =
        activeSlide && activeSlide.tagName === "VIDEO";

      galleryPlayButton.classList.toggle(
        "is-hidden",
        !isVideo
      );

      if (!isVideo) return;

      setPlayButtonState(
        galleryPlayButton,
        activeSlide
      );
    }


    /*
      El botón controla el vídeo activo de esta galería.
    */

    galleryPlayButton.addEventListener("click", (event) => {

      event.preventDefault();
      event.stopPropagation();

      const activeSlide = slides[current];

      if (!activeSlide || activeSlide.tagName !== "VIDEO") {
        return;
      }

      if (activeSlide.paused || activeSlide.ended) {

        if (activeSlide.ended) {
          try {
            activeSlide.currentTime = 0;
          } catch (error) {
            // El vídeo puede no haber terminado de cargar.
          }
        }

        playVideo(activeSlide);

      } else {
        pauseVideo(activeSlide);
      }

      updateGalleryPlayButton();
    });


    /* =====================================================
       ACTUALIZAR CARRUSEL
    ===================================================== */

    function updateGallery() {

      const activeSlide = slides[current];

      if (activeSlide) {

        track.style.transform =
          `translate3d(-${activeSlide.offsetLeft}px, 0, 0)`;
      }

      /*
        Pausar y reiniciar los vídeos al cambiar de diapositiva.
        No se reproduce automáticamente ningún vídeo de pieza.
      */

      slides.forEach((slide) => {

        if (slide.tagName !== "VIDEO") return;

        prepareVideo(slide);
        pauseVideo(slide, true);
      });


      updateGalleryPlayButton();
    }


    /*
      Actualizar el botón si el vídeo se pausa, reproduce
      o termina desde cualquier interacción.
    */

    slides.forEach((slide) => {

      if (slide.tagName !== "VIDEO") return;

      ["play", "playing", "pause", "ended"].forEach((eventName) => {

        slide.addEventListener(eventName, () => {

          if (slides[current] === slide) {
            updateGalleryPlayButton();
          }

        });

      });

    });


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

      suppressClickUntil = Date.now() + 500;

      updateGallery();

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
          En la galería normal, tocar el vídeo reproduce
          o pausa. No abre el lightbox.
        */

        slide.addEventListener("click", (event) => {

          event.preventDefault();
          event.stopPropagation();

          if (Date.now() < suppressClickUntil) {
            return;
          }

          if (slide !== slides[current]) {
            return;
          }

          if (slide.paused || slide.ended) {

            if (slide.ended) {
              try {
                slide.currentTime = 0;
              } catch (error) {
                // El vídeo puede no haber terminado de cargar.
              }
            }

            playVideo(slide);

          } else {
            pauseVideo(slide);
          }

          updateGalleryPlayButton();
        });

      } else {

        /*
          Las fotografías conservan su comportamiento:
          al tocarlas se abre el visor ampliado.
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
     REVISAR VÍDEOS AL VOLVER A LA PÁGINA
  ========================================================= */

  window.addEventListener("pageshow", () => {

    if (!document.hidden && heroVideo) {
      playVideo(heroVideo);
    }

    if (!document.hidden && processVideo) {
      playVideo(processVideo);
    }

    /*
      Las galerías de piezas nunca se inician automáticamente.
      Se pausan si el navegador restaura la página.
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

