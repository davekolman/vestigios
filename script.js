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
     GALERÍAS
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


    const slides =
      Array.from(
        track.querySelectorAll("img, video")
      );

    const total =
      slides.length;


    if (total === 0) {
      return;
    }


    let current = 0;


    /* =======================================================
       ACTUALIZAR GALERÍA
       ======================================================= */

    function updateGallery() {

      track.style.transform =
        `translate3d(-${current * 100}%, 0, 0)`;


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


          if (absY > absX) {

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


    /* =======================================================
       ABRIR LIGHTBOX
       
       IMPORTANTE:
       El listener está en .gallery, pero buscamos
       la imagen/video mediante elementFromPoint para
       que funcione incluso con pointer-events:none.
       ======================================================= */

    gallery.addEventListener(
      "click",
      (event) => {

        /* -----------------------------------------------
           Nunca abrir el visor desde las flechas
        ------------------------------------------------ */

        if (
          event.target.closest(".gallery-arrow")
        ) {
          return;
        }


        /* -----------------------------------------------
           Buscar la imagen/video real
        ------------------------------------------------ */

        let clickedSlide =
          event.target.closest("img, video");


        /*
          Si el navegador no entrega la imagen como
          target debido a pointer-events:none,
          buscamos qué elemento está debajo del dedo
          o cursor.
        */

        if (!clickedSlide) {

          const elementUnderPointer =
            document.elementFromPoint(
              event.clientX,
              event.clientY
            );


          if (elementUnderPointer) {

            clickedSlide =
              elementUnderPointer.closest(
                "img, video"
              );

          }

        }


        /*
          Si sigue sin existir una imagen/video,
          no hacemos nada.
        */

        if (!clickedSlide) {
          return;
        }


        /*
          Asegurarnos de que pertenece a ESTA galería.
        */

        if (
          !gallery.contains(clickedSlide)
        ) {
          return;
        }


        const clickedIndex =
          slides.indexOf(clickedSlide);


        if (clickedIndex === -1) {
          return;
        }


        openLightbox(
          slides,
          clickedIndex
        );

      }
    );


    /* =======================================================
       TAMBIÉN SOPORTAR TOUCH DIRECTO
       
       Esto hace que tocar una foto en móvil abra
       el visor cuando no hubo un swipe.
       ======================================================= */

    let tapStartX = 0;
    let tapStartY = 0;
    let tapStartTime = 0;


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

        tapStartX =
          touch.clientX;

        tapStartY =
          touch.clientY;

        tapStartTime =
          Date.now();

      },
      {
        passive: true
      }
    );


    gallery.addEventListener(
      "touchend",
      (event) => {

        if (
          !event.changedTouches ||
          !event.changedTouches.length
        ) {
          return;
        }


        /*
          Si el gesto fue horizontal,
          ya lo manejó el carrusel.
        */

        if (
          gestureDirection ===
          "horizontal"
        ) {
          return;
        }


        const touch =
          event.changedTouches[0];


        const differenceX =
          touch.clientX -
          tapStartX;

        const differenceY =
          touch.clientY -
          tapStartY;

        const duration =
          Date.now() -
          tapStartTime;


        const distance =
          Math.sqrt(
            differenceX * differenceX +
            differenceY * differenceY
          );


        /*
          Solo consideramos tap:
          poco movimiento + poco tiempo.
        */

        if (
          distance > 15 ||
          duration > 500
        ) {
          return;
        }


        /*
          Encontrar elemento debajo del dedo.
        */

        const elementUnderPointer =
          document.elementFromPoint(
            touch.clientX,
            touch.clientY
          );


        let clickedSlide = null;


        if (elementUnderPointer) {

          clickedSlide =
            elementUnderPointer.closest(
              "img, video"
            );

        }


        /*
          Debido a pointer-events:none,
          hacemos una búsqueda geométrica
          dentro de las diapositivas.
        */

        if (!clickedSlide) {

          clickedSlide =
            slides.find((slide) => {

              const rect =
                slide.getBoundingClientRect();

              return (
                touch.clientX >= rect.left &&
                touch.clientX <= rect.right &&
                touch.clientY >= rect.top &&
                touch.clientY <= rect.bottom
              );

            });

        }


        if (!clickedSlide) {
          return;
        }


        const clickedIndex =
          slides.indexOf(clickedSlide);


        if (clickedIndex === -1) {
          return;
        }


        openLightbox(
          slides,
          clickedIndex
        );

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


  /* =========================================================
     CREAR LIGHTBOX
     ========================================================= */

  function createLightbox() {

    if (lightbox) {
      return;
    }


    lightbox =
      document.createElement("div");

    lightbox.className =
      "lightbox";


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

        if (
          !lightboxSlides.length
        ) {
          return;
        }


        lightboxCurrent--;


        if (
          lightboxCurrent < 0
        ) {

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

        if (
          !lightboxSlides.length
        ) {
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
       CLIC EN FONDO
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


        if (
          event.key === "Escape"
        ) {

          closeLightbox();

          return;

        }


        if (
          event.key === "ArrowRight"
        ) {

          lightboxCurrent++;


          if (
            lightboxCurrent >=
            lightboxSlides.length
          ) {

            lightboxCurrent = 0;

          }


          updateLightbox();

        }


        if (
          event.key === "ArrowLeft"
        ) {

          lightboxCurrent--;


          if (
            lightboxCurrent < 0
          ) {

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


    lightboxSlides =
      slides;


    lightboxCurrent =
      startIndex;


    lightboxTrack.innerHTML = "";


    /*
      Crear copias de todas las imágenes/videos.
    */

    lightboxSlides.forEach(
      (slide) => {

        const clone =
          slide.cloneNode(true);


        clone.removeAttribute(
          "style"
        );


        /*
          Importante:
          las copias reciben la clase
          lightbox-image si son imágenes.
        */

        if (
          clone.tagName === "IMG"
        ) {

          clone.classList.add(
            "lightbox-image"
          );

        }


        if (
          clone.tagName === "VIDEO"
        ) {

          clone.muted = true;

          clone.controls = false;

          clone.removeAttribute(
            "controls"
          );

          clone.setAttribute(
            "playsinline",
            ""
          );

          clone.setAttribute(
            "muted",
            ""
          );

          clone.loop = true;

        }


        lightboxTrack.appendChild(
          clone
        );

      }
    );


    lightbox.classList.add(
      "active"
    );


    document.body.classList.add(
      "lightbox-open"
    );


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


    lightboxTrack.style.transform =
      `translate3d(-${lightboxCurrent * 100}%, 0, 0)`;


    const slides =
      Array.from(
        lightboxTrack.children
      );


    slides.forEach(
      (slide, index) => {

        if (
          slide.tagName === "VIDEO"
        ) {

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

          } else {

            slide.pause();

            try {
              slide.currentTime = 0;
            } catch (error) {}

          }

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


    const videos =
      lightbox.querySelectorAll(
        "video"
      );


    videos.forEach(
      (video) => {

        video.pause();

      }
    );

  }

});

