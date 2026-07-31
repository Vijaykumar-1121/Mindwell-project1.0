/**
 * appointments.js
 * ---------------
 * Handles the appointments list page and the booking page.
 */

const API = API_BASE_URL;

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('upcoming-appointments-list')) {
        renderFullAppointmentLists();
    }
    if (document.getElementById('counselor-list')) {
        setupBookingPage();
    }
});

// ─── APPOINTMENTS LIST PAGE ───────────────────────────────────────────────────

async function renderFullAppointmentLists() {
    renderFeaturedCounselors();

    const upcomingList = document.getElementById('upcoming-appointments-list');
    const pastList     = document.getElementById('past-appointments-list');
    if (!upcomingList || !pastList) return;

    // Loading state
    upcomingList.innerHTML = `<div class="flex justify-center py-6"><div class="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>`;
    pastList.innerHTML     = `<div class="flex justify-center py-6"><div class="w-6 h-6 border-2 border-stone-400 border-t-transparent rounded-full animate-spin"></div></div>`;

    const token = localStorage.getItem('mindwellToken');
    if (!token) {
        upcomingList.innerHTML = `<p class="text-stone-400 italic">Please log in to view appointments.</p>`;
        pastList.innerHTML     = `<p class="text-stone-400 italic">Please log in to view appointments.</p>`;
        return;
    }

    let appointments = [];
    try {
        const res  = await fetch(`${API}/appointments`, { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await res.json();
        if (data.success) appointments = data.data;
    } catch (e) {
        upcomingList.innerHTML = `<p class="text-red-400 italic">Error loading appointments.</p>`;
        return;
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const upcoming = appointments.filter(a => {
        const d = new Date(a.date);
        d.setHours(0, 0, 0, 0);
        return d >= now;
    });
    
    const past = appointments.filter(a => {
        const d = new Date(a.date);
        d.setHours(0, 0, 0, 0);
        return d < now;
    });

    // Upcoming
    if (upcoming.length === 0) {
        upcomingList.innerHTML = `
            <div class="text-center py-10">
                <div class="w-14 h-14 mx-auto mb-4 rounded-2xl bg-orange-50 flex items-center justify-center">
                    <svg class="w-7 h-7 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </div>
                <p class="font-bold text-stone-500">No upcoming appointments.</p>
                <a href="book-appointment.html" class="mt-4 inline-block text-orange-500 font-bold hover:underline">Book your first session →</a>
            </div>`;
    } else {
        upcomingList.innerHTML = upcoming.map(appt => {
            const d    = new Date(appt.date);
            const date = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
            const isVirtual = appt.type !== 'In-Person';
            const statusBadge = isVirtual
                ? `<span class="bg-[#789c8a]/10 text-[#789c8a] text-xs font-bold px-3 py-1 rounded-full">Virtual</span>`
                : `<span class="bg-stone-100 text-stone-600 text-xs font-bold px-3 py-1 rounded-full">In-Person</span>`;
            const actionBtn = isVirtual
                ? `<button onclick="showNotification('Meeting link will be provided by your doctor shortly before the session.', 'info')" class="text-sm font-bold bg-[#789c8a] text-white px-5 py-2.5 rounded-full hover:bg-[#658575] transition shadow-sm hover:-translate-y-0.5">Join Session</button>`
                : `<button onclick="showNotification('Please visit the counseling center for your in-person session.', 'info')" class="text-sm font-bold bg-stone-200 text-stone-700 px-5 py-2.5 rounded-full hover:bg-stone-300 transition">View Details</button>`;

            return `
                <div class="bg-white/60 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-white flex justify-between items-center gap-4 hover:shadow-md hover:bg-white/80 transition group">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0">
                            <svg class="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                        </div>
                        <div>
                            <p class="font-bold text-lg text-stone-800 font-['Lora',serif]">${appt.counselor}</p>
                            <p class="text-sm font-bold text-orange-500">${date} · ${appt.time}</p>
                            <div class="mt-1">${statusBadge}</div>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2 items-end flex-shrink-0">
                        ${actionBtn}
                        <div class="flex gap-4 mt-1">
                            <a href="book-appointment.html?counselor=${encodeURIComponent(appt.counselor)}" class="text-xs font-bold text-stone-400 hover:text-orange-500 transition">Reschedule</a>
                            <button onclick="cancelAppointment('${appt._id}')" class="text-xs font-bold text-stone-400 hover:text-red-500 transition cursor-pointer">Cancel</button>
                        </div>
                    </div>
                </div>`;
        }).join('');
    }

    // Past
    if (past.length === 0) {
        pastList.innerHTML = `<p class="text-stone-400 italic text-center py-10">No past sessions yet.</p>`;
    } else {
        pastList.innerHTML = past.map(appt => {
            const d    = new Date(appt.date);
            const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            return `
                <div class="bg-white/40 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-white flex justify-between items-center gap-4 opacity-80 hover:opacity-100 transition">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center flex-shrink-0">
                            <svg class="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        </div>
                        <div>
                            <p class="font-bold text-stone-700 font-['Lora',serif]">${appt.counselor}</p>
                            <p class="text-sm text-stone-400 font-semibold">${date} · ${appt.time || ''}</p>
                        </div>
                    </div>
                    <span class="text-xs text-stone-400 font-bold uppercase tracking-wide">${appt.type || 'Session'}</span>
                </div>`;
        }).join('');
    }
}

// ─── COUNSELORS DATA ──────────────────────────────────────────────────────────

async function fetchCounselors() {
    try {
        const res = await fetch(`${API}/counselors`);
        const data = await res.json();
        if (data.success) {
            // Map DB counselors to include default images & availability if they don't have them
            return data.data.map((c, i) => ({
                id: c._id,
                name: c.name,
                specialty: c.specialty,
                imageUrl: `../images/${c.name.toLowerCase().replace('dr. ', 'dr_').replace(' ', '_')}.png`,
                // Defaulting availability if not stored in DB
                availability: i === 0 ? [1, 3, 5] : (i === 1 ? [2, 4] : [1, 2, 3, 4, 5])
            }));
        }
        return [];
    } catch (e) {
        console.error("Error fetching counselors", e);
        return [];
    }
}

async function renderFeaturedCounselors() {
    const list = document.getElementById('featured-counselors-list');
    if (!list) return;
    const counselors = await fetchCounselors();
    list.innerHTML = counselors.map(c => `
        <div class="bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white text-center hover:shadow-lg transition hover:-translate-y-1 group">
            <div class="relative inline-block mb-4">
                <img src="${c.imageUrl}" alt="${c.name}" class="w-24 h-24 mx-auto rounded-full object-cover border-4 border-white shadow-md group-hover:scale-105 transition">
                <span class="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></span>
            </div>
            <h4 class="font-bold text-stone-800 text-lg font-['Lora',serif]">${c.name}</h4>
            <p class="text-sm font-semibold text-orange-500 mb-1">${c.specialty}</p>
            <p class="text-xs text-stone-400 font-bold mb-4">${formatAvailability(c.availability)}</p>
            <a href="book-appointment.html?counselor=${encodeURIComponent(c.name)}" class="inline-block bg-stone-800 text-white font-bold py-2.5 px-6 rounded-full hover:bg-stone-700 transition shadow-sm hover:-translate-y-0.5">Book Session</a>
        </div>`).join('');
}

function formatAvailability(days) {
    const names = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    return 'Available: ' + days.map(d => names[d]).join(', ');
}

// ─── BOOKING PAGE ─────────────────────────────────────────────────────────────

async function setupBookingPage() {
    const counselorList = document.getElementById('counselor-list');
    if (!counselorList) return;

    let selectedCounselor    = null;
    let selectedDate         = null;
    let selectedTime         = null;
    let selectedSessionType  = null;
    let currentDate          = new Date();

    const allCounselors = await fetchCounselors();

    // Render counselor cards
    counselorList.innerHTML = allCounselors.map((c, i) => `
        <button id="counselor-btn-${i}" class="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-transparent bg-white hover:border-orange-400 transition cursor-pointer shadow-sm text-left group relative">
            <div id="counselor-check-${i}" class="hidden absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full text-white items-center justify-center shadow-md">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <img src="${c.imageUrl}" alt="${c.name}" class="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm group-hover:scale-105 transition">
            <div>
                <h3 class="font-bold text-lg text-stone-800 font-['Lora',serif]">${c.name}</h3>
                <p class="text-sm text-stone-500">${c.specialty}</p>
                <p class="text-xs text-stone-400 mt-0.5">${formatAvailability(c.availability)}</p>
            </div>
        </button>`).join('');

    allCounselors.forEach((c, i) => {
        const btn = document.getElementById(`counselor-btn-${i}`);
        btn.addEventListener('click', () => {
            selectedCounselor = allCounselors[i].name;
            
            // Reset all
            counselorList.querySelectorAll('button').forEach((b, idx) => {
                b.classList.remove('border-green-500', 'bg-green-50', 'ring-4', 'ring-green-500/20');
                b.classList.add('opacity-50', 'scale-95'); // Dim unselected
                b.classList.remove('scale-100', 'opacity-100');
                document.getElementById(`counselor-check-${idx}`).classList.remove('flex');
                document.getElementById(`counselor-check-${idx}`).classList.add('hidden');
            });
            
            // Highlight selected with a green border and checkmark
            btn.classList.add('border-green-500', 'bg-green-50', 'ring-4', 'ring-green-500/20', 'scale-100', 'opacity-100');
            btn.classList.remove('opacity-50', 'scale-95');
            document.getElementById(`counselor-check-${i}`).classList.remove('hidden');
            document.getElementById(`counselor-check-${i}`).classList.add('flex');
            
            document.getElementById('booking-flow').classList.remove('hidden');
            document.getElementById('booking-flow').scrollIntoView({ behavior: 'smooth', block: 'start' });
            renderCalendar();
        });
    });

    // Pre-select from URL param
    const urlParams = new URLSearchParams(window.location.search);
    const preset    = urlParams.get('counselor');
    if (preset) {
        const idx = allCounselors.findIndex(c => c.name === preset);
        if (idx !== -1) document.getElementById(`counselor-btn-${idx}`).click();
    }

    // Calendar
    document.getElementById('prev-month').addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); });
    document.getElementById('next-month').addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); });

    function renderCalendar() {
        const calendarDays = document.getElementById('calendar-days');
        const monthYear    = document.getElementById('month-year');
        calendarDays.innerHTML = '';

        const month = currentDate.getMonth();
        const year  = currentDate.getFullYear();
        monthYear.textContent = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

        const firstDay    = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const counselor   = allCounselors.find(c => c.name === selectedCounselor);

        ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d => {
            const el = document.createElement('div');
            el.className = 'font-semibold text-xs text-stone-400 text-center pb-1';
            el.textContent = d;
            calendarDays.appendChild(el);
        });

        for (let i = 0; i < firstDay; i++) calendarDays.appendChild(document.createElement('div'));

        for (let day = 1; day <= daysInMonth; day++) {
            const btn  = document.createElement('button');
            const date = new Date(year, month, day);
            const isAvailable  = counselor && counselor.availability.includes(date.getDay());
            const isPast       = date < new Date().setHours(0, 0, 0, 0);

            btn.textContent = day;
            btn.className   = 'w-9 h-9 mx-auto flex items-center justify-center rounded-full text-sm font-bold transition';

            if (isPast || !isAvailable) {
                btn.disabled  = true;
                btn.className += ' text-stone-300 cursor-not-allowed';
            } else {
                btn.className += ' text-stone-700 hover:bg-orange-100 cursor-pointer';
                btn.addEventListener('click', () => {
                    selectedDate = date;
                    calendarDays.querySelectorAll('button').forEach(b => b.classList.remove('bg-orange-500', 'text-white'));
                    btn.classList.add('bg-orange-500', 'text-white');
                    renderTimeSlots(date);
                });
            }
            calendarDays.appendChild(btn);
        }
    }

    // Time slots
    function renderTimeSlots(date) {
        const container = document.getElementById('time-slots');
        container.innerHTML = '';
        document.getElementById('session-type-section').classList.add('hidden');
        document.getElementById('reason-section').classList.add('hidden');
        document.getElementById('confirmation-section').classList.add('hidden');
        selectedTime = null;

        const allTimes = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];
        const now      = new Date();
        const isToday  = date.toDateString() === now.toDateString();

        const times = allTimes.filter(t => {
            if (!isToday) return true;
            const [h12, minStr, period] = [parseInt(t), t.split(':')[1].split(' ')[0], t.split(' ')[1]];
            let h = h12 % 12 + (period === 'PM' ? 12 : 0);
            const slot = new Date(); slot.setHours(h, parseInt(minStr), 0, 0);
            return slot > now;
        });

        if (times.length === 0) {
            container.innerHTML = `<p class="text-stone-400 italic text-center py-4">No slots available today.</p>`;
            return;
        }

        times.forEach(t => {
            const btn = document.createElement('button');
            btn.textContent = t;
            btn.className = 'w-full p-3.5 border border-[#F0EBE1] bg-white rounded-xl hover:bg-orange-50 hover:border-orange-400 transition font-bold text-stone-600 text-sm';
            btn.addEventListener('click', () => {
                selectedTime = t;
                container.querySelectorAll('button').forEach(b => b.classList.remove('bg-orange-500', 'text-white', 'border-orange-500'));
                btn.classList.add('bg-orange-500', 'text-white', 'border-orange-500');
                document.getElementById('session-type-section').classList.remove('hidden');
                document.getElementById('session-type-section').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
            container.appendChild(btn);
        });
    }

    // Session type
    document.querySelectorAll('.session-type-option').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedSessionType = btn.dataset.type;
            document.querySelectorAll('.session-type-option').forEach(b => {
                b.classList.remove('bg-orange-500', 'text-white', 'border-orange-500');
                b.classList.add('border-[#F0EBE1]');
            });
            btn.classList.add('bg-orange-500', 'text-white', 'border-orange-500');
            document.getElementById('reason-section').classList.remove('hidden');
            document.getElementById('reason-section').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    });

    // Continue to confirmation
    document.getElementById('continue-to-confirm-btn').addEventListener('click', () => {
        if (!selectedCounselor || !selectedDate || !selectedTime || !selectedSessionType) {
            showNotification('Please complete all steps above.', 'error');
            return;
        }
        const dateStr  = selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
        document.getElementById('selected-appointment-details').innerHTML = `
            <span class="block text-stone-500 text-base font-normal mb-1">${selectedSessionType} Session</span>
            <span class="text-orange-500 text-2xl">${selectedCounselor}</span>
            <span class="block text-stone-700 mt-1">${dateStr} at ${selectedTime}</span>`;

        const reason = document.getElementById('reason-for-visit').value.trim();
        const rd     = document.getElementById('selected-reason-display');
        if (reason) { rd.textContent = `"${reason}"`; rd.classList.remove('hidden'); }
        else rd.classList.add('hidden');

        const sec = document.getElementById('confirmation-section');
        sec.classList.remove('hidden');
        sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Confirm booking
    document.getElementById('confirm-booking-btn').addEventListener('click', async () => {
        const token = localStorage.getItem('mindwellToken');
        if (!token) { showNotification('Please log in first.', 'error'); return; }
        if (!selectedCounselor || !selectedDate || !selectedTime || !selectedSessionType) {
            showNotification('Please complete all steps.', 'error'); return;
        }

        const btn = document.getElementById('confirm-booking-btn');
        btn.disabled = true; btn.textContent = 'Booking...';

        try {
            const res = await fetch(`${API}/appointments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    counselor: selectedCounselor,
                    date:      selectedDate.toISOString(),
                    time:      selectedTime,
                    type:      selectedSessionType,
                    reason:    document.getElementById('reason-for-visit').value.trim()
                })
            });
            const data = await res.json();
            if (data.success) {
                showNotification('Session booked successfully!', 'success');
                setTimeout(() => window.location.href = 'appointments.html', 1800);
            } else {
                showNotification(data.message || 'Failed to book appointment.', 'error');
                btn.disabled = false; btn.textContent = 'Confirm & Schedule';
            }
        } catch (e) {
            showNotification('Error connecting to server.', 'error');
            btn.disabled = false; btn.textContent = 'Confirm & Schedule';
        }
    });
}

// ─── CANCEL APPOINTMENT ───────────────────────────────────────────────────────
window.cancelAppointment = async function(id) {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    
    const token = localStorage.getItem('mindwellToken');
    if (!token) return;

    try {
        const res = await fetch(`${API}/appointments/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
            showNotification('Appointment cancelled successfully.', 'success');
            renderFullAppointmentLists();
        } else {
            showNotification(data.message || 'Error canceling appointment.', 'error');
        }
    } catch (e) {
        showNotification('Error connecting to server.', 'error');
    }
};
