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
     
     IMPORTANTE:
     El carrusel NO se desplaza mediante swipe.
     Solo cambia de imagen al tocar las flechas.
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
       Imágenes + videos, por si alguno se utiliza
       posteriormente en una galería.
       ======================================================= */

    const slides = Array.from(
      track.querySelectorAll("img, video")
    );

    const total = slides.length;

    if (total === 0) return;


    /* =======================================================
       POSICIÓN ACTUAL
       ======================================================= */

    let current = 0;


    /* =======================================================
       ACTUALIZAR CARRUSEL
       ======================================================= */

    function updateGallery() {

      /*
        Usamos porcentaje para que el carrusel
        funcione correctamente en cualquier tamaño
        de pantalla.
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
