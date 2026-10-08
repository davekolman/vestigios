document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     VIDEO DE PORTADA
     ========================================================= */

  const heroVideo =
    document.querySelector(".hero-media video");

  if (heroVideo) {

    /*
      Configuración necesaria para autoplay móvil.
    */

    heroVideo.muted = true;
    heroVideo.defaultMuted = true;

    heroVideo.setAttribute("muted", "");
    heroVideo.setAttribute("autoplay", "");
    heroVideo.setAttribute("loop", "");
    heroVideo.setAttribute("playsinline", "");
    heroVideo.setAttribute("webkit-playsinline", "");

    /*
      MUY IMPORTANTE:
      Nunca mostrar controles.
    */

    heroVideo.controls = false;
    heroVideo.removeAttribute("controls");


    /* ---------------------------------------------------------
       INTENTAR REPRODUCIR
       --------------------------------------------------------- */

    const startHeroVideo = () => {

      heroVideo.muted = true;
      heroVideo.controls = false;
      heroVideo.removeAttribute("controls");

      /*
        Si por alguna razón el navegador hubiera detenido
        el video, volvemos a activar loop.
      */

      heroVideo.loop = true;

      const playPromise =
        heroVideo.play();

      if (playPromise !== undefined) {

        playPromise.catch(() => {
          /*
            El navegador puede bloquear temporalmente
            el autoplay. No mostramos controles ni
            alteramos la interfaz.
          */
        });

      }

    };


    /*
      Primer intento.
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
      Si el usuario abandona la página y vuelve,
      intentamos reproducir nuevamente.
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
       ======================================================= */

    const slides =
      Array.from(
        track.querySelectorAll("img, video")
      );

    const total =
      slides.length;


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
         VIDEOS DENTRO DEL CARRUSEL
         ----------------------------------------------------- */

      slides.forEach((slide, index) => {

        if (slide.tagName === "VIDEO") {

          if (index === current) {

            slide.muted = true;

            slide.setAttribute(
              "muted",
              ""
            );

            slide.setAttribute(
              "playsinline",
              ""
            );

            const playPromise =
              slide.play();

            if (
              playPromise !== undefined
            ) {

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

        const touch =
          event.touches[0];

        touchStartX =
          touch.clientX;

        touchStartY =
          touch.clientY;

        touchCurrentX =
          touchStartX;

        touchCurrentY =
          touchStartY;

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

        const touch =
          event.touches[0];

        touchCurrentX =
          touch.clientX;

        touchCurrentY =
          touch.clientY;


        const differenceX =
          touchCurrentX -
          touchStartX;

        const differenceY =
          touchCurrentY -
          touchStartY;


        /*
          Determinar dirección del gesto.
        */

        if (
          gestureDirection === null
        ) {

          const absX =
            Math.abs(differenceX);

          const absY =
            Math.abs(differenceY);


          /*
            Movimiento demasiado pequeño.
          */

          if (
            absX < 8 &&
            absY < 8
          ) {

            return;

          }


          /*
            Movimiento vertical:
            dejamos que el navegador
            haga scroll normalmente.
          */

          if (absY > absX) {

            gestureDirection =
              "vertical";

            return;

          }


          /*
            Movimiento horizontal:
            pertenece al carrusel.
          */

          gestureDirection =
            "horizontal";

        }


        /*
          Solo bloqueamos el gesto cuando
          realmente es horizontal.
        */

        if (
          gestureDirection ===
          "horizontal"
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
          Si era vertical, no hacemos nada.
        */

        if (
          gestureDirection !==
          "horizontal"
        ) {

          gestureDirection = null;

          return;

        }


        const difference =
          touchStartX -
          touchCurrentX;


        /*
          Movimiento insuficiente.
        */

        if (
          Math.abs(difference) < 50
        ) {

          gestureDirection = null;

          return;

        }


        /* ---------------------------------------------------
           IZQUIERDA
           --------------------------------------------------- */

        if (difference > 0) {

          current++;

          if (current >= total) {

            current = 0;

          }

        }


        /* ---------------------------------------------------
           DERECHA
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

