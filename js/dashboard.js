const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');
const usernameDisplay = document.getElementById('usernameDisplay');
const testVulnBtn = document.getElementById('testVulnBtn');
const resetBtn = document.getElementById('resetBtn');
const overlay = document.getElementById('overlay');
const refreshHealthBtn = document.getElementById('refreshHealthBtn');
const notificationArea = document.getElementById('notificationArea');
let threatChart, performanceChart;
let serverData = Array(30).fill(60);
const threatLevels = ['Low', 'Medium', 'High', 'Critical'];

document.addEventListener('DOMContentLoaded', () => {
  const storedUser = localStorage.getItem('loggedInUser');
  if (storedUser) {
    const userData = JSON.parse(storedUser);
    usernameDisplay.textContent = userData.username;
  }
  preloadDataIfEmpty();
  initCharts();
  startServerMonitoring();
  initRevealObserver();
  initBinaryCanvas();
  displayUserLocation();
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

testVulnBtn.addEventListener('click', () => {
  overlay.style.display = 'block';
  setTimeout(() => {
    const threatIndex = Math.floor(Math.random() * threatLevels.length);
    updateThreatChart(threatIndex);
    overlay.style.display = 'none';
  }, 2000);
});

resetBtn.addEventListener('click', () => {
  localStorage.removeItem('threatData');
  localStorage.removeItem('logs');
  localStorage.removeItem('threats');
  location.reload();
});

refreshHealthBtn.addEventListener('click', () => {
  const states = ['Good', 'Warning', 'Critical'];
  const randomState = states[Math.floor(Math.random() * states.length)];
  document.getElementById('healthSummary').textContent = randomState;
});

function preloadDataIfEmpty() {
  if (!localStorage.getItem('threatData')) {
    const sampleThreatData = [1, 2, 0, 3, 2, 1, 0, 3];
    localStorage.setItem('threatData', JSON.stringify(sampleThreatData));
  }
  if (!localStorage.getItem('logs')) {
    const sampleLogs = [
      { message: 'Preloaded Log: System startup', time: '2025-04-05 09:00' },
      { message: 'Preloaded Log: Threat detection tested', time: '2025-04-05 09:15' },
      { message: 'Preloaded Log: Firewall rules updated', time: '2025-04-05 09:30' },
      { message: 'Preloaded Log: Malware detection enabled', time: '2025-04-05 09:45' },
      { message: 'Preloaded Log: Server performance optimized', time: '2025-04-05 10:00' }
    ];
    localStorage.setItem('logs', JSON.stringify(sampleLogs));
  }
  if (!localStorage.getItem('threats')) {
    const sampleThreats = [
      {
        name: 'Ransomware',
        action: 'Pending',
        level: 'High',
        time: '2025-04-05 09:20'
      },
      {
        name: 'Trojan Horse',
        action: 'Pending',
        level: 'Medium',
        time: '2025-04-05 09:25'
      },
      {
        name: 'Worm',
        action: 'In Progress',
        level: 'Critical',
        time: '2025-04-05 09:30'
      },
      {
        name: 'Spyware',
        action: 'Resolved',
        level: 'Low',
        time: '2025-04-05 09:35'
      }
    ];
    localStorage.setItem('threats', JSON.stringify(sampleThreats));
  }
}

function initCharts() {
  const threatCtx = document.getElementById('threatChart').getContext('2d');
  const performanceCtx = document.getElementById('performanceChart').getContext('2d');
  const storedThreatData = JSON.parse(localStorage.getItem('threatData')) || [0, 2];

  const threatGradient = threatCtx.createLinearGradient(0, 0, 0, 300);
  threatGradient.addColorStop(0, 'rgba(255, 0, 0, 0.4)');
  threatGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');

  threatChart = new Chart(threatCtx, {
    type: 'line',
    data: {
      labels: storedThreatData.map((_, i) => i + 1),
      datasets: [
        {
          label: 'Threat Level',
          data: storedThreatData,
          borderColor: 'rgba(255, 0, 0, 1)',
          backgroundColor: threatGradient,
          fill: true,
          tension: 0.4,
          pointRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      animation: {
        duration: 1000,
        easing: 'easeInOutQuart'
      },
      scales: {
        x: {
          title: { display: true, text: 'Test #' }
        },
        y: {
          type: 'category',
          labels: threatLevels,
          title: { display: true, text: 'Threat Level' }
        }
      },
      plugins: {
        legend: { display: true }
      }
    }
  });

  const perfGradient = performanceCtx.createLinearGradient(0, 0, 0, 300);
  perfGradient.addColorStop(0, 'rgba(0, 0, 255, 0.4)');
  perfGradient.addColorStop(1, 'rgba(0, 0, 255, 0)');

  performanceChart = new Chart(performanceCtx, {
    type: 'line',
    data: {
      labels: serverData.map((_, i) => i),
      datasets: [
        {
          label: '% Utilization',
          data: serverData,
          borderColor: 'blue',
          backgroundColor: perfGradient,
          fill: true,
          tension: 0.3,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      animation: {
        duration: 800,
        easing: 'easeInOutQuad'
      },
      scales: {
        x: { display: false },
        y: {
          title: { display: true, text: 'Utilization (%)' },
          min: 0,
          max: 100,
          ticks: { stepSize: 20 }
        }
      },
      plugins: {
        legend: { display: true }
      }
    }
  });
}

function startServerMonitoring() {
  setInterval(() => {
    serverData.shift();
    serverData.push(Math.floor(Math.random() * 101));
    performanceChart.data.labels = serverData.map((_, i) => i);
    performanceChart.data.datasets[0].data = serverData;
    performanceChart.update();
  }, 1500);
}

function updateThreatChart(threatIndex) {
  let threatData = JSON.parse(localStorage.getItem('threatData')) || [0, 2];
  let logs = JSON.parse(localStorage.getItem('logs')) || [];
  let threats = JSON.parse(localStorage.getItem('threats')) || [];

  threatData.push(threatIndex);
  logs.push({
    message: 'New threat test: ' + threatLevels[threatIndex],
    time: new Date().toLocaleString()
  });

  const threatNames = ['Trojan Horse', 'Worm', 'Ransomware', 'Spyware'];
  const name = threatNames[Math.floor(Math.random() * threatNames.length)];
  threats.push({
    name: name,
    action: 'Pending',
    level: threatLevels[threatIndex],
    time: new Date().toLocaleString()
  });

  localStorage.setItem('threatData', JSON.stringify(threatData));
  localStorage.setItem('logs', JSON.stringify(logs));
  localStorage.setItem('threats', JSON.stringify(threats));

  threatChart.data.labels = threatData.map((_, i) => i + 1);
  threatChart.data.datasets[0].data = threatData;
  threatChart.update();

  notificationArea.style.display = 'block';
  notificationArea.textContent = 'New test completed.';
  setTimeout(() => {
    notificationArea.style.display = 'none';
  }, 3000);
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

function displayUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const map = L.map('map').setView([lat, lon], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      L.marker([lat, lon]).addTo(map)
        .bindPopup('You are here')
        .openPopup();
    }, (error) => {
      console.error('Error getting location', error);
      alert('Unable to retrieve your location');
    });
  } else {
    alert('Geolocation is not supported by this browser');
  }
}
