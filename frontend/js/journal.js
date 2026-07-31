/**
 * journal.js
 * ----------
 * Handles Journal creation, community feed, likes, comments, and following.
 */

document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('journal-feed-list')) return;

    const token = localStorage.getItem('mindwellToken');
    const userString = localStorage.getItem('mindwellUser');
    const currentUser = userString ? JSON.parse(userString) : null;
    
    if (!token || !currentUser) {
        showNotification('Please log in to view journals.', 'error');
        return;
    }

    let currentTab = 'community'; // 'community' or 'personal'
    let currentFeed = [];
    let expandedComments = new Set();
    const searchInput = document.getElementById('feed-search');
    const sortSelect = document.getElementById('feed-sort');
    
    searchInput.addEventListener('input', renderFeed);
    sortSelect.addEventListener('change', renderFeed);
    
    window.expandComments = (id) => {
        expandedComments.add(id);
        renderFeed();
    };

    const tabCommunity = document.getElementById('tab-community');
    const tabMyEntries = document.getElementById('tab-my-entries');
    const feedList = document.getElementById('journal-feed-list');
    const form = document.getElementById('journal-form');
    
    const findStudentsBtn = document.getElementById('find-students-btn');
    const findStudentsModal = document.getElementById('find-students-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const studentsList = document.getElementById('students-list');

    // --- Tab Switching ---
    tabCommunity.addEventListener('click', () => {
        currentTab = 'community';
        tabCommunity.classList.add('text-orange-600', 'bg-white', 'border', 'border-orange-100', 'shadow-sm');
        tabCommunity.classList.remove('text-stone-500', 'hover:bg-white/50');
        
        tabMyEntries.classList.remove('text-orange-600', 'bg-white', 'border', 'border-orange-100', 'shadow-sm');
        tabMyEntries.classList.add('text-stone-500', 'hover:bg-white/50');
        
        loadFeed();
    });

    tabMyEntries.addEventListener('click', () => {
        currentTab = 'personal';
        tabMyEntries.classList.add('text-orange-600', 'bg-white', 'border', 'border-orange-100', 'shadow-sm');
        tabMyEntries.classList.remove('text-stone-500', 'hover:bg-white/50');
        
        tabCommunity.classList.remove('text-orange-600', 'bg-white', 'border', 'border-orange-100', 'shadow-sm');
        tabCommunity.classList.add('text-stone-500', 'hover:bg-white/50');
        
        loadFeed();
    });

    // --- Loading Feeds ---
    async function loadFeed() {
        feedList.innerHTML = '<div class="text-center py-10 text-stone-500">Loading...</div>';
        
        const endpoint = currentTab === 'community' 
            ? `${API_BASE_URL}/journal/feed`
            : `${API_BASE_URL}/journal`;

        try {
            const res = await fetch(endpoint, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (data.success) {
                currentFeed = data.data;
                renderFeed();
            } else {
                feedList.innerHTML = `<div class="text-center py-10 text-red-500">${data.message}</div>`;
            }
        } catch (e) {
            feedList.innerHTML = '<div class="text-center py-10 text-red-500">Error loading feed.</div>';
        }
    }

    function renderFeed() {
        // Filter
        const term = searchInput.value.toLowerCase();
        let displayFeed = currentFeed.filter(entry => {
            return (entry.title && entry.title.toLowerCase().includes(term)) ||
                   (entry.content && entry.content.toLowerCase().includes(term)) ||
                   (entry.user && entry.user.name && entry.user.name.toLowerCase().includes(term));
        });
        
        // Sort
        const sortVal = sortSelect.value;
        displayFeed.sort((a, b) => {
            if (sortVal === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortVal === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
            if (sortVal === 'popular') return b.likes.length - a.likes.length;
            return 0;
        });

        if (displayFeed.length === 0) {
            feedList.innerHTML = '<div class="text-center py-10 text-stone-500">No entries found.</div>';
            return;
        }

        feedList.innerHTML = displayFeed.map(entry => {
            const authorName = entry.user.name || 'Anonymous';
            const isMine = entry.user._id === currentUser.id;
            const isLiked = entry.likes.includes(currentUser.id);
            const likeCount = entry.likes.length;
            const commentCount = entry.comments ? entry.comments.length : 0;
            const date = new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const visibilityBadge = entry.visibility === 'public' 
                ? '<span class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold ml-2">Public</span>'
                : '<span class="text-xs bg-stone-200 text-stone-600 px-2 py-0.5 rounded-full font-bold ml-2">Private</span>';

            let actionsHTML = '';
            if (isMine) {
                actionsHTML = `
                    <div class="flex gap-2 text-sm ml-auto">
                        <button onclick="editJournalEntry('${entry._id}')" class="text-stone-400 hover:text-amber-500 transition-colors">Edit</button>
                        <button onclick="deleteJournalEntry('${entry._id}')" class="text-stone-400 hover:text-red-500 transition-colors">Delete</button>
                    </div>
                `;
            }
            
            let privateNotesHTML = '';
            if (isMine && entry.privateNotes) {
                privateNotesHTML = `
                    <div class="mt-4 p-3 bg-orange-50 border border-orange-100 rounded-lg text-sm">
                        <span class="font-bold text-orange-700 text-xs uppercase tracking-wide block mb-1">My Private Notes</span>
                        <p class="text-orange-900">${entry.privateNotes}</p>
                    </div>
                `;
            }

            // Render comments
            let commentsHTML = '';
            if (entry.comments && entry.comments.length > 0) {
                const totalComments = entry.comments.length;
                let visibleComments = entry.comments;
                let viewAllBtn = '';
                
                if (totalComments > 2 && !expandedComments.has(entry._id)) {
                    visibleComments = entry.comments.slice(-2); // Show last 2
                    viewAllBtn = `<button onclick="expandComments('${entry._id}')" class="text-sm font-bold text-stone-400 hover:text-stone-600 mb-3 block">View all ${totalComments} comments</button>`;
                }
                
                commentsHTML = `<div id="comments-list-${entry._id}" class="mt-4 border-t border-stone-100 pt-4">${viewAllBtn}<div class="space-y-3">`;
                commentsHTML += visibleComments.map(c => `
                    <div class="bg-stone-50 p-3 rounded-xl text-sm">
                        <span class="font-bold text-stone-700">${c.user ? c.user.name : 'User'}</span>
                        <p class="text-stone-600 mt-1">${c.text}</p>
                    </div>
                `).join('');
                commentsHTML += `</div></div>`;
            }

            return `
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-[#F0EBE1] mb-4">
                    <div class="flex justify-between items-start mb-3">
                        <div>
                            <h3 class="font-bold text-lg text-stone-800">${entry.title} ${visibilityBadge}</h3>
                            <p class="text-xs font-semibold text-stone-500 mt-1">By <span class="text-amber-600">${authorName}</span> • ${date}</p>
                        </div>
                        ${actionsHTML}
                    </div>
                    <p class="text-stone-700 leading-relaxed whitespace-pre-wrap">${entry.content}</p>
                    ${privateNotesHTML}
                    
                    <div class="flex items-center gap-4 mt-4 pt-4 border-t border-stone-100">
                        <button id="like-btn-${entry._id}" onclick="toggleLike('${entry._id}', this)" class="flex items-center gap-1 text-sm font-bold ${isLiked ? 'text-red-500' : 'text-stone-500 hover:text-red-500'} transition-colors">
                            <svg class="w-5 h-5 ${isLiked ? 'fill-current' : 'fill-none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                            ${likeCount}
                        </button>
                        <button onclick="toggleCommentBox('${entry._id}')" class="flex items-center gap-1 text-sm font-bold text-stone-500 hover:text-blue-500 transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                            ${commentCount}
                        </button>
                    </div>
                    
                    ${commentsHTML}
                    
                    <div id="comment-box-${entry._id}" class="hidden mt-4 flex gap-2">
                        <input type="text" id="comment-input-${entry._id}" class="flex-1 p-2 bg-stone-100 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" placeholder="Write a comment...">
                        <button onclick="submitComment('${entry._id}')" class="bg-stone-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-stone-700">Post</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    let editingId = null;
    const submitBtn = form.querySelector('button[type="submit"]');

    // --- Create / Edit Entry ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('journal-title').value;
        const visibility = document.querySelector('input[name="visibility"]:checked').value;
        const content = document.getElementById('journal-entry').value;
        const privateNotes = document.getElementById('journal-private-notes').value;

        try {
            const url = editingId ? `${API_BASE_URL}/journal/${editingId}` : `${API_BASE_URL}/journal`;
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ title, content, visibility, privateNotes })
            });
            const data = await res.json();
            if (data.success) {
                showNotification(editingId ? 'Entry updated!' : 'Journal entry published!', 'success');
                form.reset();
                editingId = null;
                submitBtn.textContent = 'Publish Entry';
                
                if (currentTab === 'community') tabMyEntries.click();
                else loadFeed();
            } else {
                showNotification(data.message || 'Error occurred', 'error');
            }
        } catch (e) {
            showNotification('Failed to post entry.', 'error');
        }
    });

    // --- Edit & Delete Actions ---
    window.deleteJournalEntry = async (id) => {
        if (!confirm('Are you sure you want to delete this journal entry?')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/journal/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                showNotification('Entry deleted', 'success');
                loadFeed();
            } else {
                showNotification('Failed to delete entry', 'error');
            }
        } catch (e) {
            console.error('Error deleting:', e);
        }
    };

    window.editJournalEntry = (id) => {
        const entry = currentFeed.find(e => e._id === id);
        if (!entry) return;
        
        editingId = id;
        document.getElementById('journal-title').value = entry.title;
        const visRadio = document.querySelector(`input[name="visibility"][value="${entry.visibility}"]`);
        if (visRadio) visRadio.checked = true;
        document.getElementById('journal-entry').value = entry.content;
        document.getElementById('journal-private-notes').value = entry.privateNotes || '';
        
        submitBtn.textContent = 'Update Entry';
        document.getElementById('journal-title').scrollIntoView({ behavior: 'smooth' });
    };

    // --- Global Actions (attached to window for inline onclick) ---
    
    window.toggleLike = async (id, btn) => {
        try {
            // Optimistic UI Update
            const svg = btn.querySelector('svg');
            let isLiked = svg.classList.contains('fill-current');
            let likeCount = parseInt(btn.textContent.trim());
            
            if (isLiked) {
                // Unlike locally
                btn.classList.remove('text-red-500');
                btn.classList.add('text-stone-500');
                svg.classList.remove('fill-current');
                svg.classList.add('fill-none');
                likeCount--;
            } else {
                // Like locally
                btn.classList.add('text-red-500');
                btn.classList.remove('text-stone-500');
                svg.classList.add('fill-current');
                svg.classList.remove('fill-none');
                likeCount++;
            }
            btn.innerHTML = svg.outerHTML + ' ' + likeCount;

            const res = await fetch(`${API_BASE_URL}/journal/${id}/like`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // If it fails, you would ideally revert the optimistic update here.
        } catch (e) {
            console.error('Error liking:', e);
        }
    };

    window.toggleCommentBox = (id) => {
        const box = document.getElementById(`comment-box-${id}`);
        if (box) box.classList.toggle('hidden');
    };

    window.submitComment = async (id) => {
        const input = document.getElementById(`comment-input-${id}`);
        const text = input.value.trim();
        if (!text) return;
        
        try {
            // Optimistic UI update
            const commentsList = document.getElementById(`comments-list-${id}`);
            if (commentsList) {
                commentsList.classList.add('border-t', 'border-stone-100', 'pt-4');
                const newComment = document.createElement('div');
                newComment.className = 'bg-stone-50 p-3 rounded-xl text-sm';
                newComment.innerHTML = `<span class="font-bold text-stone-700">${currentUser.name || 'You'}</span><p class="text-stone-600 mt-1">${text}</p>`;
                commentsList.appendChild(newComment);
            }
            input.value = ''; // clear instantly
            
            const res = await fetch(`${API_BASE_URL}/journal/${id}/comment`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ text })
            });
        } catch (e) {
            console.error('Error commenting:', e);
        }
    };

    // --- Discover & Network Modal (Instagram Style) ---
    if (findStudentsBtn && findStudentsModal) {
        let discoverableStudents = [];
        let networkFollowing = [];
        let networkFollowers = [];
        let currentModalTab = 'discover'; // discover, following, followers
        
        const studentSearchInput = document.getElementById('find-student-search');
        const sectionTitle = document.getElementById('find-student-section-title');
        
        const tabDiscover = document.getElementById('tab-discover');
        const tabFollowing = document.getElementById('tab-following');
        const tabFollowers = document.getElementById('tab-followers');

        const setActiveTabUI = (activeId) => {
            [tabDiscover, tabFollowing, tabFollowers].forEach(tab => {
                if (tab.id === activeId) {
                    tab.classList.add('text-orange-600', 'border-orange-500');
                    tab.classList.remove('text-stone-500', 'border-transparent', 'hover:text-stone-700');
                } else {
                    tab.classList.remove('text-orange-600', 'border-orange-500');
                    tab.classList.add('text-stone-500', 'border-transparent', 'hover:text-stone-700');
                }
            });
        };

        const renderNetworkList = (users, type) => {
            if (users.length === 0) {
                studentsList.innerHTML = `<p class="text-stone-500 text-center py-6">No users found.</p>`;
                return;
            }
            studentsList.innerHTML = users.map(user => {
                let actionButton = '';
                
                if (type === 'discover') {
                    const isFollowing = currentUser.following && currentUser.following.includes(user._id);
                    actionButton = `
                        <button onclick="toggleFollow('${user._id}', this, 'discover')" class="px-4 py-2 rounded-full font-bold text-sm transition-colors shadow-sm ${isFollowing ? 'bg-stone-200 text-stone-700' : 'bg-orange-500 text-white hover:-translate-y-0.5'}">
                            ${isFollowing ? 'Following' : 'Follow'}
                        </button>`;
                } else if (type === 'following') {
                    actionButton = `
                        <button onclick="toggleFollow('${user._id}', this, 'following')" class="px-4 py-2 rounded-full font-bold text-sm transition-colors shadow-sm bg-stone-200 text-stone-700">
                            Following
                        </button>`;
                } else if (type === 'followers') {
                    actionButton = `
                        <button onclick="removeFollower('${user._id}', this)" class="px-4 py-2 rounded-xl font-bold text-sm transition-colors bg-stone-100 text-stone-600 hover:bg-red-100 hover:text-red-600">
                            Remove
                        </button>`;
                }

                return `
                    <div class="flex justify-between items-center bg-stone-50 p-4 rounded-xl" id="network-user-${user._id}">
                        <div class="flex items-center gap-3">
                            <img src="${user.avatarBase64 || 'https://via.placeholder.com/40'}" class="w-10 h-10 rounded-full object-cover bg-stone-200">
                            <div>
                                <h4 class="font-bold text-stone-800">${user.name}</h4>
                                <p class="text-xs text-stone-500">@${user.username || user.name.split(' ')[0].toLowerCase()}</p>
                            </div>
                        </div>
                        ${actionButton}
                    </div>
                `;
            }).join('');
        };

        const fetchNetworkData = async () => {
            try {
                // Fetch Discover
                const resDiscover = await fetch(`${API_BASE_URL}/users/discover`, { headers: { 'Authorization': `Bearer ${token}` } });
                const dataDiscover = await resDiscover.json();
                if (dataDiscover.success) discoverableStudents = dataDiscover.data;

                // Fetch Network (Following & Followers)
                const resNetwork = await fetch(`${API_BASE_URL}/users/network`, { headers: { 'Authorization': `Bearer ${token}` } });
                const dataNetwork = await resNetwork.json();
                if (dataNetwork.success) {
                    networkFollowers = dataNetwork.data.followers;
                    networkFollowing = dataNetwork.data.following;
                }
            } catch (e) {
                console.error("Failed to load network", e);
            }
        };

        const loadActiveTab = async () => {
            studentsList.innerHTML = '<p class="text-stone-500 text-center py-6">Loading...</p>';
            await fetchNetworkData();
            
            studentSearchInput.value = '';
            
            if (currentModalTab === 'discover') {
                sectionTitle.textContent = 'Suggested for you';
                renderNetworkList(discoverableStudents, 'discover');
            } else if (currentModalTab === 'following') {
                sectionTitle.textContent = 'People you follow';
                renderNetworkList(networkFollowing, 'following');
            } else if (currentModalTab === 'followers') {
                sectionTitle.textContent = 'Your followers';
                renderNetworkList(networkFollowers, 'followers');
            }
        };

        // Tab click listeners
        tabDiscover.addEventListener('click', () => { currentModalTab = 'discover'; setActiveTabUI('tab-discover'); loadActiveTab(); });
        tabFollowing.addEventListener('click', () => { currentModalTab = 'following'; setActiveTabUI('tab-following'); loadActiveTab(); });
        tabFollowers.addEventListener('click', () => { currentModalTab = 'followers'; setActiveTabUI('tab-followers'); loadActiveTab(); });

        findStudentsBtn.addEventListener('click', () => {
            findStudentsModal.classList.remove('hidden');
            currentModalTab = 'discover';
            setActiveTabUI('tab-discover');
            loadActiveTab();
        });

        studentSearchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            let sourceList = [];
            if (currentModalTab === 'discover') sourceList = discoverableStudents;
            else if (currentModalTab === 'following') sourceList = networkFollowing;
            else if (currentModalTab === 'followers') sourceList = networkFollowers;

            if (query === '') {
                loadActiveTab(); // Reset to default view for tab
            } else {
                sectionTitle.textContent = 'Search Results';
                const filtered = sourceList.filter(s => s.name.toLowerCase().includes(query) || (s.username && s.username.toLowerCase().includes(query)));
                renderNetworkList(filtered, currentModalTab);
            }
        });

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => findStudentsModal.classList.add('hidden'));
        }

        // Global network actions
        window.toggleFollow = async (id, btnElement, context) => {
            const isFollowing = btnElement.textContent.trim() === 'Following';
            const endpoint = isFollowing ? `/api/users/unfollow/${id}` : `/api/users/follow/${id}`;
            
            try {
                const res = await fetch(`${API_BASE_URL.replace("/api", "")}${endpoint}`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                
                if (data.success) {
                    // Update local storage
                    const updatedUser = { ...currentUser };
                    if (isFollowing) {
                        updatedUser.following = updatedUser.following.filter(fid => fid !== id);
                    } else {
                        if (!updatedUser.following) updatedUser.following = [];
                        updatedUser.following.push(id);
                    }
                    localStorage.setItem('mindwellUser', JSON.stringify(updatedUser));
                    
                    // UI Reaction
                    if (context === 'discover') {
                        if (isFollowing) {
                            btnElement.textContent = 'Follow';
                            btnElement.className = 'px-4 py-2 rounded-full font-bold text-sm transition-colors bg-orange-500 text-white shadow-sm hover:-translate-y-0.5';
                        } else {
                            btnElement.textContent = 'Following';
                            btnElement.className = 'px-4 py-2 rounded-full font-bold text-sm transition-colors bg-stone-200 text-stone-700 shadow-sm';
                        }
                    } else if (context === 'following' && isFollowing) {
                        // We unfollowed from the following tab -> remove element immediately
                        const userRow = document.getElementById(`network-user-${id}`);
                        if (userRow) userRow.remove();
                    }
                    
                    loadFeed(); // Refresh background feed
                }
            } catch (e) {
                console.error('Error toggling follow:', e);
            }
        };

        window.removeFollower = async (id, btnElement) => {
            if (!confirm("Remove this follower? They won't be notified.")) return;
            try {
                const res = await fetch(`${API_BASE_URL}/users/remove-follower/${id}`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                
                if (data.success) {
                    const userRow = document.getElementById(`network-user-${id}`);
                    if (userRow) userRow.remove();
                }
            } catch (e) {
                console.error('Error removing follower:', e);
            }
        };
    }

    // Initial load
    loadFeed();
});
