document.addEventListener('DOMContentLoaded', function() {
    // --- Data Configuration ---
    const articleTypes = {
        '自动机器学习': 'square',
        '评测基准': 'circle',
        '基础模型': 'diamond',
        '插件': 'star', // Added 插件 type with star shape
        '特定模型': 'triangle'
    };
    const taskTypes = {
        '时序预测': 'blue',
        '时序分类': 'green',
        '异常检测': 'red',
        '其他任务': 'black'
    };
    
    const taskColor = {
        '时序预测': '#3b82f6',
        '时序分类': '#22c55e',
        '异常检测': '#ef4444',
        '其他任务': '#575757'
    };

    // --- Use the new data provided by the user ---
    const timelineData = [
        {"year":2013, "papers":[
            { "name": "STHMM [PVLDB]", "articleType": "特定模型", "taskType": "时序预测","url":"https://www.vldb.org/pvldb/vol6/p769-yang.pdf"}

        ]},
        {"year":2018, "papers":[
            { "name": "UncertainTS [VLDBJ]", "articleType": "特定模型", "taskType": "其他任务","url":"https://doi.org/10.1007/s00778-018-0494-9"},
            { "name": "DAE [MDM]", "articleType": "特定模型", "taskType": "异常检测","url":"https://doi.org/10.1109/MDM.2018.00029"},
            { "name": "AECRNN [CIKM]", "articleType": "特定模型", "taskType": "时序预测","url":"https://dl.acm.org/doi/10.1145/3269206.3269310"}
        ]},
        {"year":2019, "papers":[
            { "name": "RAE [IJCAI]", "articleType": "特定模型", "taskType": "异常检测","url":"https://doi.org/10.24963/ijcai.2019/378"}
        ]},
        {"year":2020, "papers":[
            { "name": "DGCRNN [ICDE]", "articleType": "特定模型", "taskType": "时序预测","url":"https://doi.org/10.1109/ICDE48307.2020.00126"}
        ]},
        {"year":2021, "papers":[
            { "name": "EnhanceNet [ICDE]", "articleType": "插件", "taskType": "时序预测","url":"https://ieeexplore.ieee.org/document/9458855"},
            { "name": "AutoCTS [PVLDB]", "articleType": "自动机器学习", "taskType": "时序预测","url":"https://arxiv.org/pdf/2112.11174"},
            { "name": "CAE [PVLDB]", "articleType": "特定模型", "taskType": "时序预测","url":"https://dl.acm.org/doi/10.14778/3494124.3494142"}
        ]},
        {"year":2022, "papers":[
            { "name": "Triformer [PVLDB]", "articleType": "特定模型", "taskType": "时序预测","url":"https://arxiv.org/pdf/2204.13767"},
            { "name": "ST-WA [ICDE]", "articleType": "特定模型", "taskType": "时序预测","url":"https://arxiv.org/pdf/2203.15737"},
            { "name": "RAE [ICDE]", "articleType": "特定模型", "taskType": "异常检测","url":"https://doi.org/10.1109/ICDE53745.2022.00273"},
            { "name": "VQRAE [ICDE]", "articleType": "特定模型", "taskType": "异常检测","url":"https://doi.org/10.1109/ICDE53745.2022.00105"},
            { "name": "HyperVerlet [AAAI]", "articleType": "特定模型", "taskType": "时序预测","url":"https://aaai.org/papers/04575-hyperverlet-a-symplectic-hypersolver-for-hamiltonian-systems/"}
        ]},
        {"year":2023, "papers":[
            { "name": "AutoCTS+ [SIGMOD]", "articleType": "自动机器学习", "taskType": "时序预测","url":"https://dl.acm.org/doi/10.1145/3588951"},
            { "name": "MagicSclar [PVLDB]", "articleType": "特定模型", "taskType": "时序预测","url":"https://dl.acm.org/doi/10.14778/3611540.3611566"},
            { "name": "LightTS [SIGMOD]", "articleType": "特定模型", "taskType": "时序分类","url":"https://openreview.net/forum?id=1oECpm4Xm9"},
            { "name": "CGF [TKDE]", "articleType": "特定模型", "taskType": "时序预测","url":"https://ieeexplore.ieee.org/document/10064188"}
        ]},
        {"year":2024, "papers":[
            { "name": "AutoCTS++ [VLDBJ]", "articleType": "自动机器学习", "taskType": "时序预测","url":"https://link.springer.com/article/10.1007/s00778-024-00872-x"},
            { "name": "PathFormer [ICLR]", "articleType": "特定模型", "taskType": "时序预测","url":"https://arxiv.org/pdf/2402.05956"},
            { "name": "TFB [PVLDB]", "articleType": "评测基准", "taskType": "时序预测","url":"https://dl.acm.org/doi/10.14778/3665844.3665863"},
            { "name": "MTSF-DG [PVLDB]", "articleType": "特定模型", "taskType": "时序预测","url":"https://dl.acm.org/doi/pdf/10.14778/3636218.3636230"},
            { "name": "DARF [PVLDB]", "articleType": "特定模型", "taskType": "时序预测","url":"https://dl.acm.org/doi/10.14778/3636218.3636231"},
            { "name": "STSimSiam [PVLDB]", "articleType": "特定模型", "taskType": "时序预测","url":"https://arxiv.org/pdf/2404.14999"},
            { "name": "QCore [PVLDB]", "articleType": "特定模型", "taskType": "时序分类","url":"https://dl.acm.org/doi/10.14778/3681954.3681957"},
            { "name": "Orca [CIKM]", "articleType": "特定模型", "taskType": "时序预测","url":"https://arxiv.org/pdf/2407.20053"}
        ]},
        // --- NEW: Example of a split display --- "display": "split", "index": 6,
        {"year":2025,  "papers":[
            { "name": "TAB [PVLDB]", "articleType": "评测基准", "taskType": "时序预测","url":"https://arxiv.org/pdf/2506.18046"},
            { "name": "TSFM-Bench [KDD]", "articleType": "评测基准", "taskType": "时序预测","url":"https://arxiv.org/pdf/2410.11802"},
            { "name": "AimTS [ICDE]", "articleType": "基础模型", "taskType": "时序分类","url":"https://arxiv.org/pdf/2504.09993"},
            { "name": "DADA [ICLR]", "articleType": "基础模型", "taskType": "异常检测","url":"https://arxiv.org/pdf/2405.15273"},
            { "name": "ROSE [ICML]", "articleType": "基础模型", "taskType": "时序预测","url":"https://arxiv.org/pdf/2405.17478"},
            { "name": "LightGTS [ICML]", "articleType": "基础模型", "taskType": "时序预测","url":"https://arxiv.org/pdf/2506.06005"},
            { "name": "FACT [PVLDB]", "articleType": "自动机器学习", "taskType": "时序预测","url":"https://www.vldb.org/pvldb/vol18/p144-wu.pdf"},
            { "name": "LipFormer [ICDE]", "articleType": "特定模型", "taskType": "时序预测","url":"https://arxiv.org/pdf/2501.10448"},
            { "name": "SSD-TS [KDD]", "articleType": "特定模型", "taskType": "其他任务","url":""},
            { "name": "IGCL [KDD]", "articleType": "特定模型", "taskType": "其他任务","url":""},
            { "name": "DUET [KDD]", "articleType": "特定模型", "taskType": "时序预测","url":"https://arxiv.org/pdf/2412.10859"},
            { "name": "K<sup>2</sup>VAE [ICML]", "articleType": "特定模型", "taskType": "时序预测","url":"https://arxiv.org/pdf/2505.23017"},
            { "name": "MemFormer [PVLDB]", "articleType": "特定模型", "taskType": "时序预测","url":"https://dl.acm.org/doi/10.14778/3705829.3705842"},
            { "name": "TEAM [PVLDB]", "articleType": "特定模型", "taskType": "时序预测","url":"https://arxiv.org/pdf/2410.19192"},
            { "name": "ContraAD [PVLDB]", "articleType": "特定模型", "taskType": "异常检测","url":""},
            { "name": "TimeDC [PVLDB]", "articleType": "特定模型", "taskType": "时序预测","url":""},
            { "name": "Catch [ICLR]", "articleType": "特定模型", "taskType": "异常检测","url":"https://arxiv.org/pdf/2410.12261"},
            { "name": "Air-DualODE [ICLR]", "articleType": "特定模型", "taskType": "时序预测","url":"https://arxiv.org/pdf/2410.19892"},
            { "name": "MM-Path [KDD]", "articleType": "特定模型", "taskType": "时序预测","url":"https://arxiv.org/pdf/2411.18428"}
        ]}
    ];
    const timelineData1 = [
        {"year":2013, "papers":[
            { "name": "Weight Annotation [TKDE]", "articleType": "ST", "taskType": "Forecasting","url":"https://arxiv.org/pdf/1308.0484"}

        ]},
        {"year":2014, "papers":[
            { "name": "Stochastic Skyline Routing [ICDE]", "articleType": "Specific Models", "taskType": "Others","url":"https://doi.org/10.1109/ICDE.2014.6816646"},
        ]},
        {"year":2015, "papers":[
            { "name": "Personalized Routing [ICDE]", "articleType": "Specific Models", "taskType": "Others","url":"https://doi.org/10.1109/ICDE.2015.7113313"},
            { "name": "Context-aware Routing [VLDB]", "articleType": "Specific Models", "taskType": "Others","url":"https://link.springer.com/article/10.1007/s00778-015-0378-1"},

        ]},
        {"year":2016, "papers":[
            { "name": "Path-centric Dynamic Uncertain Graphs [PVLDB]", "articleType": "Specific Models", "taskType": "Others","url":"http://www.vldb.org/pvldb/vol10/p85-dai.pdf"},
        ]},
        {"year":2018, "papers":[
            { "name": "Top-K Optimal Sequenced Routing [ICDE]", "articleType": "Specific Models", "taskType": "Others","url":"https://doi.org/10.1109/ICDE.2018.00058"},
            { "name": "Leaning2Route [ICDE]", "articleType": "Specific Models", "taskType": "Others","url":"https://doi.org/10.1109/ICDE.2018.00100"},
            { "name": "PACE [VLDBJ]", "articleType": "Specific Models", "taskType": "Others","url":"https://doi.org/10.1007/s00778-017-0491-4"},
            { "name": "TopK SP Diversity [TKDE]", "articleType": "Specific Models", "taskType": "Others","url":"https://doi.org/10.1109/ICDE.2018.00238"},

        ]},
        {"year":2019, "papers":[
            { "name": "Stochastic Weight Completion [ICDE]", "articleType": "Specific Models", "taskType": "Others","url":"https://people.cs.aau.dk/~byang/papers/ICDE2019-Stochastic Weight Completion.pdf"},
         ]},
        {"year":2020, "papers":[
            { "name": "TUCH [PVLDB]", "articleType": "Specific Models", "taskType": "Forecasting","url":"https://link.springer.com/article/10.1007/s00778-019-00585-6"},
            { "name": "Preferenced Routing [PVLDB]", "articleType": "Specific Models", "taskType": "Forecasting","url":"https://link.springer.com/article/10.1007/s00778-020-00608-7"},
            { "name": "Anytime Routing [PVLDB]", "articleType": "Specific Models", "taskType": "Forecasting","url":"https://www.vldb.org/pvldb/vol13/p1555-pedersen.pdf"},
            { "name": "Path Ranking [TKDE]", "articleType": "Specific Models", "taskType": "Forecasting","url":"https://doi.org/10.1109/TKDE.2020.3025024"},
        ]},
        {"year":2021, "papers":[
            { "name": "Path Representation Learning [IJCAI]", "articleType": "Plugins", "taskType": "Forecasting","url":"https://arxiv.org/pdf/2106.09373"},
        ]},
        {"year":2022, "papers":[
            { "name": "Temporal Path Representation Learning [ICDE]", "articleType": "Specific Models", "taskType": "Forecasting","url":"https://arxiv.org/pdf/2203.16110"},
        ]},
        {"year":2023, "papers":[
            { "name": "LightPath [KDD]", "articleType": "AutoML", "taskType": "Forecasting","url":"https://arxiv.org/pdf/2307.10171"},
        ]},
        {"year":2024, "papers":[
            { "name": "DOT [SIGMOD]", "articleType": "AutoML", "taskType": "Forecasting","url":"https://arxiv.org/pdf/2307.03048"},
            { "name": "PACE Routing [VLDB]", "articleType": "AutoML", "taskType": "Forecasting","url":"https://www.vldb.org/pvldb/vol17/p2893-xu.pdf"},
            { "name": "Crystal Property Estimation [ECML]", "articleType": "AutoML", "taskType": "Forecasting","url":"https://link.springer.com/chapter/10.1007/978-3-031-70381-2_15"},
        ]},
        // --- NEW: Example of a split display --- "display": "split", "index": 6,
        {"year":2025,  "papers":[
               { "name": "MM-Path [KDD]", "articleType": "Specific Models", "taskType": "Forecasting","url":"https://arxiv.org/pdf/2411.18428"}

        ]}
    ];
// --- DOM Elements ---
const scrollArea = document.getElementById('timeline-scroll-area');
const scrollArea1 = document.getElementById('timeline-scroll-area1');
const eventsWrapper = scrollArea.querySelector('.timeline-events-wrapper');
const eventsWrapper1 = scrollArea1.querySelector('.timeline-events-wrapper');
const svgWave = document.getElementById('timelineWave');
const svgWave1 = document.getElementById('timelineWave1');

const legendContainer = document.getElementById('legend');
// const legendContainer1= document.getElementById('legend1');
let eventElements = [];
let eventElements1 = [];
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
        'Outlier Detection': 'Outlier Detection',
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
//     legendContainer1.innerHTML = `
//     <div class="legend-section">${articleHtml}</div>
//     <div class="legend-section">${taskHtml}</div>
// `;
}

function createPapersList(papers,ann) {
    if (ann)
    {
        return papers.map(paper => {
            const shape = articleTypes[paper.articleType] || 'circle';
            const color = taskTypes[paper.taskType] || 'black';
            const nameHtml = paper.url
                ? `<a href="${paper.url}" target="_blank" class="paper-link">${paper.name}</a>`
                : `<span>${paper.name}</span>`;
            return `<li><span class="marker ${shape} ${color}"></span>${nameHtml}</li>`;
        }).join('');
    }else
    {
    {
        return papers.map(paper => {
            const shape = articleTypes[paper.articleType] || 'circle';
            const color = taskTypes[paper.taskType] || 'black';
            const nameHtml = paper.url
                ? `<a href="${paper.url}" target="_blank" class="paper-link">${paper.name}</a>`
                : `<span>${paper.name}</span>`;
            return `<li><span class="marker hollow-circle"></span>${nameHtml}</li>`;
        }).join('');
    }
    }
    
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
                topContent.innerHTML = `<ul>${createPapersList(topPapers,true)}</ul>`;
                eventDiv.appendChild(topContent);
                setupContentCard(topContent);
            }

            // Create bottom content card
            if (bottomPapers.length > 0) {
                const bottomContent = document.createElement('div');
                bottomContent.className = 'timeline-content content-bottom';
                bottomContent.innerHTML = `<ul>${createPapersList(bottomPapers,true)}</ul>`;
                eventDiv.appendChild(bottomContent);
                setupContentCard(bottomContent);
            }
        } else {
            // Create single content card
            const content = document.createElement('div');
            content.className = 'timeline-content';
            content.innerHTML = `<ul>${createPapersList(data.papers,true)}</ul>`;
            eventDiv.appendChild(content);
            setupContentCard(content);
        }
        eventsWrapper.appendChild(eventDiv)
        eventElements.push(eventDiv);
    });
    eventElements1 = [];

    timelineData1.forEach(data => {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'timeline-event limit_width';
        eventDiv.innerHTML = `<div class="timeline-point"></div><div class="timeline-year">${data.year}</div>`;

        if (data.display === 'split') {
            eventDiv.classList.add('event-split');
            const middleIndex = data.index;
            const topPapers = data.papers.slice(0, middleIndex);
            const bottomPapers = data.papers.slice(middleIndex);

            // Create top content card
            if (topPapers.length > 0) {
                const topContent = document.createElement('div');
                topContent.className = 'timeline-content content-top limit_width';
                topContent.style.width = '138px;';
                topContent.innerHTML = `<ul>${createPapersList(topPapers,false)}</ul>`;
                eventDiv.appendChild(topContent);
                setupContentCard(topContent);
            }

            // Create bottom content card
            if (bottomPapers.length > 0) {
                const bottomContent = document.createElement('div');
                bottomContent.className = 'timeline-content content-bottom limit_width';
                bottomContent.style.width = '138px;';
                bottomContent.innerHTML = `<ul>${createPapersList(bottomPapers,false)}</ul>`;
                eventDiv.appendChild(bottomContent);
                setupContentCard(bottomContent);
            }
        } else {
            // Create single content card
            const content = document.createElement('div');
            content.className = 'timeline-content limit_width';
            content.innerHTML = `<ul>${createPapersList(data.papers,false)}</ul>`;
            eventDiv.appendChild(content);
            setupContentCard(content);
        }
        eventsWrapper1.appendChild(eventDiv)
        eventElements1.push(eventDiv);
    });

}

/**
 * Calculates positions, draws the SVG wave, and places timeline events.
 */
function drawAndPosition() {
    if (eventElements.length === 0) return;

    // --- WAVE AND POSITIONING LOGIC ---
    const firstHalfCycleWidth = 110;
    const subsequentCycleWidth = 183;
    const firstHalfCycleWidth1 = 50;
    const subsequentCycleWidth1 = 154;
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
    const getXfromPhase1 = (phase) => {
        const subsequentHalfCycleWidth = subsequentCycleWidth1 / 2;
        if (phase <= Math.PI) {
            // Within the first half-cycle
            return (phase / Math.PI ) * firstHalfCycleWidth1;
        } else {
            // In subsequent half-cycles
            return firstHalfCycleWidth1 + ((phase - Math.PI) / Math.PI) * subsequentHalfCycleWidth;

    };
}
    // Calculate the x-coordinate for each event to place it on a zero-crossing point.
    // Phase for the n-th zero-crossing of cosine is (n + 0.5) * PI.
    const eventPositionsX = timelineData.map((_, index) => {
        let phase = (index + 0.5) * Math.PI;
        if (index === 0){
            phase = (index) * Math.PI
        }

        return getXfromPhase(phase);
    });

    const eventPositionsX1 = timelineData1.map((_, index) => {
        let phase = (index + 0.5) * Math.PI;
        if (index === 0){
            phase = (index) * Math.PI
        }

        return getXfromPhase1(phase);
    });

    // Calculate total width based on the LAST event's new position
    const rightSidePadding = 200;
    const maxXCoord = eventPositionsX[eventPositionsX.length - 1];
    const totalAreaWidth = maxXCoord + rightSidePadding;
    scrollArea.style.width = `${totalAreaWidth}px`;
    scrollArea1.style.width = `${totalAreaWidth}px`;
    const areaHeight = scrollArea.offsetHeight;
    const verticalCenter = areaHeight / 2;

    // Wave amplitude parameters
    const startAmplitude = 0;
    const endAmplitude = 0;

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
    let path1 = svgWave1.querySelector('path');
    if (!path) {
        path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        svgWave.appendChild(path);
    }
    if (!path1) {
        path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        svgWave1.appendChild(path1);
    }
    path.setAttribute('d', getPath());
    path1.setAttribute('d', getPath());
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

    eventElements1.forEach((event, index) => {
        const data = timelineData1[index];
        const x = eventPositionsX1[index]; // Use the new calculated x
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