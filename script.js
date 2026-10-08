document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     VIDEO DE PORTADA
     ========================================================= */

  const heroVideo = document.querySelector(".hero-media video");

  if (heroVideo) {

    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
    heroVideo.setAttribute("muted", "");
    heroVideo.setAttribute("playsinline", "");
    heroVideo.setAttribute("autoplay", "");
    heroVideo.setAttribute("loop", "");

    const startHeroVideo = () => {

      const playPromise = heroVideo.play();

      if (playPromise !== undefined) {

        playPromise.catch(() => {
          /*
            Algunos navegadores móviles bloquean el autoplay
            hasta que existe interacción del usuario.
            No hacemos nada aquí para no romper el video.
          */
        });

      }

    };

    startHeroVideo();

    window.addEventListener(
      "load",
      startHeroVideo,
      { once: true }
    );

    document.addEventListener(
      "visibilitychange",
      () => {

        if (!document.hidden) {
          startHeroVideo();
        }

      }
    );

  }


  /* =========================================================
     GALERÍAS / CARRUSELES
     ========================================================= */

  const galleries = document.querySelectorAll(".gallery");

  galleries.forEach((gallery) => {

    const track = gallery.querySelector(".gallery-track");

    const prevButton =
      gallery.querySelector(".gallery-arrow.prev");

    const nextButton =
      gallery.querySelector(".gallery-arrow.next");

    if (!track) return;


    /* =======================================================
       SLIDES
       Imágenes + videos
       ======================================================= */

    const slides = Array.from(
      track.querySelectorAll("img, video")
    );

    const total = slides.length;

    if (total === 0) return;


    /* =======================================================
       POSICIÓN
       ======================================================= */

    let current = 0;


    /* =======================================================
       ACTUALIZAR CARRUSEL
       ======================================================= */

    function updateGallery() {

      /*
        Usamos porcentaje en lugar de calcular píxeles.
        Esto hace que funcione mejor en desktop y móvil.
      */

      track.style.transform =
        `translate3d(-${current * 100}%, 0, 0)`;


      /* -----------------------------------------------------
         VIDEOS DEL CARRUSEL
         ----------------------------------------------------- */

      slides.forEach((slide, index) => {

        if (slide.tagName === "VIDEO") {

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

        }

      });

    }


    /* =======================================================
       SIGUIENTE
       ======================================================= */

    if (nextButton) {

      nextButton.addEventListener(
        "click",
        (event) => {

          event.preventDefault();
          event.stopPropagation();

          current++;

          if (current >= total) {
            current = 0;
          }

          updateGallery();

        }
      );

    }


    /* =======================================================
       ANTERIOR
       ======================================================= */

    if (prevButton) {

      prevButton.addEventListener(
        "click",
        (event) => {

          event.preventDefault();
          event.stopPropagation();

          current--;

          if (current < 0) {
            current = total - 1;
          }

          updateGallery();

        }
      );

    }


    /* =======================================================
       SWIPE EN TELÉFONO
       ======================================================= */

    let touchStartX = 0;
    let touchEndX = 0;

    gallery.addEventListener(
      "touchstart",
      (event) => {

        if (!event.touches || !event.touches.length) {
          return;
        }

        touchStartX = event.touches[0].clientX;

      },
      { passive: true }
    );


    gallery.addEventListener(
      "touchend",
      (event) => {

        if (!event.changedTouches ||
            !event.changedTouches.length) {
          return;
        }

        touchEndX =
          event.changedTouches[0].clientX;

        const difference =
          touchStartX - touchEndX;

        /*
          Solo cambiamos de imagen si el movimiento
          horizontal fue suficientemente claro.
        */

        if (Math.abs(difference) < 50) {
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

      },
      { passive: true }
    );


    /* =======================================================
       INICIALIZAR
       ======================================================= */

    updateGallery();


    /* =======================================================
       REDIMENSIONAR
       ======================================================= */

    window.addEventListener(
      "resize",
      () => {
        updateGallery();
      }
    );

  });

});
