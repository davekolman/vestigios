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
    heroVideo.setAttribute("webkit-playsinline", "");
    heroVideo.setAttribute("autoplay", "");
    heroVideo.setAttribute("loop", "");

    /*
      Nos aseguramos de que el navegador no muestre
      controles del video.
    */
    heroVideo.controls = false;

    const startHeroVideo = () => {

      heroVideo.muted = true;
      heroVideo.controls = false;

      const playPromise = heroVideo.play();

      if (playPromise !== undefined) {

        playPromise.catch(() => {
          /*
            Algunos navegadores móviles pueden bloquear
            temporalmente el autoplay.
          */
        });

      }

    };

    /*
      Intento inicial.
    */
    startHeroVideo();


    /*
      Segundo intento cuando la página termina de cargar.
    */
    window.addEventListener(
      "load",
      startHeroVideo,
      { once: true }
    );


    /*
      Si el usuario vuelve a la pestaña,
      intentamos reanudar el video.
    */
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

    const track =
      gallery.querySelector(".gallery-track");

    const prevButton =
      gallery.querySelector(".gallery-arrow.prev");

    const nextButton =
      gallery.querySelector(".gallery-arrow.next");

    if (!track) return;


    /* =======================================================
       SLIDES
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

      track.style.transform =
        `translate3d(-${current * 100}%, 0, 0)`;


      /* -----------------------------------------------------
         VIDEOS DENTRO DEL CARRUSEL
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
       SWIPE
       ======================================================= */

    let touchStartX = 0;
    let touchStartY = 0;

    let touchCurrentX = 0;
    let touchCurrentY = 0;

    let gestureDirection = null;


    /* -------------------------------------------------------
       TOUCH START
       ------------------------------------------------------- */

    gallery.addEventListener(
      "touchstart",
      (event) => {

        if (
          !event.touches ||
          !event.touches.length
        ) {
          return;
        }

        const touch = event.touches[0];

        touchStartX = touch.clientX;
        touchStartY = touch.clientY;

        touchCurrentX = touchStartX;
        touchCurrentY = touchStartY;

        gestureDirection = null;

      },
      {
        passive: true
      }
    );


    /* -------------------------------------------------------
       TOUCH MOVE
       ------------------------------------------------------- */

    gallery.addEventListener(
      "touchmove",
      (event) => {

        if (
          !event.touches ||
          !event.touches.length
        ) {
          return;
        }

        const touch = event.touches[0];

        touchCurrentX = touch.clientX;
        touchCurrentY = touch.clientY;

        const differenceX =
          touchCurrentX - touchStartX;

        const differenceY =
          touchCurrentY - touchStartY;


        /*
          Todavía no sabemos si el usuario quiere
          desplazarse horizontal o verticalmente.
        */

        if (gestureDirection === null) {

          const absX = Math.abs(differenceX);
          const absY = Math.abs(differenceY);

          /*
            Esperamos un pequeño movimiento antes
            de decidir la dirección.
          */

          if (
            absX < 8 &&
            absY < 8
          ) {
            return;
          }


          /*
            Si el movimiento vertical domina,
            dejamos completamente libre el scroll
            de la página.
          */

          if (absY > absX) {

            gestureDirection = "vertical";

            return;
          }


          /*
            Si el movimiento horizontal domina,
            lo tratamos como swipe del carrusel.
          */

          gestureDirection = "horizontal";

        }


        /*
          IMPORTANTE:

          Solo bloqueamos el comportamiento
          predeterminado cuando el gesto es
          HORIZONTAL.

          Los movimientos verticales jamás
          reciben preventDefault().
        */

        if (
          gestureDirection === "horizontal"
        ) {

          event.preventDefault();

        }

      },
      {
        passive: false
      }
    );


    /* -------------------------------------------------------
       TOUCH END
       ------------------------------------------------------- */

    gallery.addEventListener(
      "touchend",
      () => {

        /*
          Si fue un gesto vertical,
          no hacemos absolutamente nada.
          El navegador se encargó del scroll.
        */

        if (
          gestureDirection !== "horizontal"
        ) {

          gestureDirection = null;

          return;

        }


        const difference =
          touchStartX - touchCurrentX;


        /*
          Evitamos cambiar de imagen
          por movimientos horizontales mínimos.
        */

        if (
          Math.abs(difference) < 50
        ) {

          gestureDirection = null;

          return;

        }


        /* ---------------------------------------------------
           SWIPE HACIA LA IZQUIERDA
           --------------------------------------------------- */

        if (difference > 0) {

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

        gestureDirection = null;

      },
      {
        passive: true
      }
    );


    /* =======================================================
       CANCELAR GESTO
       ======================================================= */

    gallery.addEventListener(
      "touchcancel",
      () => {

        gestureDirection = null;

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
