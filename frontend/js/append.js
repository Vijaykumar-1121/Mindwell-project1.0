// --- NOTIFICATION FUNCTION ---
function showNotification(message, type = 'info') {
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = 'fixed top-4 right-4 z-50 p-4 rounded-xl font-bold shadow-lg transition-transform transform translate-x-full';
        document.body.appendChild(notification);
        
        const style = document.createElement('style');
        style.textContent = `
            #notification.show { transform: translateX(0); }
            #notification.info { background: #3b82f6; color: white; }
            #notification.success { background: #10b981; color: white; }
            #notification.error { background: #ef4444; color: white; }
        `;
        document.head.appendChild(style);
    }
    notification.textContent = message;
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-xl font-bold shadow-lg transition-transform transform show ${type}`;
    setTimeout(() => notification.classList.remove('show'), 4000);
}

// --- UNIFIED COUNSELOR DATABASE ---
function getMindwellCounselors() {
    return [
        { id: 1, name: 'Dr. Jothishree', specialty: 'Anxiety Specialist', imageUrl: '../images/dr_jothishree.png', availability: [1, 3, 5] },
        { id: 2, name: 'Dr. Vijaykumar', specialty: 'Academic Stress', imageUrl: '../images/dr_vijaykumar.png', availability: [2, 4] },
        { id: 3, name: 'Dr. EswarSai', specialty: 'General Counseling', imageUrl: '../images/dr_eswarsai.png', availability: [1, 2, 3, 4, 5] }
    ];
}

async function fetchAppointments(token) {
    try {
        const res = await fetch(`${API_BASE_URL}/appointments`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        return data.data;
    } catch (e) {
        return [];
    }
}

// --- APPOINTMENTS PAGE FUNCTIONS ---
function renderFeaturedCounselors() {
    const list = document.getElementById('featured-counselors-list');
    if (!list) return;
    list.innerHTML = '';
    const counselors = getMindwellCounselors();
    counselors.forEach(c => {
        const div = document.createElement('div');
        div.className = 'bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white text-center hover:shadow-md transition';
        div.innerHTML = `
            <img src="${c.imageUrl}" alt="${c.name}" class="w-24 h-24 mx-auto rounded-full object-cover mb-4 border-4 border-white shadow-sm">
            <h4 class="font-bold text-stone-800 text-lg font-['Lora',serif]">${c.name}</h4>
            <p class="text-sm font-semibold text-orange-500 mb-4">${c.specialty}</p>
            <a href="book-appointment.html?counselor=${encodeURIComponent(c.name)}" class="inline-block bg-orange-500 text-white font-bold py-2 px-6 rounded-full hover:bg-orange-600 transition shadow-sm hover:-translate-y-0.5">Book Now</a>
        `;
        list.appendChild(div);
    });
}

async function renderFullAppointmentLists() {
    const upcomingList = document.getElementById('upcoming-appointments-list');
    const pastList = document.getElementById('past-appointments-list');
    if (!upcomingList || !pastList) return;

    renderFeaturedCounselors();

    const token = localStorage.getItem('mindwellToken');
    const allAppointments = token ? await fetchAppointments(token) : [];
    const now = new Date();

    const upcomingAppointments = allAppointments.filter(appt => new Date(appt.date) >= now);
    const pastAppointments = allAppointments.filter(appt => new Date(appt.date) < now);

    upcomingList.innerHTML = '';
    if (upcomingAppointments.length === 0) {
        upcomingList.innerHTML = '<p class="text-stone-500 font-medium">You have no upcoming appointments. Time to relax!</p>';
    } else {
        upcomingAppointments.forEach(appt => {
            const el = document.createElement('div');
            el.className = 'bg-white/40 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white flex justify-between items-center transition hover:shadow-md hover:bg-white/60';
            const apptDate = new Date(appt.date);
            el.innerHTML = `
                <div>
                    <p class="font-bold text-xl text-stone-800 font-['Lora',serif]">${appt.counselor}</p>
                    <p class="text-sm font-bold text-orange-500 mb-1">${apptDate.toLocaleDateString()} at ${appt.time}</p>
                    <span class="inline-block px-3 py-1 bg-white rounded-full text-xs font-bold text-stone-500 tracking-wide uppercase shadow-sm border border-[#F0EBE1]">${appt.type}</span>
                </div>
                <div class="flex flex-col gap-2">
                    <button class="join-btn text-sm font-bold bg-[#789c8a] text-white px-5 py-2 rounded-full hover:bg-[#658575] transition shadow-sm hover:-translate-y-0.5">Join Session</button>
                    <a href="book-appointment.html?counselor=${encodeURIComponent(appt.counselor)}" class="text-center text-xs font-bold bg-white text-stone-600 px-5 py-2 rounded-full hover:bg-stone-50 transition border border-[#F0EBE1]">Reschedule</a>
                </div>
            `;
            
            const joinBtn = el.querySelector('.join-btn');
            if (joinBtn) {
                if (appt.type === 'In-Person') {
                    joinBtn.textContent = 'In-Person Visit';
                    joinBtn.classList.remove('bg-[#789c8a]', 'hover:bg-[#658575]', 'text-white');
                    joinBtn.classList.add('bg-stone-200', 'text-stone-700');
                    joinBtn.addEventListener('click', () => showNotification('This is an in-person session. Please visit the counseling center.', 'info'));
                } else {
                    joinBtn.addEventListener('click', () => showNotification('Meeting link will be provided by your doctor shortly before the session.', 'info'));
                }
            }
            upcomingList.appendChild(el);
        });
    }

    pastList.innerHTML = '';
    if (pastAppointments.length === 0) {
        pastList.innerHTML = '<p class="text-stone-500 font-medium">You have no past appointments.</p>';
    } else {
        pastAppointments.forEach(appt => {
            const el = document.createElement('div');
            el.className = 'bg-white/40 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white flex justify-between items-center transition hover:shadow-md hover:bg-white/60';
            el.innerHTML = `
                <div>
                    <p class="font-bold text-xl text-stone-700 font-['Lora',serif]">${appt.counselor}</p>
                    <p class="text-sm font-bold text-stone-500">${new Date(appt.date).toLocaleDateString()}</p>
                </div>
                <button class="text-sm font-bold bg-white text-stone-600 px-5 py-2 rounded-full hover:bg-stone-50 transition border border-[#F0EBE1] shadow-sm">View Notes</button>
            `;
            pastList.appendChild(el);
        });
    }
}

// --- BOOKING PAGE FUNCTIONS ---
function setupBookingPage() {
    const counselorList = document.getElementById('counselor-list');
    if (!counselorList) return;

    let selectedCounselor = null;
    let selectedDate = null;
    let selectedTime = null;
    let selectedSessionType = null;
    let currentDate = new Date();

    const allCounselors = getMindwellCounselors();

    const renderCounselorOptions = () => {
        counselorList.innerHTML = '';
        allCounselors.forEach(c => {
            const btn = document.createElement('button');
            btn.className = 'w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-transparent bg-white hover:border-orange-500 transition cursor-pointer shadow-sm text-left';
            btn.innerHTML = `
                <img src="${c.imageUrl}" alt="${c.name}" class="w-16 h-16 rounded-full object-cover">
                <div>
                    <h3 class="font-bold text-lg text-stone-800 font-['Lora',serif]">${c.name}</h3>
                    <p class="text-sm text-stone-500">${c.specialty}</p>
                </div>
            `;
            btn.addEventListener('click', () => {
                selectedCounselor = c.name;
                document.querySelectorAll('#counselor-list button').forEach(b => b.classList.remove('border-orange-500', 'bg-orange-50'));
                btn.classList.add('border-orange-500', 'bg-orange-50');
                document.getElementById('booking-flow').classList.remove('hidden');
                renderCalendar();
            });
            counselorList.appendChild(btn);
        });
    };

    const urlParams = new URLSearchParams(window.location.search);
    const preselectedCounselor = urlParams.get('counselor');
    renderCounselorOptions();
    if (preselectedCounselor) {
        const btns = counselorList.querySelectorAll('button');
        const index = allCounselors.findIndex(c => c.name === preselectedCounselor);
        if (index !== -1) btns[index].click();
    }

    const calendarDays = document.getElementById('calendar-days');
    const monthYear = document.getElementById('month-year');
    
    document.getElementById('prev-month').addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); });
    document.getElementById('next-month').addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); });

    function renderCalendar() {
        calendarDays.innerHTML = '';
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        monthYear.textContent = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d => {
            const el = document.createElement('div');
            el.className = 'font-semibold text-sm text-stone-500';
            el.textContent = d;
            calendarDays.appendChild(el);
        });

        for (let i = 0; i < firstDay; i++) calendarDays.appendChild(document.createElement('div'));

        for (let day = 1; day <= daysInMonth; day++) {
            const btn = document.createElement('button');
            btn.textContent = day;
            btn.className = 'w-10 h-10 mx-auto flex items-center justify-center rounded-full hover:bg-stone-200 transition font-bold text-stone-700';
            const date = new Date(year, month, day);
            const counselorData = allCounselors.find(c => c.name === selectedCounselor);
            const isAvailable = counselorData && counselorData.availability.includes(date.getDay());
            
            if (date < new Date().setHours(0,0,0,0) || !isAvailable) {
                btn.disabled = true;
                btn.classList.add('text-stone-300', 'cursor-not-allowed', 'opacity-50');
            } else {
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

    function renderTimeSlots(date) {
        const container = document.getElementById('time-slots');
        container.innerHTML = '';
        document.getElementById('session-type-section').classList.add('hidden');
        document.getElementById('confirmation-section').classList.add('hidden');
        selectedTime = null;

        const allTimes = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();

        const availableTimes = allTimes.filter(t => {
            if (!isToday) return true;
            const match = t.match(/(\\d+):(\\d+) (AM|PM)/);
            let h = parseInt(match[1]);
            if (match[3] === 'PM' && h < 12) h += 12;
            if (match[3] === 'AM' && h === 12) h = 0;
            const slot = new Date();
            slot.setHours(h, parseInt(match[2]), 0, 0);
            return slot > now;
        });

        if (availableTimes.length === 0) {
            container.innerHTML = '<p class="text-stone-500 italic col-span-full text-center">No times available today.</p>';
            return;
        }

        availableTimes.forEach(t => {
            const btn = document.createElement('button');
            btn.textContent = t;
            btn.className = 'w-full p-4 border bg-white rounded-2xl hover:bg-orange-50 hover:border-orange-500 transition font-bold text-stone-600';
            btn.addEventListener('click', () => {
                selectedTime = t;
                container.querySelectorAll('button').forEach(b => b.classList.remove('bg-orange-500', 'text-white', 'border-orange-500'));
                btn.classList.add('bg-orange-500', 'text-white', 'border-orange-500');
                document.getElementById('session-type-section').classList.remove('hidden');
            });
            container.appendChild(btn);
        });
    }

    document.querySelectorAll('.session-type-option').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedSessionType = btn.dataset.type;
            document.querySelectorAll('.session-type-option').forEach(b => b.classList.remove('bg-orange-500', 'text-white', 'border-orange-500'));
            btn.classList.add('bg-orange-500', 'text-white', 'border-orange-500');
            document.getElementById('reason-section').classList.remove('hidden');
        });
    });

    const continueBtn = document.getElementById('continue-to-confirm-btn');
    continueBtn.addEventListener('click', () => {
        if (!selectedCounselor || !selectedDate || !selectedTime || !selectedSessionType) return;
        const details = document.getElementById('selected-appointment-details');
        details.innerHTML = \`
            You are scheduling a <strong>\${selectedSessionType}</strong> session with <br> 
            <span class="text-xl text-orange-500">\${selectedCounselor}</span> <br>
            on <strong>\${selectedDate.toLocaleDateString()}</strong> at <strong>\${selectedTime}</strong>.
        \`;
        const reason = document.getElementById('reason-for-visit').value.trim();
        const reasonDisplay = document.getElementById('selected-reason-display');
        if (reason) {
            reasonDisplay.textContent = \`Reason: "\${reason}"\`;
            reasonDisplay.classList.remove('hidden');
        } else {
            reasonDisplay.classList.add('hidden');
        }
        const confSection = document.getElementById('confirmation-section');
        confSection.classList.remove('hidden');
        confSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        continueBtn.textContent = 'Confirmed ✓';
        continueBtn.classList.add('bg-green-100', 'text-green-700');
    });

    document.getElementById('confirm-booking-btn').addEventListener('click', async () => {
        const token = localStorage.getItem('mindwellToken');
        if (!token) { showNotification('Please log in first', 'error'); return; }
        
        try {
            const res = await fetch(`${API_BASE_URL}/appointments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${token}\` },
                body: JSON.stringify({
                    counselor: selectedCounselor,
                    date: selectedDate.toISOString(),
                    time: selectedTime,
                    type: selectedSessionType,
                    reason: document.getElementById('reason-for-visit').value.trim()
                })
            });
            if (res.ok) {
                showNotification('Appointment Scheduled!', 'success');
                setTimeout(() => window.location.href = 'appointments.html', 1500);
            } else {
                const data = await res.json();
                showNotification(data.message || 'Failed to book.', 'error');
            }
        } catch (e) {
            showNotification('Error booking appointment.', 'error');
        }
    });
}
