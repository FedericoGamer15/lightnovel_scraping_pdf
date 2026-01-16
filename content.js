console.log("Novel Scraper Ultimate V5: Loaded");

let currentLang = 'es';
let isNavMode = false;
const WIZARD_KEYS = ['title', 'cover', 'synopsis', 'content', 'nextBtn'];

// Init
chrome.storage.local.get(['language', 'wizardStep'], (res) => {
    if (res.language) currentLang = res.language;
    if (res.wizardStep && res.wizardStep > 0 && res.wizardStep <= 5) showWizardBar(res.wizardStep);
});
function getTrans(key) { return TRANSLATIONS[currentLang][key] || key; }

// --- 1. WIZARD UI ---
function showWizardBar(stepIndex) {
    document.getElementById('scraper-wizard-bar')?.remove();
    const bar = document.createElement('div');
    bar.id = 'scraper-wizard-bar';
    
    // HTML Base
    let html = `
        <div style="flex-grow:1; text-align:center; display:flex; align-items:center; justify-content:center;">
            <span id="scraper-wizard-text" style="margin-right:15px;"></span>
            <button id="scraper-btn-nav" class="wizard-btn-action">${getTrans('wiz_btn_nav')}</button>
    `;

    // Si es el paso de PORTADA (Paso 2), agregar botón de subir
    if (stepIndex === 2) {
        html += `<button id="scraper-btn-upload" class="wizard-btn-upload">${getTrans('wiz_btn_upload')}</button>`;
        // Input file oculto
        html += `<input type="file" id="scraper-file-input" accept="image/*" style="display:none;">`;
    }

    html += `</div><button id="scraper-wizard-cancel" class="wizard-btn-cancel">X</button>`;
    
    bar.innerHTML = html;
    document.documentElement.appendChild(bar);

    // Eventos
    document.getElementById('scraper-wizard-cancel').onclick = stopWizard;
    document.getElementById('scraper-btn-nav').onclick = toggleNavMode;
    
    // Evento Subir Imagen
    if (stepIndex === 2) {
        const btnUp = document.getElementById('scraper-btn-upload');
        const fileIn = document.getElementById('scraper-file-input');
        btnUp.onclick = (e) => {
            e.stopPropagation(); // Evitar que seleccione la barra
            fileIn.click();
        };
        fileIn.onchange = handleFileUpload;
    }

    updateBarText(stepIndex);
}

// Manejador de archivo local
function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const base64 = event.target.result;
        // Guardar y pasar al siguiente paso
        saveStepData('cover', null, { novelCover: base64 });
    };
    reader.readAsDataURL(file);
}

function updateBarText(stepIndex) {
    const textSpan = document.getElementById('scraper-wizard-text');
    if (isNavMode) {
        textSpan.innerText = getTrans('wiz_nav_mode_on');
        textSpan.style.color = "#ffd700"; // Amarillo
    } else {
        textSpan.innerText = getTrans(`wiz_step_${stepIndex}`);
        textSpan.style.color = "#fff";
    }
}

function toggleNavMode() {
    isNavMode = !isNavMode;
    const btn = document.getElementById('scraper-btn-nav');
    if (isNavMode) {
        btn.innerText = getTrans('wiz_btn_pick');
        btn.style.backgroundColor = "#28a745"; // Verde para "Seleccionar"
        document.querySelectorAll('.novel-scraper-hover').forEach(el => el.classList.remove('novel-scraper-hover'));
    } else {
        btn.innerText = getTrans('wiz_btn_nav');
        btn.style.backgroundColor = "#3a86ff"; // Azul para "Navegar"
    }
    chrome.storage.local.get(['wizardStep'], (res) => updateBarText(res.wizardStep || 1));
}

function stopWizard() {
    chrome.storage.local.remove('wizardStep');
    document.getElementById('scraper-wizard-bar')?.remove();
    document.querySelectorAll('.novel-scraper-hover').forEach(el => el.classList.remove('novel-scraper-hover'));
}


// --- 2. SELECTOR LOGIC ---
document.addEventListener('mouseover', (e) => {
    if (isNavMode || !document.getElementById('scraper-wizard-bar')) return;
    if (e.target.closest('#scraper-wizard-bar')) return;
    e.preventDefault(); e.stopPropagation();
    const t = e.target;
    if (!t.classList.contains('novel-scraper-hover')) {
        document.querySelectorAll('.novel-scraper-hover').forEach(el => el.classList.remove('novel-scraper-hover'));
        t.classList.add('novel-scraper-hover');
    }
}, true);

document.addEventListener('click', async (e) => {
    if (!document.getElementById('scraper-wizard-bar')) return;
    if (e.target.closest('#scraper-wizard-bar')) return;
    if (isNavMode) return;
    e.preventDefault(); e.stopPropagation();

    chrome.storage.local.get(['wizardStep'], async (res) => {
        let step = res.wizardStep || 1;
        const currentKey = WIZARD_KEYS[step - 1];
        const element = e.target;
        let selector = generateSelector(element);
        let extraData = {};

        if (currentKey === 'title') extraData.novelTitle = element.innerText.trim();
        else if (currentKey === 'cover') {
            let src = element.src || element.getAttribute('data-src') || "";
            if (element.tagName === 'DIV') {
                 const style = window.getComputedStyle(element);
                 if(style.backgroundImage && style.backgroundImage !== 'none') {
                     src = style.backgroundImage.slice(4, -1).replace(/"/g, "");
                 }
            }
            if (src) {
                try {
                    const base64 = await urlToBase64(src);
                    extraData.novelCover = base64;
                } catch (err) {}
            }
        } 
        else if (currentKey === 'synopsis') extraData.novelSynopsis = element.innerText.trim();

        saveStepData(currentKey, selector, extraData);
    });
}, true);

function saveStepData(key, selector, extraData) {
    chrome.storage.local.get(['selectors', 'wizardStep'], (res) => {
        const selectors = res.selectors || {};
        if (selector) selectors[key] = selector; // Si es subida de archivo, selector es null
        
        const currentStep = res.wizardStep || 1;
        const nextStep = currentStep + 1;

        chrome.storage.local.set({ 
            selectors: selectors, 
            wizardStep: nextStep,
            ...extraData 
        }, () => {
            if (nextStep <= 5) showWizardBar(nextStep);
            else {
                stopWizard();
                alert(getTrans('wiz_done'));
            }
        });
    });
}

// Helpers
async function urlToBase64(url) {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((r, j) => {
        const reader = new FileReader();
        reader.onloadend = () => r(reader.result);
        reader.onerror = j;
        reader.readAsDataURL(blob);
    });
}
function generateSelector(el) {
    if (el.id) return '#' + el.id;
    if (el.className && typeof el.className === 'string') {
        const c = el.className.trim().split(/\s+/).filter(k => k.length > 2 && !k.startsWith('novel'));
        if (c.length) return el.tagName.toLowerCase() + '.' + c.join('.');
    }
    return el.tagName.toLowerCase();
}

// --- 3. SCRAPER (Misma lógica) ---
function initFastScraper() {
    chrome.storage.local.get(['isScraping', 'selectors', 'chapters', 'totalChaptersTarget', 'startTime', 'startChapterCount'], (data) => {
        if (!data.isScraping) return;
        
        const currentCount = data.chapters ? data.chapters.length : 0;
        const target = data.totalChaptersTarget || 0;
        let timeInfo = getTrans('status_calculating');
        
        if (target > 0 && data.startTime && currentCount > data.startChapterCount) {
            const elapsed = Date.now() - data.startTime;
            const done = currentCount - data.startChapterCount;
            const msPerCap = elapsed / done;
            const left = target - currentCount;
            if (left > 0) {
                const sec = Math.floor((left * msPerCap) / 1000);
                timeInfo = `${getTrans('status_time_left')} ${Math.floor(sec/60)}m ${sec%60}s`;
            } else timeInfo = "Final...";
        }

        showStatusPanel(currentCount, timeInfo);

        let attempts = 0;
        const interval = setInterval(() => {
            attempts++;
            const contentEl = document.querySelector(data.selectors.content);
            const nextBtn = document.querySelector(data.selectors.nextBtn);

            if (contentEl) {
                clearInterval(interval);
                const text = contentEl.innerText;
                if (text.length > 20) {
                    const chapters = data.chapters || [];
                    chapters.push({ text: text });
                    chrome.storage.local.set({ chapters: chapters }, () => {
                        if (target > 0 && chapters.length >= target) {
                            alert("Done!"); chrome.storage.local.set({ isScraping: false }); removeStatusPanel(); return;
                        }
                        if (nextBtn) { nextBtn.click(); if(nextBtn.href) window.location.href=nextBtn.href; }
                        else setTimeout(() => { 
                            const r = document.querySelector(data.selectors.nextBtn); 
                            if(r) r.click(); 
                            else { chrome.storage.local.set({isScraping: false}); removeStatusPanel(); }
                        }, 2000);
                    });
                }
            }
            if (attempts >= 100) clearInterval(interval);
        }, 100);
    });
}
function showStatusPanel(c, t) {
    let p = document.getElementById('scraper-status-panel');
    if (!p) { p = document.createElement('div'); p.id='scraper-status-panel'; document.body.appendChild(p); }
    p.innerHTML = `<div style="font-weight:bold;color:#00d4ff;">${c} Caps</div><div style="font-size:11px;color:#fff;">${t}</div>`;
}
function removeStatusPanel() { document.getElementById('scraper-status-panel')?.remove(); }


// --- 4. PDF GENERATOR CON TEMAS ---
async function createPDF(theme = 'light') {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Configuración de Colores
    const isDark = theme === 'dark';
    const bgColor = isDark ? '#232323' : '#F4F4F4';
    const txtColor = isDark ? '#BBBBBB' : '#2B2B2B';
    const titleColor = isDark ? '#FFFFFF' : '#000000';

    // Función Helper para pintar fondo
    const paintBackground = () => {
        doc.setFillColor(bgColor);
        doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
    };

    chrome.storage.local.get(['chapters', 'novelTitle', 'novelCover', 'novelSynopsis'], (data) => {
        const chapters = data.chapters || [];
        if (!chapters.length) return;
        
        const W = doc.internal.pageSize.width;
        const H = doc.internal.pageSize.height;
        const M = 20;

        // --- PÁGINA 1 ---
        paintBackground(); // Pintar fondo

        // Título
        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.setTextColor(titleColor);
        const title = doc.splitTextToSize(data.novelTitle || "Novela", W - 40);
        let y = 40;
        doc.text(title, W/2, y, { align: 'center' });
        y += (title.length * 10) + 20;

        // Portada
        if (data.novelCover) {
            try {
                const props = doc.getImageProperties(data.novelCover);
                const iW = 100;
                const iH = (props.height * iW) / props.width;
                doc.addImage(data.novelCover, 'JPEG', (W-iW)/2, y, iW, iH);
                y += iH + 20;
            } catch(e){}
        } else y += 20;

        // Stats
        doc.setFontSize(12);
        doc.setTextColor(txtColor);
        doc.text(`${getTrans('pdf_stats')}: ${chapters.length}`, W/2, y, { align: 'center' });
        y += 20;

        // Sinopsis
        if (data.novelSynopsis) {
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(doc.splitTextToSize(data.novelSynopsis, W-(M*2)), M, y);
        }
        
        // --- CAPÍTULOS ---
        doc.addPage();
        paintBackground(); // Pintar fondo pág 2

        let pageY = 20;
        chapters.forEach((c, i) => {
            if (pageY > H - 40) { 
                doc.addPage(); 
                paintBackground(); // Pintar fondo nueva pág
                pageY = 20; 
            }
            
            // Titulo Cap
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.setTextColor(titleColor);
            doc.text(`Capítulo ${i+1}`, M, pageY);
            pageY += 10;
            
            // Texto
            doc.setFont("helvetica", "normal");
            doc.setFontSize(11);
            doc.setTextColor(txtColor);
            
            const lines = doc.splitTextToSize(c.text.replace(/\n\s*\n/g, '\n\n'), W-(M*2));
            lines.forEach(line => {
                if (pageY > H - 15) { 
                    doc.addPage(); 
                    paintBackground();
                    pageY = 15; 
                }
                doc.text(line, M, pageY);
                pageY += 5;
            });
            pageY += 15;
        });
        
        doc.save(`${(data.novelTitle||'novela').slice(0,20)}_${theme}.pdf`);
    });
}

chrome.runtime.onMessage.addListener((m) => {
    if (m.lang) currentLang = m.lang;
    if (m.action === 'startWizard') {
        chrome.storage.local.set({ wizardStep: 1 }, () => showWizardBar(1));
    }
    else if (m.action === 'startScraping') initFastScraper();
    else if (m.action === 'generatePDF') createPDF(m.theme); // Pasamos el tema
});

initFastScraper();