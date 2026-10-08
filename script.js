document.addEventListener("DOMContentLoaded", () => {

  const galleries = document.querySelectorAll(".gallery");

  galleries.forEach((gallery) => {

    const track = gallery.querySelector(".gallery-track");
    const prevButton = gallery.querySelector(".gallery-arrow.prev");
    const nextButton = gallery.querySelector(".gallery-arrow.next");
    const currentCounter = gallery.querySelector(".gallery-counter .current");
    const counter = gallery.querySelector(".gallery-counter");

    if (!track) return;

    // Por ahora contamos únicamente las imágenes.
    // Los videos se incorporarán al sistema más adelante.
    const images = Array.from(track.querySelectorAll("img"));

    const total = images.length;

    if (total === 0) return;

    let current = 0;

    // Actualiza la posición de la galería
    function updateGallery() {

      const imageWidth = track.parentElement.clientWidth;

      track.style.transform =
        `translateX(-${current * imageWidth}px)`;

      // Contador actual
      if (currentCounter) {
        currentCounter.textContent =
          String(current + 1).padStart(2, "0");
      }

      // Contador total
      if (counter) {

        const totalText = counter.childNodes;

        totalText.forEach((node) => {

          if (
            node.nodeType === Node.TEXT_NODE &&
            node.textContent.includes("/")
          ) {
            node.textContent = ` / ${String(total).padStart(2, "0")}`;
          }

        });

      }

    }


    // Imagen anterior
    if (prevButton) {

      prevButton.addEventListener("click", () => {

        current--;

        if (current < 0) {
          current = total - 1;
        }

        updateGallery();

      });

    }


    // Imagen siguiente
    if (nextButton) {

      nextButton.addEventListener("click", () => {

        current++;

        if (current >= total) {
          current = 0;
        }

        updateGallery();

      });

    }


    // Inicializa la galería
    updateGallery();


    // Recalcula la posición si cambia el tamaño
    // de la ventana o cambia la orientación del teléfono.
    window.addEventListener("resize", () => {
      updateGallery();
    });

  });

});
