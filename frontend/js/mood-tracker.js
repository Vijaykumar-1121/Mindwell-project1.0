/** Mood Tracker Page */

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('mood-tracker-card')) {
        setupMoodTracker();
    }
});

function setupMoodTracker() {
    const API = API_BASE_URL;
    const token = localStorage.getItem('mindwellToken');

    initMoodPicker();

    const logMoodBtn = document.getElementById('log-mood-btn');
    const moodDetailsSection = document.getElementById('mood-details-section');
    const moodTrackerCard = document.getElementById('mood-tracker-card');
    const moodNotes = document.getElementById('mood-notes');
    const moodTagsContainer = document.getElementById('mood-tags');
    const customTagForm = document.getElementById('custom-tag-form');
    const customTagInput = document.getElementById('custom-tag-input');
    const aiInspireBtn = document.getElementById('ai-inspire-btn');
    const moodHistoryList = document.getElementById('mood-history-list');
    const heatmapSection = document.getElementById('heatmap-section');
    const heatmapGrid = document.getElementById('heatmap-grid');
    const streakBadge = document.getElementById('streak-badge');
    const streakCount = document.getElementById('streak-count');
    const moodPicker = document.getElementById('mood-picker');

    let selectedMood = null;
    let allMoodData = [];

    const moodPrompts = {
        1: "It's okay to feel this way. What's on your mind?",
        2: "Sorry to hear that. What seems to be the trouble?",
        3: "Just okay? Feel free to write down what's happening.",
        4: "That's great to hear! What's contributing to this feeling?",
        5: "Wonderful! What's making today so great?"
    };
    const moodColors = { 1: 'bg-red-50', 2: 'bg-orange-50', 3: 'bg-stone-50', 4: 'bg-[#E8F0EB]', 5: 'bg-green-50' };
    const heatmapColors = {
        0: 'bg-[#F0EBE1]',
        1: 'bg-red-300',
        2: 'bg-orange-300',
        3: 'bg-amber-300',
        4: 'bg-lime-400',
        5: 'bg-green-500'
    };

    // --- Load mood history from API ---
    async function loadMoodHistory() {
        if (!token) {
            moodHistoryList.innerHTML = '<p class="text-stone-400 text-center py-6">Please log in to see your mood history.</p>';
            return;
        }
        try {
            const res = await fetch(`${API}/mood`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                allMoodData = data.data;
                renderMoodHistory(allMoodData);
                renderHeatmap(allMoodData);
                renderStreak(allMoodData);
            }
        } catch (e) {
            moodHistoryList.innerHTML = '<p class="text-red-400 text-center py-6">Error loading history.</p>';
        }
    }

    function renderMoodHistory(entries) {
        if (entries.length === 0) {
            moodHistoryList.innerHTML = '<p class="text-stone-400 text-center py-6 italic">No mood entries yet. Log your first one above!</p>';
            return;
        }
        moodHistoryList.innerHTML = entries.slice(0, 10).map(entry => {
            const mood = entry.mood;
            const cfg = getMoodConfig(mood);
            const date = new Date(entry.entryDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
            const tags = entry.tags && entry.tags.length > 0
                ? `<div class="flex flex-wrap gap-1 mt-3">${entry.tags.map(t => `<span class="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">${t}</span>`).join('')}</div>`
                : '';
            const notes = entry.notes ? `<p class="text-stone-500 text-sm mt-2 italic">"${entry.notes}"</p>` : '';

            return `
                <div class="bg-white rounded-2xl p-5 border border-[#F0EBE1] flex items-start gap-4 hover:shadow-sm transition-shadow">
                    ${getMoodIconHtml(mood, 'sm')}
                    <div class="flex-1">
                        <div class="flex justify-between items-start">
                            <div>
                                <span class="font-bold text-stone-800 text-lg">${cfg.label}</span>
                                <p class="text-xs text-stone-400 font-semibold mt-0.5">${date}</p>
                            </div>
                            <div class="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${cfg.dot}"></div>
                        </div>
                        ${notes}
                        ${tags}
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderHeatmap(entries) {
        if (entries.length === 0) return;
        heatmapSection.classList.remove('hidden');

        const moodMap = {};
        entries.forEach(e => {
            const d = new Date(e.entryDate).toISOString().split('T')[0];
            moodMap[d] = e.mood;
        });

        heatmapGrid.innerHTML = '';
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const key = d.toISOString().split('T')[0];
            const mood = moodMap[key] || 0;
            const label = mood ? `${getMoodConfig(mood).label} – ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const cell = document.createElement('div');
            cell.className = `w-7 h-7 rounded-md ${heatmapColors[mood]} cursor-default transition-transform hover:scale-125`;
            cell.title = label;
            heatmapGrid.appendChild(cell);
        }
    }

    function renderStreak(entries) {
        if (entries.length === 0) return;
        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const moodDates = new Set(entries.map(e => new Date(e.entryDate).toISOString().split('T')[0]));

        for (let i = 0; i < 365; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const key = d.toISOString().split('T')[0];
            if (moodDates.has(key)) {
                streak++;
            } else {
                break;
            }
        }

        if (streak > 0) {
            streakBadge.classList.remove('hidden');
            streakBadge.classList.add('flex');
            streakCount.textContent = streak;
        }
    }

    function clearMoodSelection() {
        moodPicker.querySelectorAll('.mood-option').forEach(btn => {
            const cfg = getMoodConfig(btn.dataset.mood);
            btn.classList.remove('selected', 'ring-2', cfg.ring, cfg.border, cfg.bg);
            btn.classList.add('border-[#E8E2D2]', 'bg-[#FDFCFA]');
        });
    }

    function selectMoodButton(button) {
        clearMoodSelection();
        const cfg = getMoodConfig(button.dataset.mood);
        button.classList.remove('border-[#E8E2D2]', 'bg-[#FDFCFA]');
        button.classList.add('selected', 'ring-2', cfg.ring, cfg.border, cfg.bg);
    }

    // --- Mood selection ---
    moodPicker.addEventListener('click', (e) => {
        const button = e.target.closest('.mood-option');
        if (!button) return;

        selectedMood = button.dataset.mood;
        selectMoodButton(button);
        Object.values(moodColors).forEach(c => moodTrackerCard.classList.remove(c));
        moodTrackerCard.classList.add(moodColors[selectedMood]);
        moodDetailsSection.classList.remove('hidden');
        setTimeout(() => moodDetailsSection.classList.remove('opacity-0'), 10);
        moodNotes.placeholder = moodPrompts[selectedMood];
        logMoodBtn.disabled = false;
    });

    // --- Tag toggling ---
    moodTagsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('mood-tag')) {
            e.target.classList.toggle('bg-amber-500');
            e.target.classList.toggle('text-white');
            e.target.classList.toggle('border-amber-500');
        }
    });

    // --- Custom tags ---
    if (customTagForm) {
        customTagForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = customTagInput.value.trim();
            if (text) {
                const tag = document.createElement('button');
                tag.className = 'mood-tag bg-amber-500 text-white border border-amber-500 px-5 py-2.5 rounded-full text-sm font-bold transition-all';
                tag.textContent = text;
                moodTagsContainer.appendChild(tag);
                customTagInput.value = '';
            }
        });
    }

    // --- AI Inspire ---
    const inspirations = [
        "I am capable of handling anything that comes my way today.",
        "My feelings are valid and I honour them with compassion.",
        "Every day is a fresh start — I choose to move forward.",
        "I am grateful for the small moments that bring me peace.",
        "Growth happens outside my comfort zone and I embrace that.",
        "I deserve rest, care, and kindness — especially from myself."
    ];
    if (aiInspireBtn) {
        aiInspireBtn.addEventListener('click', () => {
            const random = inspirations[Math.floor(Math.random() * inspirations.length)];
            moodNotes.value = random;
            moodNotes.focus();
        });
    }

    // --- Log Mood (save to backend) ---
    if (logMoodBtn) {
        logMoodBtn.addEventListener('click', async () => {
            if (!selectedMood) return;

            const tags = Array.from(document.querySelectorAll('.mood-tag.bg-amber-500')).map(t => t.textContent);
            const payload = {
                mood: parseInt(selectedMood),
                notes: moodNotes.value.trim(),
                tags
            };

            if (!token) {
                showNotification('Please log in to save your mood.', 'error');
                return;
            }

            logMoodBtn.disabled = true;
            logMoodBtn.textContent = 'Saving...';

            try {
                const res = await fetch(`${API}/mood`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                if (data.success) {
                    document.getElementById('mood-form').classList.add('hidden');
                    const conf = document.getElementById('confirmation-message');
                    conf.classList.remove('hidden');
                    setTimeout(() => conf.classList.remove('opacity-0'), 10);
                    // Reload history
                    loadMoodHistory();
                } else {
                    showNotification(data.message || 'Failed to save mood.', 'error');
                    logMoodBtn.disabled = false;
                    logMoodBtn.textContent = 'Log Mood';
                }
            } catch (e) {
                showNotification('Error connecting to server.', 'error');
                logMoodBtn.disabled = false;
                logMoodBtn.textContent = 'Log Mood';
            }
        });
    }

    // --- Log Another ---
    const logAnotherBtn = document.getElementById('log-another-btn');
    if (logAnotherBtn) {
        logAnotherBtn.addEventListener('click', () => {
            document.getElementById('mood-form').classList.remove('hidden');
            const conf = document.getElementById('confirmation-message');
            conf.classList.add('opacity-0', 'hidden');
            clearMoodSelection();
            Object.values(moodColors).forEach(c => moodTrackerCard.classList.remove(c));
            moodDetailsSection.classList.add('hidden', 'opacity-0');
            moodNotes.value = '';
            logMoodBtn.disabled = true;
            logMoodBtn.textContent = 'Log Mood';
            selectedMood = null;
        });
    }

    // Initial load
    loadMoodHistory();
}
