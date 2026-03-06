let waterChart, radarChart;

function update() {
    // 1. Données de Base
    const n = parseFloat(document.getElementById('n').value) || 0;
    const t_action = parseFloat(document.getElementById('t_action').value) / 100;
    const t_contre = parseFloat(document.getElementById('t_contre').value) / 100;
    const coutGlobal = parseFloat(document.getElementById('cout-global').value) || 0;

    // 2. Biais Correctifs
    const b_sel = parseFloat(document.getElementById('b_sel').value) / 100;
    const e_sub = parseFloat(document.getElementById('e_sub').value) / 100;
    const b_dur = parseFloat(document.getElementById('b_dur').value) / 100;
    const e_aub = parseFloat(document.getElementById('e_aub').value) / 100;

    // 3 & 4. Gains Financiers
    const g_alloc = parseFloat(document.getElementById('g_alloc').value) || 0;
    const g_cotis = parseFloat(document.getElementById('g_cotis').value) || 0;
    const g_ecart = parseFloat(document.getElementById('g_ecart').value) || 0;

    // Calcul de l'Impact Net
    const succes_brut = n * t_action;
    const succes_contre = n * t_contre;
    
    // Le gain de base est la différence entre l'action et le contrefactuel
    let base_impact = Math.max(0, succes_brut - succes_contre);

    // Application stricte de la cascade des biais
    const impactNet = base_impact * (1 - b_sel) * (1 - e_sub) * (1 - b_dur) * (1 - e_aub);

    // Calculs économiques
    const gain_societe_unitaire = g_alloc + g_cotis;
    const gain_societe_total = impactNet * gain_societe_unitaire;
    const gain_benef_total = impactNet * g_ecart;

    const gainNetPur = gain_societe_total - coutGlobal;
    const roi = coutGlobal > 0 ? (gain_societe_total / coutGlobal) : 0;

    // Mise à jour de l'UI
    document.getElementById('net').innerText = Math.round(impactNet);
    document.getElementById('gain-global').innerText = Math.round(gain_societe_total).toLocaleString() + " €";
    document.getElementById('gain-net-pur').innerText = Math.round(gainNetPur).toLocaleString() + " €";
    document.getElementById('roi').innerText = roi.toFixed(2) + "x";

    updateTable(g_alloc, g_cotis, g_ecart, impactNet, gain_societe_total);
    renderCharts(succes_brut, succes_contre, b_sel, e_sub, b_dur, e_aub, base_impact, impactNet);
    generateSynthesis(impactNet, gainNetPur, roi);
}

function updateTable(alloc, cotis, ecart, net, gain_societe_total) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = `
        <tr><td>🏛️ Société : Réduction Allocations</td><td>${alloc.toLocaleString()} €</td><td>${Math.round(alloc * net).toLocaleString()} €</td></tr>
        <tr><td>🏛️ Société : Cotisations Salariales</td><td>${cotis.toLocaleString()} €</td><td>${Math.round(cotis * net).toLocaleString()} €</td></tr>
        <tr class="total-row"><td>TOTAL GAINS SOCIÉTÉ (Sert au calcul du ROI)</td><td>${(alloc + cotis).toLocaleString()} €</td><td>${Math.round(gain_societe_total).toLocaleString()} €</td></tr>
        <tr><td colspan="3" style="background:#f8fafc; height:10px; padding:0;"></td></tr>
        <tr><td>👤 Bénéficiaire : Écart de revenus (Salaire - Alloc)</td><td>${ecart.toLocaleString()} €</td><td><b>${Math.round(ecart * net).toLocaleString()} €</b></td></tr>
    `;
}

function renderCharts(brut, contre, b_sel, e_sub, b_dur, e_aub, base_impact, net) {
    const ctxW = document.getElementById('waterfallChart').getContext('2d');
    if (waterChart) waterChart.destroy();
    
    // Décomposition pour le graphique
    const val_sel = base_impact * b_sel;
    const val_sub = (base_impact - val_sel) * e_sub;
    const val_dur = (base_impact - val_sel - val_sub) * b_dur;
    const val_aub = (base_impact - val_sel - val_sub - val_dur) * e_aub;

    waterChart = new Chart(ctxW, {
        type: 'bar',
        data: {
            labels: ['Brut Action', 'Contrefactuel', 'Sélection', 'Substitution', 'Durabilité', 'Aubaine', 'Impact Net'],
            datasets: [{ 
                data: [brut, -contre, -val_sel, -val_sub, -val_dur, -val_aub, net], 
                backgroundColor: ['#94a3b8', '#64748b', '#ef4444', '#f97316', '#eab308', '#f59e0b', '#1d4ed8'] 
            }]
        },
        options: { plugins: { legend: { display: false } }, scales: { y: { grid: { color: '#e2e8f0' } } } }
    });

    const ctxR = document.getElementById('radarChart').getContext('2d');
    if (radarChart) radarChart.destroy();
    
    // Récupération des valeurs qualitatives
    const q1 = parseFloat(document.getElementById('q_bienetre').value) || 0;
    const q2 = parseFloat(document.getElementById('q_sat').value) || 0;
    const q3 = parseFloat(document.getElementById('q_syn').value) || 0;
    const q4 = parseFloat(document.getElementById('q_not').value) || 0;
    const q5 = parseFloat(document.getElementById('q_eff').value) || 0;

    radarChart = new Chart(ctxR, {
        type: 'radar',
        data: {
            labels: ['Bien-être Bénéficiaire', 'Satisfaction Clients', 'Synergie Acteurs', 'Notoriété', 'Sentiment Efficacité'],
            datasets: [{ 
                data: [q1, q2, q3, q4, q5], 
                borderColor: '#1d4ed8', 
                backgroundColor: 'rgba(29, 78, 216, 0.2)', 
                pointBackgroundColor: '#1d4ed8' 
            }]
        },
        options: { scales: { r: { suggestedMax: 10, ticks: { display: false } } }, plugins: { legend: { display: false } } }
    });
}

function generateSynthesis(net, netPur, roi) {
    const syn = document.getElementById('dynamic-synthesis');
    const verdict = roi >= 1 ? "La rentabilité sociale de l'action est positive" : "L'action représente un coût net pour la société";
    
    syn.innerHTML = `
        <p>En confrontant le taux de succès de l'action à celui du groupe contrefactuel, puis en déduisant rigoureusement les 4 biais (Sélection, Substitution, Durabilité, Aubaine), l'impact réel et exclusif de l'action s'établit à <strong>${Math.round(net)} bénéficiaires insérés</strong>.</p>
        <p>D'un point de vue systémique, ${verdict} avec un ROI de <strong>${roi.toFixed(2)}x</strong>. Le gain monétaire net pour la société s'élève à <strong>${Math.round(netPur).toLocaleString()} €</strong> après absorption des coûts opérationnels.</p>
        <p>Sur le plan qualitatif, le modèle atteste d'une amélioration globale du bien-être des bénéficiaires et d'un renforcement de la performance des acteurs de l'insertion.</p>
    `;
}

window.onload = update;
