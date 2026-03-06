let currentView = 'demandeur';
let waterChart, radarChart;

function setView(view) {
    currentView = view;
    document.getElementById('fields-demandeur').style.display = view === 'demandeur' ? 'block' : 'none';
    document.getElementById('fields-entreprise').style.display = view === 'entreprise' ? 'block' : 'none';
    document.getElementById('btn-demandeur').className = view === 'demandeur' ? 'active' : '';
    document.getElementById('btn-entreprise').className = view === 'entreprise' ? 'active' : '';
    update();
}

function update() {
    const n = parseFloat(document.getElementById('n').value) || 0;
    const s = parseFloat(document.getElementById('s').value) / 100;
    const a = parseFloat(document.getElementById('a').value) / 100;
    const sel = parseFloat(document.getElementById('sel').value) / 100;
    const coutGlobal = parseFloat(document.getElementById('cout-global').value) || 0;

    const impactNet = n * s * (1 - a) * (1 - sel);
    
    let gainGlobal = 0;
    if (currentView === 'demandeur') {
        gainGlobal = impactNet * (parseFloat(document.getElementById('gain-indiv').value) + parseFloat(document.getElementById('gain-soc').value));
    } else {
        gainGlobal = impactNet * (parseFloat(document.getElementById('gain-prod').value) + parseFloat(document.getElementById('gain-recrut').value));
    }

    const gainNetPur = gainGlobal - coutGlobal;
    const roi = coutGlobal > 0 ? (gainGlobal / coutGlobal) : 0;

    // UI Update
    document.getElementById('net').innerText = Math.round(impactNet);
    document.getElementById('gain-global').innerText = Math.round(gainGlobal).toLocaleString() + " €";
    document.getElementById('gain-net-pur').innerText = Math.round(gainNetPur).toLocaleString() + " €";
    document.getElementById('roi').innerText = roi.toFixed(2) + "x";

    renderCharts(n * s, n * s * a, n * s * sel, impactNet);
}

function renderCharts(brut, aubaine, selection, net) {
    const ctxW = document.getElementById('waterfallChart').getContext('2d');
    if (waterChart) waterChart.destroy();
    waterChart = new Chart(ctxW, {
        type: 'bar',
        data: {
            labels: ['Brut', 'Aubaine', 'Sélection', 'Net'],
            datasets: [{
                data: [brut, -aubaine, -selection, net],
                backgroundColor: ['#3b82f6', '#ef4444', '#f59e0b', '#00ff88'],
                borderRadius: 5
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: { y: { grid: { color: '#333' } } }
        }
    });

    const ctxR = document.getElementById('radarChart').getContext('2d');
    if (radarChart) radarChart.destroy();
    const rosen = parseFloat(document.getElementById('rosenberg').value) || 0;

    radarChart = new Chart(ctxR, {
        type: 'radar',
        data: {
            labels: ['Confiance', 'Évol. Rosenberg', 'NPS', 'Matching', 'Autonomie'],
            datasets: [{
                label: 'Performance Acteurs',
                data: [8, rosen, 7, 9, 6],
                borderColor: '#00f2ff',
                backgroundColor: 'rgba(0, 242, 255, 0.2)',
                pointBackgroundColor: '#00f2ff'
            }]
        },
        options: {
            scales: { r: { suggestedMax: 10, grid: { color: '#333' }, pointLabels: { color: '#888' }, ticks: { display: false } } },
            plugins: { legend: { display: false } }
        }
    });
}

window.onload = () => update();
