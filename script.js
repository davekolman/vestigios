document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     VIDEO PRINCIPAL / HERO
     ===================================================== */

  const heroVideo = document.querySelector(".hero-media video");

  if (heroVideo) {

    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
    heroVideo.setAttribute("muted", "");
    heroVideo.setAttribute("playsinline", "");
    heroVideo.setAttribute("webkit-playsinline", "");
    heroVideo.setAttribute("autoplay", "");

    const startHeroVideo = () => {

      const playPromise = heroVideo.play();

      if (playPromise !== undefined) {

        playPromise.catch(() => {
          /*
            Algunos navegadores móviles pueden bloquear
            temporalmente el autoplay. No hacemos nada
            destructivo aquí.
          */
        });

      }

    };

    startHeroVideo();

    /*
      Intentar nuevamente cuando la página esté visible.
    */
    document.addEventListener("visibilitychange", () => {

      if (!document.hidden) {
        startHeroVideo();
      }

    });

  }


  /* =====================================================
     GALERÍAS
     ===================================================== */

  const galleries = document.querySelectorAll(".gallery");

  galleries.forEach((gallery) => {

    const track = gallery.querySelector(".gallery-track");

    const prevButton =
      gallery.querySelector(".gallery-arrow.prev");

    const nextButton =
      gallery.querySelector(".gallery-arrow.next");

    const currentCounter =
      gallery.querySelector(".gallery-counter .current");

    const counter =
      gallery.querySelector(".gallery-counter");

    if (!track) return;


    /* ===================================================
       SLIDES
       IMÁGENES + VIDEOS
       =================================================== */

    const slides = Array.from(
      track.children
    ).filter((element) => {

      return (
        element.tagName === "IMG" ||
        element.tagName === "VIDEO"
      );

    });

    const total = slides.length;

    if (total === 0) return;


    /* ===================================================
       PREPARAR SLIDES
       =================================================== */

    slides.forEach((slide) => {

      slide.style.flex = "0 0 100%";
      slide.style.width = "100%";
      slide.style.minWidth = "100%";
      slide.style.height = "100%";

      if (slide.tagName === "IMG") {

        slide.style.objectFit = "contain";
        slide.style.display = "block";

      }

      if (slide.tagName === "VIDEO") {

        slide.style.objectFit = "contain";
        slide.style.display = "block";

        slide.muted = true;
        slide.defaultMuted = true;

        slide.setAttribute("muted", "");
        slide.setAttribute("playsinline", "");
        slide.setAttribute("webkit-playsinline", "");

      }

    });


    /* ===================================================
       CONTADOR
       =================================================== */

    let totalCounter = counter
      ? counter.querySelector(".total")
      : null;


    if (counter && !totalCounter) {

      totalCounter =
        document.createElement("span");

      totalCounter.className = "total";

      counter.appendChild(totalCounter);

    }


    if (totalCounter) {

      totalCounter.textContent =
        ` / ${String(total).padStart(2, "0")}`;

    }


    /* ===================================================
       POSICIÓN
       =================================================== */

    let current = 0;


    /* ===================================================
       ACTUALIZAR GALERÍA
       =================================================== */

    function updateGallery() {

      /*
        Usamos el ancho real del contenedor.
        Esto funciona tanto en escritorio como
        en teléfono.
      */

      const slideWidth =
        gallery.getBoundingClientRect().width;


      track.style.transform =
        `translate3d(-${current * slideWidth}px, 0, 0)`;


      /* -----------------------------------------------
         CONTADOR ACTUAL
      ------------------------------------------------ */

      if (currentCounter) {

        currentCounter.textContent =
          String(current + 1).padStart(2, "0");

      }


      /* -----------------------------------------------
         CONTROL DE VIDEOS
         Solo reproduce el video que esté visible.
      ------------------------------------------------ */

      slides.forEach((slide, index) => {

        if (slide.tagName === "VIDEO") {

          if (index === current) {

            slide.muted = true;

            const playPromise =
              slide.play();

            if (playPromise !== undefined) {

              playPromise.catch(() => {});

            }

          } else {

            slide.pause();

            slide.currentTime = 0;

          }

        }

      });

    }


    /* ===================================================
       ANTERIOR
       =================================================== */

    if (prevButton) {

      prevButton.addEventListener("click", (event) => {

        event.preventDefault();

        current--;

        if (current < 0) {

          current = total - 1;

        }

        updateGallery();

      });

    }


    /* ===================================================
       SIGUIENTE
       =================================================== */

    if (nextButton) {

      nextButton.addEventListener("click", (event) => {

        event.preventDefault();

        current++;

        if (current >= total) {

          current = 0;

        }

        updateGallery();

      });

    }


    /* ===================================================
       INICIALIZAR
       =================================================== */

    /*
      Esperamos un momento para asegurarnos de que
      las imágenes ya hayan comenzado a calcular
      correctamente sus dimensiones.
    */

    requestAnimationFrame(() => {

      updateGallery();

    });


    /* ===================================================
       RECALCULAR AL CAMBIAR TAMAÑO
       =================================================== */

    window.addEventListener("resize", () => {

      updateGallery();

    });


    /* ===================================================
       RECALCULAR CUANDO CAMBIA LA ORIENTACIÓN
       DEL TELÉFONO
       =================================================== */

    window.addEventListener(
      "orientationchange",
      () => {

        setTimeout(() => {

          updateGallery();

        }, 150);

      }
    );

  });

});
