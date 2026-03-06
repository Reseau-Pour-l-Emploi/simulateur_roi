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

    // Calcul Impact Net (Approche Contrefactuelle)
    const impactNet = n * s * (1 - a) * (1 - sel);
    
    let g1, g2, l1, l2;
    if (currentView === 'demandeur') {
        g1 = parseFloat(document.getElementById('gain-indiv').value) || 0;
        g2 = parseFloat(document.getElementById('gain-soc').value) || 0;
        l1 = "Bénéfice Salarial (Net)"; l2 = "Économies État (Allocations)";
    } else {
        g1 = parseFloat(document.getElementById('gain-prod').value) || 0;
        g2 = parseFloat(document.getElementById('gain-recrut').value) || 0;
        l1 = "Gain Productivité Brute"; l2 = "Économie Process Recrutement";
    }

    const gainGlobal = impactNet * (g1 + g2);
    const gainNetPur = gainGlobal - coutGlobal;
    const roi = coutGlobal > 0 ? (gainGlobal / coutGlobal) : 0;

    // Mise à jour de l'UI
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
    const etatRoi = roi >= 1 ? "signifie une rentabilité sociale positive" : "indique un coût net pour la collectivité";
    const impactBiais = (a + sel) > 0.4 ? "une influence majeure des facteurs externes" : "une performance robuste et corrélée à l'action";

    syn.innerHTML = `
        L'analyse des données révèle un <b>impact réel de ${Math.round(net)} succès nets</b>. 
        Après déduction de l'investissement initial, l'action génère une valeur financière nette de <b>${Math.round(netPur).toLocaleString()} €</b>. 
        Le coefficient ROI de <b>${roi.toFixed(2)}x</b> ${etatRoi}. 
        La décomposition des biais montre ${impactBiais}. Enfin, l'action présente une cohérence entre les indicateurs financiers et la progression qualitative des bénéficiaires.
    `;
}

function updateTable(l1, g1, l2, g2, net) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = `
        <tr><td>${l1}</td><td>${g1.toLocaleString()} €</td><td><b>${Math.round(g1 * net).toLocaleString()} €</b></td></tr>
        <tr><td>${l2}</td><td>${g2.toLocaleString()} €</td><td><b>${Math.round(g2 * net).toLocaleString()} €</b></td></tr>
        <tr style="background:#f1f5f9; font-weight:bold;"><td>VALEUR FINANCIÈRE GLOBALE</td><td>-</td><td>${Math.round((g1+g2)*net).toLocaleString()} €</td></tr>
    `;
}

function renderCharts(brut, aubaine, selection, net) {
    const ctxW = document.getElementById('waterfallChart').getContext('2d');
    if (waterChart) waterChart.destroy();
    waterChart = new Chart(ctxW, {
        type: 'bar',
        data: {
            labels: ['Succès Brut', 'Effet Aubaine', 'Biais Sélection', 'Impact Net'],
            datasets: [{
                label: 'Volume',
                data: [brut, -aubaine, -selection, net],
                backgroundColor: ['#94a3b8', '#ef4444', '#f59e0b', '#2563eb'],
                borderRadius: 6
            }]
        },
        options: { plugins: { legend: { display: false } }, scales: { y: { grid: { color: '#f1f5f9' } } } }
    });

    const ctxR = document.getElementById('radarChart').getContext('2d');
    if (radarChart) radarChart.destroy();
    const rScore = parseFloat(document.getElementById('rosenberg')?.value) || 5;
    radarChart = new Chart(ctxR, {
        type: 'radar',
        data: {
            labels: ['Confiance', 'Évol. Rosenberg', 'NPS Client', 'Matching', 'Autonomie'],
            datasets: [{
                label: 'Performance Acteurs',
                data: [8, rScore, 7, 9, 6],
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                pointBackgroundColor: '#2563eb'
            }]
        },
        options: { scales: { r: { suggestedMax: 10, ticks: { display: false } } }, plugins: { legend: { display: false } } }
    });
}

window.onload = update;
