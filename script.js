let waterfallChart, radarChart;

// Fonction utilitaire pour récupérer la valeur d'un input proprement
function getVal(id) {
    return parseFloat(document.getElementById(id).value) || 0;
}

function update() {
    
    // 1. MISE À JOUR VISUELLE DES CURSEURS (Le "Span Display")
    document.getElementById('t_act_val').innerText = document.getElementById('t_act').value;
    document.getElementById('t_cont_val').innerText = document.getElementById('t_cont').value;
    document.getElementById('b_aub_val').innerText = document.getElementById('b_aub').value;
    document.getElementById('b_sel_val').innerText = document.getElementById('b_sel').value;
    document.getElementById('b_sub_val').innerText = document.getElementById('b_sub').value;
    document.getElementById('b_dur_val').innerText = document.getElementById('b_dur').value;
    document.getElementById('a_sat_val').innerText = document.getElementById('a_sat').value;
    document.getElementById('a_syn_val').innerText = document.getElementById('a_syn').value;
    document.getElementById('a_not_val').innerText = document.getElementById('a_not').value;
    document.getElementById('a_eff_val').innerText = document.getElementById('a_eff').value;

    // 1. COÛTS
    const total_cost = (getVal('tjm') * getVal('rh_jours')) + 
                       getVal('log') + getVal('aides') + 
                       getVal('presta') + getVal('form');

    // 2. IMPACT NET (CALCUL SCIENTIFIQUE)
    const n = getVal('n');
    const t_act = getVal('t_act') / 100;
    const t_cont = getVal('t_cont') / 100;
    
    let brut = n * (t_act - t_cont);
    
    const b_aub = brut * (getVal('b_aub') / 100);
    const b_sel = (brut - b_aub) * (getVal('b_sel') / 100);
    const b_sub = (brut - b_aub - b_sel) * (getVal('b_sub') / 100);
    const b_dur = (brut - b_aub - b_sel - b_sub) * (getVal('b_dur') / 100);
    
    let net = Math.max(0, brut - b_aub - b_sel - b_sub - b_dur);

    // 3. GAINS FINANCIERS (Société)
    const g_alloc = net * 12500; // Base: 12.5k€ d'allocations évitées/an
    const g_cotis = net * 5800;  // Base: 5.8k€ cotisations générées/an
    const g_total = g_alloc + g_cotis;
    const sroi = total_cost > 0 ? (g_total / total_cost).toFixed(2) : 0;

    // 4. GAINS QUALITATIFS (Bénéficiaires & Acteurs)
    const rosenberg = getVal('q_ros');
    const rev = getVal('q_rev');
    const eff_ben = getVal('q_eff_ben');

    const qual_acteurs = [ getVal('a_sat'), getVal('a_syn'), getVal('a_not'), getVal('a_eff') ];

    // 5. MISE À JOUR DE L'INTERFACE UI
    document.getElementById('total_cost').innerText = Math.round(total_cost).toLocaleString() + " €";
    document.getElementById('net_impact').innerText = net.toFixed(1);
    document.getElementById('sroi').innerText = sroi + "x";
    
    document.getElementById('g_alloc').innerText = Math.round(g_alloc).toLocaleString() + " €";
    document.getElementById('g_cotis').innerText = Math.round(g_cotis).toLocaleString() + " €";
    document.getElementById('g_total_fin').innerText = Math.round(g_total).toLocaleString() + " €";

    document.getElementById('ui_ros').innerText = rosenberg + "/40";
    document.getElementById('ui_rev').innerText = "+" + rev.toLocaleString() + " €";
    document.getElementById('ui_eff_ben').innerText = "+" + eff_ben + "%";

    // Mise à jour de la synthèse textuelle
    document.getElementById('dynamic-summary').innerHTML = `
        <strong>Rapport Analytique :</strong> Sur une cohorte de <strong>${n} bénéficiaires</strong>, 
        l'investissement global de <strong>${Math.round(total_cost).toLocaleString()} €</strong> permet d'obtenir un taux d'accès à l'emploi brut de ${Math.round(t_act*100)}%. 
        L'analyse contrefactuelle corrigée isole un <strong>impact net réel de ${net.toFixed(1)} insertions additionnelles</strong> 
        après retraitement des biais d'aubaine, de sélection, de substitution et de durabilité. 
        Sur le plan qualitatif individuel, l'action génère un score de bien-être de <strong>${rosenberg}/40 (Rosenberg)</strong> et un écart de revenu de <strong>+${rev} €/mois</strong>. 
        Le SROI final s'établit à <strong>${sroi}x</strong>, démontrant une utilité sociale et financière optimisée.
    `;

    // 6. MISE À JOUR DES GRAPHIQUES
    renderWaterfall(brut, b_aub, b_sel, b_sub, b_dur, net);
    renderRadar(qual_acteurs);
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
