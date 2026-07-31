/**
 * Profile Logic
 * -------------
 * Handles loading the user's profile, including the expanded fields 
 * and handling base64 avatar uploads.
 */

const API = API_BASE_URL;
let currentAvatarBase64 = '';
let cropper = null;

document.addEventListener('DOMContentLoaded', () => {
    loadProfile();

    const form = document.getElementById('profile-form');
    if (form) {
        form.addEventListener('submit', handleProfileUpdate);
    }
    
    const avatarInput = document.getElementById('avatar-upload');
    if (avatarInput) {
        avatarInput.addEventListener('change', handleAvatarUpload);
    }

    // Cropper logic
    const cropModal = document.getElementById('crop-modal');
    const cancelCropBtn = document.getElementById('cancel-crop-btn');
    const confirmCropBtn = document.getElementById('confirm-crop-btn');
    const cropImage = document.getElementById('crop-image');

    if (cancelCropBtn) {
        cancelCropBtn.addEventListener('click', () => {
            cropModal.classList.remove('flex');
            cropModal.classList.add('hidden');
            if (cropper) { cropper.destroy(); cropper = null; }
            avatarInput.value = ''; // Reset input
        });
    }

    if (confirmCropBtn) {
        confirmCropBtn.addEventListener('click', () => {
            if (cropper) {
                const canvas = cropper.getCroppedCanvas({
                    width: 256,
                    height: 256
                });
                currentAvatarBase64 = canvas.toDataURL('image/jpeg');
                
                // Update the display picture
                const display = document.getElementById('profile-avatar-display');
                if (display) {
                    display.innerHTML = `<img src="${currentAvatarBase64}" class="w-full h-full object-cover">`;
                }

                cropModal.classList.remove('flex');
                cropModal.classList.add('hidden');
                cropper.destroy();
                cropper = null;
            }
        });
    }
});

function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const cropModal = document.getElementById('crop-modal');
            const cropImage = document.getElementById('crop-image');
            
            cropImage.src = e.target.result;
            cropModal.classList.remove('hidden');
            cropModal.classList.add('flex');

            if (cropper) { cropper.destroy(); }
            
            cropper = new Cropper(cropImage, {
                aspectRatio: 1,
                viewMode: 1,
                dragMode: 'move',
                autoCropArea: 1,
                restore: false,
                guides: false,
                center: false,
                highlight: false,
                cropBoxMovable: false,
                cropBoxResizable: false,
                toggleDragModeOnDblclick: false,
            });
        };
        reader.readAsDataURL(file);
    }
}

async function loadProfile() {
    const token = localStorage.getItem('mindwellToken');
    if (!token) {
        window.location.href = '../login.html';
        return;
    }

    try {
        const res = await fetch(`${API}/users/profile`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await res.json();
        if (data.success && data.data) {
            const user = data.data;
            
            // Populate summary card
            document.getElementById('display-name').textContent = user.name || 'Anonymous';
            document.getElementById('display-username').textContent = `@${user.username || 'user'}`;
            if (user.bio) {
                document.getElementById('display-bio').textContent = `"${user.bio}"`;
            }
            
            if (user.avatarBase64) {
                const display = document.getElementById('profile-avatar-display');
                if (display) display.innerHTML = `<img src="${user.avatarBase64}" class="w-full h-full object-cover">`;
                currentAvatarBase64 = user.avatarBase64;
                
                // Also update nav avatar if present on this page
                const navAvatar = document.querySelector('.nav-avatar');
                if (navAvatar) navAvatar.innerHTML = `<img src="${user.avatarBase64}" class="w-full h-full object-cover">`;
            }
            
            const joinDate = new Date(user.createdAt);
            document.getElementById('display-join-date').textContent = joinDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            
            // Populate form
            if (document.getElementById('input-name')) document.getElementById('input-name').value = user.name || '';
            if (document.getElementById('input-username')) document.getElementById('input-username').value = user.username || '';
            if (document.getElementById('input-email')) document.getElementById('input-email').value = user.email || '';
            if (document.getElementById('input-bio')) document.getElementById('input-bio').value = user.bio || '';
            if (document.getElementById('input-timezone')) document.getElementById('input-timezone').value = user.timezone || 'UTC';
            if (document.getElementById('input-therapy-preference')) document.getElementById('input-therapy-preference').value = user.therapyPreference || 'Virtual';
            if (document.getElementById('input-emergency-name')) document.getElementById('input-emergency-name').value = user.emergencyContactName || '';
            if (document.getElementById('input-emergency-phone')) document.getElementById('input-emergency-phone').value = user.emergencyContactPhone || '';
        } else {
            if (typeof showNotification === 'function') showNotification('Failed to load profile', 'error');
        }
    } catch (err) {
        console.error(err);
        if (typeof showNotification === 'function') showNotification('Error connecting to server', 'error');
    }
}

async function handleProfileUpdate(e) {
    e.preventDefault();
    
    const token = localStorage.getItem('mindwellToken');
    const saveBtn = document.getElementById('save-btn');
    
    const payload = {
        name: document.getElementById('input-name').value,
        username: document.getElementById('input-username').value,
        email: document.getElementById('input-email').value,
        bio: document.getElementById('input-bio').value
    };
    
    if (currentAvatarBase64) {
        payload.avatarBase64 = currentAvatarBase64;
    }

    saveBtn.disabled = true;
    saveBtn.innerHTML = `<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Saving...`;

    try {
        const res = await fetch(`${API}/users/profile`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        
        if (data.success) {
            if (typeof showNotification === 'function') showNotification('Profile updated successfully!', 'success');
            
            // Update summary card instantly
            document.getElementById('display-name').textContent = data.data.name;
            document.getElementById('display-username').textContent = `@${data.data.username}`;
            
            if (data.data.bio) {
                document.getElementById('display-bio').textContent = `"${data.data.bio}"`;
            }
            
            if (data.data.avatarBase64) {
                const navAvatar = document.querySelector('.nav-avatar');
                if (navAvatar) navAvatar.innerHTML = `<img src="${data.data.avatarBase64}" class="w-full h-full object-cover">`;
                
                // Update global memory for navbar script
                localStorage.setItem('mindwellAvatarBase64', data.data.avatarBase64);
            }
            
            localStorage.setItem('mindwellUserName', data.data.name.split(' ')[0]);
            
        } else {
            if (typeof showNotification === 'function') showNotification(data.message || 'Failed to update profile', 'error');
        }
    } catch (err) {
        console.error(err);
        if (typeof showNotification === 'function') showNotification('Error connecting to server', 'error');
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = `<span>Save All Changes</span>`;
    }
}
