document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     VIDEO DE PORTADA
     ========================================================= */

  const heroVideo = document.querySelector(".hero-media video");

  if (heroVideo) {

    /*
      Configuración necesaria para autoplay
      en navegadores móviles.
    */

    heroVideo.muted = true;
    heroVideo.defaultMuted = true;

    heroVideo.autoplay = true;
    heroVideo.loop = true;
    heroVideo.playsInline = true;

    heroVideo.controls = false;

    heroVideo.setAttribute("muted", "");
    heroVideo.setAttribute("autoplay", "");
    heroVideo.setAttribute("loop", "");
    heroVideo.setAttribute("playsinline", "");

    heroVideo.removeAttribute("controls");


    /* ---------------------------------------------------------
       INICIAR VIDEO
       --------------------------------------------------------- */

    const startHeroVideo = () => {

      if (document.hidden) {
        return;
      }

      heroVideo.muted = true;

      const playPromise = heroVideo.play();

      if (playPromise !== undefined) {

        playPromise.catch(() => {
          /*
            Algunos navegadores pueden bloquear
            el autoplay hasta que exista interacción.
          */
        });

      }

    };


    /* ---------------------------------------------------------
       PRIMER INTENTO
       --------------------------------------------------------- */

    startHeroVideo();


    /* ---------------------------------------------------------
       CUANDO EL VIDEO ESTÁ LISTO
       --------------------------------------------------------- */

    heroVideo.addEventListener(
      "loadeddata",
      startHeroVideo,
      { once: true }
    );

    heroVideo.addEventListener(
      "canplay",
      startHeroVideo,
      { once: true }
    );


    /* ---------------------------------------------------------
       CUANDO TERMINA DE CARGAR LA PÁGINA
       --------------------------------------------------------- */

    window.addEventListener(
      "load",
      startHeroVideo,
      { once: true }
    );


    /* ---------------------------------------------------------
       CUANDO EL USUARIO VUELVE A LA PÁGINA
       --------------------------------------------------------- */

    document.addEventListener(
      "visibilitychange",
      () => {

        if (!document.hidden) {
          startHeroVideo();
        }

      }
    );


    /* ---------------------------------------------------------
       SI EL NAVEGADOR PAUSA EL VIDEO
       --------------------------------------------------------- */

    heroVideo.addEventListener(
      "pause",
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

  const galleries =
    document.querySelectorAll(".gallery");

  galleries.forEach((gallery) => {

    const track =
      gallery.querySelector(".gallery-track");

    const prevButton =
      gallery.querySelector(".gallery-arrow.prev");

    const nextButton =
      gallery.querySelector(".gallery-arrow.next");

    if (!track) {
      return;
    }


    /* =======================================================
       SLIDES
       Imágenes + videos
       ======================================================= */

    const slides = Array.from(
      track.querySelectorAll("img, video")
    );

    const total = slides.length;

    if (total === 0) {
      return;
    }


    /* =======================================================
       POSICIÓN
       ======================================================= */

    let current = 0;


    /* =======================================================
       ACTUALIZAR CARRUSEL
       ======================================================= */

    function updateGallery() {

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

            const playPromise =
              slide.play();

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
       SWIPE
       ======================================================= */

    let touchStartX = 0;
    let touchStartY = 0;

    let touchEndX = 0;
    let touchEndY = 0;

    let trackingTouch = false;


    /* =======================================================
       TOUCH START
       ======================================================= */

    gallery.addEventListener(
      "touchstart",
      (event) => {

        if (
          !event.touches ||
          !event.touches.length
        ) {
          return;
        }

        const touch =
          event.touches[0];

        touchStartX =
          touch.clientX;

        touchStartY =
          touch.clientY;

        touchEndX =
          touchStartX;

        touchEndY =
          touchStartY;

        trackingTouch = true;

      },
      {
        passive: true
      }
    );


    /* =======================================================
       TOUCH MOVE
       ======================================================= */

    gallery.addEventListener(
      "touchmove",
      (event) => {

        if (
          !trackingTouch ||
          !event.touches ||
          !event.touches.length
        ) {
          return;
        }

        const touch =
          event.touches[0];

        touchEndX =
          touch.clientX;

        touchEndY =
          touch.clientY;

      },
      {
        passive: true
      }
    );


    /* =======================================================
       TOUCH END
       ======================================================= */

    gallery.addEventListener(
      "touchend",
      () => {

        if (!trackingTouch) {
          return;
        }

        trackingTouch = false;


        const differenceX =
          touchStartX - touchEndX;

        const differenceY =
          touchStartY - touchEndY;


        const horizontalDistance =
          Math.abs(differenceX);

        const verticalDistance =
          Math.abs(differenceY);


        /*
          El gesto solo se considera swipe
          si es claramente horizontal.

          Esto es lo importante:

          Si el usuario desliza hacia arriba
          o hacia abajo, la galería NO hace nada.

          Por tanto el navegador puede continuar
          desplazando la página normalmente.
        */

        if (
          horizontalDistance < 50 ||
          horizontalDistance <= verticalDistance
        ) {
          return;
        }


        /* ---------------------------------------------------
           SWIPE HACIA LA IZQUIERDA
           --------------------------------------------------- */

        if (differenceX > 0) {

          current++;

          if (current >= total) {
            current = 0;
          }

        }


        /* ---------------------------------------------------
           SWIPE HACIA LA DERECHA
           --------------------------------------------------- */

        else {

          current--;

          if (current < 0) {
            current = total - 1;
          }

        }


        updateGallery();

      },
      {
        passive: true
      }
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
