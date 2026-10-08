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
       SWIPE DE LA GALERÍA
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


          /*
            Si el gesto es vertical,
            dejamos libre el scroll de la página.
          */

          if (absY > absX) {

            gestureDirection =
              "vertical";

            return;

          }


          /*
            Si es horizontal,
            pertenece a la galería.
          */

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

        }

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
       VENTANA AMPLIADA
       ======================================================= */

    gallery.addEventListener(
      "click",
      (event) => {

        /*
          Si se hizo clic directamente sobre una
          flecha de la galería, no abrir la ventana.
        */

        if (
          event.target.closest(".gallery-arrow")
        ) {
          return;
        }


        /*
          Solo abrir al hacer clic sobre una imagen
          o video.
        */

        const clickedSlide =
          event.target.closest("img, video");


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
     LIGHTBOX / VENTANA DE IMAGEN
     ========================================================= */

  let lightbox = null;
  let lightboxTrack = null;
  let lightboxSlides = [];
  let lightboxCurrent = 0;


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


    closeButton.addEventListener(
      "click",
      closeLightbox
    );


    prevButton.addEventListener(
      "click",
      (event) => {

        event.preventDefault();
        event.stopPropagation();

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


    nextButton.addEventListener(
      "click",
      (event) => {

        event.preventDefault();
        event.stopPropagation();

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


    /*
      Clic en el fondo blanco:
      cerrar ventana.
    */

    lightbox.addEventListener(
      "click",
      (event) => {

        if (
          event.target === lightbox ||
          event.target.classList.contains(
            "lightbox-window"
          )
        ) {

          closeLightbox();

        }

      }
    );


    /*
      Teclado.
    */

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
      Copiamos las imágenes/videos
      de la galería a la ventana.
    */

    lightboxSlides.forEach(
      (slide) => {

        const clone =
          slide.cloneNode(true);


        clone.removeAttribute(
          "style"
        );


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

          }

          else {

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

