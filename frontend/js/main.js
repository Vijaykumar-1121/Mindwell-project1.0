/**
 * MindWell - main.js
 * ------------------
 * This file contains the core client-side JavaScript for the public-facing pages
 * of the MindWell platform. It handles tasks such as:
 * - Toggling the mobile navigation menu.
 * - Any other global scripts needed across the marketing pages (index, about, connect).
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Authentication Check ---
    // If the user is already logged in, redirect them directly to the dashboard
    // so they don't see the "Login / Sign Up" landing page.
    if (localStorage.getItem('mindwellToken')) {
        window.location.href = 'student/dashboard.html';
        return; // Stop execution
    }

    // --- Mobile Navigation Toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // --- Active Navigation Link Highlighting (Optional but good practice) ---
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('header nav a');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('font-bold', 'text-amber-600'); 
        }
    });

    console.log("Main script loaded and running.");
});