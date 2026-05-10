// === NAVBAR SCROLL ===
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

// === HAMBURGER MENU ===
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.add('open');
});
document.getElementById('mobileClose').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.remove('open');
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

// === SCROLL ANIMATIONS ===
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
