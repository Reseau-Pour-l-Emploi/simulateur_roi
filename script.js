let waterfallChart, radarChart;

// Fonction utilitaire pour récupérer la valeur d'un input proprement
function getVal(id) {
    return parseFloat(document.getElementById(id).value) || 0;
}

function update() {
    // A. Mise à jour de TOUS les labels (Span)
    // Cette liste doit correspondre exactement aux IDs de vos <span id="...">
    const rangeIds = ['t_act', 't_cont', 'b_aub', 'b_sel', 'b_sub', 'b_dur', 'a_sat', 'a_syn', 'a_not', 'a_eff'];
    
    rangeIds.forEach(id => {
        const span = document.getElementById(id + '_val');
        const input = document.getElementById(id);
        if (span && input) span.innerText = input.value;
    });

    // B. CALCULS
    const total_cost = (getVal('tjm') * getVal('rh_jours')) + getVal('log') + getVal('aides') + getVal('presta') + getVal('form');
    const n = getVal('n');
    const t_act = getVal('t_act') / 100;
    const t_cont = getVal('t_cont') / 100;
    let brut = n * (t_act - t_cont);
    
    // Correction des biais
    const b_aub = brut * (getVal('b_aub') / 100);
    const b_sel = (brut - b_aub) * (getVal('b_sel') / 100);
    const b_sub = (brut - b_aub - b_sel) * (getVal('b_sub') / 100);
    const b_dur = (brut - b_aub - b_sel - b_sub) * (getVal('b_dur') / 100);
    let net = Math.max(0, brut - b_aub - b_sel - b_sub - b_dur);

    // C. MISE À JOUR UI
    document.getElementById('total_cost').innerText = Math.round(total_cost).toLocaleString() + " €";
    document.getElementById('net_impact').innerText = net.toFixed(1);
    
    // D. RENDU GRAPHIQUES (Si erreur ici, le script s'arrête)
    try {
        renderWaterfall(brut, b_aub, b_sel, b_sub, b_dur, net);
        renderRadar([getVal('a_sat'), getVal('a_syn'), getVal('a_not'), getVal('a_eff')]);
    } catch (e) {
        console.error("Erreur graphique :", e);
    }
}
function updateRangeVal(id, val) {
    document.getElementById(id).innerText = val;
}
// Fonction du Waterfall Chart avec des barres flottantes (Floating Bars)
function renderWaterfall(brut, aub, sel, sub, dur, net) {
    const ctx = document.getElementById('waterfallChart').getContext('2d');
    if (waterfallChart) waterfallChart.destroy();
    
    // Logique mathématique pour empiler les barres vers le bas
    const y1 = brut;
    const y2 = y1 - aub;
    const y3 = y2 - sel;
    const y4 = y3 - sub;
    const y5 = y4 - dur;

    waterfallChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Brut', 'Aubaine', 'Sélection', 'Substitution', 'Durabilité', 'Impact NET'],
            datasets: [{
                // Chart.js format pour floating bars: [min, max]
                data: [
                    [0, y1],       // Brut
                    [y2, y1],      // Aubaine
                    [y3, y2],      // Sélection
                    [y4, y3],      // Substitution
                    [y5, y4],      // Durabilité
                    [0, net]       // Net
                ],
                backgroundColor: ['#0ea5e9', '#ef4444', '#f97316', '#f43f5e', '#8b5cf6', '#10b981'],
                borderRadius: 4
            }]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false, 
            plugins: { 
                legend: { display: false },
                tooltip: { callbacks: { label: (ctx) => 'Personnes : ' + (ctx.raw[1] - ctx.raw[0]).toFixed(1) } }
            },
            scales: { y: { beginAtZero: true } }
        }
    });
}

// Fonction du Radar Chart
function renderRadar(data) {
    const ctx = document.getElementById('radarChart').getContext('2d');
    if (radarChart) radarChart.destroy();
    radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Satisfaction Clients', 'Synergie Acteurs', 'Notoriété Dispositif', 'Efficacité Équipe'],
            datasets: [{ 
                label: 'Score Qualitatif (%)', 
                data: data, 
                borderColor: '#1e40af', 
                backgroundColor: 'rgba(30, 64, 175, 0.15)',
                pointBackgroundColor: '#1e40af',
                borderWidth: 2
            }]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false, 
            scales: { r: { min: 0, max: 100, ticks: { stepSize: 20 } } },
            plugins: { legend: { display: false } }
        }
    });
}

// Initialisation au chargement
window.onload = update;
