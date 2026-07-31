/**
 * MindWell - admin-dashboard.js
 * -----------------------------
 * This file contains all the JavaScript logic specific to the admin dashboard
 * and its sub-pages.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Run initializers based on the current page ---

    if (document.getElementById('signupsChart')) { // Main Dashboard
        fetchDashboardData();
    }

    if (document.getElementById('analyticsGrowthChart')) { // Analytics Page
        setupAnalyticsPage();
    }

    if (document.getElementById('user-table-body')) { // Manage Users page
        setupManageUsersPage();
    }

    if (document.getElementById('counselor-table-body')) { // Manage Counselors page
        setupManageCounselorsPage();
    }

    if (document.getElementById('resource-table-body')) { // Manage Resources page
        setupManageResourcesPage();
    }
    
    if (document.getElementById('admin-profile-form')) { // Admin Profile page
        setupAdminProfilePage();
    }
    
    // Global Admin Logout Logic
    const logoutBtn = document.getElementById('admin-logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('mindwellToken');
            window.location.href = '../login.html';
        });
    }
});

function setupManageUsersPage() {
    const searchInput = document.getElementById('user-search');
    const userTableBody = document.getElementById('user-table-body');
    const token = localStorage.getItem('mindwellToken');
    let allUsers = [];

    if (!token) {
        window.location.href = '../login.html';
        return;
    }

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/admin/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) {
                throw new Error('Failed to fetch users.');
            }

            const data = await res.json();
            allUsers = data.data;
            renderUsers();
        } catch (error) {
            console.error(error);
            userTableBody.innerHTML = `<tr><td colspan="5" class="text-center p-8 text-red-500">Could not load user data.</td></tr>`;
        }
    };

    const renderUsers = () => {
        const searchTerm = searchInput.value.toLowerCase();
        userTableBody.innerHTML = '';

        const filteredUsers = allUsers.filter(user => {
            const matchesSearch = 
                user.name.toLowerCase().includes(searchTerm) ||
                user.email.toLowerCase().includes(searchTerm) ||
                (user.registrationNumber && user.registrationNumber.toLowerCase().includes(searchTerm));

            return matchesSearch;
        });

        if (filteredUsers.length === 0) {
            userTableBody.innerHTML = `<tr><td colspan="5" class="text-center p-8 text-stone-500">No users found.</td></tr>`;
            return;
        }

        filteredUsers.forEach(user => {
            const row = document.createElement('tr');
            row.className = 'border-b hover:bg-stone-50';
            row.innerHTML = `
                <td class="p-4">${user.name}</td>
                <td class="p-4">${user.email}</td>
                <td class="p-4">${new Date(user.createdAt).toLocaleDateString()}</td>
                <td class="p-4">
                    <button class="suspend-btn font-semibold ${user.isSuspended ? 'text-green-500 hover:text-green-700' : 'text-red-500 hover:text-red-700'}" data-id="${user._id}">
                        ${user.isSuspended ? 'Unsuspend' : 'Suspend'}
                    </button>
                </td>
            `;
            userTableBody.appendChild(row);
        });
    };

    userTableBody.addEventListener('click', async (e) => {
        if (e.target.classList.contains('suspend-btn')) {
            const userId = e.target.dataset.id;
            try {
                const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/suspend`, {
                    method: 'PUT',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    showNotification(data.message, 'success');
                    fetchUsers(); // Refresh the list
                } else {
                    showNotification(data.message || 'Error', 'error');
                }
            } catch (err) {
                console.error(err);
                showNotification('Network error.', 'error');
            }
        }
    });

    searchInput.addEventListener('input', renderUsers);

    fetchUsers(); // Initial fetch
}


// --- NOTIFICATION FUNCTION ---

/**
 * Displays a custom notification message.
 * @param {string} message - The message to display.
 * @param {string} type - The type of notification ('success' or 'error').
 */
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    if (!notification) return;

    notification.textContent = message;
    notification.className = ''; // Clear existing classes
    notification.classList.add(type, 'show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000); // Hide after 3 seconds
}

// --- ADMIN PROFILE PAGE FUNCTIONS ---

function setupAdminProfilePage() {
    const editBtn = document.getElementById('edit-admin-profile-btn');
    const formActions = document.getElementById('admin-form-actions');
    const cancelBtn = document.getElementById('cancel-admin-edit-btn');
    const profileFields = document.querySelectorAll('.admin-profile-field');

    if (!editBtn) return;

    const originalValues = {};
    profileFields.forEach(field => {
        originalValues[field.id] = field.value;
    });

    const enterEditMode = () => {
        editBtn.classList.add('hidden');
        formActions.classList.remove('hidden');
        profileFields.forEach(field => {
            field.readOnly = false;
            field.classList.remove('bg-stone-100');
        });
    };

    const exitEditMode = () => {
        editBtn.classList.remove('hidden');
        formActions.classList.add('hidden');
        profileFields.forEach(field => {
            field.readOnly = true;
            field.classList.add('bg-stone-100');
            field.value = originalValues[field.id]; // Revert changes
        });
    };

    editBtn.addEventListener('click', enterEditMode);
    cancelBtn.addEventListener('click', exitEditMode);

    document.getElementById('admin-profile-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const newPassword = document.getElementById('admin-new-password').value;
        const confirmPassword = document.getElementById('admin-confirm-password').value;

        if (newPassword && newPassword !== confirmPassword) {
            alert("New passwords do not match.");
            return;
        }
        
        alert('Admin profile has been updated successfully!');
        profileFields.forEach(field => {
            originalValues[field.id] = field.value;
        });
        exitEditMode();
    });
}

function updateTimestamp(elementId) {
    const timestampEl = document.getElementById(elementId);
    if (timestampEl) {
        const now = new Date();
        timestampEl.textContent = `Last updated: ${now.toLocaleTimeString()}`;
    }
}

async function fetchDashboardData() {
    const token = localStorage.getItem('mindwellToken');
    if (!token) return;

    try {
        // Fetch stats
        const statsRes = await fetch(`${API_BASE_URL}/admin/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const statsData = await statsRes.json();
        
        if (statsData.success) {
            document.getElementById('total-students').textContent = statsData.data.totalStudents.toLocaleString();
            document.getElementById('active-counselors').textContent = statsData.data.activeCounselors;
            document.getElementById('appointments-week').textContent = statsData.data.appointmentsThisWeek;
            document.getElementById('avg-mood').textContent = `${statsData.data.averageMood} / 5`;
            updateTimestamp('last-updated');
        }

        // Fetch analytics for charts
        const analyticsRes = await fetch(`${API_BASE_URL}/admin/analytics`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const analyticsData = await analyticsRes.json();

        if (analyticsData.success) {
            renderSignupsChart(document.getElementById('signupsChart'), analyticsData.data.signups, analyticsData.data.labels.months);
            renderMoodTrendsChart(document.getElementById('moodTrendsChart'), analyticsData.data.moodTrends, analyticsData.data.labels.weeks);
        }
    } catch (err) {
        console.error("Error fetching dashboard data", err);
    }
}

function renderSignupsChart(canvas, data, labels) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'New Student Signups',
                data: data || [65, 59, 80, 81, 56, 55],
                backgroundColor: 'rgba(234, 88, 12, 0.6)',
                borderColor: 'rgba(234, 88, 12, 1)',
                borderWidth: 1,
                borderRadius: 5
            }]
        },
        options: {
            scales: { y: { beginAtZero: true } },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function renderMoodTrendsChart(canvas, data, labels) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels || ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
            datasets: [{
                label: 'Average Mood Rating',
                data: data || [3.5, 3.2, 2.9, 3.8, 4.1, 4.0],
                backgroundColor: 'rgba(13, 148, 136, 0.2)',
                borderColor: 'rgba(13, 148, 136, 1)',
                borderWidth: 2,
                tension: 0.4
            }]
        },
        options: {
            scales: { y: { beginAtZero: false, min: 1, max: 5 } },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// --- ANALYTICS PAGE FUNCTIONS ---
async function setupAnalyticsPage() {
    updateTimestamp('analytics-last-updated');
    const token = localStorage.getItem('mindwellToken');
    if (!token) return;

    try {
        const res = await fetch(`${API_BASE_URL}/admin/analytics`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await res.json();
        
        if (json.success) {
            // Growth Chart
            const growthCanvas = document.getElementById('analyticsGrowthChart');
            if (growthCanvas) {
                new Chart(growthCanvas.getContext('2d'), {
                    type: 'line',
                    data: {
                        labels: json.data.labels.months,
                        datasets: [{
                            label: 'Total Active Users',
                            data: json.data.signups.map((s, i, arr) => arr.slice(0, i+1).reduce((a, b) => a + b, 0)), // Cumulative
                            fill: true,
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            borderColor: 'rgba(16, 185, 129, 1)',
                            tension: 0.4
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false }
                });
            }

            // Pie Chart
            const pieCanvas = document.getElementById('analyticsMoodPieChart');
            if (pieCanvas) {
                new Chart(pieCanvas.getContext('2d'), {
                    type: 'doughnut',
                    data: {
                        labels: ['Happy (5)', 'Good (4)', 'Okay (3)', 'Sad (2)', 'Stressed (1)'],
                        datasets: [{
                            data: json.data.moodDistribution || [30, 40, 15, 10, 5],
                            backgroundColor: ['#10b981', '#34d399', '#fbbf24', '#f59e0b', '#ef4444'],
                            borderWidth: 0
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false }
                });
            }

            // Appointments Chart
            const aptCanvas = document.getElementById('analyticsAppointmentsChart');
            if (aptCanvas) {
                new Chart(aptCanvas.getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        datasets: [{
                            label: 'Sessions Booked',
                            data: json.data.appointmentsByDay || [12, 19, 15, 22, 18, 5, 2],
                            backgroundColor: 'rgba(59, 130, 246, 0.7)'
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false }
                });
            }
        }
    } catch (err) {
        console.error("Error setting up analytics page", err);
    }
}

// --- MANAGE COUNSELORS PAGE FUNCTIONS ---

function setupManageCounselorsPage() {
    const manageBtn = document.getElementById('manage-counselors-btn');
    const accessCodeOverlay = document.getElementById('access-code-overlay');
    const accessCodeModal = document.getElementById('access-code-modal');
    const accessCodeForm = document.getElementById('access-code-form');
    const accessCodeInput = document.getElementById('access-code-input');
    const accessError = document.getElementById('access-error');
    const searchInput = document.getElementById('counselor-search');

    let counselors = [];
    const token = localStorage.getItem('mindwellToken');

    const fetchCounselors = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/counselors`);
            const data = await res.json();
            if (data.success) {
                counselors = data.data.map(c => ({
                    id: c._id, // map mongo _id to id
                    name: c.name,
                    specialty: c.specialty,
                    bio: c.bio || c.description || '',
                    isDefault: false // Treat all db counselors as editable by admin
                }));
            }
            renderCounselors();
        } catch (err) {
            console.error("Error fetching counselors", err);
            document.getElementById('counselor-table-body').innerHTML = `<tr><td colspan="3" class="text-center p-8 text-red-500">Could not load counselor data.</td></tr>`;
        }
    };

    let managementEnabled = false;

    const renderCounselors = () => {
        const tableBody = document.getElementById('counselor-table-body');
        const searchTerm = searchInput.value.toLowerCase();
        tableBody.innerHTML = '';

        const filteredCounselors = counselors.filter(c => 
            c.name.toLowerCase().includes(searchTerm) || 
            c.specialty.toLowerCase().includes(searchTerm)
        );

        if (filteredCounselors.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="3" class="text-center p-8 text-stone-500">No counselors found.</td></tr>`;
            return;
        }

        filteredCounselors.forEach(counselor => {
            const row = document.createElement('tr');
            row.className = 'border-b hover:bg-stone-50';
            
            const actionsHtml = `<button class="edit-btn text-blue-500 hover:text-blue-700 font-semibold mr-4" data-id="${counselor.id}">Edit</button>
                                 <button class="delete-btn text-red-500 hover:text-red-700 font-semibold" data-id="${counselor.id}">Delete</button>`;

            row.innerHTML = `
                <td class="p-4">${counselor.name}</td>
                <td class="p-4">${counselor.specialty}</td>
                <td class="p-4 text-right actions-cell ${managementEnabled ? '' : 'hidden'}">
                    ${actionsHtml}
                </td>
            `;
            tableBody.appendChild(row);
        });
    };

    const toggleManagementFeatures = (enable) => {
        managementEnabled = enable;
        const actionsHeader = document.querySelector('.actions-header');
        const manageBtnContainer = document.getElementById('manage-counselors-btn');
        const manageBtnText = manageBtnContainer.querySelector('span');

        if (enable) {
            actionsHeader.classList.remove('hidden');
            manageBtnContainer.id = 'add-counselor-btn'; // Change ID for event handling
            manageBtnText.textContent = 'Add New Counselor';
            manageBtnContainer.classList.remove('bg-stone-600', 'hover:bg-stone-700');
            manageBtnContainer.classList.add('bg-orange-500', 'hover:bg-orange-600');
            
            // Re-bind the click event to the new ID
            document.getElementById('add-counselor-btn').addEventListener('click', () => openCounselorModal());
        }
        renderCounselors(); // Re-render to show/hide action buttons
    };

    manageBtn.addEventListener('click', () => {
        if (!managementEnabled) {
            accessCodeOverlay.classList.remove('hidden');
            accessCodeModal.classList.remove('hidden');
        }
    });

    accessCodeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (accessCodeInput.value === '1105') {
            accessCodeOverlay.classList.add('hidden');
            accessCodeModal.classList.add('hidden');
            accessError.classList.add('hidden');
            accessCodeInput.value = '';
            toggleManagementFeatures(true);
        } else {
            accessError.classList.remove('hidden');
        }
    });
    
    searchInput.addEventListener('input', renderCounselors);

    // Modal Logic
    const modalOverlay = document.getElementById('counselor-modal-overlay');
    const modal = document.getElementById('counselor-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const counselorForm = document.getElementById('counselor-form');
    const modalTitle = document.getElementById('modal-title');
    const deleteConfirmModal = document.getElementById('delete-confirm-modal');
    const deleteConfirmOverlay = document.getElementById('delete-confirm-modal-overlay');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    let counselorToDeleteId = null;

    const openCounselorModal = (counselor = null) => {
        counselorForm.reset();
        if (counselor) {
            modalTitle.textContent = 'Edit Counselor';
            document.getElementById('counselor-id').value = counselor.id;
            document.getElementById('counselor-name').value = counselor.name;
            document.getElementById('counselor-specialty').value = counselor.specialty;
            document.getElementById('counselor-bio').value = counselor.bio;
        } else {
            modalTitle.textContent = 'Add New Counselor';
            document.getElementById('counselor-id').value = '';
        }
        modalOverlay.classList.remove('hidden');
        modal.classList.remove('hidden');
    };

    const closeCounselorModal = () => {
        modalOverlay.classList.add('hidden');
        modal.classList.add('hidden');
    };

    closeModalBtn.addEventListener('click', closeCounselorModal);
    modalOverlay.addEventListener('click', closeCounselorModal);

    counselorForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('counselor-id').value;
        
        const counselorData = {
            name: document.getElementById('counselor-name').value,
            specialty: document.getElementById('counselor-specialty').value,
            description: document.getElementById('counselor-bio').value
        };

        try {
            if (id) {
                // Update
                await fetch(`${API_BASE_URL}/counselors/${id}`, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify(counselorData)
                });
            } else {
                // Create
                await fetch(`${API_BASE_URL}/counselors`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify(counselorData)
                });
            }
            await fetchCounselors(); // Refresh list
            closeCounselorModal();
        } catch (err) {
            console.error("Error saving counselor", err);
            alert("Error saving counselor.");
        }
    });

    document.getElementById('counselor-table-body').addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-btn')) {
            const id = e.target.dataset.id;
            const counselor = counselors.find(c => c.id === id);
            if (counselor) {
                openCounselorModal(counselor);
            }
        }
        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.dataset.id;
            const counselor = counselors.find(c => c.id === id);
            if (counselor) {
                counselorToDeleteId = id;
                document.getElementById('delete-confirm-text').textContent = `This will permanently delete the profile for ${counselor.name}.`;
                deleteConfirmModal.classList.remove('hidden');
                deleteConfirmOverlay.classList.remove('hidden');
            }
        }
    });

    cancelDeleteBtn.addEventListener('click', () => {
        deleteConfirmModal.classList.add('hidden');
        deleteConfirmOverlay.classList.add('hidden');
    });

    confirmDeleteBtn.addEventListener('click', async () => {
        if (!counselorToDeleteId) return;
        try {
            await fetch(`${API_BASE_URL}/counselors/${counselorToDeleteId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            await fetchCounselors();
        } catch (err) {
            console.error("Error deleting counselor", err);
            alert("Error deleting counselor.");
        }
        
        deleteConfirmModal.classList.add('hidden');
        deleteConfirmOverlay.classList.add('hidden');
    });

    fetchCounselors(); // Initial render
}

// --- MANAGE RESOURCES PAGE FUNCTIONS ---

function setupManageResourcesPage() {
    const addResourceBtn = document.getElementById('add-resource-btn');
    const modalOverlay = document.getElementById('resource-modal-overlay');
    const modal = document.getElementById('resource-modal');
    const closeModalBtn = document.getElementById('close-resource-modal-btn');
    const resourceForm = document.getElementById('resource-form');
    const modalTitle = document.getElementById('resource-modal-title');
    const searchInput = document.getElementById('resource-search');
    const deleteConfirmModal = document.getElementById('delete-confirm-modal');
    const deleteConfirmOverlay = document.getElementById('delete-confirm-modal-overlay');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    let resourceToDeleteId = null;

    let resources = [];
    const token = localStorage.getItem('mindwellToken');

    const fetchResources = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/resources`);
            const data = await res.json();
            if (data.success) {
                resources = data.data.map(r => ({
                    id: r._id,
                    title: r.title,
                    type: r.type,
                    topic: r.topic,
                    link: r.link || r.content || '',
                    img: r.imageUrl || r.img || ''
                }));
            }
            renderResources();
        } catch (err) {
            console.error("Error fetching resources", err);
            document.getElementById('resource-table-body').innerHTML = `<tr><td colspan="4" class="text-center p-8 text-red-500">Could not load resources data.</td></tr>`;
        }
    };

    const renderResources = () => {
        const tableBody = document.getElementById('resource-table-body');
        const searchTerm = searchInput.value.toLowerCase();
        tableBody.innerHTML = '';

        const filteredResources = resources.filter(res => 
            res.title.toLowerCase().includes(searchTerm) || 
            res.topic.toLowerCase().includes(searchTerm)
        );

        if (filteredResources.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4" class="text-center p-8 text-stone-500">No resources found.</td></tr>`;
            return;
        }

        filteredResources.forEach(resource => {
            const row = document.createElement('tr');
            row.className = 'border-b hover:bg-stone-50';
            row.innerHTML = `
                <td class="p-4 font-semibold">${resource.title}</td>
                <td class="p-4 capitalize">${resource.type}</td>
                <td class="p-4 capitalize">${resource.topic}</td>
                <td class="p-4 text-right">
                    <button class="edit-btn text-blue-500 hover:text-blue-700 font-semibold mr-4" data-id="${resource.id}">Edit</button>
                    <button class="delete-btn text-red-500 hover:text-red-700 font-semibold" data-id="${resource.id}">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    };

    const openModal = (resource = null) => {
        resourceForm.reset();
        if (resource) {
            modalTitle.textContent = 'Edit Resource';
            document.getElementById('resource-id').value = resource.id;
            document.getElementById('resource-title').value = resource.title;
            document.getElementById('resource-type').value = resource.type;
            document.getElementById('resource-topic').value = resource.topic;
            document.getElementById('resource-content').value = resource.link;
            document.getElementById('resource-img').value = resource.img;
        } else {
            modalTitle.textContent = 'Add New Resource';
            document.getElementById('resource-id').value = '';
        }
        modalOverlay.classList.remove('hidden');
        modal.classList.remove('hidden');
    };

    const closeModal = () => {
        modalOverlay.classList.add('hidden');
        modal.classList.add('hidden');
    };

    addResourceBtn.addEventListener('click', () => openModal());
    closeModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    resourceForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('resource-id').value;
        const newResource = {
            title: document.getElementById('resource-title').value,
            type: document.getElementById('resource-type').value,
            topic: document.getElementById('resource-topic').value,
            link: document.getElementById('resource-content').value,
            imageUrl: document.getElementById('resource-img').value
        };

        try {
            if (id) {
                await fetch(`${API_BASE_URL}/resources/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(newResource)
                });
            } else {
                await fetch(`${API_BASE_URL}/resources`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(newResource)
                });
            }
            await fetchResources();
            closeModal();
        } catch (err) {
            console.error("Error saving resource", err);
            alert("Error saving resource.");
        }
    });

    document.getElementById('resource-table-body').addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-btn')) {
            const id = e.target.dataset.id;
            const resource = resources.find(res => res.id === id);
            if (resource) openModal(resource);
        }
        if (e.target.classList.contains('delete-btn')) {
            resourceToDeleteId = e.target.dataset.id;
            const resource = resources.find(res => res.id === resourceToDeleteId);
            if (resource) {
                document.getElementById('delete-confirm-text').textContent = `This will permanently delete the resource: "${resource.title}".`;
                deleteConfirmModal.classList.remove('hidden');
                deleteConfirmOverlay.classList.remove('hidden');
            }
        }
    });

    cancelDeleteBtn.addEventListener('click', () => {
        deleteConfirmModal.classList.add('hidden');
        deleteConfirmOverlay.classList.add('hidden');
    });

    confirmDeleteBtn.addEventListener('click', async () => {
        if (!resourceToDeleteId) return;
        try {
            await fetch(`${API_BASE_URL}/resources/${resourceToDeleteId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            await fetchResources();
        } catch (err) {
            console.error("Error deleting resource", err);
            alert("Error deleting resource.");
        }
        
        deleteConfirmModal.classList.add('hidden');
        deleteConfirmOverlay.classList.add('hidden');
    });
    
    searchInput.addEventListener('input', renderResources);

    fetchResources();
}
