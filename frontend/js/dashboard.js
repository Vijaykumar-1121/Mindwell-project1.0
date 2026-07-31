/**
 * Dashboard Logic
 * ---------------
 * Populates live data from the backend into the dashboard UI.
 */

const API = API_BASE_URL;

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('dynamic-greeting')) {
        setDynamicGreeting();
        setCurrentDate();
        setDailyQuote();
        renderDashboardAppointmentList();
        renderMoodChart();
    }
});

// ─── GREETING & QUOTE ─────────────────────────────────────────────────────────

function setDynamicGreeting() {
    const greetingElement = document.getElementById('dynamic-greeting');
    if (!greetingElement) return;
    
    // We can enhance this later to pull the real user's name from localStorage
    const currentHour = new Date().getHours();
    let greeting = "Welcome back";
    if (currentHour < 12) greeting = "Good morning";
    else if (currentHour < 18) greeting = "Good afternoon";
    else greeting = "Good evening";
    
    // Retrieve the stored user name, or default to a generic greeting
    const userName = localStorage.getItem('mindwellUserName') || '';
    
    greetingElement.textContent = userName ? `${greeting}, ${userName}` : `${greeting}`;
}

function setCurrentDate() {
    const dateElement = document.getElementById('current-date');
    if (!dateElement) return;
    const today = new Date();
    dateElement.textContent = today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

function setDailyQuote() {
    const quotes = [
        '"Progress, not perfection."',
        '"Every day is a second chance."',
        '"Breathe in courage, exhale fear."',
        '"You are stronger than you think."',
        '"Small steps still move you forward."',
        '"It is okay to ask for help."',
        '"Focus on what you can control."'
    ];
    
    const quoteElement = document.getElementById('daily-quote');
    if (!quoteElement) return;
    
    // Use the day of the year to pick a deterministic "quote of the day"
    const now = new Date();
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    quoteElement.textContent = quotes[dayOfYear % quotes.length];
}

// ─── LIVE APPOINTMENTS ────────────────────────────────────────────────────────

async function renderDashboardAppointmentList() {
    const appointmentList = document.getElementById('appointment-list');
    if (!appointmentList) return;
    
    appointmentList.innerHTML = `<div class="flex justify-center py-4"><div class="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>`;
    
    const token = localStorage.getItem('mindwellToken');
    if (!token) {
        appointmentList.innerHTML = `<p class="text-stone-400 italic text-sm">Please log in to view appointments.</p>`;
        return;
    }

    let appointments = [];
    try {
        const res = await fetch(`${API}/appointments`, { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await res.json();
        if (data.success) appointments = data.data;
    } catch (e) {
        appointmentList.innerHTML = `<p class="text-red-400 italic text-sm">Error loading appointments.</p>`;
        return;
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const upcoming = appointments.filter(a => {
        const d = new Date(a.date);
        d.setHours(0, 0, 0, 0);
        return d >= now;
    });

    if (upcoming.length === 0) {
        appointmentList.innerHTML = `
            <div class="text-center py-4">
                <p class="text-stone-400 text-sm mb-2">No upcoming sessions.</p>
                <a href="book-appointment.html" class="text-xs font-bold text-orange-500 hover:underline">Book a session →</a>
            </div>`;
    } else {
        // Show up to 2 appointments
        appointmentList.innerHTML = upcoming.slice(0, 2).map(appt => {
            const d = new Date(appt.date);
            const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            return `
                <div class="flex items-center gap-4 bg-[#FAF8F5] p-4 rounded-2xl border border-[#F0EBE1]">
                    <div class="w-10 h-10 rounded-xl bg-orange-100 flex flex-col items-center justify-center flex-shrink-0 text-orange-500 font-bold leading-tight">
                        <span class="text-xs uppercase">${d.toLocaleDateString('en-US', { month: 'short' })}</span>
                        <span class="text-sm">${d.getDate()}</span>
                    </div>
                    <div>
                        <p class="font-bold text-stone-700 text-sm font-['Lora',serif]">${appt.counselor}</p>
                        <p class="text-xs text-stone-500 font-semibold">${appt.time} • ${appt.type}</p>
                    </div>
                </div>`;
        }).join('');
    }
}

// ─── LIVE MOOD CHART ──────────────────────────────────────────────────────────

async function renderMoodChart() {
    const canvas = document.getElementById('moodHistoryChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const token = localStorage.getItem('mindwellToken');
    let liveMoods = [];
    
    if (token) {
        try {
            const res = await fetch(`${API}/mood`, { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await res.json();
            if (data.success) liveMoods = data.data;
        } catch (e) {
            console.error("Failed to load live moods:", e);
        }
    }
    
    const labels = [];
    const data = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Build the last 7 days array
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dayStr = date.toLocaleDateString('en-US', { weekday: 'short' });
        labels.push(dayStr);
        
        // Find if we have a mood logged for this exact date
        const entryForDay = liveMoods.find(entry => {
            const entryDate = new Date(entry.entryDate || entry.createdAt);
            entryDate.setHours(0,0,0,0);
            return entryDate.getTime() === date.getTime();
        });
        
        data.push(entryForDay ? entryForDay.mood : null);
    }
    
    // Check if empty
    const hasData = data.some(val => val !== null);
    if (!hasData) {
        ctx.font = "bold 14px Nunito";
        ctx.fillStyle = "#a8a29e"; // stone-400
        ctx.textAlign = "center";
        ctx.fillText("Log your mood today to start tracking your history!", canvas.width / 2, canvas.height / 2);
        return;
    }

    // Create gradient
    let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(249, 115, 22, 0.4)'); // orange-500
    gradient.addColorStop(1, 'rgba(249, 115, 22, 0.0)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Your Mood',
                data: data,
                backgroundColor: gradient,
                borderColor: '#f97316', // orange-500
                borderWidth: 4,
                tension: 0.4,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#f97316',
                pointBorderWidth: 3,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: '#f97316',
                pointHoverBorderColor: '#fff',
                spanGaps: false,
                fill: true
            }]
        },
        options: {
            scales: { 
                y: { 
                    min: 0.5, max: 5.5, 
                    ticks: { 
                        stepSize: 1, 
                        color: '#78716c',
                        font: { family: 'Nunito', weight: 'bold', size: 13 },
                        callback: (value) => ({1: 'Awful', 2: 'Bad', 3: 'Okay', 4: 'Good', 5: 'Great'}[value] || '') 
                    },
                    grid: { color: '#F0EBE1', drawBorder: false, borderDash: [5, 5] }
                },
                x: {
                    ticks: { color: '#78716c', font: { family: 'Nunito', weight: 'bold', size: 13 } },
                    grid: { display: false, drawBorder: false }
                }
            },
            plugins: { 
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#292524',
                    bodyColor: '#f97316',
                    bodyFont: { family: 'Lora', size: 16, weight: 'bold' },
                    titleFont: { family: 'Nunito', size: 13, weight: 'bold' },
                    borderColor: '#F0EBE1',
                    borderWidth: 1,
                    padding: 12,
                    boxPadding: 6,
                    usePointStyle: true,
                    callbacks: {
                        label: function(context) {
                            const map = {1: 'Awful', 2: 'Bad', 3: 'Okay', 4: 'Good', 5: 'Great'};
                            return map[context.raw] || '';
                        }
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false }
        }
    });
}
