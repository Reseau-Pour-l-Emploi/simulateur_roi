let appMode = 'DE';
let myChart;
let currentLabels = [];

function switchMode(mode) {
    appMode = mode;
    const mainTitle = document.getElementById('main-title');
    const gainTitle = document.getElementById('gain-title');
    const containerGains = document.getElementById('dynamic-inputs');
    const sliderContainer = document.getElementById('radar-sliders');
    const btnDE = document.getElementById('btn-de');
    const btnENT = document.getElementById('btn-ent');

    if(mode === 'DE') {
        mainTitle.innerText = "ROI lié au placement des demandeurs d'emploi";
        gainTitle.innerText = "Gains pour la Société";
        btnDE.className = "text-xs font-bold px-4 py-2 rounded-full border-2 border-blue-600 bg-blue-600 text-white transition";
        btnENT.className = "text-xs font-bold px-4 py-2 rounded-full border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 transition";
        
        containerGains.innerHTML = `
            <div class="input-group"><label>Mois d'allocations évités</label><input type="number" id="g_1" value="12" oninput="calculate()"></div>
            <div class="input-group"><label>Montant mensuel moyen (€)</label><input type="number" id="g_2" value="1200" oninput="calculate()"></div>
            <div class="input-group"><label>Cotisations générées (€)</label><input type="number" id="g_3" value="4500" oninput="calculate()"></div>`;
        
        currentLabels = ['Satisfaction', 'Sentiment d’Efficacité', 'Collaboration', 'Inclusion'];
        sliderContainer.innerHTML = `
            ${renderSlider(1, "Satisfaction", 85)}
            ${renderSlider(2, "Sentiment d’Efficacité", 75)}
            ${renderSlider(3, "Collaboration", 80)}
            ${renderSlider(4, "Inclusion", 70)}`;
    } else {
        mainTitle.innerText = "ROI lié à l'aide au recrutement des entreprises";
        gainTitle.innerText = "Gains pour l'Entreprise";
        btnENT.className = "text-xs font-bold px-4 py-2 rounded-full border-2 border-emerald-600 bg-emerald-600 text-white transition";
        btnDE.className = "text-xs font-bold px-4 py-2 rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition";
        
        containerGains.innerHTML = `
            <div class="input-group"><label>Recrutement raté évité (€)</label><input type="number" id="g_1" value="6000" oninput="calculate()"></div>
            <div class="input-group"><label>Gain de Productivité (€)</label><input type="number" id="g_2" value="15000" oninput="calculate()"></div>
            <div class="input-group"><label>Économie de sourcing (€)</label><input type="number" id="g_3" value="2500" oninput="calculate()"></div>`;
        
        currentLabels = ['Satisfaction', 'Sentiment d’Efficacité', 'Collaboration', 'Part de marché'];
        sliderContainer.innerHTML = `
            ${renderSlider(1, "Satisfaction", 80)}
            ${renderSlider(2, "Sentiment d’Efficacité", 70)}
            ${renderSlider(3, "Collaboration", 85)}
            ${renderSlider(4, "Part de marché", 60)}`;
    }
    calculate();
}

function renderSlider(id, label, value) {
    return `
    <div class="flex items-center justify-between">
        <label class="text-[9px] font-bold text-slate-500 uppercase">${label}</label>
        <input type="range" id="im_${id}" value="${value}" class="w-1/2 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" oninput="calculate()">
    </div>`;
}

function calculate() {
    const nbBenef = Number(document.getElementById('nb_benef').value) || 0;
    const tjm = Number(document.getElementById('tjm_val').value) || 0;

    const totalCosts = (Number(document.getElementById('c_rh').value) * tjm) +
                       Number(document.getElementById('c_log').value) +
                       Number(document.getElementById('c_aides').value) +
                       Number(document.getElementById('c_prest').value) +
                       Number(document.getElementById('c_form').value);

    let unitGains = 0;
    let detailTxt = "";

    if(appMode === 'DE') {
        const alloc = (Number(document.getElementById('g_1').value) * Number(document.getElementById('g_2').value));
        const cotis = Number(document.getElementById('g_3').value);
        unitGains = alloc + cotis;
        detailTxt = `Un placement génère <strong>${unitGains.toLocaleString()}€</strong>. Pour <strong>${nbBenef}</strong> bénéficiaires, le gain brut total est de <strong>${(unitGains * nbBenef).toLocaleString()}€</strong>.`;
    } else {
        unitGains = Number(document.getElementById('g_1').value) + Number(document.getElementById('g_2').value) + Number(document.getElementById('g_3').value);
        detailTxt = `Une aide au recrutement génère <strong>${unitGains.toLocaleString()}€</strong>. Pour <strong>${nbBenef}</strong> entreprises, le gain brut est de <strong>${(unitGains * nbBenef).toLocaleString()}€</strong>.`;
    }

    const totalGainsBruts = unitGains * nbBenef;
    const net = totalGainsBruts - totalCosts;
    const roi = totalCosts > 0 ? (net / totalCosts) * 100 : 0;

    document.getElementById('roi-display').innerText = Math.round(roi) + "%";
    document.getElementById('roi-display').style.color = roi >= 0 ? "#10b981" : "#ef4444";
    document.getElementById('net-display').innerText = net.toLocaleString() + " € Gain Net Total";
    document.getElementById('total-costs-display').innerText = totalCosts.toLocaleString() + " €";
    document.getElementById('total-gains-display').innerText = totalGainsBruts.toLocaleString() + " €";
    document.getElementById('explanation-text').innerHTML = detailTxt;

    updateChart();
}

function updateChart() {
    const ctx = document.getElementById('radarChart').getContext('2d');
    const dataVals = [
        document.getElementById('im_1').value,
        document.getElementById('im_2').value,
        document.getElementById('im_3').value,
        document.getElementById('im_4').value
    ];

    if (myChart) myChart.destroy();
    myChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: currentLabels,
            datasets: [{
                data: dataVals,
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderColor: '#3b82f6',
                borderWidth: 3,
                pointRadius: 4,
                pointBackgroundColor: '#3b82f6'
            }]
        },
        options: {
            animation: false, // Désactivé pour garantir la capture PDF immédiate
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    min: 0, max: 100,
                    ticks: { display: false },
                    pointLabels: { font: { size: 10, weight: '900', family: 'Inter' }, color: '#64748b' }
                }
            },
            plugins: { legend: { display: false } }
        }
    });
}

window.onload = () => switchMode('DE');
