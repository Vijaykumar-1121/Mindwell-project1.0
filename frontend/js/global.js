/** Global functionalities for all pages */

document.addEventListener('DOMContentLoaded', () => {
    // --- Auth Guard: redirect to login if no token found ---
    const publicPages = ['login.html', 'signup.html', 'index.html', 'about.html', 'connect.html'];
    const isPublicPage = publicPages.some(p => window.location.pathname.includes(p)) || window.location.pathname === '/' || window.location.pathname.endsWith('index.html');
    if (!isPublicPage && !localStorage.getItem('mindwellToken')) {
        window.location.href = '../login.html';
        return;
    }

    injectHeader();
    setupDropdowns();
    setupMobileMenu();
    setupChatWidget();
    loadGlobalProfile();
});

function injectHeader() {
    const globalHeader = document.getElementById('global-header');
    if (!globalHeader) return;

    const path = window.location.pathname;
    
    // Helper to determine active link
    const isActive = (page) => path.includes(page) 
        ? 'text-orange-500 border-b-2 border-orange-500 pb-1' 
        : 'hover:text-orange-500 transition-colors';
        
    const isMobileActive = (page) => path.includes(page) 
        ? 'text-orange-500' 
        : 'hover:text-orange-500 transition-colors';

    globalHeader.innerHTML = `
        <header class="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-[#F0EBE1]">
            <div class="container mx-auto px-6 py-4 flex justify-between items-center relative">
                <a href="dashboard.html" class="flex items-center gap-2 text-2xl font-bold text-amber-600 font-['Lato',sans-serif]">
                    <img src="../assets/icons/logo.svg" alt="MindWell Logo" class="h-8">
                    MindWell
                </a>
                
                <nav class="hidden md:flex items-center space-x-6 text-sm font-semibold text-stone-600">
                    <a href="dashboard.html" class="${isActive('dashboard.html')}">Dashboard</a>
                    <a href="mood-tracker.html" class="${isActive('mood-tracker.html')}">Mood Tracker</a>
                    <a href="journal.html" class="${isActive('journal.html')}">Journal</a>
                    <a href="appointments.html" class="${isActive('appointments.html')}">Appointments</a>
                    <a href="resources.html" class="${isActive('resources.html')}">Resources</a>
                </nav>

                <div class="flex items-center gap-4">
                    <div id="current-date" class="hidden md:block text-sm text-stone-600 font-bold tracking-wide uppercase mr-2"></div>
                    
                    <div class="relative">
                        <button id="help-button" class="text-stone-400 hover:text-orange-500 transition-colors">
                             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </button>
                        <div id="help-dropdown" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg z-20 border border-[#F0EBE1]">
                            <a href="feedback.html" class="block px-4 py-2 text-stone-600 hover:bg-[#FAF8F5]">Feedback</a>
                            <a href="report-problem.html" class="block px-4 py-2 text-stone-600 hover:bg-[#FAF8F5]">Report a Problem</a>
                            <a href="contact.html" class="block px-4 py-2 text-stone-600 hover:bg-[#FAF8F5]">Contact Us</a>
                        </div>
                    </div>

                    <div class="relative">
                        <button id="profile-button" class="flex items-center gap-2 focus:outline-none">
                            <div class="w-10 h-10 rounded-full border-2 border-orange-500 bg-stone-200 overflow-hidden flex items-center justify-center text-stone-400 nav-avatar">
                                <svg class="w-8 h-8 mt-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                            </div>
                        </button>
                        <div id="profile-dropdown" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg z-20 border border-[#F0EBE1]">
                            <div class="px-4 py-3 border-b border-[#F0EBE1]">
                                <p class="text-sm font-bold text-stone-800 nav-username">Student</p>
                            </div>
                            <a href="profile.html" class="block px-4 py-2 text-stone-600 hover:bg-[#FAF8F5]">My Profile</a>
                            <a href="settings.html" class="block px-4 py-2 text-stone-600 hover:bg-[#FAF8F5]">Settings</a>
                            <a href="#" onclick="localStorage.removeItem('mindwellToken'); localStorage.removeItem('mindwellUser'); localStorage.removeItem('mindwellUserName'); window.location.href='../login.html'; return false;" class="block px-4 py-2 text-red-500 hover:bg-red-50">Log Out</a>
                        </div>
                    </div>

                    <button id="mobile-menu-button" class="md:hidden text-stone-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                </div>
            </div>
            
            <div id="mobile-menu" class="hidden md:hidden bg-white border-t border-[#F0EBE1]">
                <nav class="flex flex-col p-4 space-y-4 font-semibold text-stone-600">
                    <a href="dashboard.html" class="${isMobileActive('dashboard.html')}">Dashboard</a>
                    <a href="mood-tracker.html" class="${isMobileActive('mood-tracker.html')}">Mood Tracker</a>
                    <a href="journal.html" class="${isMobileActive('journal.html')}">Journal</a>
                    <a href="appointments.html" class="${isMobileActive('appointments.html')}">Appointments</a>
                    <a href="resources.html" class="${isMobileActive('resources.html')}">Resources</a>
                </nav>
            </div>
        </header>
    `;
}


function setupDropdowns() {
    const profileButton = document.getElementById('profile-button');
    const profileDropdown = document.getElementById('profile-dropdown');
    const helpButton = document.getElementById('help-button');
    const helpDropdown = document.getElementById('help-dropdown');

    if (profileButton && profileDropdown) {
        profileButton.addEventListener('click', (event) => {
            event.stopPropagation();
            profileDropdown.classList.toggle('hidden');
            if (helpDropdown) helpDropdown.classList.add('hidden');
        });
    }

    if (helpButton && helpDropdown) {
        helpButton.addEventListener('click', (event) => {
            event.stopPropagation();
            helpDropdown.classList.toggle('hidden');
            if (profileDropdown) profileDropdown.classList.add('hidden');
        });
    }

    window.addEventListener('click', () => {
        if (profileDropdown) profileDropdown.classList.add('hidden');
        if (helpDropdown) helpDropdown.classList.add('hidden');
    });
}

function setupMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

function setupChatWidget() {
    if (!document.getElementById('chat-popup')) {
        const chatContainer = document.createElement('div');
        chatContainer.innerHTML = `
            <!-- AI Chat Widget (Global) -->
            <div id="chat-popup" class="hidden fixed bottom-6 right-6 w-96 max-w-[90vw] bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl z-50 flex flex-col border border-white overflow-hidden transition-all duration-300 transform origin-bottom-right">
                <!-- Chat Header -->
                <div class="bg-gradient-to-r from-orange-500 to-amber-500 p-4 text-white flex justify-between items-center shadow-sm">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-inner">
                            <svg class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15C4.5 10.8579 7.85786 7.5 12 7.5C16.1421 7.5 19.5 10.8579 19.5 15V16.5M19.5 16.5C19.5 17.3284 18.8284 18 18 18H16.5V13.5H19.5V16.5ZM4.5 16.5C4.5 17.3284 5.17157 18 6 18H7.5V13.5H4.5V16.5ZM16.5 18C16.5 19.6569 15.1569 21 13.5 21H12"></path>
                            </svg>
                        </div>
                        <div>
                            <h4 class="font-bold text-sm">MindWell Support</h4>
                            <p class="text-[10px] text-orange-100 uppercase tracking-wider font-semibold">Platform Assistant</p>
                        </div>
                    </div>
                    <button id="close-chat" class="text-white hover:bg-white/20 rounded-full transition-colors focus:outline-none p-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                <!-- Chat Window -->
                <div id="chat-window" class="p-4 h-80 overflow-y-auto bg-transparent space-y-4 flex flex-col">
                </div>
                
                <!-- Chat Input -->
                <div class="p-4 bg-white/50 backdrop-blur-md border-t border-white">
                    <form id="chat-form" class="flex items-center gap-2" autocomplete="off">
                        <input type="text" id="chat-input" name="chat-input" autocomplete="off" class="flex-1 p-3 bg-white/80 border border-[#F0EBE1] rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm shadow-inner transition-all" placeholder="Ask about MindWell..." required>
                        <button type="submit" class="bg-gradient-to-br from-orange-400 to-orange-500 text-white p-3 rounded-2xl hover:shadow-lg transition-all shadow-md hover:-translate-y-0.5">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                        </button>
                    </form>
                </div>
            </div>

            <!-- AI Chat Trigger Bubble -->
            <button id="chat-bubble" class="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full shadow-xl flex items-center justify-center text-white hover:shadow-orange-500/50 hover:scale-105 transition-all z-40">
                <svg class="w-8 h-8 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15C4.5 10.8579 7.85786 7.5 12 7.5C16.1421 7.5 19.5 10.8579 19.5 15V16.5M19.5 16.5C19.5 17.3284 18.8284 18 18 18H16.5V13.5H19.5V16.5ZM4.5 16.5C4.5 17.3284 5.17157 18 6 18H7.5V13.5H4.5V16.5ZM16.5 18C16.5 19.6569 15.1569 21 13.5 21H12"></path>
                </svg>
            </button>
        `;
        document.body.appendChild(chatContainer);
    }

    const chatBubble = document.getElementById('chat-bubble');
    const chatPopup = document.getElementById('chat-popup');
    const closeChatBtn = document.getElementById('close-chat');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatWindow = document.getElementById('chat-window');

    if (!chatBubble || !chatPopup || !closeChatBtn || !chatForm) return;

    let chatHistory = [];

    function renderHistory() {
        chatWindow.innerHTML = '';
        if (chatHistory.length === 0) {
            appendAiMessage("Hi! I'm the MindWell Support Assistant. How can I help you navigate the platform today?", false);
        } else {
            chatHistory.forEach(msg => {
                if (msg.role === 'user') appendUserMessage(msg.content, false);
                else appendAiMessage(msg.content, false);
            });
        }
    }

    renderHistory();

    function clearChatHistory() {
        chatHistory = [];
        renderHistory();
    }

    chatBubble.addEventListener('click', () => {
        chatPopup.classList.toggle('hidden');
        // Reset chat if the user hides it
        if (chatPopup.classList.contains('hidden')) {
            clearChatHistory();
        }
    });

    closeChatBtn.addEventListener('click', () => {
        chatPopup.classList.add('hidden');
        clearChatHistory();
    });

    chatForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const userMessage = chatInput.value.trim();
        if (userMessage) {
            appendUserMessage(userMessage, true);
            chatInput.value = '';
            await getAiResponse(userMessage);
        }
    });

    function formatMarkdown(text) {
        return text
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-orange-500 underline font-semibold hover:text-orange-600 transition-colors">$1</a>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
    }

    function appendUserMessage(message, save = true) {
        if (save) {
            chatHistory.push({ role: 'user', content: message });
        }
        const el = document.createElement('div');
        el.className = 'flex justify-end';
        el.innerHTML = `<div class="bg-gradient-to-br from-amber-100 to-orange-100 text-orange-900 p-3 rounded-2xl rounded-tr-sm max-w-[80%] text-sm shadow-sm"><p>${formatMarkdown(message)}</p></div>`;
        chatWindow.appendChild(el);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function appendAiMessage(message, save = true) {
        if (save) {
            chatHistory.push({ role: 'assistant', content: message });
        }
        const el = document.createElement('div');
        el.className = 'flex';
        el.innerHTML = `<div class="bg-white/90 backdrop-blur-sm border border-white text-stone-700 p-3 rounded-2xl rounded-tl-sm max-w-[80%] text-sm shadow-sm"><p>${formatMarkdown(message)}</p></div>`;
        chatWindow.appendChild(el);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
    
    function showTypingIndicator() {
        const el = document.createElement('div');
        el.id = 'typing-indicator';
        el.className = 'flex';
        el.innerHTML = `
            <div class="bg-white border border-[#F0EBE1] text-stone-700 px-4 py-3 rounded-2xl rounded-tl-sm max-w-[80%] text-sm shadow-sm flex items-center gap-1">
                <div class="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                <div class="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                <div class="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
            </div>`;
        chatWindow.appendChild(el);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
    
    function removeTypingIndicator() {
        const el = document.getElementById('typing-indicator');
        if (el) el.remove();
    }

    async function getAiResponse(userMessage) {
        showTypingIndicator();
        
        try {
            const response = await fetch(`${API_BASE_URL}/ai/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Only send the last 10 messages to avoid token bloat
                body: JSON.stringify({ messages: chatHistory.slice(-10) })
            });
            const result = await response.json();
            removeTypingIndicator();
            if (result.success && result.reply) {
                appendAiMessage(result.reply, true);
            } else {
                appendAiMessage("I'm sorry, our support system is currently offline. Please try again later.", false);
            }
        } catch (error) {
            removeTypingIndicator();
            console.error("Error fetching AI response:", error);
            appendAiMessage("I'm sorry, I couldn't connect to the server. Please check your internet connection.");
        }
    }
}

function showNotification(message, type) {
    // Auto-create the notification element if not present in HTML
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;padding:14px 24px;border-radius:12px;font-weight:700;font-size:14px;opacity:0;transition:opacity 0.3s ease;pointer-events:none;max-width:360px;box-shadow:0 4px 20px rgba(0,0,0,0.15);';
        document.body.appendChild(notification);
    }
    notification.textContent = message;
    // Apply color based on type
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
        notification.style.color = '#fff';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg,#ef4444,#dc2626)';
        notification.style.color = '#fff';
    } else {
        notification.style.background = 'linear-gradient(135deg,#f97316,#ea580c)';
        notification.style.color = '#fff';
    }
    notification.style.opacity = '1';
    setTimeout(() => { notification.style.opacity = '0'; }, 3000);
}

async function loadGlobalProfile() {
    const token = localStorage.getItem('mindwellToken');
    if (!token) return;

    try {
        const res = await fetch(`${API_BASE_URL}/users/profile`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.success && data.data) {
            const user = data.data;
            // Store globally for other scripts to use synchronously
            localStorage.setItem('mindwellUserName', user.name.split(' ')[0]);
            
            if (user.avatarBase64) {
                localStorage.setItem('mindwellAvatarBase64', user.avatarBase64);
            }
            
            // Update the profile dropdown if it exists
            const profileDropdown = document.getElementById('profile-dropdown');
            if (profileDropdown) {
                // The first <p> is the name, the second <p> is the email in the dropdown header
                const nameEl = profileDropdown.querySelector('p.font-bold');
                const emailEl = profileDropdown.querySelector('p.text-xs');
                if (nameEl) nameEl.textContent = user.name;
                if (emailEl) emailEl.textContent = user.email;
            }
            
            // Update the top-right nav avatar
            const navAvatar = document.querySelector('.nav-avatar');
            if (navAvatar && user.avatarBase64) {
                navAvatar.innerHTML = `<img src="${user.avatarBase64}" class="w-full h-full object-cover">`;
            }
        }
    } catch (err) {
        console.error("Failed to load global profile:", err);
    }
}