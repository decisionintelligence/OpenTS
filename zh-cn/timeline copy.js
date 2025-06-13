document.addEventListener('DOMContentLoaded', function() {
    // --- Data Configuration ---
    const articleTypes = {
        'AutoML': 'square',
        'Benchmarks': 'circle',
        'Foundation Models': 'diamond',
        'Plugins': 'star', // Added Plugins type with star shape
        'Specific Models': 'triangle'
    };
    const taskTypes = {
        'Forecasting': 'blue',
        'Classification': 'green',
        'Outlier': 'red',
        'Others': 'black'
    };
    
    const taskColor = {
        'Forecasting': '#3b82f6',
        'Classification': '#22c55e',
        'Outlier': '#ef4444',
        'Others': '#575757'
    };

    // --- Use the new data provided by the user ---
    const timelineData = [
        {"year":2013, "papers":[
            { "name": "STHMM [PVLDB]", "articleType": "Specific Models", "taskType": "Forecasting","url":""}

        ]},
        {"year":2018, "papers":[
            { "name": "UncertainTS [VLDBJ]", "articleType": "Specific Models", "taskType": "Others","url":"Efficient Stochastic Routing in Path-Centric Uncertain Road Networks"},
            { "name": "DAE [MDM]", "articleType": "Specific Models", "taskType": "Outlier","url":""},
            { "name": "AECRNN [CIKM]", "articleType": "Specific Models", "taskType": "Forecasting","url":""}
        ]},
        {"year":2019, "papers":[
            { "name": "RAE [IJCAI]", "articleType": "Specific Models", "taskType": "Outlier","url":""}
        ]},
        {"year":2020, "papers":[
            { "name": "DGCRNN [ICDE]", "articleType": "Specific Models", "taskType": "Forecasting","url":""}
        ]},
        {"year":2021, "papers":[
            { "name": "EnhanceNet [ICDE]", "articleType": "Plugins", "taskType": "Forecasting","url":"https://ieeexplore.ieee.org/document/9458855"},
            { "name": "AutoCTS [PVLDB]", "articleType": "AutoML", "taskType": "Forecasting","url":"https://arxiv.org/abs/2112.11174"},
            { "name": "CAE [PVLDB]", "articleType": "Specific Models", "taskType": "Forecasting","url":"https://dl.acm.org/doi/10.14778/3494124.3494142"}
        ]},
        {"year":2022, "papers":[
            { "name": "Triformer [PVLDB]", "articleType": "Specific Models", "taskType": "Forecasting","url":"https://arxiv.org/abs/2204.13767"},
            { "name": "ST-WA [ICDE]", "articleType": "Specific Models", "taskType": "Forecasting","url":""},
            { "name": "RAE [ICDE]", "articleType": "Specific Models", "taskType": "Outlier","url":"https://ieeexplore.ieee.org/abstract/document/9835268"},
            { "name": "VQRAE [ICDE]", "articleType": "Specific Models", "taskType": "Outlier","url":""},
            { "name": "HyperVerlet [AAAI]", "articleType": "Specific Models", "taskType": "Forecasting","url":"https://aaai.org/papers/04575-hyperverlet-a-symplectic-hypersolver-for-hamiltonian-systems/"}
        ]},
        {"year":2023, "papers":[
            { "name": "AutoCTS+ [SIGMOD]", "articleType": "AutoML", "taskType": "Forecasting","url":"https://dl.acm.org/doi/10.1145/3588951"},
            { "name": "MagicSclar [PVLDB]", "articleType": "Specific Models", "taskType": "Forecasting","url":"https://dl.acm.org/doi/10.14778/3611540.3611566"},
            { "name": "LightTS [SIGMOD]", "articleType": "Specific Models", "taskType": "Classification","url":"https://openreview.net/forum?id=1oECpm4Xm9"},
            { "name": "CGF [TKDE]", "articleType": "Specific Models", "taskType": "Forecasting","url":"https://ieeexplore.ieee.org/document/10064188"}
        ]},
        {"year":2024, "papers":[
            { "name": "AutoCTS++ [VLDBJ]", "articleType": "AutoML", "taskType": "Forecasting","url":"https://link.springer.com/article/10.1007/s00778-024-00872-x"},
            { "name": "PatchFormer [ICLR]", "articleType": "Specific Models", "taskType": "Forecasting","url":"https://arxiv.org/abs/2402.05956"},
            { "name": "TFB [PVLDB]", "articleType": "Specific Models", "taskType": "Forecasting","url":"https://dl.acm.org/doi/10.14778/3665844.3665863"},
            { "name": "MTSF-DG [PVLDB]", "articleType": "Specific Models", "taskType": "Forecasting","url":"https://dl.acm.org/doi/abs/10.14778/3636218.3636230"},
            { "name": "DARF [PVLDB]", "articleType": "Specific Models", "taskType": "Forecasting","url":"https://dl.acm.org/doi/10.14778/3636218.3636231"},
            { "name": "STSimSiam [PVLDB]", "articleType": "Specific Models", "taskType": "Forecasting","url":"https://arxiv.org/abs/2404.14999"},
            { "name": "QCore [PVLDB]", "articleType": "Specific Models", "taskType": "Classification","url":"https://dl.acm.org/doi/10.14778/3681954.3681957"},
            { "name": "Orca [CIKM]", "articleType": "Specific Models", "taskType": "Forecasting","url":""}
        ]},
        // --- NEW: Example of a split display --- "display": "split", "index": 6,
        {"year":2025,  "papers":[
            { "name": "TAB [PVLDB]", "articleType": "Benchmarks", "taskType": "Forecasting","url":""},
            { "name": "TSFM-Bench [KDD]", "articleType": "Benchmarks", "taskType": "Forecasting","url":""},
            { "name": "AimTS [ICDE]", "articleType": "Foundation Models", "taskType": "Classification","url":"https://arxiv.org/abs/2504.09993"},
            { "name": "DADA [ICLR]", "articleType": "Foundation Models", "taskType": "Outlier","url":"https://arxiv.org/abs/2405.15273"},
            { "name": "ROSE [ICML]", "articleType": "Foundation Models", "taskType": "Forecasting","url":"https://arxiv.org/abs/2405.17478"},
            { "name": "LightGTS [ICML]", "articleType": "Foundation Models", "taskType": "Forecasting","url":"https://arxiv.org/abs/2506.06005"},
            { "name": "FACT [PVLDB]", "articleType": "AutoML", "taskType": "Forecasting","url":""},
            { "name": "LipFormer [ICDE]", "articleType": "Specific Models", "taskType": "Forecasting","url":""},
            { "name": "SSD-TS [KDD]", "articleType": "Specific Models", "taskType": "Others","url":""},
            { "name": "IGCL [KDD]", "articleType": "Specific Models", "taskType": "Others","url":""},
            { "name": "DUET [KDD]", "articleType": "Specific Models", "taskType": "Forecasting","url":"https://arxiv.org/abs/2412.10859"},
            { "name": "K2VAE [ICML]", "articleType": "Specific Models", "taskType": "Forecasting","url":"AAhttps://arxiv.org/abs/2505.23017AAA"},
            { "name": "MemFormer [PVLDB]", "articleType": "Specific Models", "taskType": "Forecasting","url":"https://dl.acm.org/doi/10.14778/3705829.3705842"},
            { "name": "TEAM [PVLDB]", "articleType": "Specific Models", "taskType": "Forecasting","url":"https://arxiv.org/abs/2410.19192"},
            { "name": "ContraAD [PVLDB]", "articleType": "Specific Models", "taskType": "Outlier","url":""},
            { "name": "TimeDC [PVLDB]", "articleType": "Specific Models", "taskType": "Forecasting","url":""},
            { "name": "Catch [ICLR]", "articleType": "Specific Models", "taskType": "Outlier","url":"https://arxiv.org/abs/2410.12261"},
            { "name": "Air-DualODE [ICLR]", "articleType": "Specific Models", "taskType": "Forecasting","url":"https://arxiv.org/abs/2410.19892"}
        ]}
    ];


    // --- DOM Elements ---
    const scrollArea = document.querySelector('.timeline-scroll-area');
    const eventsWrapper = scrollArea.querySelector('.timeline-events-wrapper');
    const svgWave = scrollArea.querySelector('#timelineWave');
    const legendContainer = document.getElementById('legend');
    let eventElements = [];

    // --- Functions ---
    /**
     * Creates and injects the legend into the DOM.
     */
function createLegend() {
        // Use Chinese translations for legend titles
        let articleHtml = '<h4>Markers</h4>';
        for (const [type, shape] of Object.entries(articleTypes)) {
            // Replace underscores for better display
            const displayType = type.replace(/_/g, ' ');
            articleHtml += `<div class="legend-item"><span class="marker legend-marker ${shape} black"></span><span>${displayType}</span></div>`;
        }

        let taskHtml = '<h4>Color</h4>';
        const taskTranslations = {
            'Forecasting': 'Forecasting',
            'Classification': 'Classification',
            'Outlier': 'Outlier',
            'Others': 'Others'
        };
        for (const [type, color] of Object.entries(taskColor)) {
             const translatedType = taskTranslations[type] || type;
            taskHtml += `<div class="legend-item"><span style="color: ${color}">${translatedType}</span></div>`;
        }

        legendContainer.innerHTML = `
            <div class="legend-section">${articleHtml}</div>
            <div class="legend-section">${taskHtml}</div>
        `;
    }

    function createPapersList(papers) {
        return papers.map(paper => {
            const shape = articleTypes[paper.articleType] || 'circle';
            const color = taskTypes[paper.taskType] || 'black';
            const nameHtml = paper.url
                ? `<a href="${paper.url}" target="_blank" class="paper-link">${paper.name}</a>`
                : `<span>${paper.name}</span>`;
            return `<li><span class="marker ${shape} ${color}"></span>${nameHtml}</li>`;
        }).join('');
    }

    /**
     * Attaches necessary event listeners to a content card's list.
     * @param {HTMLElement} contentDiv - The content card element.
     */
    function setupContentCard(contentDiv) {
        const contentUl = contentDiv.querySelector('ul');
        if (!contentUl) return;
        setTimeout(() => {
            if (contentUl.scrollHeight > contentUl.clientHeight) {
                contentUl.classList.add('is-expanded')
                contentUl.classList.add('is-scrollable');
            }
        }, 100);
    }

    /**
     * Creates and injects all timeline event elements into the DOM.
     */
    function createTimelineEvents() {
        eventsWrapper.innerHTML = '';
        eventElements = [];
        timelineData.forEach(data => {
            const eventDiv = document.createElement('div');
            eventDiv.className = 'timeline-event';
            eventDiv.innerHTML = `<div class="timeline-point"></div><div class="timeline-year">${data.year}</div>`;

            if (data.display === 'split') {
                eventDiv.classList.add('event-split');
                const middleIndex = data.index;
                const topPapers = data.papers.slice(0, middleIndex);
                const bottomPapers = data.papers.slice(middleIndex);

                // Create top content card
                if (topPapers.length > 0) {
                    const topContent = document.createElement('div');
                    topContent.className = 'timeline-content content-top';
                    topContent.innerHTML = `<ul>${createPapersList(topPapers)}</ul>`;
                    eventDiv.appendChild(topContent);
                    setupContentCard(topContent);
                }

                // Create bottom content card
                if (bottomPapers.length > 0) {
                    const bottomContent = document.createElement('div');
                    bottomContent.className = 'timeline-content content-bottom';
                    bottomContent.innerHTML = `<ul>${createPapersList(bottomPapers)}</ul>`;
                    eventDiv.appendChild(bottomContent);
                    setupContentCard(bottomContent);
                }
            } else {
                // Create single content card
                const content = document.createElement('div');
                content.className = 'timeline-content';
                content.innerHTML = `<ul>${createPapersList(data.papers)}</ul>`;
                eventDiv.appendChild(content);
                setupContentCard(content);
            }

            eventsWrapper.appendChild(eventDiv);
            eventElements.push(eventDiv);
        });
    }

    /**
     * Calculates positions, draws the SVG wave, and places timeline events.
     */
    function drawAndPosition() {
        if (eventElements.length === 0) return;

        // --- WAVE AND POSITIONING LOGIC ---
        const firstHalfCycleWidth = 70;
        const subsequentCycleWidth = 190;

        /**
         * Calculates the x-coordinate on the wave from a given phase.
         * This is the inverse of the phase calculation in getWaveY.
         * @param {number} phase - The phase in radians.
         * @returns {number} The x-coordinate.
         */
        const getXfromPhase = (phase) => {
            const subsequentHalfCycleWidth = subsequentCycleWidth / 2;
            if (phase <= Math.PI) {
                // Within the first half-cycle
                return (phase / Math.PI ) * firstHalfCycleWidth;
            } else {
                // In subsequent half-cycles
                return firstHalfCycleWidth + ((phase - Math.PI) / Math.PI) * subsequentHalfCycleWidth;
            }
        };

        // Calculate the x-coordinate for each event to place it on a zero-crossing point.
        // Phase for the n-th zero-crossing of cosine is (n + 0.5) * PI.
        const eventPositionsX = timelineData.map((_, index) => {
            let phase = (index + 0.5) * Math.PI;
            if (index === 0){
                phase = (index) * Math.PI
            }

            return getXfromPhase(phase);
        });


        // Calculate total width based on the LAST event's new position
        const rightSidePadding = 200;
        const maxXCoord = eventPositionsX[eventPositionsX.length - 1];
        const totalAreaWidth = maxXCoord + rightSidePadding;
        scrollArea.style.width = `${totalAreaWidth}px`;

        const areaHeight = scrollArea.offsetHeight;
        const verticalCenter = areaHeight / 2;

        // Wave amplitude parameters
        const startAmplitude = 40;
        const endAmplitude = 120;

        /**
         * Calculates the y-position of the wave at a given x-coordinate.
         * @param {number} x - The horizontal coordinate.
         * @returns {number} The vertical coordinate on the wave.
         */
        const getWaveY = (x) => {
            let phase;
            // Calculate phase based on position
            const subsequentHalfCycleWidth = subsequentCycleWidth / 2;
            if (x <= firstHalfCycleWidth) {
                const progress = x / firstHalfCycleWidth;
                phase = progress * Math.PI;
            } else {
                const x_after_first = x - firstHalfCycleWidth;
                const subsequentPhase = (x_after_first / subsequentHalfCycleWidth) * Math.PI;
                phase = Math.PI + subsequentPhase;
            }

            const amplitude = startAmplitude + (endAmplitude - startAmplitude) * (x / totalAreaWidth);
            const y = verticalCenter - amplitude * Math.cos(phase);
            return y;
        }

        /**
         * Generates the SVG path 'd' attribute string for the wave.
         * @returns {string} The SVG path data.
         */
        const getPath = () => {
             let d = '';
             const step = 2; // Use a small step for a smoother curve
             for (let x = 0; x <= totalAreaWidth; x += step) {
                 const y = getWaveY(x);
                 d += (x === 0) ? `M ${x},${y}` : ` L ${x},${y}`;
             }
             return d;
        };
        // --- END WAVE LOGIC ---

        // Draw the SVG path
        let path = svgWave.querySelector('path');
        if (!path) {
            path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            svgWave.appendChild(path);
        }
        path.setAttribute('d', getPath());

        // Position each event on the wave using the calculated positions
        eventElements.forEach((event, index) => {
            const data = timelineData[index];
            const x = eventPositionsX[index]; // Use the new calculated x
            // The y position is always the center line for zero-crossings.
            const y = getWaveY(x);

            event.style.left = `${x}px`;
            event.style.top = `${y}px`;

            // Add alternating classes for card positioning, ONLY to non-split events.
            if (data.display !== 'split') {
                 if (index % 2 === 0) { // First card (index 0) is on top.
                    event.classList.add('event-top');
                    event.classList.remove('event-bottom');
                 } else { // Second card (index 1) is on bottom.
                    event.classList.add('event-bottom');
                    event.classList.remove('event-top');
                 }
            }
        });
    }


    // --- Initialization ---

    

    document.fonts.ready.then(() => {
        createLegend();
        createTimelineEvents();
        drawAndPosition();
    });

    window.addEventListener('resize', drawAndPosition);
});