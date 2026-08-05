document.addEventListener('DOMContentLoaded', () => {
  renderPageContent();
  initLazyImages();
  initGalleryLightbox();
  initPressKit();
  initMobileMenu();
});

const heroImage = {
  src: 'https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  alt: 'Palco iluminado com cortinas avermelhadas, cena teatral em destaque'
};

const galleryItems = [
  {
    src: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80',
    webp: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80&fm=webp',
    alt: 'Elenco em cena com iluminação dramática',
    caption: 'Sombras do Passado · 2024'
  },
  {
    src: 'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=80',
    webp: 'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=80&fm=webp',
    alt: 'Palco com cortinas vermelhas e luzes',
    caption: 'O Auto da Mambembe · 2022'
  },
  {
    src: 'https://images.unsplash.com/photo-1485579149621-3123dd979885?auto=format&fit=crop&w=1200&q=80',
    webp: 'https://images.unsplash.com/photo-1485579149621-3123dd979885?auto=format&fit=crop&w=1200&q=80&fm=webp',
    alt: 'Espaço teatral com público e luzes baixas',
    caption: 'Cenas de temporada'
  },
  {
    src: 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?auto=format&fit=crop&w=1200&q=80',
    webp: 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?auto=format&fit=crop&w=1200&q=80&fm=webp',
    alt: 'Personagem em close com maquiagem teatral',
    caption: 'Rostos e emoção'
  }
];

const timelineItems = [
  {
    year: '2015',
    title: 'O início',
    description: 'Nasce a companhia com um desejo forte de levar teatro contemporâneo a públicos diversos.'
  },
  {
    year: '2016',
    title: 'Primeiro repertório',
    description: 'O grupo estreia dois espetáculos autorais e começa a construir sua assinatura estética.'
  },
  {
    year: '2018',
    title: 'Crescimento artístico',
    description: 'Os espetáculos passam a ganhar destaque em circuitos culturais e festivais da região.'
  },
  {
    year: '2020',
    title: 'Adaptação e novas linguagens',
    description: 'A companhia expande seus formatos, experimenta performances híbridas e instala diálogo com audiovisual.'
  },
  {
    year: '2022',
    title: 'Reconhecimento',
    description: 'A companhia amplia sua presença e consolida uma linguagem visual marcante e própria.'
  },
  {
    year: '2024',
    title: 'Cenas em nova fase',
    description: 'Novos projetos fortalecem a presença da trupe em palcos e na comunicação digital.'
  },
  {
    year: '2026',
    title: 'Presença institucional',
    description: 'Agora, o Palco Mambembe se apresenta também em formato digital, com uma galeria e press kit online.'
  }
];

function renderPageContent() {
  renderHeroImage();
  renderGalleryItems();
  renderTimelineItems();
}

function renderHeroImage() {
  const heroImageElement = document.querySelector('.hero-panel img');
  if (!heroImageElement) return;

  heroImageElement.classList.add('lazy-load');
  heroImageElement.src = 'assets/images/placeholder/image-placeholder.svg';
  heroImageElement.dataset.src = heroImage.src;
  heroImageElement.alt = heroImage.alt;
  heroImageElement.loading = 'lazy';
  heroImageElement.decoding = 'async';
  heroImageElement.onerror = function () {
    this.onerror = null;
    this.src = 'assets/images/placeholder/image-placeholder.svg';
  };
}

function renderGalleryItems() {
  const galleryGrid = document.querySelector('.masonry-grid');
  if (!galleryGrid) return;

  galleryGrid.innerHTML = galleryItems
    .map((item) => `
      <figure class="masonry-item">
        <picture>
          <source data-srcset="${item.webp}" type="image/webp">
          <img
            class="lazy-load"
            src="assets/images/placeholder/image-placeholder.svg"
            data-src="${item.src}"
            alt="${escapeHtml(item.alt)}"
            loading="lazy"
            decoding="async"
            onerror="this.onerror=null;this.src='assets/images/placeholder/image-placeholder.svg'"
          >
        </picture>
        <figcaption>${escapeHtml(item.caption)}</figcaption>
      </figure>
    `)
    .join('');
}

function renderTimelineItems() {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;

  timeline.innerHTML = timelineItems
    .map((item) => `
      <article class="timeline-item">
        <h3>${escapeHtml(item.year)} — ${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
      </article>
    `)
    .join('');
}

function initLazyImages() {
  const lazyImages = document.querySelectorAll('img.lazy-load');
  if (!lazyImages.length) return;

  const loadImage = (image) => {
    const picture = image.closest('picture');
    const src = image.dataset.src;
    const srcset = image.dataset.srcset;

    if (picture) {
      picture.querySelectorAll('source').forEach((source) => {
        const sourceSrcset = source.dataset.srcset;
        if (sourceSrcset) {
          source.srcset = sourceSrcset;
        }
      });
    }

    if (src) image.src = src;
    if (srcset) image.srcset = srcset;
    image.classList.remove('lazy-load');
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, observerInstance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        loadImage(entry.target);
        observerInstance.unobserve(entry.target);
      });
    }, {
      rootMargin: '150px 0px',
      threshold: 0.01
    });

    lazyImages.forEach((image) => observer.observe(image));
  } else {
    lazyImages.forEach(loadImage);
  }
}

function initGalleryLightbox() {
  const galleryImages = document.querySelectorAll('.masonry-item img');
  if (!galleryImages.length) return;

  const modal = document.createElement('div');
  modal.className = 'lightbox-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Imagem ampliada');
  modal.innerHTML = `
    <button class="close-btn" type="button" aria-label="Fechar imagem ampliada">&times;</button>
    <img class="modal-content" id="modal-img" alt="Imagem ampliada">
  `;

  document.body.appendChild(modal);
  const modalImg = modal.querySelector('#modal-img');
  const closeBtn = modal.querySelector('.close-btn');

  const openModal = (image) => {
    modalImg.src = image.currentSrc || image.src;
    modalImg.alt = image.alt || 'Imagem ampliada';
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };

  const closeModal = () => {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  };

  galleryImages.forEach((image) => {
    image.setAttribute('tabindex', '0');
    image.setAttribute('role', 'button');
    image.setAttribute('aria-label', `Ampliar imagem: ${image.alt || 'galeria'}`);

    image.addEventListener('click', () => openModal(image));
    image.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openModal(image);
      }
    });
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.style.display === 'flex') {
      closeModal();
    }
  });
}

async function initPressKit() {
  const container = document.querySelector('[data-presskit-list]');
  if (!container) return;

  try {
    const response = await fetch('assets/presskit/data.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Não foi possível carregar o press kit.');

    const data = await response.json();
    container.innerHTML = data.espetaculos.map(createPressCard).join('');
  } catch (error) {
    console.error(error);
    container.innerHTML = `
      <p class="press-kit-empty">
        Não foi possível carregar os materiais no momento.
      </p>
    `;
  }
}

function createPressCard(item) {
  return `
    <article class="press-card">
      <img
        class="press-card__cover"
        src="${item.capa}"
        alt="${escapeHtml(item.titulo)}"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='assets/images/placeholder/image-placeholder.svg'"
      >
      <h3>${escapeHtml(item.titulo)} (${item.ano})</h3>
      <p>${escapeHtml(item.sinopse)}</p>
      <a href="${item.presskit_zip}" class="btn btn-download" download>
        Download fotos high-res (.ZIP)
      </a>
      <a href="${item.release_pdf}" class="btn btn-download secondary" download>
        Press release (.PDF)
      </a>
    </article>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function initMobileMenu() {
  const btn = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const opened = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', opened ? 'true' : 'false');
    document.body.classList.toggle('no-scroll', opened);
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
    });
  });

  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
    }
  });
}

