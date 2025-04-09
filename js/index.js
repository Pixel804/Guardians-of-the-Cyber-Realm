const guestLoginBtn = document.getElementById('guestLoginBtn');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');

document.addEventListener('DOMContentLoaded', () => {
  initBinaryCanvas();

  guestLoginBtn.addEventListener('click', () => {
    localStorage.setItem('loggedInUser', JSON.stringify({ username: 'Guest' }));
    window.location.href = 'dashboard.html';
  });

  loginBtn.addEventListener('click', () => {
    window.location.href = 'login.html';
  });

  signupBtn.addEventListener('click', () => {
    window.location.href = 'signup.html';
  });
});

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
