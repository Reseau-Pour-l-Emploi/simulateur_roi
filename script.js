let waterfallChart, radarChart;

// Fonction utilitaire pour récupérer la valeur d'un input
function getVal(id) {
    const el = document.getElementById(id);
    return el ? parseFloat(el.value) || 0 : 0;
}

function update() {
    // 1. Mise à jour de TOUS les labels (Span) dynamiques
    const rangeIds = ['t_act', 't_cont', 'b_aub', 'b_sel', 'b_sub', 'b_dur', 'a_sat', 'a_syn', 'a_not', 'a_eff'];
    rangeIds.forEach(id => {
        const span = document.getElementById(id + '_val');
        const input = document.getElementById(id);
        if (span && input) span.innerText = input.value;
    });

    // 2. CALCULS
    const total_cost = (getVal('tjm') * getVal('rh_jours')) + getVal('log') + getVal('aides') + getVal('presta') + getVal('form');
    const n = getVal('n');
    const t_act = getVal('t_act') / 100;
    const t_cont = getVal('t_cont') / 100;
    
    let brut = n * (t_act - t_cont);
    
    // Correction des biais
    const b_aub_val = brut * (getVal('b_aub') / 100);
    const b_sel_val = (brut - b_aub_val) * (getVal('b_sel') / 100);
    const b_sub_val = (brut - b_aub_val - b_sel_val) * (getVal('b_sub') / 100);
    const b_dur_val = (brut - b_aub_val - b_sel_val - b_sub_val) * (getVal('b_dur') / 100);
    
    let net = Math.max(0, brut - b_aub_val - b_sel_val - b_sub_val - b_dur_val);

    // 3. MISE À JOUR UI
    document.getElementById('total_cost').innerText = Math.round(total_cost).toLocaleString() + " €";
    document.getElementById('net_impact').innerText = net.toFixed(1);
    
    // 4. RENDU GRAPHIQUES
    try {
        renderWaterfall(brut, b_aub_val, b_sel_val, b_sub_val, b_dur_val, net);
        renderRadar([getVal('a_sat'), getVal('a_syn'), getVal('a_not'), getVal('a_eff')]);
    } catch (e) {
        console.error("Erreur de rendu graphique :", e);
    }
    // --- CALCULS ADDITIONNELS POUR LES GAINS ---
const g_alloc = n * t_act * 400; // Exemple : 400€ économisés par personne
const g_cotis = n * t_act * 200; // Exemple : 200€ de cotisations
const g_total_fin = g_alloc + g_cotis;
const sroi = total_cost > 0 ? (g_total_fin / total_cost).toFixed(2) : 0;

// --- MISE À JOUR DU DOM ---
document.getElementById('g_alloc').innerText = Math.round(g_alloc).toLocaleString() + " €";
document.getElementById('g_cotis').innerText = Math.round(g_cotis).toLocaleString() + " €";
document.getElementById('g_total_fin').innerText = Math.round(g_total_fin).toLocaleString() + " €";
document.getElementById('sroi').innerText = sroi + "x";

// Gains Qualitatifs (Bénéficiaires)
document.getElementById('ui_ros').innerText = getVal('q_ros') + "/40";
document.getElementById('ui_rev').innerText = "+" + getVal('q_rev').toLocaleString() + " €";
document.getElementById('ui_eff_ben').innerText = "+" + getVal('q_eff_ben') + "%";
}

// Fonction du Waterfall Chart avec données simples
function renderWaterfall(brut, aub, sel, sub, dur, net) {
    const ctx = document.getElementById('waterfallChart').getContext('2d');
    if (waterfallChart) waterfallChart.destroy();
    
    waterfallChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Brut', 'Aub', 'Sel', 'Sub', 'Dur', 'Net'],
            datasets: [{
                data: [brut, aub, sel, sub, dur, net],
                backgroundColor: ['#0ea5e9', '#ef4444', '#f97316', '#f43f5e', '#8b5cf6', '#10b981'],
                borderRadius: 4
            }]
        },
        options: { 
            responsive: true, maintainAspectRatio: false, 
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

function renderRadar(data) {
    const ctx = document.getElementById('radarChart').getContext('2d');
    if (radarChart) radarChart.destroy();
    radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Satisfaction', 'Synergie', 'Notoriété', 'Efficacité'],
            datasets: [{ 
                data: data, 
                borderColor: '#1e40af', 
                backgroundColor: 'rgba(30, 64, 175, 0.15)',
                borderWidth: 2
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { r: { min: 0, max: 100 } } }
    });
}

window.onload = update;
