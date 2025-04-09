const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');
const usernameDisplay = document.getElementById('usernameDisplay');
const logsContainer = document.getElementById('logsContainer');

document.addEventListener('DOMContentLoaded', () => {
  const storedUser = localStorage.getItem('loggedInUser');
  if (storedUser) {
    const userData = JSON.parse(storedUser);
    usernameDisplay.textContent = userData.username;
  }
  initBinaryCanvas();
  initRevealObserver();
  loadLogs();
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

function loadLogs() {
  const logs = JSON.parse(localStorage.getItem('logs')) || [];
  if (logs.length === 0) {
    logsContainer.innerHTML = `<p class="text-white">No logs found.</p>`;
    return;
  }
  let html = '';
  logs.forEach((log, index) => {
    html += `
      <div class="mb-2" style="border-bottom:1px solid #444; padding-bottom:8px;">
        <strong>Log #${index + 1}:</strong> ${log.message} 
        <br>
        <small>Time: ${log.time}</small>
      </div>
    `;
  });
  logsContainer.innerHTML = html;
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
