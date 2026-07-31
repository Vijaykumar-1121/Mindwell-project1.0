const fs = require('fs');

let html = fs.readFileSync('c:/mindwell-project/frontend/student/journal.html', 'utf8');
html = html.replace(
    '<div class="flex gap-4 mb-4">',
    `<div class="flex flex-col gap-4 mb-4">
                            <div class="flex gap-4">
                                <div class="flex-1 relative">
                                    <input type="text" id="feed-search" class="w-full p-3 pl-10 bg-white border border-[#F0EBE1] rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm" placeholder="Search journals...">
                                    <svg class="w-5 h-5 text-stone-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                </div>
                                <select id="feed-sort" class="p-3 bg-white border border-[#F0EBE1] rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-600 font-bold shadow-sm">
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="popular">Most Liked</option>
                                </select>
                            </div>
                            <div class="flex gap-4">`
);
fs.writeFileSync('c:/mindwell-project/frontend/student/journal.html', html);


let js = fs.readFileSync('c:/mindwell-project/frontend/js/journal.js', 'utf8');

// 1. Add global variables for state
js = js.replace(
    'let currentFeed = [];',
    `let currentFeed = [];
    let expandedComments = new Set();
    const searchInput = document.getElementById('feed-search');
    const sortSelect = document.getElementById('feed-sort');
    
    searchInput.addEventListener('input', renderFeed);
    sortSelect.addEventListener('change', renderFeed);
    
    window.expandComments = (id) => {
        expandedComments.add(id);
        renderFeed();
    };`
);

// 2. Rewrite renderFeed to filter, sort, and truncate
js = js.replace(
    'function renderFeed() {\n        if (currentFeed.length === 0) {',
    `function renderFeed() {
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

        if (displayFeed.length === 0) {`
);

// 3. Update currentFeed mapping to displayFeed
js = js.replace(
    'feedList.innerHTML = currentFeed.map(entry => {',
    'feedList.innerHTML = displayFeed.map(entry => {'
);

// 4. Update Comments Truncation logic
js = js.replace(
    /let commentsHTML = `<div id="comments-list-\$\{entry\._id\}"[\s\S]*?commentsHTML \+= `<\/div>`;/,
    `let commentsHTML = '';
            if (entry.comments && entry.comments.length > 0) {
                const totalComments = entry.comments.length;
                let visibleComments = entry.comments;
                let viewAllBtn = '';
                
                if (totalComments > 2 && !expandedComments.has(entry._id)) {
                    visibleComments = entry.comments.slice(-2); // Show last 2
                    viewAllBtn = \`<button onclick="expandComments('\${entry._id}')" class="text-sm font-bold text-stone-400 hover:text-stone-600 mb-3 block">View all \${totalComments} comments</button>\`;
                }
                
                commentsHTML = \`<div id="comments-list-\${entry._id}" class="mt-4 border-t border-stone-100 pt-4">\${viewAllBtn}<div class="space-y-3">\`;
                commentsHTML += visibleComments.map(c => \`
                    <div class="bg-stone-50 p-3 rounded-xl text-sm">
                        <span class="font-bold text-stone-700">\${c.user ? c.user.name : 'User'}</span>
                        <p class="text-stone-600 mt-1">\${c.text}</p>
                    </div>
                \`).join('');
                commentsHTML += \`</div></div>\`;
            }`
);

fs.writeFileSync('c:/mindwell-project/frontend/js/journal.js', js);
console.log('Search, sort, and pagination added.');
