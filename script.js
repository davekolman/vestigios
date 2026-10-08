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
       CONTAR IMÁGENES
    ========================= */

    const images = Array.from(
      track.querySelectorAll("img")
    );

    const total = images.length;

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

      const imageWidth = gallery.clientWidth;

      track.style.transform =
        `translateX(-${current * imageWidth}px)`;


      if (currentCounter) {

        currentCounter.textContent =
          String(current + 1).padStart(2, "0");

      }

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
