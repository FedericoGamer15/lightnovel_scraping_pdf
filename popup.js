document.addEventListener('DOMContentLoaded', () => {
    // Referencias
    const langSelect = document.getElementById('lang-select');
    const btnWizard = document.getElementById('btn-wizard');
    const btnStart = document.getElementById('btn-start');
    const btnStop = document.getElementById('btn-stop');
    const btnPdfLight = document.getElementById('btn-pdf-light'); // Nuevo
    const btnPdfDark = document.getElementById('btn-pdf-dark');   // Nuevo
    const pdfContainer = document.getElementById('pdf-buttons-container');
    const btnClear = document.getElementById('btn-clear');
    const inputTotal = document.getElementById('total-chapters-input');
    const inputContainer = document.getElementById('input-total-container');
    const statusText = document.getElementById('status-text');
    const chaptersDisplay = document.getElementById('chapters-count');
    
    let currentLang = 'es';

    // Traducciones
    function applyTranslations(lang) {
        currentLang = lang;
        langSelect.value = lang;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (TRANSLATIONS[lang][key]) {
                el.innerText = TRANSLATIONS[lang][key];
                if(el.tagName === 'INPUT') el.placeholder = TRANSLATIONS[lang].placeholder_caps;
            }
        });
        inputTotal.placeholder = TRANSLATIONS[lang].placeholder_caps;
        updateUI();
    }

    // Inicialización
    chrome.storage.local.get(['language'], (res) => applyTranslations(res.language || 'es'));
    langSelect.onchange = () => {
        chrome.storage.local.set({ language: langSelect.value });
        applyTranslations(langSelect.value);
    };

    function sendMessage(action, data = {}) {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs[0]?.id) chrome.tabs.sendMessage(tabs[0].id, { action, ...data });
        });
    }

    function updateUI() {
        chrome.storage.local.get(['isScraping', 'chapters', 'selectors', 'totalChaptersTarget'], (data) => {
            const count = data.chapters ? data.chapters.length : 0;
            const hasConfig = data.selectors && data.selectors.content && data.selectors.nextBtn;
            const t = TRANSLATIONS[currentLang];

            chaptersDisplay.textContent = count;
            if (data.totalChaptersTarget) inputTotal.value = data.totalChaptersTarget;

            if (data.isScraping) {
                // Grabando
                document.getElementById('panel-setup').classList.add('hidden');
                document.getElementById('panel-action').classList.remove('hidden');
                inputContainer.classList.add('hidden');
                btnStart.classList.add('hidden');
                btnStop.classList.remove('hidden');
                pdfContainer.classList.add('hidden');
                statusText.innerText = t.status_recording;
            } else {
                // Standby
                btnStop.classList.add('hidden');
                if (hasConfig) {
                    document.getElementById('panel-setup').classList.add('hidden');
                    document.getElementById('panel-action').classList.remove('hidden');
                    inputContainer.classList.remove('hidden');
                    btnStart.classList.remove('hidden');
                    if (count > 0) {
                        pdfContainer.classList.remove('hidden');
                        pdfContainer.style.display = 'flex'; // Forzar flex
                    } else {
                        pdfContainer.classList.add('hidden');
                    }
                    statusText.innerText = "Ready.";
                } else {
                    document.getElementById('panel-setup').classList.remove('hidden');
                    document.getElementById('panel-action').classList.add('hidden');
                }
            }
        });
    }

    // Listeners
    btnWizard.onclick = () => { window.close(); sendMessage('startWizard', { lang: currentLang }); };
    
    btnStart.onclick = () => {
        const total = parseInt(inputTotal.value) || 0;
        chrome.storage.local.set({ 
            isScraping: true, 
            totalChaptersTarget: total,
            startTime: Date.now(),
            startChapterCount: parseInt(chaptersDisplay.textContent) || 0
        }, () => {
            sendMessage('startScraping', { lang: currentLang });
            window.close();
        });
    };

    btnStop.onclick = () => chrome.storage.local.set({ isScraping: false }, updateUI);
    
    // Generar PDF Light
    btnPdfLight.onclick = () => {
        statusText.innerText = "Generando (Light)...";
        sendMessage('generatePDF', { theme: 'light' });
    };

    // Generar PDF Dark
    btnPdfDark.onclick = () => {
        statusText.innerText = "Generando (Dark)...";
        sendMessage('generatePDF', { theme: 'dark' });
    };

    btnClear.onclick = () => {
        if(confirm("Reset?")) chrome.storage.local.clear(() => chrome.storage.local.set({language: currentLang}, updateUI));
    };
});