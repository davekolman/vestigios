document.addEventListener("DOMContentLoaded", () => {

  const galleries = document.querySelectorAll(".gallery");

  galleries.forEach((gallery) => {

    const track = gallery.querySelector(".gallery-track");
    const prevButton = gallery.querySelector(".gallery-arrow.prev");
    const nextButton = gallery.querySelector(".gallery-arrow.next");
    const currentCounter = gallery.querySelector(".gallery-counter .current");
    const counter = gallery.querySelector(".gallery-counter");

    if (!track) return;


    /* =========================
       ELEMENTOS DE LA GALERÍA
       IMÁGENES + VIDEOS
    ========================= */

    const slides = Array.from(
      track.querySelectorAll("img, video")
    );

    const total = slides.length;

    if (total === 0) return;


    /* =========================
       CREAR CONTADOR TOTAL
    ========================= */

    let totalCounter = counter
      ? counter.querySelector(".total")
      : null;

    if (counter && !totalCounter) {

      totalCounter = document.createElement("span");

      totalCounter.className = "total";

      counter.appendChild(totalCounter);

    }

    if (totalCounter) {

      totalCounter.textContent =
        ` / ${String(total).padStart(2, "0")}`;

    }


    /* =========================
       POSICIÓN ACTUAL
    ========================= */

    let current = 0;


    /* =========================
       ACTUALIZAR GALERÍA
    ========================= */

    function updateGallery() {

      const slideWidth = gallery.clientWidth;

      track.style.transform =
        `translateX(-${current * slideWidth}px)`;


      if (currentCounter) {

        currentCounter.textContent =
          String(current + 1).padStart(2, "0");

      }


      /* =========================
         CONTROL DE VIDEOS
         Si algún día se coloca un
         video dentro del carrusel:
         solo reproduce el actual.
      ========================= */

      slides.forEach((slide, index) => {

        if (slide.tagName === "VIDEO") {

          if (index === current) {

            slide.play().catch(() => {});

          } else {

            slide.pause();

            slide.currentTime = 0;

          }

        }

      });

    }


    /* =========================
       ANTERIOR
    ========================= */

    if (prevButton) {

      prevButton.addEventListener("click", () => {

        current--;

        if (current < 0) {

          current = total - 1;

        }

        updateGallery();

      });

    }


    /* =========================
       SIGUIENTE
    ========================= */

    if (nextButton) {

      nextButton.addEventListener("click", () => {

        current++;

        if (current >= total) {

          current = 0;

        }

        updateGallery();

      });

    }


    /* =========================
       INICIALIZAR
    ========================= */

    updateGallery();


    /* =========================
       RESPONSIVE
    ========================= */

    window.addEventListener("resize", () => {

      updateGallery();

    });

  });

});
