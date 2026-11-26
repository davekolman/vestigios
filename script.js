
document.addEventListener("DOMContentLoaded", () => {

/* =========================================================
CONFIGURACIÓN GENERAL DE LOS VÍDEOS
========================================================= */

function prepareVideo(video) {
  if (!video) return;

  video.muted = true;
  video.defaultMuted = true;
  video.volume = 0;
  video.controls = false;
  video.playsInline = true;

  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.setAttribute("disablepictureinpicture", "");
  video.setAttribute("controlslist", "nodownload noplaybackrate");
  video.removeAttribute("controls");
}

function playVideo(video) {
  if (!video) return;

  prepareVideo(video);

  const promise = video.play();

  if (promise && typeof promise.catch === "function") {
    promise.catch(() => {});
  }
}

function pauseVideo(video, reset = false) {
  if (!video) return;

  video.pause();

  if (reset) {
    try {
      video.currentTime = 0;
    } catch (error) {}
  }
}

/* =========================================================
IDENTIFICAR VÍDEOS OPCIONALES
========================================================= */

function isOptionalVideoSlide(slide) {
  return Boolean(
    slide &&
    slide.classList &&
    slide.classList.contains("gallery-video-slide")
  );
}

function getOptionalVideo(slide) {
  if (!slide) return null;
  return slide.querySelector("video.gallery-optional-video");
}

/* =========================================================
BOTONES DE VÍDEOS OPCIONALES
========================================================= */

function showOptionalPlayButton(slide) {
  if (!slide) return;

  slide.classList.remove("is-playing");

  const button = slide.querySelector(
    ".gallery-video-play, .lightbox-video-toggle"
  );

  if (button) {
    button.style.removeProperty("display");
    button.setAttribute("aria-label", "Reproducir video");
  }
}

function hideOptionalPlayButton(slide) {
  if (!slide) return;

  slide.classList.add("is-playing");

  const button = slide.querySelector(
    ".gallery-video-play, .lightbox-video-toggle"
  );

  if (button) {
    button.style.setProperty("display", "none", "important");
    button.setAttribute("aria-label", "Vídeo en reproducción");
  }
}

function toggleOptionalVideo(slide) {
  const video = getOptionalVideo(slide);

  if (!video) return;

  if (!video.paused && !video.ended) {
    pauseVideo(video);
    showOptionalPlayButton(slide);
    return;
  }

  prepareVideo(video);

  const promise = video.play();

  if (promise && typeof promise.then === "function") {
    promise
      .then(() => {
        if (!video.paused && !video.ended) {
          hideOptionalPlayButton(slide);
        } else {
          showOptionalPlayButton(slide);
        }
      })
      .catch(() => showOptionalPlayButton(slide));
  } else {
    if (!video.paused && !video.ended) {
      hideOptionalPlayButton(slide);
    } else {
      showOptionalPlayButton(slide);
    }
  }
}

/* =========================================================
PREPARAR TODOS LOS VÍDEOS
========================================================= */

document.querySelectorAll("video").forEach(prepareVideo);

/* =========================================================
VÍDEOS PRINCIPALES
ESCRITORIO: COMPORTAMIENTO ORIGINAL
MÓVILES: AUTOPLAY Y REINTENTOS DE CARGA
========================================================= */

const heroVideo = document.getElementById("hero-video");
const processVideo = document.getElementById("process-video");

const mobileVideoMode = window.matchMedia("(max-width: 700px)");

const mobilePlayPending = new WeakSet();

function playMainVideoOnMobile(video) {
  if (!video || document.hidden) return;

  if (!video.paused && !video.ended) return;

  if (mobilePlayPending.has(video)) return;

  prepareVideo(video);

  video.autoplay = true;
  video.loop = true;

  video.setAttribute("autoplay", "");
  video.setAttribute("loop", "");

  mobilePlayPending.add(video);

  let promise;

  try {
    promise = video.play();
  } catch (error) {
    mobilePlayPending.delete(video);

    console.error("ERROR DE AUTOPLAY:", {
      video: video.id,
      nombre: error.name,
      mensaje: error.message,
      muted: video.muted,
      readyState: video.readyState,
      networkState: video.networkState
    });

    return;
  }

  if (promise && typeof promise.then === "function") {
    promise
      .then(() => {
        mobilePlayPending.delete(video);
      })
      .catch((error) => {
        mobilePlayPending.delete(video);

        console.error("ERROR DE AUTOPLAY:", {
          video: video.id,
          nombre: error.name,
          mensaje: error.message,
          muted: video.muted,
          readyState: video.readyState,
          networkState: video.networkState
        });
      });
  } else {
    mobilePlayPending.delete(video);
  }
}

function startMainVideo(video) {
  if (!video || document.hidden) return;

  if (!mobileVideoMode.matches) {
    playVideo(video);
    return;
  }

  prepareVideo(video);

  video.autoplay = true;
  video.loop = true;

  video.setAttribute("autoplay", "");
  video.setAttribute("loop", "");

  playMainVideoOnMobile(video);
}

/* =========================================================
VIDEO DE PORTADA
========================================================= */

function startHeroVideo() {
  startMainVideo(heroVideo);
}

if (heroVideo) {
  prepareVideo(heroVideo);

  heroVideo.loop = true;
  heroVideo.autoplay = true;

  heroVideo.setAttribute("autoplay", "");
  heroVideo.setAttribute("loop", "");

  heroVideo.addEventListener("loadedmetadata", startHeroVideo);
  heroVideo.addEventListener("loadeddata", startHeroVideo);
  heroVideo.addEventListener("canplay", startHeroVideo);

  startHeroVideo();

  window.addEventListener("pageshow", startHeroVideo);
}

/* =========================================================
VIDEO DE PROCESO
========================================================= */

function startProcessVideo() {
  startMainVideo(processVideo);
}

if (processVideo) {
  prepareVideo(processVideo);

  processVideo.loop = true;
  processVideo.autoplay = true;

  processVideo.setAttribute("autoplay", "");
  processVideo.setAttribute("loop", "");

  processVideo.addEventListener("loadedmetadata", startProcessVideo);
  processVideo.addEventListener("loadeddata", startProcessVideo);
  processVideo.addEventListener("canplay", startProcessVideo);

  startProcessVideo();
}

/* =========================================================
REVISAR VÍDEOS AL CAMBIAR LA VISIBILIDAD
========================================================= */

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    pauseVideo(heroVideo);
    pauseVideo(processVideo);
  } else {
    startHeroVideo();
    startProcessVideo();
  }
});

/* =========================================================
MENÚ MÓVIL
========================================================= */

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.getElementById("main-nav");
const siteHeader = document.querySelector(".site-header");

function closeMenu() {
  if (!menuToggle || !mainNav) return;

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menú");

  mainNav.classList.remove("open");
  document.body.classList.remove("menu-open");
}

function openMenu() {
  if (!menuToggle || !mainNav) return;

  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Cerrar menú");

  mainNav.classList.add("open");
  document.body.classList.add("menu-open");
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (menuToggle.getAttribute("aria-expanded") === "true") {
      closeMenu();
    } else {
      openMenu();
    }
  });

  mainNav.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (
      mainNav.classList.contains("open") &&
      siteHeader &&
      !siteHeader.contains(event.target)
    ) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 700) closeMenu();
  });
}

/* =========================================================
BOTÓN VOLVER ARRIBA
========================================================= */

const backToTop = document.getElementById("back-to-top");

if (backToTop) {
  const updateBackToTop = () => {
    const scrollPosition =
      window.scrollY ||
      document.documentElement.scrollTop ||
      0;

    backToTop.classList.toggle("visible", scrollPosition > 120);
  };

  window.addEventListener("scroll", updateBackToTop, {
    passive: true
  });

  window.addEventListener("resize", updateBackToTop, {
    passive: true
  });

  window.addEventListener("pageshow", updateBackToTop);

  updateBackToTop();

  backToTop.addEventListener("click", () => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth"
    });
  });
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
  if (lightbox) return;

  lightbox = document.createElement("div");
  lightbox.className = "lightbox";

  lightbox.innerHTML = `
    <button class="lightbox-close" type="button"
      aria-label="Cerrar visor">×</button>

    <button class="lightbox-arrow lightbox-prev" type="button"
      aria-label="Imagen anterior">‹</button>

    <div class="lightbox-window">
      <div class="lightbox-track"></div>
    </div>

    <button class="lightbox-arrow lightbox-next" type="button"
      aria-label="Siguiente imagen">›</button>
  `;

  document.body.appendChild(lightbox);

  lightboxTrack = lightbox.querySelector(".lightbox-track");

  const closeButton = lightbox.querySelector(".lightbox-close");
  const prevButton = lightbox.querySelector(".lightbox-prev");
  const nextButton = lightbox.querySelector(".lightbox-next");
  const lightboxWindow = lightbox.querySelector(".lightbox-window");

  closeButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    closeLightbox();
  });

  prevButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!lightboxSlides.length) return;

    lightboxCurrent =
      (lightboxCurrent - 1 + lightboxSlides.length) %
      lightboxSlides.length;

    updateLightbox();
  });

  nextButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!lightboxSlides.length) return;

    lightboxCurrent =
      (lightboxCurrent + 1) % lightboxSlides.length;

    updateLightbox();
  });

  lightbox.addEventListener("click", (event) => {
    if (
      event.target === lightbox ||
      event.target === lightboxWindow
    ) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("active")) return;

    if (event.key === "Escape") {
      closeLightbox();
      return;
    }

    if (!lightboxSlides.length) return;

    if (event.key === "ArrowRight") {
      lightboxCurrent =
        (lightboxCurrent + 1) % lightboxSlides.length;
      updateLightbox();
    }

    if (event.key === "ArrowLeft") {
      lightboxCurrent =
        (lightboxCurrent - 1 + lightboxSlides.length) %
        lightboxSlides.length;
      updateLightbox();
    }
  });
}

/* =========================================================
PREPARAR VÍDEO OPCIONAL EN LIGHTBOX
========================================================= */

function setupOptionalLightboxSlide(slide) {
  if (!isOptionalVideoSlide(slide)) return;

  const video = getOptionalVideo(slide);

  const button = slide.querySelector(
    ".gallery-video-play, .lightbox-video-toggle"
  );

  if (!video) return;

  prepareVideo(video);

  video.controls = false;
  video.autoplay = false;
  video.loop = false;
  video.preload = "metadata";

  video.removeAttribute("controls");
  video.removeAttribute("autoplay");
  video.removeAttribute("loop");

  if (button) {
    button.classList.remove("gallery-video-play");
    button.classList.add("lightbox-video-toggle");

    button.textContent = "▶";
    button.setAttribute("type", "button");
    button.setAttribute("aria-label", "Reproducir video");

    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleOptionalVideo(slide);
    });
  }

  video.addEventListener("play", () => hideOptionalPlayButton(slide));
  video.addEventListener("playing", () => hideOptionalPlayButton(slide));
  video.addEventListener("pause", () => showOptionalPlayButton(slide));
  video.addEventListener("ended", () => showOptionalPlayButton(slide));

  video.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleOptionalVideo(slide);
  });

  showOptionalPlayButton(slide);
}

/* =========================================================
ABRIR LIGHTBOX
========================================================= */

function openLightbox(slides, startIndex) {
  createLightbox();

  document.querySelectorAll(".gallery video").forEach((video) => {
    const optionalSlide = video.closest(".gallery-video-slide");

    pauseVideo(video, Boolean(optionalSlide));

    if (optionalSlide) showOptionalPlayButton(optionalSlide);
  });

  lightboxSlides = Array.from(slides);
  lightboxCurrent = Number(startIndex) || 0;

  lightboxTrack.innerHTML = "";

  lightboxSlides.forEach((slide) => {
    const clone = slide.cloneNode(true);

    clone.removeAttribute("style");

    if (isOptionalVideoSlide(clone)) {
      setupOptionalLightboxSlide(clone);
    } else if (clone.tagName === "VIDEO") {
      prepareVideo(clone);

      clone.controls = false;
      clone.loop = true;
      clone.autoplay = false;

      clone.removeAttribute("controls");
      clone.removeAttribute("autoplay");
    }

    clone.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
    });

    lightboxTrack.appendChild(clone);
  });

  lightbox.classList.add("active");
  document.body.classList.add("lightbox-open");

  updateLightbox();
}

/* =========================================================
ACTUALIZAR LIGHTBOX
========================================================= */

function updateLightbox() {
  if (!lightboxTrack || !lightboxSlides.length) return;

  lightboxCurrent =
    (lightboxCurrent + lightboxSlides.length) %
    lightboxSlides.length;

  lightboxTrack.style.transform =
    `translate3d(-${lightboxCurrent * 100}%, 0, 0)`;

  const slides = Array.from(lightboxTrack.children);

  slides.forEach((slide, index) => {
    if (isOptionalVideoSlide(slide)) {
      pauseVideo(getOptionalVideo(slide), true);
      showOptionalPlayButton(slide);
      return;
    }

    if (slide.tagName !== "VIDEO") return;

    prepareVideo(slide);

    if (index === lightboxCurrent) {
      playVideo(slide);
    } else {
      pauseVideo(slide, true);
    }
  });
}

/* =========================================================
CERRAR LIGHTBOX
========================================================= */

function closeLightbox() {
  if (!lightbox) return;

  lightbox.classList.remove("active");
  document.body.classList.remove("lightbox-open");

  lightbox.querySelectorAll("video").forEach((video) => {
    pauseVideo(video, true);
  });

  lightbox.querySelectorAll(".gallery-video-slide").forEach((slide) => {
    showOptionalPlayButton(slide);
  });
}

/* =========================================================
INICIALIZAR GALERÍAS
========================================================= */

const galleries = document.querySelectorAll(".gallery");

galleries.forEach((gallery) => {
  const track = gallery.querySelector(".gallery-track");

  const prevButton = gallery.querySelector(".gallery-arrow.prev");
  const nextButton = gallery.querySelector(".gallery-arrow.next");

  if (!track) return;

  const slides = Array.from(track.children).filter((slide) => {
    return slide.matches("img, video, .gallery-video-slide");
  });

  const total = slides.length;

  if (!total) return;

  let current = 0;
  let suppressClickUntil = 0;

  function updateGallery() {
    const activeSlide = slides[current];

    if (activeSlide) {
      track.style.transform =
        `translate3d(-${activeSlide.offsetLeft}px, 0, 0)`;
    }

    slides.forEach((slide, index) => {
      if (isOptionalVideoSlide(slide)) {
        pauseVideo(getOptionalVideo(slide), true);
        showOptionalPlayButton(slide);
        return;
      }

      if (slide.tagName !== "VIDEO") return;

      prepareVideo(slide);

      if (index === current) {
        playVideo(slide);
      } else {
        pauseVideo(slide, true);
      }
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      current = (current + 1) % total;
      updateGallery();
    });
  }

  if (prevButton) {
    prevButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      current = (current - 1 + total) % total;
      updateGallery();
    });
  }

  let touchStartX = 0;
  let touchStartY = 0;
  let touchCurrentX = 0;
  let touchCurrentY = 0;
  let gestureDirection = null;

  gallery.addEventListener("touchstart", (event) => {
    if (!event.touches || !event.touches.length) return;

    const touch = event.touches[0];

    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchCurrentX = touchStartX;
    touchCurrentY = touchStartY;

    gestureDirection = null;
  }, { passive: true });

  gallery.addEventListener("touchmove", (event) => {
    if (!event.touches || !event.touches.length) return;

    const touch = event.touches[0];

    touchCurrentX = touch.clientX;
    touchCurrentY = touch.clientY;

    const differenceX = touchCurrentX - touchStartX;
    const differenceY = touchCurrentY - touchStartY;

    if (gestureDirection === null) {
      const absX = Math.abs(differenceX);
      const absY = Math.abs(differenceY);

      if (absX < 8 && absY < 8) return;

      gestureDirection = absY > absX ? "vertical" : "horizontal";
    }

    if (gestureDirection === "horizontal") {
      event.preventDefault();
    }
  }, { passive: false });

  gallery.addEventListener("touchend", () => {
    if (gestureDirection !== "horizontal") {
      gestureDirection = null;
      return;
    }

    const difference = touchStartX - touchCurrentX;

    if (Math.abs(difference) < 50) {
      gestureDirection = null;
      return;
    }

    if (difference > 0) {
      current = (current + 1) % total;
    } else {
      current = (current - 1 + total) % total;
    }

    suppressClickUntil = Date.now() + 500;

    updateGallery();
    gestureDirection = null;
  }, { passive: true });

  gallery.addEventListener("touchcancel", () => {
    gestureDirection = null;
  }, { passive: true });

  slides.forEach((slide, index) => {
    slide.style.cursor = "pointer";

    slide.addEventListener("click", (event) => {
      if (Date.now() < suppressClickUntil) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      openLightbox(slides, index);
    });
  });

  updateGallery();

  window.addEventListener("resize", updateGallery);

  window.addEventListener("orientationchange", () => {
    requestAnimationFrame(updateGallery);
  });
});

/* =========================================================
REVISAR VÍDEOS AL VOLVER A LA PÁGINA
========================================================= */

window.addEventListener("pageshow", () => {
  if (!document.hidden) {
    startHeroVideo();
    startProcessVideo();
  }

  document.querySelectorAll(".gallery").forEach((gallery) => {
    const track = gallery.querySelector(".gallery-track");
    if (!track) return;

    const activeVideo = track.querySelector("video");

    if (
      activeVideo &&
      !(lightbox && lightbox.classList.contains("active"))
    ) {
      prepareVideo(activeVideo);
    }
  });
});

/* =========================================================
PIEZAS SELECCIONADAS — VISOR Y CARRUSEL
========================================================= */

(() => {
  const cardSelector =
    ".independent-pieces [data-independent-piece]";

  const cards = document.querySelectorAll(cardSelector);

  if (!cards.length) return;

  let currentPiece = null;
  let currentImage = 0;
  let lastFocusedElement = null;

  /* CREAR MODAL */

  const modal = document.createElement("div");

  modal.className = "independent-modal";
  modal.setAttribute("aria-hidden", "true");

  modal.innerHTML = `
    <section class="independent-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="independent-modal-title">

      <button class="independent-modal-close"
        type="button" aria-label="Cerrar">×</button>

      <div class="independent-modal-image">
        <img alt="">
        <video
          class="independent-modal-video"
          playsinline
          webkit-playsinline
          preload="none"
          disablepictureinpicture>
        </video>
      </div>

      <button
        class="lightbox-arrow lightbox-prev independent-gallery-arrow independent-gallery-prev"
        type="button" aria-label="Fotografía anterior">‹</button>

      <button
        class="lightbox-arrow lightbox-next independent-gallery-arrow independent-gallery-next"
        type="button" aria-label="Fotografía siguiente">›</button>

      <div class="independent-modal-copy">

        <p class="independent-modal-kicker">
          DAVE KOLMAN · PIEZAS SELECCIONADAS
        </p>

        <h2 class="independent-modal-title"
          id="independent-modal-title"></h2>

        <div class="independent-modal-description"></div>

        <strong class="independent-modal-price"></strong>

        <dl class="independent-modal-meta"></dl>

        <p class="independent-modal-note">
          ¿Deseas más información sobre esta pieza?
          Puedes realizar tu consulta a través de WhatsApp.
        </p>

        <a class="independent-size-link"
           href="https://wa.me/573234338305"
           target="_blank"
           rel="noopener noreferrer">
          Solicitar información por WhatsApp ↗
        </a>

      </div>
    </section>
  `;

  document.body.appendChild(modal);

  /* ELEMENTOS DEL MODAL */

  const image = modal.querySelector(
    ".independent-modal-image img"
  );

  const video = modal.querySelector(
    ".independent-modal-video"
  );

  const closeButton = modal.querySelector(
    ".independent-modal-close"
  );

  const previousButton = modal.querySelector(
    ".independent-gallery-prev"
  );

  const nextButton = modal.querySelector(
    ".independent-gallery-next"
  );

  const title = modal.querySelector(
    ".independent-modal-title"
  );

  const description = modal.querySelector(
    ".independent-modal-description"
  );

  const price = modal.querySelector(
    ".independent-modal-price"
  );

  const meta = modal.querySelector(
    ".independent-modal-meta"
  );

  const imageContainer = modal.querySelector(
    ".independent-modal-image"
  );

  /* PREPARAR VIDEO DEL MODAL */

  prepareVideo(video);

  /* Reactivar controles solo para este video */

  video.controls = true;
  video.setAttribute("controls", "");

  /* No reproducir automáticamente */

  video.autoplay = false;
  video.loop = false;
  video.preload = "none";

  video.removeAttribute("autoplay");
  video.removeAttribute("loop");

  /* Permitir sonido al reproducir manualmente */

  video.muted = false;
  video.defaultMuted = false;
  video.removeAttribute("muted");

  video.style.width = "100%";
  video.style.height = "100%";
  video.style.objectFit = "contain";
  video.style.objectPosition = "center";
  video.style.display = "none";

  /* LEER DATOS DEL HTML */

  function readPiece(card) {
    return {
      name: card.dataset.name || "",
      description: card.dataset.description || "",
      price: card.dataset.price || "",
      size: card.dataset.size || "",
      fabric: card.dataset.fabric || "",
      length: card.dataset.length || "",

      images: (card.dataset.images || "")
        .split("|")
        .map(src => src.trim())
        .filter(Boolean),

      video: card.dataset.video || ""
    };
  }

  /* LIBERAR VIDEO */

  function releaseModalVideo() {
    pauseVideo(video, true);

    video.removeAttribute("src");
    video.load();

    video.dataset.loadedSrc = "";
    video.style.display = "none";
  }

  /* ACTUALIZAR IMAGEN O VIDEO */

  function updateImage() {
    if (!currentPiece) return;

    const images = currentPiece.images;
    const hasVideo = Boolean(currentPiece.video);

    const totalSlides =
      images.length + (hasVideo ? 1 : 0);

    if (!totalSlides) {
      releaseModalVideo();

      image.removeAttribute("src");
      image.alt = "";
      image.hidden = true;
      image.style.display = "none";

      previousButton.hidden = true;
      nextButton.hidden = true;

      imageContainer.hidden = true;
      return;
    }

    imageContainer.hidden = false;

    currentImage =
      ((currentImage % totalSlides) + totalSlides) %
      totalSlides;

    /* SI LA DIAPOSITIVA ACTUAL ES EL VIDEO */

    if (hasVideo && currentImage === images.length) {

      image.hidden = true;
      image.style.display = "none";
      image.removeAttribute("src");

      video.style.display = "block";

      const source = currentPiece.video;

      if (video.dataset.loadedSrc !== source) {

        releaseModalVideo();

        video.style.display = "block";
        video.dataset.loadedSrc = source;
        video.src = source;

        video.load();
      }

    } else {

      /* SI LA DIAPOSITIVA ACTUAL ES UNA FOTOGRAFÍA */

      releaseModalVideo();

      image.hidden = false;
      image.style.display = "block";

      image.src = images[currentImage];

      image.alt =
        currentPiece.name +
        " — fotografía " +
        (currentImage + 1);
    }

    const showArrows = totalSlides > 1;

    previousButton.hidden = !showArrows;
    nextButton.hidden = !showArrows;
  }

  /* NAVEGACIÓN DE IMÁGENES Y VIDEO */

  function previousImage() {
    if (!currentPiece) return;

    const totalSlides =
      currentPiece.images.length +
      (currentPiece.video ? 1 : 0);

    if (!totalSlides) return;

    currentImage--;
    updateImage();
  }

  function nextImage() {
    if (!currentPiece) return;

    const totalSlides =
      currentPiece.images.length +
      (currentPiece.video ? 1 : 0);

    if (!totalSlides) return;

    currentImage++;
    updateImage();
  }

  /* ABRIR PIEZA */

  function openPiece(card) {
    currentPiece = readPiece(card);
    currentImage = 0;

    lastFocusedElement = card;

    releaseModalVideo();

    image.removeAttribute("src");
    image.alt = "";

    updateImage();

    title.textContent = currentPiece.name;

    description.innerHTML = currentPiece.description;

    price.textContent = currentPiece.price;

    meta.innerHTML = "";

    const metadata = [
      ["Talla", currentPiece.size],
      ["Material", currentPiece.fabric],
      ["Largo total", currentPiece.length],
      ["Disponibilidad", "Por encargo"]
    ];

    metadata.forEach(([label, value]) => {
      if (!value) return;

      const wrapper = document.createElement("div");
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");

      dt.textContent = label;
      dd.textContent = value;

      wrapper.append(dt, dd);
      meta.appendChild(wrapper);
    });

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");

    document.body.classList.add("independent-modal-open");

    closeButton.focus();
  }

  /* CERRAR PIEZA */

  function closePiece() {
    if (!modal.classList.contains("is-open")) return;

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("independent-modal-open");

    releaseModalVideo();

    image.removeAttribute("src");
    image.alt = "";
    image.hidden = false;
    image.style.display = "";

    currentPiece = null;
    currentImage = 0;

    if (
      lastFocusedElement &&
      document.contains(lastFocusedElement)
    ) {
      lastFocusedElement.focus();
    }
  }

  /* CLIC O TOQUE EN LAS TARJETAS */

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (!target || typeof target.closest !== "function") return;

    const card = target.closest(cardSelector);

    if (!card) return;

    event.preventDefault();
    event.stopPropagation();

    openPiece(card);
  }, true);

  /* BOTONES DEL CARRUSEL */

  previousButton.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();

    previousImage();
  });

  nextButton.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();

    nextImage();
  });

  closeButton.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();

    closePiece();
  });

  /* CERRAR AL TOCAR EL FONDO */

  modal.addEventListener("click", event => {
    if (event.target === modal) {
      closePiece();
    }
  });

  /* TECLADO */

  document.addEventListener("keydown", event => {
    if (!modal.classList.contains("is-open")) return;

    if (event.key === "Escape") {
      closePiece();
      return;
    }

    if (event.key === "ArrowLeft") {
      previousImage();
    }

    if (event.key === "ArrowRight") {
      nextImage();
    }
  });

})();

/* =========================================================
CIERRE DEL EVENTO DOMCONTENTLOADED
========================================================= */

});
