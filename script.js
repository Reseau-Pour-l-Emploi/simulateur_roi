let waterfallChart, radarChart;

function update() {
    // 1. CALCUL DES COÛTS
    const tjm = parseFloat(document.getElementById('tjm').value);
    const rh_jours = parseFloat(document.getElementById('rh_jours').value);
    const cout_rh = tjm * rh_jours;
    const total_cost = cout_rh + 
                       parseFloat(document.getElementById('logistique').value) +
                       parseFloat(document.getElementById('aides').value) +
                       parseFloat(document.getElementById('presta').value) +
                       parseFloat(document.getElementById('form').value);

    // 2. CALCUL DE L'IMPACT NET (Logique Contrefactuelle + Biais)
    const n = parseFloat(document.getElementById('n').value);
    const tx_act = parseFloat(document.getElementById('taux_act').value) / 100;
    const tx_cont = parseFloat(document.getElementById('taux_cont').value) / 100;
    
    // Impact Brut (Additionnalité brute)
    let impact_brut = n * (tx_act - tx_cont);
    
    // Application séquentielle des biais de rigueur
    const aub = parseFloat(document.getElementById('b_aub').value) / 100;
    const sel = parseFloat(document.getElementById('b_sel').value) / 100;
    const sub = parseFloat(document.getElementById('b_sub').value) / 100;
    const dur = parseFloat(document.getElementById('b_dur').value) / 100;

    let apres_aubaine = impact_brut * (1 - aub);
    let apres_selection = apres_aubaine * (1 - sel);
    let apres_substitution = apres_selection * (1 - sub);
    let impact_net = apres_substitution * (1 - dur);

    // 3. CALCUL DES GAINS FINANCIERS (Société)
    const gain_alloc_moyen = 12000; // Moyenne annuelle
    const gain_cotis_moyen = 6000;
    const total_alloc = impact_net * gain_alloc_moyen;
    const total_cotis = impact_net * gain_cotis_moyen;
    const total_gain_fin = total_alloc + total_cotis;

    // 4. CALCUL SROI
    const sroi = total_cost > 0 ? (total_gain_fin / total_cost).toFixed(2) : 0;

    // 5. MISE À JOUR DE L'INTERFACE
    document.getElementById('total_cost').innerText = Math.round(total_cost).toLocaleString() + " €";
    document.getElementById('net_impact').innerText = Math.max(0, impact_net).toFixed(1);
    document.getElementById('sroi').innerText = sroi + "x";
    
    document.getElementById('g_alloc').innerText = Math.round(total_alloc).toLocaleString() + " €";
    document.getElementById('g_cotis').innerText = Math.round(total_cotis).toLocaleString() + " €";
    document.getElementById('g_total_fin').innerText = Math.round(total_gain_fin).toLocaleString() + " €";
    document.getElementById('g_diff_rev').innerText = "+" + Math.round(impact_net * 550).toLocaleString() + " €";

    renderCharts(impact_brut, aub, sel, sub, dur, impact_net);
}

function renderCharts(brut, aub, sel, sub, dur, net) {
    const ctxW = document.getElementById('waterfallChart').getContext('2d');
    if(waterfallChart) waterfallChart.destroy();
    waterfallChart = new Chart(ctxW, {
        type: 'bar',
        data: {
            labels: ['Brut', 'Aubaine', 'Sélection', 'Substitution', 'Durabilité', 'NET'],
            datasets: [{
                data: [brut, -(brut*aub), -(brut*sel), -(brut*sub), -(brut*dur), net],
                backgroundColor: ['#0ea5e9', '#ef4444', '#f59e0b', '#f43f5e', '#8b5cf6', '#10b981']
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: {display: false} } }
    });

    const ctxR = document.getElementById('radarChart').getContext('2d');
    if(radarChart) radarChart.destroy();
    radarChart = new Chart(ctxR, {
        type: 'radar',
        data: {
            labels: ['SROI', 'Bien-être', 'Synergie', 'Notoriété', 'Efficacité'],
            datasets: [{
                label: 'Performance',
                data: [85, 70, 65, 50, 80],
                borderColor: '#1e40af', backgroundColor: 'rgba(30, 64, 175, 0.2)'
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

window.onload = update;
