// --- Initialisation des canvases ---
const pieCtx = document.getElementById('pieChart');

const pieChart = new Chart(pieCtx, {
  type: 'pie',
  data: {
    labels: ['Voiture', 'Bus', 'Train', 'Avion'],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: ['#00ff88', '#ffaa00', '#0077ff', '#ff4444']
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }
});

const barCtx = document.createElement('canvas');
barCtx.id = 'barChart';
document.querySelector('#dashboard').appendChild(barCtx);

const barChart = new Chart(barCtx, {
  type: 'bar',
  data: {
    labels: ['Voiture', 'Bus', 'Train', 'Avion'],
    datasets: [{
      label: 'Émissions CO₂ (kg)',
      data: [0, 0, 0, 0],
      backgroundColor: ['#00ff88', '#ffaa00', '#0077ff', '#ff4444']
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

const CO2_FACTORS = {
  voiture: 0.2,
  bus: 0.1,
  train: 0.05,
  avion: 0.25
};

let activities = JSON.parse(localStorage.getItem('activities')) || [];
let editingId = null;

function updateCharts() {
  const emissions = [0, 0, 0, 0];
  activities.forEach(act => {
    const index = barChart.data.labels.indexOf(capitalize(act.type));
    emissions[index] += act.distance * CO2_FACTORS[act.type];
  });
  barChart.data.datasets[0].data = [...emissions];
  pieChart.data.datasets[0].data = [...emissions];
  barChart.update();
  pieChart.update();
}

function displayHistory() {
  const list = document.getElementById('history-list');
  list.innerHTML = '';
  activities.forEach(act => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${capitalize(act.type)} - ${act.distance} km <br>
      <small>Ajouté le ${act.date}</small>
      <div>
        <button onclick="editActivity(${act.id})">Modifier</button>
        <button onclick="deleteActivity(${act.id})">Supprimer</button>
      </div>
    `;
    list.appendChild(li);
  });
}

function deleteActivity(id) {
  activities = activities.filter(a => a.id !== id);
  localStorage.setItem('activities', JSON.stringify(activities));
  updateCharts();
  displayHistory();
}

function editActivity(id) {
  const act = activities.find(a => a.id === id);
  if (!act) return;
  document.querySelector('select[name="transport"]').value = act.type;
  document.querySelector('input[name="distance"]').value = act.distance;
  editingId = id;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getCurrentFormattedDate() {
  const now = new Date();
  const date = now.toLocaleDateString('fr-FR');
  const time = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  return `${date} à ${time}`;
}

document.getElementById('activity-form').addEventListener('submit', e => {
  e.preventDefault();
  const form = e.target;
  const type = form.transport.value;
  const distance = parseFloat(form.distance.value);
  if (!type || isNaN(distance) || distance <= 0) return;

  if (editingId) {
    const index = activities.findIndex(a => a.id === editingId);
    activities[index] = { id: editingId, type, distance, date: getCurrentFormattedDate() };
    editingId = null;
  } else {
    activities.push({ id: Date.now(), type, distance, date: getCurrentFormattedDate() });
  }

  localStorage.setItem('activities', JSON.stringify(activities));
  updateCharts();
  displayHistory();
  form.reset();
});

// --- Navigation par onglets ---
function showSectionFromHash() {
  const hash = window.location.hash || '#dashboard';
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    section.classList.remove('active');
    if (`#${section.id}` === hash) {
      section.classList.add('active');
    }
  });
}

window.addEventListener('load', showSectionFromHash);
window.addEventListener('hashchange', showSectionFromHash);

// Initial load
updateCharts();
displayHistory();