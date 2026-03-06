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
    
    let g1, g2, l1, l2;
    if (currentView === 'demandeur') {
        g1 = parseFloat(document.getElementById('gain-indiv').value) || 0;
        g2 = parseFloat(document.getElementById('gain-soc').value) || 0;
        l1 = "👤 Individu (Revenus Nets)"; l2 = "🏛️ État (Économies Sociales)";
    } else {
        g1 = parseFloat(document.getElementById('gain-prod').value) || 0;
        g2 = parseFloat(document.getElementById('gain-recrut').value) || 0;
        l1 = "🏢 Entreprise (Productivité)"; l2 = "🏢 Entreprise (Frais Recrutement)";
    }

    const gainGlobal = impactNet * (g1 + g2);
    const gainNetPur = gainGlobal - coutGlobal;
    const roi = coutGlobal > 0 ? (gainGlobal / coutGlobal) : 0;

    document.getElementById('net').innerText = Math.round(impactNet);
    document.getElementById('gain-global').innerText = Math.round(gainGlobal).toLocaleString() + " €";
    document.getElementById('gain-net-pur').innerText = Math.round(gainNetPur).toLocaleString() + " €";
    document.getElementById('roi').innerText = roi.toFixed(2) + "x";

    updateTable(l1, g1, l2, g2, impactNet);
    renderCharts(n * s, n * s * a, n * s * sel, impactNet);
    generateSynthesis(impactNet, gainNetPur, roi, a, sel);
}

function generateSynthesis(net, netPur, roi, a, sel) {
    const syn = document.getElementById('dynamic-synthesis');
    const etatRoi = roi >= 1 ? "montre une rentabilité positive pour la société." : "indique que l'action coûte plus qu'elle ne rapporte financièrement.";
    
    syn.innerHTML = `
        <p>Après application de la méthode contrefactuelle (déduction de l'aubaine et de la sélection), l'action génère <strong>${Math.round(net)} succès réels</strong> qui n'auraient pas eu lieu sans vous.</p>
        <p>Le gain financier net dégagé (une fois le coût de l'action remboursé) est de <strong>${Math.round(netPur).toLocaleString()} €</strong>. Avec un ROI de <strong>${roi.toFixed(2)}x</strong>, le bilan ${etatRoi}</p>
    `;
}

function updateTable(l1, g1, l2, g2, net) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = `
        <tr><td>${l1}</td><td>${g1.toLocaleString()} €</td><td><b>${Math.round(g1 * net).toLocaleString()} €</b></td></tr>
        <tr><td>${l2}</td><td>${g2.toLocaleString()} €</td><td><b>${Math.round(g2 * net).toLocaleString()} €</b></td></tr>
        <tr class="total-row"><td>TOTAL DES GAINS BRUTS CRÉÉS</td><td>-</td><td>${Math.round((g1+g2)*net).toLocaleString()} €</td></tr>
    `;
}

function renderCharts(brut, aubaine, selection, net) {
    const ctxW = document.getElementById('waterfallChart').getContext('2d');
    if (waterChart) waterChart.destroy();
    waterChart = new Chart(ctxW, {
        type: 'bar',
        data: {
            labels: ['Brut', 'Aubaine', 'Sélection', 'Impact Net'],
            datasets: [{ data: [brut, -aubaine, -selection, net], backgroundColor: ['#94a3b8', '#ef4444', '#f59e0b', '#1d4ed8'] }]
        },
        options: { plugins: { legend: { display: false } }, scales: { y: { grid: { color: '#e2e8f0' } } } }
    });

    const ctxR = document.getElementById('radarChart').getContext('2d');
    if (radarChart) radarChart.destroy();
    const rScore = parseFloat(document.getElementById('rosenberg')?.value) || 0;
    radarChart = new Chart(ctxR, {
        type: 'radar',
        data: {
            labels: ['Confiance', 'Évol. Rosenberg', 'NPS', 'Matching', 'Autonomie'],
            datasets: [{ data: [8, rScore, 7, 9, 6], borderColor: '#1d4ed8', backgroundColor: 'rgba(29, 78, 216, 0.1)', pointBackgroundColor: '#1d4ed8' }]
        },
        options: { scales: { r: { suggestedMax: 10, ticks: { display: false } } }, plugins: { legend: { display: false } } }
    });
}
window.onload = update;
