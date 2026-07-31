const fs = require('fs');

let g = fs.readFileSync('c:/mindwell-project/frontend/js/global.js', 'utf8');
g += `\n\nfunction showNotification(message, type) {
    const notification = document.getElementById('notification');
    if (!notification) return;
    notification.textContent = message;
    notification.className = '';
    notification.classList.add(type, 'show');
    setTimeout(() => notification.classList.remove('show'), 3000);
}`;
fs.writeFileSync('c:/mindwell-project/frontend/js/global.js', g);

let d = fs.readFileSync('c:/mindwell-project/frontend/js/dashboard.js', 'utf8');
d = d.replace(
    /function renderDashboardAppointmentList\(\) {[\s\S]*?function renderMoodChart/,
    `async function renderDashboardAppointmentList() {
    const appointmentList = document.getElementById('appointment-list');
    if (!appointmentList) return;
    
    const token = localStorage.getItem('mindwellToken');
    const allAppointments = token ? await fetchAppointments(token) : [];
    
    const now = new Date();
    const upcomingAppointments = allAppointments.filter(appt => new Date(appt.date) >= now);

    appointmentList.innerHTML = '';
    if (upcomingAppointments.length === 0) {
        appointmentList.innerHTML = \`<p class="text-stone-500 text-sm">You have no upcoming appointments.</p>\`;
    } else {
        upcomingAppointments.slice(0, 2).forEach(appt => {
            const el = document.createElement('div');
            el.innerHTML = \`<p class="font-semibold text-stone-700">\${appt.counselor}</p><p class="text-sm text-stone-500">\${new Date(appt.date).toLocaleDateString()} at \${appt.time}</p>\`;
            appointmentList.appendChild(el);
        });
    }
}

function renderMoodChart`
);
fs.writeFileSync('c:/mindwell-project/frontend/js/dashboard.js', d);
console.log('Fixed showNotification and dashboard fetching.');
