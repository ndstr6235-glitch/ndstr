/* ============================================================
   VERTEX CAPITAL - JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ── Navbar scroll effect ──
    const navbar = document.getElementById('navbar');
    const handleScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // ── Mobile menu toggle ──
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        // Close on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => navLinks.classList.remove('active'));
        });
    }

    // ── Animated counter ──
    const counters = document.querySelectorAll('.stat-number[data-target]');
    let countersAnimated = false;

    const animateCounters = () => {
        if (countersAnimated) return;
        countersAnimated = true;

        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const duration = 2000;
            const start = performance.now();

            const update = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.round(target * eased);
                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target;
                }
            };
            requestAnimationFrame(update);
        });
    };

    // Trigger counters when hero stats are visible
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });
        observer.observe(statsSection);
    }

    // ── Scroll reveal animations ──
    const revealElements = document.querySelectorAll(
        '.about-card, .fund-card, .team-card, .security-item, .process-step, .perf-stat, .tier-card'
    );

    // Track the sequential index of each element so stagger delays work
    // correctly even when multiple elements enter the viewport at once.
    const revealIndexMap = new Map();
    revealElements.forEach((el, idx) => revealIndexMap.set(el, idx));

    const revealObserver = new IntersectionObserver(entries => {
        // Determine the lowest sequential index in this batch so we can
        // compute a relative stagger offset for each entry.
        let batchMin = Infinity;
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const idx = revealIndexMap.get(entry.target);
                if (idx < batchMin) batchMin = idx;
            }
        });

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const idx = revealIndexMap.get(entry.target);
                const offset = idx - batchMin;
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, offset * 80);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });

    // ── Performance chart ──
    const chartCanvas = document.getElementById('performanceChart');
    if (chartCanvas && typeof Chart !== 'undefined') {
        const ctx = chartCanvas.getContext('2d');

        const gradient = ctx.createLinearGradient(0, 0, 0, 340);
        gradient.addColorStop(0, 'rgba(201, 168, 76, 0.25)');
        gradient.addColorStop(1, 'rgba(201, 168, 76, 0)');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: [
                    'Q1 21', 'Q2 21', 'Q3 21', 'Q4 21',
                    'Q1 22', 'Q2 22', 'Q3 22', 'Q4 22',
                    'Q1 23', 'Q2 23', 'Q3 23', 'Q4 23',
                    'Q1 24', 'Q2 24', 'Q3 24', 'Q4 24',
                    'Q1 25', 'Q2 25', 'Q3 25'
                ],
                datasets: [{
                    label: 'Kumulativni vynos (%)',
                    data: [
                        3.2, 7.0, 11.1, 14.1,
                        15.3, 15.0, 15.8, 17.3,
                        19.1, 21.6, 23.0, 25.1,
                        27.5, 30.6, 33.2, 35.4,
                        37.5, 40.3, 42.2
                    ],
                    borderColor: '#c9a84c',
                    borderWidth: 2.5,
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    pointBackgroundColor: '#c9a84c',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 6,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#0f1f33',
                        titleColor: 'rgba(255,255,255,0.6)',
                        bodyColor: '#fff',
                        bodyFont: { size: 14, weight: 'bold' },
                        padding: 12,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: item => `+${item.parsed.y.toFixed(1)} %`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: {
                            color: '#94a3b8',
                            font: { size: 11 },
                            maxRotation: 45,
                        }
                    },
                    y: {
                        border: { display: false },
                        grid: {
                            color: 'rgba(226,232,240,0.5)',
                        },
                        ticks: {
                            color: '#94a3b8',
                            font: { size: 11 },
                            callback: v => `${v} %`
                        },
                        beginAtZero: true,
                    }
                },
                interaction: {
                    mode: 'index',
                    intersect: false,
                }
            }
        });
    }

    // ── Smooth scroll for anchor links ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;               // skip bare "#" links
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ── Contact form (demo) ──
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'Odesláno!';
            btn.style.background = '#059669';
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
                form.reset();
            }, 3000);
        });
    }

    // ── Allocation bars animation ──
    const allocationBars = document.querySelectorAll('.allocation-bar');
    const barObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.dataset.width;
                barObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    allocationBars.forEach(bar => {
        // Store the target width before zeroing so the observer can restore it
        bar.dataset.width = getComputedStyle(bar).getPropertyValue('--width').trim();
        bar.style.width = '0';
        barObserver.observe(bar);
    });

    // ── Investor Warning Modal ──
    const investorModal = document.getElementById('investorModal');
    const investorAccept = document.getElementById('investorAccept');
    if (investorModal && investorAccept) {
        const dismissed = localStorage.getItem('vc_investor_dismissed');
        if (dismissed) {
            investorModal.classList.add('hidden');
            document.body.style.overflow = '';
        } else {
            document.body.style.overflow = 'hidden';
        }
        investorAccept.addEventListener('click', () => {
            investorModal.classList.add('hidden');
            document.body.style.overflow = '';
            localStorage.setItem('vc_investor_dismissed', '1');
        });
    }

    // ── Cookie Consent Banner ──
    const cookieBanner = document.getElementById('cookieBanner');
    const cookieAcceptAll = document.getElementById('cookieAcceptAll');
    const cookieNecessary = document.getElementById('cookieNecessary');
    const cookieSettings = document.getElementById('cookieSettings');
    if (cookieBanner) {
        const consent = localStorage.getItem('vc_cookie_consent');
        if (consent) {
            cookieBanner.classList.add('hidden');
        }
        const dismissCookies = (type) => {
            localStorage.setItem('vc_cookie_consent', type);
            cookieBanner.classList.add('hidden');
        };
        if (cookieAcceptAll) cookieAcceptAll.addEventListener('click', () => dismissCookies('all'));
        if (cookieNecessary) cookieNecessary.addEventListener('click', () => dismissCookies('necessary'));
        if (cookieSettings) cookieSettings.addEventListener('click', () => dismissCookies('settings'));
    }

    // ── Portfolio Allocation Doughnut Chart ──
    const allocCanvas = document.getElementById('allocationChart');
    if (allocCanvas && typeof Chart !== 'undefined') {
        new Chart(allocCanvas.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Nemovitosti', 'ESG projekty', 'Financni trhy', 'Hotovost'],
                datasets: [{
                    data: [45, 35, 15, 5],
                    backgroundColor: [
                        '#2d5a8e',
                        '#059669',
                        '#c9a84c',
                        '#94a3b8'
                    ],
                    borderWidth: 0,
                    hoverOffset: 8,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle',
                            font: { size: 12, family: 'Inter' },
                            color: '#64748b',
                        }
                    },
                    tooltip: {
                        backgroundColor: '#0f1f33',
                        bodyColor: '#fff',
                        bodyFont: { size: 13, weight: 'bold' },
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: item => ` ${item.label}: ${item.parsed} %`
                        }
                    }
                }
            }
        });
    }

    // ── Sector Performance Bar Chart ──
    const sectorCanvas = document.getElementById('sectorChart');
    if (sectorCanvas && typeof Chart !== 'undefined') {
        const sCtx = sectorCanvas.getContext('2d');
        const barGradient1 = sCtx.createLinearGradient(0, 0, 0, 280);
        barGradient1.addColorStop(0, 'rgba(45,90,142,0.9)');
        barGradient1.addColorStop(1, 'rgba(45,90,142,0.3)');
        const barGradient2 = sCtx.createLinearGradient(0, 0, 0, 280);
        barGradient2.addColorStop(0, 'rgba(5,150,105,0.9)');
        barGradient2.addColorStop(1, 'rgba(5,150,105,0.3)');
        const barGradient3 = sCtx.createLinearGradient(0, 0, 0, 280);
        barGradient3.addColorStop(0, 'rgba(201,168,76,0.9)');
        barGradient3.addColorStop(1, 'rgba(201,168,76,0.3)');

        new Chart(sCtx, {
            type: 'bar',
            data: {
                labels: ['Q1', 'Q2', 'Q3'],
                datasets: [
                    {
                        label: 'Nemovitosti',
                        data: [2.8, 3.1, 2.4],
                        backgroundColor: barGradient1,
                        borderRadius: 6,
                        borderSkipped: false,
                    },
                    {
                        label: 'ESG projekty',
                        data: [3.5, 4.2, 3.1],
                        backgroundColor: barGradient2,
                        borderRadius: 6,
                        borderSkipped: false,
                    },
                    {
                        label: 'Financni trhy',
                        data: [1.2, 1.8, 0.9],
                        backgroundColor: barGradient3,
                        borderRadius: 6,
                        borderSkipped: false,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle',
                            font: { size: 12, family: 'Inter' },
                            color: '#64748b',
                        }
                    },
                    tooltip: {
                        backgroundColor: '#0f1f33',
                        bodyColor: '#fff',
                        bodyFont: { size: 13 },
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: item => ` ${item.dataset.label}: +${item.parsed.y} %`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: '#94a3b8', font: { size: 12 } }
                    },
                    y: {
                        border: { display: false },
                        grid: { color: 'rgba(226,232,240,0.5)' },
                        ticks: {
                            color: '#94a3b8',
                            font: { size: 11 },
                            callback: v => `${v} %`
                        },
                        beginAtZero: true,
                    }
                }
            }
        });
    }

    // ── Monthly Returns Heatmap ──
    const heatmapContainer = document.getElementById('heatmapContainer');
    if (heatmapContainer) {
        const months = ['Led', 'Uno', 'Bre', 'Dub', 'Kve', 'Cer', 'Cvc', 'Srp', 'Zar', 'Rij', 'Lis', 'Pro'];
        const years = {
            '2025': [0.8, 0.7, 0.6, 0.9, 1.0, 0.9, 1.0, 0.6, 0.3, null, null, null],
            '2024': [0.6, 0.8, 1.0, 0.7, 1.2, 1.2, 0.9, 0.8, 0.9, 0.7, 0.8, 0.7],
            '2023': [0.5, 0.6, 0.7, 0.4, 0.9, 1.0, 0.8, -0.2, 0.8, 0.6, 0.7, 0.8],
            '2022': [0.4, 0.5, 0.3, -0.1, -0.2, 0.0, 0.3, 0.2, 0.3, 0.5, 0.6, 0.4],
            '2021': [1.0, 1.1, 1.1, 0.9, 1.2, 1.5, 1.4, 1.2, 1.3, 0.9, 0.8, 0.8],
        };

        const getClass = (val) => {
            if (val === null) return 'hm-empty';
            if (val >= 1.0) return 'hm-strong-pos';
            if (val > 0) return 'hm-pos';
            if (val === 0) return 'hm-neutral';
            return 'hm-neg';
        };

        let html = '<table class="heatmap-table"><thead><tr><th></th>';
        months.forEach(m => html += `<th>${m}</th>`);
        html += '<th>Rok</th></tr></thead><tbody>';

        Object.entries(years).forEach(([year, data]) => {
            html += `<tr><td>${year}</td>`;
            let yearTotal = 0;
            let count = 0;
            data.forEach(val => {
                if (val !== null) { yearTotal += val; count++; }
                const display = val !== null ? `${val > 0 ? '+' : ''}${val.toFixed(1)}%` : '-';
                html += `<td class="${getClass(val)}">${display}</td>`;
            });
            const totalClass = yearTotal >= 5 ? 'hm-strong-pos' : yearTotal > 0 ? 'hm-pos' : 'hm-neg';
            html += `<td class="${totalClass}" style="font-weight:800;">+${yearTotal.toFixed(1)}%</td>`;
            html += '</tr>';
        });

        html += '</tbody></table>';
        heatmapContainer.innerHTML = html;
    }

    // ══════════════════════════════════════════════════════════════
    //  LIVE DATA ENGINE
    // ══════════════════════════════════════════════════════════════

    // ── State ──
    const liveState = {
        nav: 1.1847,
        navBase: 1.1847,
        dayChange: 0.03,
        ytd: 6.9,
        eurCzk: null,
        eurCzkBase: null,
    };

    // ── Flash animation helper ──
    function flashValue(el, direction) {
        el.classList.remove('flash-up', 'flash-down');
        void el.offsetWidth; // reflow
        el.classList.add(direction === 'up' ? 'flash-up' : 'flash-down');
    }

    // ── Update live stats display ──
    function updateLiveDisplay() {
        const navEl = document.getElementById('liveNav');
        const dayEl = document.getElementById('liveDayChange');
        const ytdEl = document.getElementById('liveYtd');
        const eurEl = document.getElementById('liveEurCzk');
        const timeEl = document.getElementById('liveTime');

        if (navEl) {
            navEl.textContent = liveState.nav.toFixed(4) + ' CZK';
        }
        if (dayEl) {
            const sign = liveState.dayChange >= 0 ? '+' : '';
            dayEl.textContent = sign + liveState.dayChange.toFixed(2) + ' %';
            dayEl.className = 'live-value ' + (liveState.dayChange >= 0 ? 'positive' : 'negative');
        }
        if (ytdEl) {
            ytdEl.textContent = '+' + liveState.ytd.toFixed(1) + ' %';
            ytdEl.className = 'live-value positive';
        }
        if (eurEl && liveState.eurCzk !== null) {
            eurEl.textContent = liveState.eurCzk.toFixed(3);
        }
        if (timeEl) {
            const now = new Date();
            const pad = n => String(n).padStart(2, '0');
            timeEl.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
        }
    }

    // ── Simulate micro NAV movements ──
    function tickNav() {
        const change = (Math.random() - 0.48) * 0.0003; // slight upward bias
        const oldNav = liveState.nav;
        liveState.nav = Math.max(liveState.nav + change, 0.9);
        liveState.dayChange = ((liveState.nav - liveState.navBase) / liveState.navBase) * 100;

        const navEl = document.getElementById('liveNav');
        if (navEl) flashValue(navEl, liveState.nav >= oldNav ? 'up' : 'down');

        updateLiveDisplay();
    }

    // ── Fetch real EUR/CZK rate ──
    async function fetchEurCzk() {
        try {
            const res = await fetch('https://api.frankfurter.dev/v1/latest?base=EUR&symbols=CZK');
            const data = await res.json();
            if (data && data.rates && data.rates.CZK) {
                const oldRate = liveState.eurCzk;
                liveState.eurCzk = data.rates.CZK;
                if (!liveState.eurCzkBase) liveState.eurCzkBase = data.rates.CZK;
                const eurEl = document.getElementById('liveEurCzk');
                if (eurEl && oldRate !== null) {
                    flashValue(eurEl, liveState.eurCzk >= oldRate ? 'up' : 'down');
                }
                updateLiveDisplay();
            }
        } catch (e) {
            // Fallback - simulate a rate
            if (!liveState.eurCzk) {
                liveState.eurCzk = 25.15 + (Math.random() - 0.5) * 0.2;
                liveState.eurCzkBase = liveState.eurCzk;
                updateLiveDisplay();
            }
        }
    }

    // ── Market Ticker ──
    function buildTicker() {
        const tickerTrack = document.getElementById('tickerTrack');
        if (!tickerTrack) return;

        // Market data with simulated prices
        const markets = [
            { symbol: 'EUR/CZK', price: () => liveState.eurCzk || 25.15, change: () => ((liveState.eurCzk || 25.15) - (liveState.eurCzkBase || 25.15)) / (liveState.eurCzkBase || 25.15) * 100 },
            { symbol: 'PX Index', price: () => 1587 + Math.random() * 12 - 6, change: () => (Math.random() - 0.4) * 1.2 },
            { symbol: 'S&P 500', price: () => 5842 + Math.random() * 30 - 15, change: () => (Math.random() - 0.45) * 0.8 },
            { symbol: 'DAX', price: () => 19245 + Math.random() * 80 - 40, change: () => (Math.random() - 0.4) * 1.0 },
            { symbol: 'EUR/USD', price: () => 1.0845 + (Math.random() - 0.5) * 0.003, change: () => (Math.random() - 0.5) * 0.3 },
            { symbol: 'Zlato', price: () => 2935 + Math.random() * 15 - 7, change: () => (Math.random() - 0.35) * 0.6 },
            { symbol: 'Ropa Brent', price: () => 72.4 + Math.random() * 2 - 1, change: () => (Math.random() - 0.5) * 1.5 },
            { symbol: 'BTC/USD', price: () => 87200 + Math.random() * 800 - 400, change: () => (Math.random() - 0.45) * 3 },
            { symbol: 'VX Fund NAV', price: () => liveState.nav, change: () => liveState.dayChange },
        ];

        function renderTicker() {
            let html = '';
            // Duplicate for infinite scroll
            for (let rep = 0; rep < 2; rep++) {
                markets.forEach(m => {
                    const price = m.price();
                    const change = m.change();
                    const isUp = change >= 0;
                    const priceStr = price >= 1000 ? price.toFixed(0) : price >= 10 ? price.toFixed(2) : price.toFixed(4);
                    const changeStr = (isUp ? '+' : '') + change.toFixed(2) + '%';
                    html += `<span class="ticker-item">
                        <span class="ticker-symbol">${m.symbol}</span>
                        <span class="ticker-price">${priceStr}</span>
                        <span class="ticker-change ${isUp ? 'up' : 'down'}">${changeStr}</span>
                    </span>`;
                });
            }
            tickerTrack.innerHTML = html;
        }

        renderTicker();
        // Update ticker values every 8 seconds
        setInterval(renderTicker, 8000);
    }

    // ── Initialize live data ──
    fetchEurCzk();
    updateLiveDisplay();
    buildTicker();

    // NAV ticks every 3 seconds
    setInterval(tickNav, 3000);

    // Refresh EUR/CZK every 60 seconds
    setInterval(fetchEurCzk, 60000);

    // Update clock every second
    setInterval(() => {
        const timeEl = document.getElementById('liveTime');
        if (timeEl) {
            const now = new Date();
            const pad = n => String(n).padStart(2, '0');
            timeEl.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
        }
    }, 1000);

});
