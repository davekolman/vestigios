document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     VIDEO DE PORTADA
  ========================================================= */

  const heroVideo =
    document.querySelector(".hero-media video");

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

      const playPromise =
        heroVideo.play();

      if (playPromise !== undefined) {
        playPromise.catch(() => {});
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

    if (lightbox) {
      return;
    }


    lightbox =
      document.createElement("div");

    lightbox.className = "lightbox";


    lightbox.innerHTML = `

      <button
        class="lightbox-close"
        type="button"
        aria-label="Cerrar"
      >
        ×
      </button>

      <button
        class="lightbox-arrow lightbox-prev"
        type="button"
        aria-label="Imagen anterior"
      >
        ‹
      </button>

      <div class="lightbox-window">

        <div class="lightbox-track"></div>

      </div>

      <button
        class="lightbox-arrow lightbox-next"
        type="button"
        aria-label="Siguiente imagen"
      >
        ›
      </button>

    `;


    document.body.appendChild(lightbox);


    lightboxTrack =
      lightbox.querySelector(
        ".lightbox-track"
      );


    const closeButton =
      lightbox.querySelector(
        ".lightbox-close"
      );


    const prevButton =
      lightbox.querySelector(
        ".lightbox-prev"
      );


    const nextButton =
      lightbox.querySelector(
        ".lightbox-next"
      );


    /* =======================================================
       CERRAR
    ======================================================= */

    closeButton.addEventListener(
      "click",
      (event) => {

        event.preventDefault();
        event.stopPropagation();

        closeLightbox();

      }
    );


    /* =======================================================
       ANTERIOR
    ======================================================= */

    prevButton.addEventListener(
      "click",
      (event) => {

        event.preventDefault();
        event.stopPropagation();

        if (!lightboxSlides.length) {
          return;
        }


        lightboxCurrent--;


        if (lightboxCurrent < 0) {

          lightboxCurrent =
            lightboxSlides.length - 1;

        }


        updateLightbox();

      }
    );


    /* =======================================================
       SIGUIENTE
    ======================================================= */

    nextButton.addEventListener(
      "click",
      (event) => {

        event.preventDefault();
        event.stopPropagation();

        if (!lightboxSlides.length) {
          return;
        }


        lightboxCurrent++;


        if (
          lightboxCurrent >=
          lightboxSlides.length
        ) {

          lightboxCurrent = 0;

        }


        updateLightbox();

      }
    );


    /* =======================================================
       CLIC EN EL FONDO
    ======================================================= */

    lightbox.addEventListener(
      "click",
      (event) => {

        if (
          event.target === lightbox ||
          event.target ===
          lightbox.querySelector(
            ".lightbox-window"
          )
        ) {

          closeLightbox();

        }

      }
    );


    /* =======================================================
       TECLADO
    ======================================================= */

    document.addEventListener(
      "keydown",
      (event) => {

        if (
          !lightbox ||
          !lightbox.classList.contains(
            "active"
          )
        ) {

          return;

        }


        if (event.key === "Escape") {

          closeLightbox();

          return;

        }


        if (event.key === "ArrowRight") {

          if (!lightboxSlides.length) {
            return;
          }


          lightboxCurrent++;


          if (
            lightboxCurrent >=
            lightboxSlides.length
          ) {

            lightboxCurrent = 0;

          }


          updateLightbox();

        }


        if (event.key === "ArrowLeft") {

          if (!lightboxSlides.length) {
            return;
          }


          lightboxCurrent--;


          if (lightboxCurrent < 0) {

            lightboxCurrent =
              lightboxSlides.length - 1;

          }


          updateLightbox();

        }

      }
    );

  }


  /* =========================================================
     ABRIR LIGHTBOX
  ========================================================= */

  function openLightbox(
    slides,
    startIndex
  ) {

    createLightbox();


    /*
      Convertimos a array nuevo para evitar
      problemas con NodeList/DOM original.
    */

    lightboxSlides =
      Array.from(slides);


    lightboxCurrent =
      Number(startIndex) || 0;


    /*
      Limpiar visor anterior.
    */

    lightboxTrack.innerHTML = "";


    /*
      Crear copias de las imágenes/videos.
    */

    lightboxSlides.forEach(
      (slide) => {

        const clone =
          slide.cloneNode(true);


        /*
          Eliminar cualquier transformación
          heredada del carrusel.
        */

        clone.style.transform = "";


        clone.removeAttribute("style");


        /*
          Configuración especial para videos.
        */

        if (
          clone.tagName === "VIDEO"
        ) {

          clone.muted = true;
          clone.defaultMuted = true;

          clone.controls = false;
          clone.loop = true;

          clone.setAttribute(
            "muted",
            ""
          );

          clone.setAttribute(
            "playsinline",
            ""
          );

          clone.setAttribute(
            "webkit-playsinline",
            ""
          );

          clone.removeAttribute(
            "controls"
          );

        }


        /*
          Evitar que una imagen clonada
          vuelva a intentar abrir otro lightbox.
        */

        clone.onclick = (event) => {

          event.preventDefault();
          event.stopPropagation();

        };


        lightboxTrack.appendChild(
          clone
        );

      }
    );


    /*
      Mostrar visor.
    */

    lightbox.classList.add(
      "active"
    );


    document.body.classList.add(
      "lightbox-open"
    );


    /*
      Actualizar posición.
    */

    updateLightbox();

  }


  /* =========================================================
     ACTUALIZAR LIGHTBOX
  ========================================================= */

  function updateLightbox() {

    if (
      !lightboxTrack ||
      !lightboxSlides.length
    ) {

      return;

    }


    /*
      Mantener índice válido.
    */

    if (
      lightboxCurrent < 0
    ) {

      lightboxCurrent =
        lightboxSlides.length - 1;

    }


    if (
      lightboxCurrent >=
      lightboxSlides.length
    ) {

      lightboxCurrent = 0;

    }


    /*
      Mover carrusel.
    */

    lightboxTrack.style.transform =
      `translate3d(-${lightboxCurrent * 100}%, 0, 0)`;


    /*
      Controlar videos.
    */

    const slides =
      Array.from(
        lightboxTrack.children
      );


    slides.forEach(
      (slide, index) => {

        if (
          slide.tagName !== "VIDEO"
        ) {

          return;

        }


        if (
          index === lightboxCurrent
        ) {

          slide.muted = true;

          const playPromise =
            slide.play();


          if (
            playPromise !== undefined
          ) {

            playPromise.catch(
              () => {}
            );

          }

        }

        else {

          slide.pause();


          try {

            slide.currentTime = 0;

          }
          catch (error) {}

        }

      }
    );

  }


  /* =========================================================
     CERRAR LIGHTBOX
  ========================================================= */

  function closeLightbox() {

    if (!lightbox) {
      return;
    }


    lightbox.classList.remove(
      "active"
    );


    document.body.classList.remove(
      "lightbox-open"
    );


    /*
      Detener videos.
    */

    const videos =
      lightbox.querySelectorAll(
        "video"
      );


    videos.forEach(
      (video) => {

        video.pause();

        try {

          video.currentTime = 0;

        }
        catch (error) {}

      }
    );

  }


  /* =========================================================
     GALERÍAS
  ========================================================= */

  const galleries =
    document.querySelectorAll(
      ".gallery"
    );


  galleries.forEach(
    (gallery) => {

      const track =
        gallery.querySelector(
          ".gallery-track"
        );


      const prevButton =
        gallery.querySelector(
          ".gallery-arrow.prev"
        );


      const nextButton =
        gallery.querySelector(
          ".gallery-arrow.next"
        );


      if (!track) {
        return;
      }


      /*
        Obtener imágenes y videos.
      */

      const slides =
        Array.from(
          track.querySelectorAll(
            "img, video"
          )
        );


      const total =
        slides.length;


      if (!total) {
        return;
      }


      let current = 0;


      /* =====================================================
         ACTUALIZAR CARRUSEL
      ===================================================== */

      function updateGallery() {

        track.style.transform =
          `translate3d(-${current * 100}%, 0, 0)`;


        slides.forEach(
          (slide, index) => {

            if (
              slide.tagName !== "VIDEO"
            ) {

              return;

            }


            if (
              index === current
            ) {

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

                playPromise.catch(
                  () => {}
                );

              }

            }

            else {

              slide.pause();


              try {

                slide.currentTime = 0;

              }
              catch (error) {}

            }

          }
        );

      }


      /* =====================================================
         SIGUIENTE
      ===================================================== */

      if (nextButton) {

        nextButton.addEventListener(
          "click",
          (event) => {

            event.preventDefault();
            event.stopPropagation();


            current++;


            if (
              current >= total
            ) {

              current = 0;

            }


            updateGallery();

          }
        );

      }


      /* =====================================================
         ANTERIOR
      ===================================================== */

      if (prevButton) {

        prevButton.addEventListener(
          "click",
          (event) => {

            event.preventDefault();
            event.stopPropagation();


            current--;


            if (
              current < 0
            ) {

              current = total - 1;

            }


            updateGallery();

          }
        );

      }


      /* =====================================================
         SWIPE
      ===================================================== */

      let touchStartX = 0;
      let touchStartY = 0;

      let touchCurrentX = 0;
      let touchCurrentY = 0;

      let gestureDirection = null;


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

          gestureDirection =
            null;

        },
        {
          passive: true
        }
      );


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


          if (
            gestureDirection === null
          ) {

            const absX =
              Math.abs(differenceX);


            const absY =
              Math.abs(differenceY);


            if (
              absX < 8 &&
              absY < 8
            ) {

              return;

            }


            if (
              absY > absX
            ) {

              gestureDirection =
                "vertical";

              return;

            }


            gestureDirection =
              "horizontal";

          }


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


      gallery.addEventListener(
        "touchend",
        () => {

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


          if (
            Math.abs(difference) < 50
          ) {

            gestureDirection = null;

            return;

          }


          if (
            difference > 0
          ) {

            current++;


            if (
              current >= total
            ) {

              current = 0;

            }

          }
          else {

            current--;


            if (
              current < 0
            ) {

              current =
                total - 1;

            }

          }


          updateGallery();


          gestureDirection = null;

        },
        {
          passive: true
        }
      );


      gallery.addEventListener(
        "touchcancel",
        () => {

          gestureDirection = null;

        },
        {
          passive: true
        }
      );


      /* =====================================================
         ABRIR LIGHTBOX
         
         IMPORTANTE:
         El clic se registra directamente sobre cada
         imagen/video. No dependemos del bubbling.
      ===================================================== */

      slides.forEach(
        (slide, index) => {

          slide.style.cursor =
            "pointer";


          slide.addEventListener(
            "click",
            (event) => {

              event.preventDefault();
              event.stopPropagation();


              openLightbox(
                slides,
                index
              );

            },
            false
          );

        }
      );


      /* =====================================================
         INICIALIZAR
      ===================================================== */

      updateGallery();


      /* =====================================================
         REDIMENSIONAR
      ===================================================== */

      window.addEventListener(
        "resize",
        () => {

          updateGallery();

        }
      );

    }
  );

});

