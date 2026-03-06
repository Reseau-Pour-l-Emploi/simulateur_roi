let waterfallChart, radarChart;

function update() {
    // 1. COÛTS COMPLETS
    const tjm = parseFloat(document.getElementById('tjm').value) || 0;
    const rh = parseFloat(document.getElementById('rh_jours').value) || 0;
    const log = parseFloat(document.getElementById('log').value) || 0;
    const aides = parseFloat(document.getElementById('aides').value) || 0;
    const presta = parseFloat(document.getElementById('presta').value) || 0;
    const form = parseFloat(document.getElementById('form').value) || 0;
    const total_cost = (tjm * rh) + log + aides + presta + form;

    // 2. IMPACT NET
    const n = parseFloat(document.getElementById('n').value) || 0;
    const t_act = parseFloat(document.getElementById('t_act').value) / 100;
    const t_cont = parseFloat(document.getElementById('t_cont').value) / 100;
    
    let brut = n * (t_act - t_cont);
    const b_aub = brut * (parseFloat(document.getElementById('b_aub').value) / 100);
    const b_sel = (brut - b_aub) * (parseFloat(document.getElementById('b_sel').value) / 100);
    const b_sub = (brut - b_aub - b_sel) * (parseFloat(document.getElementById('b_sub').value) / 100);
    const b_dur = (brut - b_aub - b_sel - b_sub) * (parseFloat(document.getElementById('b_dur').value) / 100);
    let net = Math.max(0, brut - b_aub - b_sel - b_sub - b_dur);

    // 3. GAINS & SROI
    const g_alloc = net * 12500;
    const g_cotis = net * 5800;
    const g_total = g_alloc + g_cotis;
    const sroi = total_cost > 0 ? (g_total / total_cost).toFixed(2) : 0;

    // 4. QUALITATIF ACTEURS
    const q_data = [
        document.getElementById('q_sat').value,
        document.getElementById('q_syn').value,
        document.getElementById('q_not').value,
        document.getElementById('q_eff').value
    ];

    // 5. AFFICHAGE
    document.getElementById('total_cost').innerText = Math.round(total_cost).toLocaleString() + " €";
    document.getElementById('net_impact').innerText = net.toFixed(1);
    document.getElementById('sroi').innerText = sroi + "x";
    document.getElementById('g_alloc').innerText = Math.round(g_alloc).toLocaleString() + " €";
    document.getElementById('g_cotis').innerText = Math.round(g_cotis).toLocaleString() + " €";
    document.getElementById('g_total_fin').innerText = Math.round(g_total).toLocaleString() + " €";
    document.getElementById('eff_display').innerText = "+" + document.getElementById('q_eff').value + "%";

    generateSummary(n, t_act, net, total_cost, sroi, q_data);
    renderWaterfall(brut, b_aub, b_sel, b_sub, b_dur, net);
    renderRadar(q_data);
}

function generateSummary(n, tact, net, cost, sroi, qual) {
    const text = `Pour <strong>${n} bénéficiaires</strong>, l'action présente un coût total de <strong>${Math.round(cost).toLocaleString()} €</strong>. 
    Malgré un taux d'accès brut de ${Math.round(tact*100)}%, l'analyse scientifique révèle un <strong>impact net réel de ${net.toFixed(1)} personnes</strong> 
    après correction des biais (aubaine, sélection, substitution). Cette performance génère un <strong>SROI de ${sroi}x</strong>, soit ${sroi} € de valeur sociale 
    créée pour chaque euro investi. Côté acteurs, on note une synergie de ${qual[1]}% et un sentiment d'efficacité renforcé à ${qual[3]}%.`;
    document.getElementById('dynamic-summary').innerHTML = text;
}

function renderWaterfall(brut, aub, sel, sub, dur, net) {
    const ctx = document.getElementById('waterfallChart').getContext('2d');
    if (waterfallChart) waterfallChart.destroy();
    waterfallChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Brut', 'Aubaine', 'Sélection', 'Subst.', 'Durab.', 'NET'],
            datasets: [{
                data: [[0, brut], [brut, brut-aub], [brut-aub, brut-aub-sel], [brut-aub-sel, brut-aub-sel-sub], [brut-aub-sel-sub, net], [0, net]],
                backgroundColor: ['#1e40af', '#ef4444', '#f59e0b', '#f43f5e', '#8b5cf6', '#10b981']
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
}

function renderRadar(data) {
    const ctx = document.getElementById('radarChart').getContext('2d');
    if (radarChart) radarChart.destroy();
    radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Satisfaction', 'Synergie', 'Notoriété', 'Efficacité'],
            datasets: [{ label: 'Score %', data: data, borderColor: '#1e40af', backgroundColor: 'rgba(30,64,175,0.1)' }]
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { r: { min: 0, max: 100 } } }
    });
}

window.onload = update;
