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


      /* =========================
         ACTUALIZAR CONTADOR
      ========================= */

      if (currentCounter) {

        currentCounter.textContent =
          String(current + 1).padStart(2, "0");

      }


      /* =========================
         CONTROL DE VIDEOS
         
         Si en el futuro colocas
         un video dentro del carrusel,
         solo se reproducirá cuando
         ese slide esté visible.
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
       BOTÓN ANTERIOR
       FUNCIONAMIENTO CIRCULAR
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
       BOTÓN SIGUIENTE
       FUNCIONAMIENTO CIRCULAR
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
       INICIALIZAR GALERÍA
    ========================= */

    updateGallery();


    /* =========================
       RESPONSIVE
    ========================= */

    window.addEventListener("resize", () => {

      updateGallery();

    });

  });


  /* =====================================================
     WHATSAPP — PREGUNTAR POR UNA PIEZA
     
     Cada botón .order-button puede tener:
     
     data-piece="Nombre de la pieza"
     data-number="01"
     
     El mensaje se genera automáticamente.
  ===================================================== */

  const orderButtons = document.querySelectorAll(".order-button");

  orderButtons.forEach((button) => {

    button.addEventListener("click", (event) => {

      event.preventDefault();


      /* =========================
         DATOS DE LA PIEZA
      ========================= */

      const pieceName =
        button.dataset.piece || "esta pieza";

      const pieceNumber =
        button.dataset.number || "";


      /* =========================
         MENSAJE
      ========================= */

      let message =
        `Hola Dave, quisiera hacer una consulta sobre la pieza ${pieceNumber} — ${pieceName}.`;

      message +=
        `\n\nMe gustaría conocer más información sobre disponibilidad, precio y proceso de pedido.`;


      /* =========================
         NÚMERO DE WHATSAPP
      ========================= */

      const phone =
        "573234338305";


      /* =========================
         CREAR ENLACE WHATSAPP
      ========================= */

      const whatsappURL =
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;


      /* =========================
         ABRIR WHATSAPP
      ========================= */

      window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
      );

    });

  });

});
