/** Resources Page */

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('resource-grid')) {
        setupResourcesPage();
    }
});

function setupResourcesPage() {
    const API = `${API_BASE_URL}/resources`;
    let allResources = [];
    let activeTopic = 'all';

    const resourceGrid = document.getElementById('resource-grid');
    const searchInput = document.getElementById('resource-search');
    const topicFilters = document.getElementById('topic-filters');
    const noResults = document.getElementById('no-results');

    // --- FETCH RESOURCES FROM BACKEND ---
    async function loadResources() {
        resourceGrid.innerHTML = `
            <div class="col-span-3 flex justify-center py-10">
                <div class="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>`;
        try {
            const defaultResources = [
                { _id: 'def1', title: 'Managing Pre-Exam Jitters', type: 'article', topic: 'anxiety', img: '../images/meditation_bg.png', summary: 'Simple strategies to stay calm and focused before your exams.', body: '<p>Exams are stressful, but your reaction to them doesn\'t have to be. Deep breathing and positive visualization can help.</p>' },
                { _id: 'def2', title: '5-Minute Calm', type: 'meditation', topic: 'stress', img: '../images/nature_walk.png', summary: 'A quick guided breathing exercise to recenter yourself.', link: 'https://www.youtube.com/embed/inpok4MKVLM' },
                { _id: 'def3', title: 'Deep Focus Mix', type: 'music', topic: 'focus', img: '../images/study_focus.png', summary: 'Binaural beats and ambient sounds for intense study sessions.', body: '<p>Music can act as a sound barrier against distractions. Use ambient audio to increase your focus.</p>' },
                { _id: 'def4', title: 'Sleep Hygiene 101', type: 'article', topic: 'sleep', img: '../images/sleep_hygiene.png', summary: 'How to build a nighttime routine that actually works.', body: '<p>Turn off screens an hour before bed. Ensure your room is cool and dark. Keep a consistent sleep schedule.</p>' }
            ];

            const res = await fetch(API);
            const data = await res.json();
            
            if (data.success) {
                allResources = [...defaultResources, ...data.data];
            } else {
                allResources = [...defaultResources];
            }
            renderResources();
        } catch (e) {
            console.error(e);
            resourceGrid.innerHTML = '<p class="col-span-3 text-center text-red-500 py-10">Error loading resources.</p>';
        }
    }

    // --- RENDER RESOURCE CARDS ---
    function renderResources() {
        const term = searchInput.value.toLowerCase();
        const filtered = allResources.filter(r => {
            const matchSearch = r.title.toLowerCase().includes(term) ||
                (r.summary && r.summary.toLowerCase().includes(term));
            const matchTopic = activeTopic === 'all' || r.topic === activeTopic;
            return matchSearch && matchTopic;
        });

        if (filtered.length === 0) {
            resourceGrid.innerHTML = '';
            noResults.classList.remove('hidden');
            return;
        }
        noResults.classList.add('hidden');

        const typeIcons = {
            article: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> Article`,
            video: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Video`,
            meditation: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg> Meditation`,
            music: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg> Music`
        };

        const topicColors = {
            stress: 'bg-red-100 text-red-700',
            anxiety: 'bg-purple-100 text-purple-700',
            focus: 'bg-blue-100 text-blue-700',
            sleep: 'bg-indigo-100 text-indigo-700',
            breathe: 'bg-green-100 text-green-700'
        };

        resourceGrid.innerHTML = filtered.map(r => `
            <div class="bg-white rounded-2xl border border-[#F0EBE1] overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                 onclick="openResourceModal('${r._id}')">
                <div class="relative overflow-hidden h-48">
                    <img src="${r.img}" alt="${r.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    <div class="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent"></div>
                    <span class="absolute bottom-3 left-3 flex items-center gap-1 text-xs font-bold text-white bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                        ${typeIcons[r.type] || r.type}
                    </span>
                </div>
                <div class="p-5">
                    <span class="text-xs font-bold px-2 py-1 rounded-full ${topicColors[r.topic] || 'bg-stone-100 text-stone-700'}">${r.topic.charAt(0).toUpperCase() + r.topic.slice(1)}</span>
                    <h4 class="font-bold text-stone-800 text-lg mt-3 mb-2 font-['Lora',serif] leading-snug">${r.title}</h4>
                    <p class="text-stone-500 text-sm leading-relaxed line-clamp-2">${r.summary || ''}</p>
                    <span class="mt-4 inline-flex items-center gap-1 text-sm font-bold text-orange-500 group-hover:gap-2 transition-all">
                        Read more
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                    </span>
                </div>
            </div>
        `).join('');
    }

    // --- READING MODAL ---
    const modal = document.getElementById('reading-modal');
    const modalContent = document.getElementById('reading-modal-content');
    const modalClose = document.getElementById('modal-close-btn');
    const modalBackdrop = document.getElementById('reading-modal-backdrop');

    window.openResourceModal = (id) => {
        const resource = allResources.find(r => r._id === id);
        if (!resource) return;

        document.getElementById('modal-img').src = resource.img;
        document.getElementById('modal-topic').textContent = resource.topic;
        document.getElementById('modal-title').textContent = resource.title;

        const body = document.getElementById('modal-body');
        // If it's a video/meditation with a YouTube link
        if (resource.link && resource.link.includes('youtube.com/embed')) {
            body.innerHTML = `
                <div class="aspect-video w-full rounded-2xl overflow-hidden mb-6">
                    <iframe class="w-full h-full" src="${resource.link}" frameborder="0" allowfullscreen></iframe>
                </div>
                ${resource.body || ''}
            `;
        } else {
            body.innerHTML = resource.body || `<p class="text-stone-500 italic">No content available yet.</p>`;
        }

        modal.classList.remove('hidden');
        setTimeout(() => {
            modalContent.classList.remove('scale-95', 'opacity-0');
            modalContent.classList.add('scale-100', 'opacity-100');
        }, 10);
    };

    const closeModal = () => {
        modalContent.classList.remove('scale-100', 'opacity-100');
        modalContent.classList.add('scale-95', 'opacity-0');
        setTimeout(() => modal.classList.add('hidden'), 300);
    };

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    // --- TOPIC FILTERS ---
    topicFilters.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-topic]');
        if (!btn) return;
        activeTopic = btn.dataset.topic;
        topicFilters.querySelectorAll('button').forEach(b => {
            b.className = 'topic-filter-btn px-4 py-2 rounded-full text-sm font-bold bg-white text-stone-600 border border-[#F0EBE1] hover:bg-stone-50 transition-colors';
        });
        btn.className = 'topic-filter-btn px-4 py-2 rounded-full text-sm font-bold bg-orange-500 text-white transition-colors';
        renderResources();
    });

    searchInput.addEventListener('input', renderResources);

    // --- BREATHING EXERCISE (4-7-8) ---
    const breatheCircle = document.getElementById('breathe-circle');
    const breatheText = document.getElementById('breathe-text');
    const breatheBtn = document.getElementById('breathe-btn');
    const breatheCounter = document.getElementById('breathe-counter');

    if (breatheBtn) {
        let breatheInterval = null;
        let cycle = 0;
        const totalCycles = 4;

        const phases = [
            { label: 'Breathe In', duration: 4000, className: 'breathe-in' },
            { label: 'Hold', duration: 7000, className: 'breathe-hold' },
            { label: 'Breathe Out', duration: 8000, className: 'breathe-out' }
        ];

        const runBreathing = () => {
            let phaseIndex = 0;
            let countdown = phases[0].duration / 1000;
            cycle = 0;

            const tick = () => {
                const phase = phases[phaseIndex];
                breatheCircle.className = `w-32 h-32 rounded-full flex items-center justify-center breathe-circle mb-8 ${phase.className}`;
                breatheText.textContent = `${phase.label} (${countdown})`;
                breatheCounter.textContent = `Cycle ${cycle + 1} of ${totalCycles}`;
                countdown--;

                if (countdown < 0) {
                    phaseIndex++;
                    if (phaseIndex >= phases.length) {
                        phaseIndex = 0;
                        cycle++;
                        if (cycle >= totalCycles) {
                            clearInterval(breatheInterval);
                            breatheCircle.className = `w-32 h-32 rounded-full bg-[#789c8a] flex items-center justify-center breathe-circle mb-8`;
                            breatheText.textContent = 'Done ✓';
                            breatheCounter.textContent = `Complete!`;
                            breatheBtn.textContent = 'Begin Exercise';
                            breatheBtn.disabled = false;
                            breatheInterval = null;
                            return;
                        }
                    }
                    countdown = phases[phaseIndex].duration / 1000;
                }
            };

            tick();
            breatheInterval = setInterval(tick, 1000);
        };

        breatheBtn.addEventListener('click', () => {
            if (breatheInterval) {
                clearInterval(breatheInterval);
                breatheInterval = null;
                breatheBtn.textContent = 'Begin Exercise';
                breatheCircle.className = `w-32 h-32 rounded-full bg-[#D4CBB3] flex items-center justify-center breathe-circle mb-8`;
                breatheText.textContent = 'Start';
                breatheCounter.textContent = 'Cycle 0 of 4';
            } else {
                breatheBtn.textContent = 'Stop';
                runBreathing();
            }
        });
    }

    // --- WORRY RELEASE CLOUD ---
    const worryReleaseBtn = document.getElementById('worry-release-btn');
    const worryResetBtn = document.getElementById('worry-reset-btn');
    const worryText = document.getElementById('worry-text');
    const worryInputArea = document.getElementById('worry-input-area');
    const worrySuccessArea = document.getElementById('worry-success-area');
    const worryContainer = document.getElementById('worry-container');

    if (worryReleaseBtn) {
        worryReleaseBtn.addEventListener('click', () => {
            if (!worryText.value.trim()) return;
            worryText.classList.add('dissolve-text');
            setTimeout(() => {
                worryInputArea.style.opacity = '0';
                worryInputArea.style.transition = 'opacity 1s';
                setTimeout(() => {
                    worryInputArea.classList.add('hidden');
                    worrySuccessArea.classList.remove('hidden');
                    worrySuccessArea.style.opacity = '0';
                    worrySuccessArea.style.transition = 'opacity 1s';
                    setTimeout(() => worrySuccessArea.style.opacity = '1', 10);
                }, 1000);
            }, 2500);
        });
    }

    if (worryResetBtn) {
        worryResetBtn.addEventListener('click', () => {
            worryText.value = '';
            worryText.classList.remove('dissolve-text');
            worrySuccessArea.classList.add('hidden');
            worryInputArea.classList.remove('hidden');
            worryInputArea.style.opacity = '1';
        });
    }

    // --- AMBIENT AUDIO (Web Audio API — Procedural 3D Synthesis) ---
    const ambientSelector = document.getElementById('ambient-selector');
    const ambientVolume   = document.getElementById('ambient-volume');
    const ambientIcon     = document.getElementById('ambient-icon');

    const icons = { none: '🎧', rain: '🌧️', forest: '🌲', ocean: '🌊' };

    let audioCtx = null;
    let masterGain = null;
    let activeSources = [];   // all running AudioNodes for current sound
    let panInterval = null;

    function getCtx() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        return audioCtx;
    }

    /* Create a looping noise buffer */
    function makeNoise(ctx, duration = 3, channels = 2) {
        const size = ctx.sampleRate * duration;
        const buf  = ctx.createBuffer(channels, size, ctx.sampleRate);
        for (let c = 0; c < channels; c++) {
            const d = buf.getChannelData(c);
            for (let i = 0; i < size; i++) d[i] = Math.random() * 2 - 1;
        }
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.loop = true;
        return src;
    }

    /* Smooth 3D panning orbit around listener */
    function startOrbit(panner) {
        let angle = Math.random() * Math.PI * 2;
        panInterval = setInterval(() => {
            angle += 0.008;
            panner.positionX.value = Math.sin(angle) * 1.5;
            panner.positionZ.value = Math.cos(angle) * 1.5;
        }, 50);
    }

    function stopAllSounds() {
        if (panInterval) { clearInterval(panInterval); panInterval = null; }
        activeSources.forEach(n => { try { n.stop ? n.stop() : n.disconnect(); } catch(e){} });
        activeSources = [];
    }

    function buildRain(ctx, gain) {
        // Layer 1: heavy white-noise base (the downpour body)
        const base = makeNoise(ctx, 4);
        const lpf  = ctx.createBiquadFilter();
        lpf.type = 'lowpass'; lpf.frequency.value = 800; lpf.Q.value = 0.4;

        // Layer 2: higher-frequency drizzle sparkle
        const sparkle = makeNoise(ctx, 2);
        const bpf = ctx.createBiquadFilter();
        bpf.type = 'bandpass'; bpf.frequency.value = 3500; bpf.Q.value = 1.2;
        const sGain = ctx.createGain(); sGain.gain.value = 0.18;

        // Layer 3: slow LFO for rainfall intensity variation
        const lfo = ctx.createOscillator();
        const lfoG = ctx.createGain();
        lfo.frequency.value = 0.12;
        lfoG.gain.value = 0.08;
        lfo.connect(lfoG); lfoG.connect(gain.gain);

        const panner = ctx.createPanner();
        panner.panningModel = 'HRTF';
        panner.distanceModel = 'inverse';
        panner.refDistance = 1;
        panner.positionY.value = 1;

        base.connect(lpf); lpf.connect(panner);
        sparkle.connect(bpf); bpf.connect(sGain); sGain.connect(panner);
        panner.connect(gain);

        base.start(); sparkle.start(); lfo.start();
        startOrbit(panner);
        activeSources.push(base, sparkle, lfo);
    }

    function buildForest(ctx, gain) {
        // Wind through leaves — bandpass noise
        const wind = makeNoise(ctx, 5);
        const bpf  = ctx.createBiquadFilter();
        bpf.type = 'bandpass'; bpf.frequency.value = 900; bpf.Q.value = 0.6;
        const wGain = ctx.createGain(); wGain.gain.value = 0.6;

        // High-freq rustle
        const rustle = makeNoise(ctx, 2);
        const hpf  = ctx.createBiquadFilter();
        hpf.type = 'highpass'; hpf.frequency.value = 2000; hpf.Q.value = 0.8;
        const rGain = ctx.createGain(); rGain.gain.value = 0.22;

        // Occasional cricket-like tone (two detuned oscillators)
        const cricket1 = ctx.createOscillator();
        const cricket2 = ctx.createOscillator();
        const cGain = ctx.createGain();
        cricket1.frequency.value = 4200; cricket2.frequency.value = 4250;
        cricket1.type = 'sine'; cricket2.type = 'sine';
        cGain.gain.value = 0.04;
        cricket1.connect(cGain); cricket2.connect(cGain);

        // LFO to pulse the cricket
        const lfo = ctx.createOscillator();
        const lfoG = ctx.createGain();
        lfo.frequency.value = 8; lfoG.gain.value = 0.04;
        lfo.connect(lfoG); lfoG.connect(cGain.gain);

        const panner = ctx.createPanner();
        panner.panningModel = 'HRTF';
        panner.positionY.value = 0.5;

        wind.connect(bpf); bpf.connect(wGain); wGain.connect(panner);
        rustle.connect(hpf); hpf.connect(rGain); rGain.connect(panner);
        cGain.connect(panner);
        panner.connect(gain);

        wind.start(); rustle.start(); cricket1.start(); cricket2.start(); lfo.start();
        startOrbit(panner);
        activeSources.push(wind, rustle, cricket1, cricket2, lfo);
    }

    function buildOcean(ctx, gain) {
        // Deep rolling wave base
        const wave = makeNoise(ctx, 6);
        const lpf  = ctx.createBiquadFilter();
        lpf.type = 'lowpass'; lpf.frequency.value = 500; lpf.Q.value = 0.3;

        // Surf foam — higher frequency bursts
        const foam = makeNoise(ctx, 3);
        const bpf  = ctx.createBiquadFilter();
        bpf.type = 'bandpass'; bpf.frequency.value = 1800; bpf.Q.value = 0.7;
        const fGain = ctx.createGain(); fGain.gain.value = 0.3;

        // Slow LFO for wave rhythm (swell ~6s cycle)
        const lfo = ctx.createOscillator();
        const lfoG = ctx.createGain();
        lfo.frequency.value = 0.17;
        lfoG.gain.value = 0.35;
        lfo.connect(lfoG); lfoG.connect(gain.gain);

        const panner = ctx.createPanner();
        panner.panningModel = 'HRTF';
        panner.distanceModel = 'inverse';
        panner.positionY.value = -0.5;

        wave.connect(lpf); lpf.connect(panner);
        foam.connect(bpf); bpf.connect(fGain); fGain.connect(panner);
        panner.connect(gain);

        wave.start(); foam.start(); lfo.start();
        startOrbit(panner);
        activeSources.push(wave, foam, lfo);
    }

    let currentHtmlAudio = null;

    function playAmbient(type) {
        stopAllSounds();
        if (currentHtmlAudio) {
            currentHtmlAudio.pause();
            currentHtmlAudio.currentTime = 0;
            currentHtmlAudio = null;
        }

        if (type === 'none') return;

        currentHtmlAudio = new Audio(`../assets/audio/${type}.mp3`);
        currentHtmlAudio.loop = true;
        currentHtmlAudio.volume = parseFloat(ambientVolume ? ambientVolume.value : 0.7);
        currentHtmlAudio.play().catch(e => console.error("Audio play failed:", e));
    }

    if (ambientSelector) {
        ambientSelector.addEventListener('change', () => {
            const val = ambientSelector.value;
            if (ambientIcon) ambientIcon.textContent = icons[val] || '🎧';
            playAmbient(val);
        });
    }

    if (ambientVolume) {
        ambientVolume.addEventListener('input', () => {
            if (currentHtmlAudio) {
                currentHtmlAudio.volume = parseFloat(ambientVolume.value);
            }
        });
    }

    // Stop on nav or page leave
    const stopAmbient = () => { 
        stopAllSounds(); 
        if (currentHtmlAudio) currentHtmlAudio.pause();
        if (audioCtx) { audioCtx.close(); audioCtx = null; } 
    };
    window.addEventListener('beforeunload', stopAmbient);
    document.querySelectorAll('header a').forEach(a => a.addEventListener('click', stopAmbient));

    // --- MICRO TIPS ---
    const tips = [
        'Drop your shoulders and unclench your jaw.',
        'Take 3 slow, deep breaths right now.',
        'Drink a glass of water — your brain is ~75% water.',
        'Look away from your screen and focus on something 20 feet away for 20 seconds.',
        'Roll your neck gently — stress lives in the shoulders and neck.',
        'Name 3 things you are grateful for in this exact moment.'
    ];
    const microTip = document.getElementById('micro-tip');
    if (microTip) {
        microTip.textContent = tips[Math.floor(Math.random() * tips.length)];
    }

    // --- INITIAL LOAD ---
    loadResources();
}
