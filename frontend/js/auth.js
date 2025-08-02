/**
 * MindWell - auth.js
 * -----------------
 * This file manages all user authentication logic. It handles form submissions by
 * making API calls to the backend server.
 */

// --- Global Variables ---
const API_URL = 'http://localhost:5000/api'; // Base URL for the backend API

// --- Event Listener Setup ---
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    if (signupForm) signupForm.addEventListener('submit', handleSignup);

    const loginForm = document.getElementById('login-form');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    const forgotPasswordForm = document.getElementById('forgot-password-form');
    if (forgotPasswordForm) forgotPasswordForm.addEventListener('submit', handleForgotPassword);
});

// --- NOTIFICATION FUNCTION ---
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    if (!notification) return;
    notification.textContent = message;
    notification.className = '';
    notification.classList.add(type, 'show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// --- Form Handlers ---

async function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const role = document.querySelector('#student-btn.bg-orange-500') ? 'student' : 'admin';

    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role }),
        });

        const data = await res.json();

        if (data.success) {
            showNotification('Signup successful! Please log in.', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        } else {
            showNotification(data.message || 'An error occurred.', 'error');
        }
    } catch (error) {
        console.error('Signup Error:', error);
        showNotification('Could not connect to the server.', 'error');
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (data.success) {
            // In a real app, you'd save the token and user data securely
            localStorage.setItem('mindwellToken', data.token);
            localStorage.setItem('mindwellUser', JSON.stringify(data.user));

            showNotification('Login successful! Welcome back.', 'success');

            setTimeout(() => {
                if (data.user.role === 'admin') {
                    window.location.href = 'admin/dashboard.html';
                } else {
                    window.location.href = 'student/dashboard.html';
                }
            }, 1000);
        } else {
            showNotification(data.message || 'Invalid credentials.', 'error');
        }
    } catch (error) {
        console.error('Login Error:', error);
        showNotification('Could not connect to the server.', 'error');
    }
}

function handleForgotPassword(event) {
    event.preventDefault();
    // This would also make an API call in a real app
    showNotification("Token Generated.", "success");
    console.log("Password reset requested.");
}

// --- UI Helper Functions (GLOBAL SCOPE) ---

function togglePasswordVisibility(inputId) {
    const passwordInput = document.getElementById(inputId);
    const eyeIcon = document.getElementById(`eye-icon-${inputId}`);
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.052 10.052 0 013.453-5.118m7.536 7.536A5.005 5.005 0 0017 12c0-1.38-.56-2.63-1.464-3.536m-7.072 7.072A5.005 5.005 0 017 12c0-1.38.56-2.63 1.464-3.536M2 2l20 20" />`;
    } else {
        passwordInput.type = "password";
        eyeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />`;
    }
}

function switchRole(role) {
    const studentBtn = document.getElementById('student-btn');
    const adminBtn = document.getElementById('admin-btn');
    const adminCodeField = document.getElementById('admin-code-field');
    const adminCodeInput = document.getElementById('admin-code');

    if (role === 'student') {
        studentBtn.classList.add('bg-orange-500', 'text-white');
        studentBtn.classList.remove('bg-transparent', 'text-stone-600');
        adminBtn.classList.add('bg-transparent', 'text-stone-600');
        adminBtn.classList.remove('bg-orange-500', 'text-white');
        adminCodeField.classList.add('hidden');
        adminCodeInput.required = false;
    } else {
        adminBtn.classList.add('bg-orange-500', 'text-white');
        adminBtn.classList.remove('bg-transparent', 'text-stone-600');
        studentBtn.classList.add('bg-transparent', 'text-stone-600');
        studentBtn.classList.remove('bg-orange-500', 'text-white');
        adminCodeField.classList.remove('hidden');
        adminCodeInput.required = true;
    }
}
