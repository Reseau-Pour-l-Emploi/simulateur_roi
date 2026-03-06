let waterfallChart, radarChart;

function update() {
    // 1. Calculs des coûts
    const total_cost = (parseFloat(document.getElementById('tjm').value) * parseFloat(document.getElementById('rh_jours').value)) +
                       parseFloat(document.getElementById('log').value) + parseFloat(document.getElementById('aides').value);

    // 2. Calcul Impact Net
    const n = parseFloat(document.getElementById('n').value);
    const brut = n * (parseFloat(document.getElementById('t_act').value)/100 - parseFloat(document.getElementById('t_cont').value)/100);
    
    const b_aub = brut * (parseFloat(document.getElementById('b_aub').value)/100);
    const b_sel = (brut - b_aub) * (parseFloat(document.getElementById('b_sel').value)/100);
    const b_sub = (brut - b_aub - b_sel) * (parseFloat(document.getElementById('b_sub').value)/100);
    const b_dur = (brut - b_aub - b_sel - b_sub) * (parseFloat(document.getElementById('b_dur').value)/100);
    const net = brut - b_aub - b_sel - b_sub - b_dur;

    // 3. Gains & ROI
    const g_total = net * 18000; // 18k€ gain moyen société
    document.getElementById('total_cost').innerText = Math.round(total_cost).toLocaleString() + " €";
    document.getElementById('net_impact').innerText = net.toFixed(1);
    document.getElementById('sroi').innerText = (total_cost > 0 ? g_total / total_cost : 0).toFixed(2) + "x";

    renderWaterfall(brut, b_aub, b_sel, b_sub, b_dur, net);
}

function renderWaterfall(brut, b_aub, b_sel, b_sub, b_dur, net) {
    const ctx = document.getElementById('waterfallChart').getContext('2d');
    if (waterfallChart) waterfallChart.destroy();

    // Construction des "Floating Bars" [début, fin]
    waterfallChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Brut', 'Aubaine', 'Sélection', 'Subst.', 'Durab.', 'Impact NET'],
            datasets: [{
                data: [
                    [0, brut], 
                    [brut, brut - b_aub], 
                    [brut - b_aub, brut - b_aub - b_sel],
                    [brut - b_aub - b_sel, brut - b_aub - b_sel - b_sub],
                    [brut - b_aub - b_sel - b_sub, net],
                    [0, net]
                ],
                backgroundColor: ['#2563eb', '#ef4444', '#ef4444', '#ef4444', '#ef4444', '#10b981']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

window.onload = update;
