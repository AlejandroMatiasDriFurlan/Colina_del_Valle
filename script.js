// === NAVBAR SCROLL ===
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

// === HAMBURGER MENU ===
const mobileMenu = document.getElementById('mobileMenu');
const hamburger   = document.getElementById('hamburger');

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('is-open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('is-open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', closeMobileMenu);
});

// === HERO VIDEO ===
const isMobile = window.innerWidth <= 768;
const heroVideo = document.getElementById('heroVideo');
if (heroVideo) {
  heroVideo.play().catch(() => {});
}

// === GALERÍA AUTO-SCROLL (CSS-driven, pause on hover handled via CSS) ===

// === VER MÁS FOTOS ===
function toggleGaleria(btn) {
  const grid = document.getElementById('galeriaGrid');
  const isOpen = grid.style.display !== 'none';
  if (!isOpen) {
    // Cargar imágenes solo la primera vez (data-src → src)
    grid.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
    grid.style.display = 'grid';
    btn.textContent = '✕ Cerrar galería';
    setTimeout(() => grid.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  } else {
    grid.style.display = 'none';
    btn.textContent = '✦ Ver todas las fotos';
  }
}

// === WHATSAPP FLOAT ===
const waFloat = document.getElementById('waFloat');
window.addEventListener('scroll', () => {
  if (window.scrollY > window.innerHeight * 0.05) {
    waFloat.classList.add('visible');
  } else {
    waFloat.classList.remove('visible');
  }
});

// === FORMULARIO WHATSAPP ===
document.getElementById('whatsappForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const nombre     = document.getElementById('nombre').value.trim();
  const email      = document.getElementById('email').value.trim();
  const telefono   = document.getElementById('telefono').value.trim();
  const pasajeros  = document.getElementById('pasajeros').value;
  const desde      = document.getElementById('desde').value;
  const hasta      = document.getElementById('hasta').value;
  const comentarios = document.getElementById('comentarios').value.trim();

  ['nombre', 'email', 'telefono', 'desde', 'hasta'].forEach(id => {
    document.getElementById('err-' + id).textContent = '';
  });

  let valid = true;
  if (!nombre) {
    document.getElementById('err-nombre').textContent = 'Por favor ingresá tu nombre.';
    valid = false;
  }
  if (!desde) {
    document.getElementById('err-desde').textContent = 'Por favor seleccioná la fecha de ingreso.';
    valid = false;
  }
  if (!hasta) {
    document.getElementById('err-hasta').textContent = 'Por favor seleccioná la fecha de egreso.';
    valid = false;
  }
  if (desde && hasta && desde >= hasta) {
    document.getElementById('err-hasta').textContent = 'La fecha de egreso debe ser posterior al ingreso.';
    valid = false;
  }
  if (!valid) return;

  function formatDate(str) {
    const [y, m, d] = str.split('-');
    return `${d}/${m}/${y}`;
  }

  let msg = `Hola! Me gustaría consultar disponibilidad en Colina del Valle 🌿\n\n`;
  msg += `*Nombre:* ${nombre}\n`;
  if (email)     msg += `*Email:* ${email}\n`;
  if (telefono)  msg += `*Teléfono:* ${telefono}\n`;
  msg += `*Ingreso:* ${formatDate(desde)}\n`;
  msg += `*Egreso:* ${formatDate(hasta)}\n`;
  msg += `*Pasajeros:* ${pasajeros}`;
  if (comentarios) msg += `\n\n*Consulta adicional:* ${comentarios}`;

  document.getElementById('redirectMsg').style.display = 'block';

  setTimeout(() => {
    window.open('https://api.whatsapp.com/send?phone=5493544466350&text=' + encodeURIComponent(msg), '_blank');
    document.getElementById('redirectMsg').style.display = 'none';
  }, 600);
});

// === LIGHTBOX ===
const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
let lbImages = [];
let lbIndex  = 0;

function getSrc(img) {
  return img.getAttribute('src') || img.dataset.src || '';
}

function buildGaleriaList() {
  const carousel = Array.from(document.querySelectorAll('.galeria-track img'));
  const seen = new Set();
  const unique = carousel.filter(img => {
    const key = getSrc(img);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const grid = Array.from(document.querySelectorAll('#galeriaGrid img'));
  return [...unique, ...grid];
}

function buildTerapiasList() {
  return Array.from(document.querySelectorAll('.terapias-grid img, #terapiasGrid img'))
    .filter(img => img.style.display !== 'none');
}

function openLightbox(clickedImg) {
  const section = clickedImg.closest('section');
  lbImages = (section && section.classList.contains('terapias'))
    ? buildTerapiasList()
    : buildGaleriaList();

  const clickedSrc = getSrc(clickedImg);
  lbIndex = lbImages.findIndex(img => getSrc(img) === clickedSrc);
  if (lbIndex === -1) lbIndex = 0;
  showLightboxImage(lbIndex);
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function showLightboxImage(index) {
  const img = lbImages[index];
  lightboxImg.src = getSrc(img);
  lightboxImg.alt = img.alt || '';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { lightboxImg.src = ''; }, 350);
}

function lbPrev() {
  lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length;
  showLightboxImage(lbIndex);
}
function lbNext() {
  lbIndex = (lbIndex + 1) % lbImages.length;
  showLightboxImage(lbIndex);
}

document.querySelector('.galeria-strips').addEventListener('click', e => {
  if (e.target.tagName === 'IMG') openLightbox(e.target);
});
document.getElementById('galeriaGrid').addEventListener('click', e => {
  if (e.target.tagName === 'IMG') openLightbox(e.target);
});

lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});
document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.getElementById('lightboxPrev').addEventListener('click', e => { e.stopPropagation(); lbPrev(); });
document.getElementById('lightboxNext').addEventListener('click', e => { e.stopPropagation(); lbNext(); });

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   lbPrev();
  if (e.key === 'ArrowRight')  lbNext();
});

// === TERAPIAS TOGGLE ===
function toggleTerapias(btn) {
  const grid = document.getElementById('terapiasGrid');
  const isOpen = grid.style.display !== 'none';
  if (!isOpen) {
    grid.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
    grid.style.display = 'grid';
    btn.textContent = '✕ Cerrar galería';
    setTimeout(() => grid.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  } else {
    grid.style.display = 'none';
    btn.textContent = '✦ Ver galería completa';
  }
}

// === LAZY MAP ===
const MAP_SRC = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3407.381387222165!2d-65.00045312411933!3d-31.73515767946955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x942d25e05923dccb%3A0xadf6d874e0633e7b!2sColina%20del%20Valle%20Hotel!5e0!3m2!1ses-419!2sar!4v1714424858327!5m2!1ses-419!2sar';

function loadMap(el) {
  const iframe = document.createElement('iframe');
  iframe.className = 'map-embed';
  iframe.src = MAP_SRC;
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = 'no-referrer-when-downgrade';
  iframe.title = 'Ubicación Colina del Valle - Mina Clavero';
  el.replaceWith(iframe);
}

// Desktop: carga automática al hacer scroll hasta el mapa
if (window.innerWidth > 768) {
  const mapFacade = document.getElementById('mapFacade');
  if (mapFacade) {
    const mapObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMap(mapFacade);
        mapObserver.disconnect();
      }
    }, { rootMargin: '150px' });
    mapObserver.observe(mapFacade);
  }
}

// === SCROLL ANIMATIONS ===
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
 