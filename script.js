let currentView = 'demandeur';
function setView(view) {
    currentView = view;
    document.getElementById('fields-demandeur').style.display = view === 'demandeur' ? 'block' : 'none';
    document.getElementById('fields-entreprise').style.display = view === 'entreprise' ? 'block' : 'none';
    document.getElementById('btn-demandeur').className = view === 'demandeur' ? 'active' : '';
    document.getElementById('btn-entreprise').className = view === 'entreprise' ? 'active' : '';
    update();
}

function update() {
    let n = parseFloat(document.getElementById('n').value);
    let s = parseFloat(document.getElementById('s').value) / 100;
    let a = parseFloat(document.getElementById('a').value) / 100;
    let sel = parseFloat(document.getElementById('sel').value) / 100;
    let impactNet = n * s * (1 - a) * (1 - sel);
    
    let totalGain = 0;
    if (currentView === 'demandeur') {
        totalGain = impactNet * (parseFloat(document.getElementById('gain-indiv').value) + parseFloat(document.getElementById('gain-soc').value));
    } else {
        totalGain = impactNet * (parseFloat(document.getElementById('gain-prod').value) + parseFloat(document.getElementById('gain-recrut').value));
    }
    
    document.getElementById('net').innerText = Math.round(impactNet);
    document.getElementById('gain-financier').innerText = totalGain.toLocaleString() + " €";
    document.getElementById('roi').innerText = (totalGain / 25000).toFixed(2) + "x";
}
window.onload = update;
