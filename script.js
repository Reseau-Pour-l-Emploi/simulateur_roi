let waterfallChart, radarChart;

function update() {
    // 1. Calcul des Coûts
    const tjm = parseFloat(document.getElementById('tjm').value);
    const rh_jours = parseFloat(document.getElementById('rh_jours').value);
    const total_cost = (tjm * rh_jours) + 
                       parseFloat(document.getElementById('logistique').value) +
                       parseFloat(document.getElementById('aides').value) +
                       parseFloat(document.getElementById('presta').value) +
                       parseFloat(document.getElementById('form').value);

    // 2. Calcul de l'Impact Net
    const n = parseFloat(document.getElementById('n').value);
    const tx_act = parseFloat(document.getElementById('taux_act').value) / 100;
    const tx_cont = parseFloat(document.getElementById('taux_cont').value) / 100;
    
    // Impact Brut : Différence entre action et contrefactuel
    let impact_brut = n * (tx_act - tx_cont);
    
    // Application séquentielle des biais
    const aubaine = parseFloat(document.getElementById('b_aub').value) / 100;
    const selection = parseFloat(document.getElementById('b_sel').value) / 100;
    const substitution = parseFloat(document.getElementById('b_sub').value) / 100;
    const durabilite = parseFloat(document.getElementById('b_dur').value) / 100;

    let apres_aubaine = impact_brut * (1 - aubaine);
    let apres_selection = apres_aubaine * (1 - selection);
    let apres_substitution = apres_selection * (1 - substitution);
    let impact_net = apres_substitution * (1 - durabilite);

    // 3. Calcul du SROI (Exemple : Gain moyen société 15k€/an/personne)
    const gain_soc_unitaire = 15000;
    const total_gain = impact_net * gain_soc_unitaire;
    const sroi = total_cost > 0 ? (total_gain / total_cost).toFixed(2) : 0;

    // 4. Rosenberg & Qualitatif (Simulé sur les entrées)
    const score_r = Math.round(25 + (tx_act * 10)); // Score sur 40

    // Mise à jour UI
    document.getElementById('total_cost').innerText = total_cost.toLocaleString() + " €";
    document.getElementById('net_impact').innerText = Math.max(0, impact_net.toFixed(1));
    document.getElementById('sroi').innerText = sroi + "x";
    document.getElementById('gain_rev').innerText = (impact_net * 450).toLocaleString() + " €/mois";
    document.getElementById('score_ros').innerText = score_r + "/40";

    updateCharts(impact_brut, aubaine, selection, substitution, durabilite, impact_net);
}

function updateCharts(brut, aub, sel, sub, dur, net) {
    const ctxW = document.getElementById('waterfallChart').getContext('2d');
    if(waterfallChart) waterfallChart.destroy();
    
    waterfallChart = new Chart(ctxW, {
        type: 'bar',
        data: {
            labels: ['Brut', 'Aubaine', 'Sélection', 'Subst.', 'Durab.', 'NET'],
            datasets: [{
                label: 'Individus',
                data: [brut, -(brut*aub), -(brut*sel), -(brut*sub), -(brut*dur), net],
                backgroundColor: ['#22d3ee', '#ef4444', '#ef4444', '#ef4444', '#ef4444', '#10b981']
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    const ctxR = document.getElementById('radarChart').getContext('2d');
    if(radarChart) radarChart.destroy();
    radarChart = new Chart(ctxR, {
        type: 'radar',
        data: {
            labels: ['ROI Financier', 'Bien-être (Rosenberg)', 'Synergie Acteurs', 'Notoriété', 'Sentiment Efficacité'],
            datasets: [{
                label: 'Performance Actuelle',
                data: [80, 75, 60, 45, 70],
                borderColor: '#fbbf24', backgroundColor: 'rgba(251, 191, 36, 0.2)'
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

window.onload = update;
