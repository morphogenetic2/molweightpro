const PTABLE = {
    "H": 1.008, "He": 4.0026, "Li": 6.94, "Be": 9.0122, "B": 10.81, "C": 12.011, "N": 14.007, "O": 15.999, "F": 18.998, "Ne": 20.180,
    "Na": 22.990, "Mg": 24.305, "Al": 26.982, "Si": 28.085, "P": 30.974, "S": 32.06, "Cl": 35.45, "Ar": 39.948, "K": 39.098, "Ca": 40.078,
    "Sc": 44.956, "Ti": 47.867, "V": 50.942, "Cr": 51.996, "Mn": 54.938, "Fe": 55.845, "Co": 58.933, "Ni": 58.693, "Cu": 63.546, "Zn": 65.38,
    "Ga": 69.723, "Ge": 72.63, "As": 74.922, "Se": 78.971, "Br": 79.904, "Kr": 83.798, "Rb": 85.468, "Sr": 87.62, "Y": 88.906, "Zr": 91.224,
    "Nb": 92.906, "Mo": 95.95, "Tc": 98, "Ru": 101.07, "Rh": 102.91, "Pd": 106.42, "Ag": 107.87, "Cd": 112.41, "In": 114.82, "Sn": 118.71,
    "Sb": 121.76, "Te": 127.60, "I": 126.90, "Xe": 131.29, "Cs": 132.91, "Ba": 137.33, "La": 138.91, "Ce": 140.12, "Pr": 140.91, "Nd": 144.24,
    "Pm": 145, "Sm": 150.36, "Eu": 151.96, "Gd": 157.25, "Tb": 158.93, "Dy": 162.50, "Ho": 164.93, "Er": 167.26, "Tm": 168.93, "Yb": 173.05,
    "Lu": 174.97, "Hf": 178.49, "Ta": 180.95, "W": 183.84, "Re": 186.21, "Os": 190.23, "Ir": 192.22, "Pt": 195.08, "Au": 196.97, "Hg": 200.59,
    "Tl": 204.38, "Pb": 207.2, "Bi": 208.98, "Po": 209, "At": 210, "Rn": 222, "Fr": 223, "Ra": 226, "Ac": 227, "Th": 232.04, "Pa": 231.04,
    "U": 238.03, "Np": 237, "Pu": 244, "Am": 243, "Cm": 247, "Bk": 247, "Cf": 251, "Es": 252, "Fm": 257, "Md": 258, "No": 259, "Lr": 262,
    "Rf": 267, "Db": 270, "Sg": 271, "Bh": 270, "Hs": 277, "Mt": 276, "Ds": 281, "Rg": 280, "Cn": 285, "Nh": 284, "Fl": 289, "Mc": 288,
    "Lv": 293, "Ts": 294, "Og": 294
};

// DOM Elements - View Switching
const mwView = document.getElementById('mwView');
const bufferView = document.getElementById('bufferView');
const showMwBtn = document.getElementById('showMwView');
const showBufferBtn = document.getElementById('showBufferView');

// DOM Elements - MW Calc
const input = document.getElementById('chemicalInput');
const calculateBtn = document.getElementById('calculateBtn');
const resultsSection = document.getElementById('resultsSection');
const errorMsg = document.getElementById('errorMessage');
const mwValueDisplay = document.getElementById('mwValue');
const formulaDisplay = document.getElementById('formulaDisplay');
const nameDisplay = document.getElementById('nameDisplay');
const compositionList = document.getElementById('compositionList');
const elementTableBody = document.querySelector('#elementTable tbody');
const historyList = document.getElementById('historyList');
const imageContainer = document.getElementById('imageContainer');
const chemicalImage = document.getElementById('chemicalImage');
const synonymsDisplay = document.getElementById('synonymsDisplay');
const solubilityDisplay = document.getElementById('solubilityDisplay');

// DOM Elements - Buffer Calc
const solutionVolumeInput = document.getElementById('solutionVolume');
const volumeUnitSelect = document.getElementById('volumeUnit');
const soluteContainer = document.getElementById('soluteContainer');
const addSoluteBtn = document.getElementById('addSoluteBtn');

let history = JSON.parse(localStorage.getItem('chemHistory') || '[]');

/**
 * VIEW SWITCHING
 */
function switchView(view) {
    if (view === 'mw') {
        mwView.classList.remove('hidden');
        bufferView.classList.add('hidden');
        showMwBtn.classList.add('active');
        showBufferBtn.classList.remove('active');
    } else {
        mwView.classList.add('hidden');
        bufferView.classList.remove('hidden');
        showMwBtn.classList.remove('active');
        showBufferBtn.classList.add('active');
        if (soluteContainer.children.length === 0) addSoluteRow();
    }
}

showMwBtn.addEventListener('click', () => switchView('mw'));
showBufferBtn.addEventListener('click', () => switchView('buffer'));

/**
 * MW CALCULATOR LOGIC
 */
function showResult(data) {
    const { mw, formula, name, composition, cid, synonyms } = data;
    const numMw = Number(mw);

    mwValueDisplay.textContent = numMw.toFixed(2);
    formulaDisplay.innerHTML = formatFormula(formula);
    nameDisplay.textContent = name || '';

    renderComposition(composition, numMw);
    renderTable(composition, numMw);

    resultsSection.classList.remove('hidden');
    errorMsg.classList.add('hidden');

    if (cid) {
        chemicalImage.src = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG`;
        imageContainer.classList.remove('hidden');
    } else {
        imageContainer.classList.add('hidden');
    }

    if (synonyms && synonyms.length > 0) {
        const topSynonyms = synonyms
            .filter(s => s.toLowerCase() !== (name || '').toLowerCase())
            .slice(0, 5)
            .join(', ');
        if (topSynonyms) {
            synonymsDisplay.innerHTML = `Known as: ${topSynonyms}`;
            synonymsDisplay.classList.remove('hidden');
        } else {
            synonymsDisplay.classList.add('hidden');
        }
    } else {
        synonymsDisplay.classList.add('hidden');
    }

    if (data.solubility) {
        solubilityDisplay.innerHTML = `<strong>Solubility in water:</strong> ${data.solubility}`;
        solubilityDisplay.classList.remove('hidden');
    } else {
        solubilityDisplay.classList.add('hidden');
    }

    updateHistory(formula, name, numMw);
}

function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.classList.remove('hidden');
    resultsSection.classList.add('hidden');
}

function formatFormula(formula) {
    return formula.replace(/(\d+)/g, '<sub>$1</sub>');
}

function renderComposition(composition, totalMw) {
    compositionList.innerHTML = '';
    const sorted = Object.entries(composition).sort((a, b) => (b[1] * PTABLE[b[0]]) - (a[1] * PTABLE[a[0]]));

    sorted.forEach(([symbol, count]) => {
        const mass = count * PTABLE[symbol];
        const pct = (mass / totalMw) * 100;

        const item = document.createElement('div');
        item.className = 'comp-item';
        item.innerHTML = `
            <div class="comp-symbol">${symbol}</div>
            <div class="comp-bar-container">
                <div class="comp-bar" style="width: ${pct}%"></div>
            </div>
            <div class="comp-pct">${pct.toFixed(1)}%</div>
        `;
        compositionList.appendChild(item);
    });
}

function renderTable(composition, totalMw) {
    elementTableBody.innerHTML = '';
    Object.entries(composition).forEach(([symbol, count]) => {
        const mass = count * PTABLE[symbol];
        const pct = (mass / totalMw) * 100;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${symbol} (${PTABLE[symbol].toFixed(3)})</td>
            <td>${count}</td>
            <td>${pct.toFixed(2)}%</td>
        `;
        elementTableBody.appendChild(row);
    });
}

function updateHistory(formula, name, mw) {
    const key = name || formula;
    if (history.find(h => h.key === key)) return;

    history.unshift({ key, formula, mw });
    history = history.slice(0, 10);
    localStorage.setItem('chemHistory', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    history.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.textContent = item.key;
        div.onclick = () => {
            input.value = item.key;
            switchView('mw');
            handleCalculate();
        };
        historyList.appendChild(div);
    });
}

/**
 * BUFFER CALCULATOR LOGIC
 */
function addSoluteRow() {
    const row = document.createElement('tr');
    row.className = 'solute-row';
    row.innerHTML = `
        <td>
            <div class="chem-input-group">
                <button class="lookup-btn" title="Open PubChem Entry">🔍</button>
                <input type="text" class="chem-name" placeholder="Name/Formula">
            </div>
        </td>
        <td class="formula-cell"></td>
        <td><input type="number" class="mw-input" step="0.01" placeholder="Mw"></td>
        <td>
            <div class="conc-group">
                <input type="number" class="conc-input" value="1" step="0.1">
                <select class="conc-unit">
                    <option value="M">M</option>
                    <option value="mM">mM</option>
                    <option value="uM">uM</option>
                    <option value="pct">% (w/v)</option>
                    <option value="dil">Dilution (X)</option>
                </select>
            </div>
        </td>
        <td class="result-cell">-</td>
        <td><button class="remove-btn">×</button></td>
    `;

    const nameInput = row.querySelector('.chem-name');
    const formulaCell = row.querySelector('.formula-cell');
    const mwInput = row.querySelector('.mw-input');
    const concInput = row.querySelector('.conc-input');
    const unitSelect = row.querySelector('.conc-unit');
    const resultCell = row.querySelector('.result-cell');
    const removeBtn = row.querySelector('.remove-btn');
    const lookupBtn = row.querySelector('.lookup-btn');

    // Auto-lookup MW when name changes or MW is clicked
    const triggerLookup = async () => {
        const query = nameInput.value.trim();
        if (!query) {
            formulaCell.innerHTML = '';
            return;
        }

        // Visual feedback
        mwInput.placeholder = "...";

        // Try local parse
        if (/^[A-Za-z0-9()\[\]·.]+$/.test(query) && /[A-Z]/.test(query)) {
            try {
                const composition = parseFormula(query);
                mwInput.value = calculateMw(composition).toFixed(2);
                calculateRow(row);
                mwInput.placeholder = "Mw";
                formulaCell.innerHTML = '';
                return;
            } catch (e) { }
        }

        // Try PubChem
        const res = await lookupPubChem(query);
        if (res) {
            mwInput.value = Number(res.mw).toFixed(2);
            row.dataset.cid = res.cid; // Store for the magnifying glass button

            // Show formula badge if it's a name search
            if (res.formula && res.formula !== query) {
                formulaCell.innerHTML = `<span class="formula-badge">${formatFormula(res.formula)}</span>`;
            } else {
                formulaCell.innerHTML = '';
            }

            calculateRow(row);
        } else {
            formulaCell.innerHTML = '';
        }
        mwInput.placeholder = "Mw";
    };

    lookupBtn.onclick = () => {
        const query = nameInput.value.trim();
        if (!query) return;

        const url = row.dataset.cid
            ? `https://pubchem.ncbi.nlm.nih.gov/compound/${row.dataset.cid}`
            : `https://pubchem.ncbi.nlm.nih.gov/#query=${encodeURIComponent(query)}`;
        window.open(url, '_blank');
    };

    let debounce;
    nameInput.oninput = () => {
        formulaCell.innerHTML = '';
        clearTimeout(debounce);
        debounce = setTimeout(triggerLookup, 500);
    };

    nameInput.onkeydown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            triggerLookup();
        }
    };

    // User specifically asked to trigger lookup when clicking/focusing the MW input
    mwInput.onfocus = triggerLookup;

    [mwInput, concInput, unitSelect].forEach(el => {
        el.oninput = () => calculateRow(row);
    });

    removeBtn.onclick = () => {
        row.remove();
    };

    soluteContainer.appendChild(row);
}

function calculateRow(row) {
    const mw = parseFloat(row.querySelector('.mw-input').value);
    const conc = parseFloat(row.querySelector('.conc-input').value);
    const unit = row.querySelector('.conc-unit').value;
    const resultCell = row.querySelector('.result-cell');

    const vol = parseFloat(solutionVolumeInput.value);
    const volUnit = volumeUnitSelect.value;

    if (isNaN(mw) && unit !== 'pct' && unit !== 'dil') {
        resultCell.textContent = '-';
        return;
    }
    if (isNaN(conc) || isNaN(vol)) {
        resultCell.textContent = '-';
        return;
    }

    // Convert volume to Liters for calculation
    let volL = vol;
    if (volUnit === 'mL') volL = vol / 1000;
    if (volUnit === 'uL') volL = vol / 1000000;

    let resultMsg = "";

    if (unit === 'M' || unit === 'mM' || unit === 'uM') {
        let molarity = conc;
        if (unit === 'mM') molarity = conc / 1000;
        if (unit === 'uM') molarity = conc / 1000000;

        const grams = molarity * volL * mw;
        if (grams < 0.001) resultMsg = (grams * 1000000).toFixed(1) + " ug";
        else if (grams < 1) resultMsg = (grams * 1000).toFixed(1) + " mg";
        else resultMsg = grams.toFixed(3) + " g";
    }
    else if (unit === 'pct') {
        // % w/v is grams per 100mL
        const volML = volL * 1000;
        const grams = (conc / 100) * volML;
        if (grams < 1) resultMsg = (grams * 1000).toFixed(1) + " mg";
        else resultMsg = grams.toFixed(2) + " g";
    }
    else if (unit === 'dil') {
        // Dilution X (making it 1X). Vol = FinalVol / StockConc
        const stockVolL = volL / conc;
        const stockVolML = stockVolL * 1000;
        if (stockVolML < 1) resultMsg = (stockVolML * 1000).toFixed(1) + " uL";
        else resultMsg = stockVolML.toFixed(2) + " mL";
    }

    resultCell.textContent = resultMsg;
}

addSoluteBtn.onclick = addSoluteRow;
solutionVolumeInput.oninput = () => document.querySelectorAll('.solute-row').forEach(calculateRow);
volumeUnitSelect.onchange = () => document.querySelectorAll('.solute-row').forEach(calculateRow);

/**
 * SHARED UTILITIES
 */
function parseFormula(formula) {
    const parts = formula.replace(/·/g, '.').split('.');
    let totalComp = {};
    parts.forEach(part => {
        let multiplier = 1;
        const multMatch = part.match(/^(\d+)(.*)$/);
        let formulaPart = part;
        if (multMatch && multMatch[2].length > 0 && !/^\d+$/.test(multMatch[2])) {
            multiplier = parseInt(multMatch[1]);
            formulaPart = multMatch[2];
        }
        const tokens = formulaPart.match(/([A-Z][a-z]?|\d+|\(|\)|\[|\])/g);
        if (!tokens || tokens.join('') !== formulaPart) throw new Error(`Invalid formula: ${formulaPart}`);
        let stack = [{}];
        for (let i = 0; i < tokens.length; i++) {
            let t = tokens[i];
            if (t === '(' || t === '[') stack.push({});
            else if (t === ')' || t === ']') {
                let top = stack.pop();
                let next = tokens[i + 1];
                let groupMult = 1;
                if (next && /^\d+$/.test(next)) { groupMult = parseInt(next); i++; }
                let current = stack[stack.length - 1];
                for (let atom in top) current[atom] = (current[atom] || 0) + top[atom] * groupMult;
            } else if (/^[A-Z][a-z]?$/.test(t)) {
                if (!PTABLE[t]) throw new Error(`Unknown element: ${t}`);
                let next = tokens[i + 1];
                let count = 1;
                if (next && /^\d+$/.test(next)) { count = parseInt(next); i++; }
                let current = stack[stack.length - 1];
                current[t] = (current[t] || 0) + count;
            }
        }
        if (stack.length !== 1) throw new Error("Unbalanced parentheses/brackets");
        for (let atom in stack[0]) totalComp[atom] = (totalComp[atom] || 0) + stack[0][atom] * multiplier;
    });
    return totalComp;
}

function calculateMw(composition) {
    return Object.entries(composition).reduce((sum, [symbol, count]) => sum + (PTABLE[symbol] * count), 0);
}

async function lookupPubChem(query) {
    try {
        const response = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(query)}/property/MolecularFormula,MolecularWeight/JSON`);
        if (!response.ok) return null;
        const data = await response.json();
        const prop = data.PropertyTable.Properties[0];
        return {
            formula: prop.MolecularFormula,
            mw: prop.MolecularWeight,
            cid: prop.CID
        };
    } catch (e) { return null; }
}

async function lookupSynonyms(cid) {
    try {
        const res = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/synonyms/JSON`);
        const data = await res.json();
        return data.InformationList.Information[0].Synonym || [];
    } catch (e) { return []; }
}

async function lookupSolubility(cid) {
    try {
        const res = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/${cid}/JSON?heading=Solubility`);
        if (!res.ok) return null;
        const data = await res.json();
        function find(obj) {
            if (!obj || typeof obj !== 'object') return null;
            if (obj.StringWithMarkup?.[0]?.String) return obj.StringWithMarkup[0].String;
            if (obj.Value?.StringWithMarkup?.[0]?.String) return obj.Value.StringWithMarkup[0].String;
            if (Array.isArray(obj)) { for (let x of obj) { const r = find(x); if (r) return r; } }
            for (let k in obj) { if (k === 'Section' || k === 'Information') { const r = find(obj[k]); if (r) return r; } }
            return null;
        }
        return find(data.Record);
    } catch (e) { return null; }
}



async function handleCalculate() {
    const query = input.value.trim();
    if (!query) return;
    calculateBtn.disabled = true;
    calculateBtn.textContent = '...';

    try {
        if (/^[A-Za-z0-9()\[\]·.]+$/.test(query) && /[A-Z]/.test(query)) {
            try {
                const composition = parseFormula(query);
                const mw = calculateMw(composition);
                showResult({ mw, formula: query, composition });
                return;
            } catch (e) { }
        }
        const apiData = await lookupPubChem(query);
        if (apiData) {
            const [comp, syns, solol] = await Promise.all([
                parseFormula(apiData.formula),
                lookupSynonyms(apiData.cid),
                lookupSolubility(apiData.cid)
            ]);
            showResult({ ...apiData, composition: comp, synonyms: syns, solubility: solol });
        } else showError("Could not find chemical.");
    } catch (e) { showError(e.message); }
    finally {
        calculateBtn.disabled = false;
        calculateBtn.textContent = 'Calculate';
    }
}

calculateBtn.addEventListener('click', handleCalculate);
input.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleCalculate(); });
renderHistory();
