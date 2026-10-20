document.addEventListener('DOMContentLoaded', function() {
    const timelineData = [
        { year: 2013, papers: [
            { name: 'Weight Annotation [TKDE]', articleType: 'ST', taskType: 'Forecasting', url: 'https://arxiv.org/pdf/1308.0484' }
        ] },
        { year: 2014, papers: [
            { name: 'Stochastic Skyline Routing [ICDE]', articleType: 'Specific Models', taskType: 'Others', url: 'https://doi.org/10.1109/ICDE.2014.6816646' }
        ] },
        { year: 2015, papers: [
            { name: 'Personalized Routing [ICDE]', articleType: 'Specific Models', taskType: 'Others', url: 'https://doi.org/10.1109/ICDE.2015.7113313' },
            { name: 'Context-aware Routing [VLDB]', articleType: 'Specific Models', taskType: 'Others', url: 'https://link.springer.com/article/10.1007/s00778-015-0378-1' }
        ] },
        { year: 2016, papers: [
            { name: 'Path-centric Dynamic Uncertain Graphs [PVLDB]', articleType: 'Specific Models', taskType: 'Others', url: 'http://www.vldb.org/pvldb/vol10/p85-dai.pdf' }
        ] },
        { year: 2018, papers: [
            { name: 'Top-K Optimal Sequenced Routing [ICDE]', articleType: 'Specific Models', taskType: 'Others', url: 'https://doi.org/10.1109/ICDE.2018.00058' },
            { name: 'Leaning2Route [ICDE]', articleType: 'Specific Models', taskType: 'Others', url: 'https://doi.org/10.1109/ICDE.2018.00100' },
            { name: 'PACE [VLDBJ]', articleType: 'Specific Models', taskType: 'Others', url: 'https://doi.org/10.1007/s00778-017-0491-4' },
            { name: 'TopK SP Diversity [TKDE]', articleType: 'Specific Models', taskType: 'Others', url: 'https://doi.org/10.1109/ICDE.2018.00238' }
        ] },
        { year: 2019, papers: [
            { name: 'Stochastic Weight Completion [ICDE]', articleType: 'Specific Models', taskType: 'Others', url: 'https://doi.org/10.1109/ICDE.2019.00116' }
        ] },
        { year: 2020, papers: [
            { name: 'TUCH [PVLDB]', articleType: 'Specific Models', taskType: 'Forecasting', url: 'https://link.springer.com/article/10.1007/s00778-019-00585-6' },
            { name: 'Preferenced Routing [VLDBJ]', articleType: 'Specific Models', taskType: 'Forecasting', url: 'https://link.springer.com/article/10.1007/s00778-020-00608-7' },
            { name: 'Anytime Routing [PVLDB]', articleType: 'Specific Models', taskType: 'Forecasting', url: 'https://www.vldb.org/pvldb/vol13/p1555-pedersen.pdf' },
            { name: 'Path Ranking [TKDE]', articleType: 'Specific Models', taskType: 'Forecasting', url: 'https://doi.org/10.1109/TKDE.2020.3025024' }
        ] },
        { year: 2021, papers: [
            { name: 'Path Representation Learning [IJCAI]', articleType: 'Plugins', taskType: 'Forecasting', url: 'https://arxiv.org/pdf/2106.09373' }
        ] },
        { year: 2022, papers: [
            { name: 'Temporal Path Representation Learning [ICDE]', articleType: 'Specific Models', taskType: 'Forecasting', url: 'https://arxiv.org/pdf/2203.16110' }
        ] },
        { year: 2023, papers: [
            { name: 'LightPath [KDD]', articleType: 'AutoML', taskType: 'Forecasting', url: 'https://arxiv.org/pdf/2307.10171' }
        ] },
        { year: 2024, papers: [
            { name: 'DOT [SIGMOD]', articleType: 'AutoML', taskType: 'Forecasting', url: 'https://arxiv.org/pdf/2307.03048' },
            { name: 'PACE Routing [VLDB]', articleType: 'AutoML', taskType: 'Forecasting', url: 'https://www.vldb.org/pvldb/vol17/p2893-xu.pdf' },
            { name: 'Crystal Property Estimation [ECML]', articleType: 'AutoML', taskType: 'Forecasting', url: 'https://link.springer.com/chapter/10.1007/978-3-031-70381-2_15' }
        ] },
        { year: 2025, papers: [
            { name: 'MM-Path [KDD]', articleType: 'Specific Models', taskType: 'Forecasting', url: 'https://arxiv.org/pdf/2411.18428' }
        ] }
    ];

    const scrollArea = document.getElementById('spatio-timeline-scroll-area');
    if (!scrollArea) return;

    const eventsWrapper = scrollArea.querySelector('.timeline-events-wrapper');
    const svgWave = document.getElementById('spatioTimelineWave');
    let eventElements = [];

    function createPapersList(papers) {
        return papers.map(paper => {
            const nameHtml = paper.url
                ? `<a href="${paper.url}" target="_blank" class="paper-link">${paper.name}</a>`
                : `<span>${paper.name}</span>`;
            return `<li><span class="marker hollow-circle"></span>${nameHtml}</li>`;
        }).join('');
    }

    function setupContentCard(contentDiv) {
        const contentUl = contentDiv.querySelector('ul');
        if (!contentUl) return;
        setTimeout(() => {
            if (contentUl.scrollHeight > contentUl.clientHeight) {
                contentUl.classList.add('is-expanded');
                contentUl.classList.add('is-scrollable');
            }
        }, 100);
    }

    function createTimelineEvents() {
        eventsWrapper.innerHTML = '';
        eventElements = [];
        timelineData.forEach(data => {
            const eventDiv = document.createElement('div');
            eventDiv.className = 'timeline-event limit_width';
            eventDiv.innerHTML = `<div class="timeline-point"></div><div class="timeline-year">${data.year}</div>`;
            const content = document.createElement('div');
            content.className = 'timeline-content limit_width';
            content.innerHTML = `<ul>${createPapersList(data.papers)}</ul>`;
            eventDiv.appendChild(content);
            eventsWrapper.appendChild(eventDiv);
            setupContentCard(content);
            eventElements.push(eventDiv);
        });
    }

    function drawAndPosition() {
        if (eventElements.length === 0) return;

        const firstHalfCycleWidth = 50;
        const subsequentCycleWidth = 154;
        const subsequentHalfCycleWidth = subsequentCycleWidth / 2;
        const getXfromPhase = phase => {
            if (phase <= Math.PI) {
                return phase / Math.PI * firstHalfCycleWidth;
            }
            return firstHalfCycleWidth + (phase - Math.PI) / Math.PI * subsequentHalfCycleWidth;
        };

        const eventPositionsX = timelineData.map((_, index) => {
            const phase = index === 0 ? 0 : (index + 0.5) * Math.PI;
            return getXfromPhase(phase);
        });

        const totalAreaWidth = 1000;
        scrollArea.style.width = `${totalAreaWidth}px`;
        const verticalCenter = scrollArea.offsetHeight / 2;

        let path = svgWave.querySelector('path');
        if (!path) {
            path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            svgWave.appendChild(path);
        }
        path.setAttribute('d', `M 0,${verticalCenter} L ${totalAreaWidth},${verticalCenter}`);

        eventElements.forEach((event, index) => {
            event.style.left = `${eventPositionsX[index]}px`;
            event.style.top = `${verticalCenter}px`;
            event.classList.toggle('event-top', index % 2 === 0);
            event.classList.toggle('event-bottom', index % 2 !== 0);
        });
    }

    createTimelineEvents();
    drawAndPosition();
    window.addEventListener('resize', drawAndPosition);
});
