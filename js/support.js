const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');
const usernameDisplay = document.getElementById('usernameDisplay');
const supportForm = document.getElementById('supportForm');
const supportFeedback = document.getElementById('supportFeedback');

document.addEventListener('DOMContentLoaded', () => {
  const storedUser = localStorage.getItem('loggedInUser');
  if (storedUser) {
    const userData = JSON.parse(storedUser);
    usernameDisplay.textContent = userData.username;
  }
  initBinaryCanvas();
  initRevealObserver();
  initSupportForm();
});

sidebarToggleBtn.addEventListener('click', () => {
  if (!sidebar.classList.contains('sidebar-closed')) {
    sidebar.classList.add('sidebar-closed');
    mainContent.classList.add('full-width');
  } else {
    sidebar.classList.remove('sidebar-closed');
    mainContent.classList.remove('full-width');
  }
});

function initSupportForm() {
  supportForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('supportName').value;
    const email = document.getElementById('supportEmail').value;
    const message = document.getElementById('supportMessage').value;

    // Example: storing or logging the data
    console.log("Support message received:", { name, email, message });

    // Optionally store in localStorage
    // let supportRequests = JSON.parse(localStorage.getItem('supportRequests')) || [];
    // supportRequests.push({ name, email, message, time: new Date().toLocaleString() });
    // localStorage.setItem('supportRequests', JSON.stringify(supportRequests));

    supportFeedback.style.display = 'block';
    supportForm.reset();
  });
}

function initRevealObserver() {
  const revealEls = document.querySelectorAll('[data-reveal]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('left-in');
        entry.target.classList.remove('right-out');
      } else {
        entry.target.classList.remove('left-in');
        entry.target.classList.add('right-out');
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach((el) => observer.observe(el));
}

function initBinaryCanvas() {
  const canvas = document.getElementById('binaryCanvas');
  const ctx = canvas.getContext('2d');
  resizeCanvas();

  let fontSize = 16;
  let columns;
  let drops;
  const characters = '010110110010101111'.split('');

  function setupMatrix() {
    columns = Math.floor(canvas.width / fontSize);
    drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -50;
    }
  }

  function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.01)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0f0';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const text = characters[Math.floor(Math.random() * characters.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  function animate() {
    drawMatrix();
    requestAnimationFrame(animate);
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
    setupMatrix();
  });

  setupMatrix();
  animate();
}
