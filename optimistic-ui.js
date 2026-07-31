const fs = require('fs');

let js = fs.readFileSync('c:/mindwell-project/frontend/js/journal.js', 'utf8');

// 1. Give IDs to elements in renderFeed
js = js.replace(
    /onclick="toggleLike\('\${entry\._id}'\)"/g,
    `id="like-btn-\${entry._id}" onclick="toggleLike('\${entry._id}', this)"`
);

js = js.replace(
    /let commentsHTML = '';\s*if \(entry\.comments && entry\.comments\.length > 0\) {[\s\S]*?}\n/,
    `let commentsHTML = \`<div id="comments-list-\${entry._id}" class="mt-4 space-y-3 \${(entry.comments && entry.comments.length > 0) ? 'border-t border-stone-100 pt-4' : ''}">\`;
    if (entry.comments && entry.comments.length > 0) {
        commentsHTML += entry.comments.map(c => \`
            <div class="bg-stone-50 p-3 rounded-xl text-sm">
                <span class="font-bold text-stone-700">\${c.user ? c.user.name : 'User'}</span>
                <p class="text-stone-600 mt-1">\${c.text}</p>
            </div>
        \`).join('');
    }
    commentsHTML += \`</div>\`;\n`
);

// 2. Rewrite toggleLike and submitComment to do DOM updates
js = js.replace(
    /window\.toggleLike = async \(id\) => {[\s\S]*?};/,
    `window.toggleLike = async (id, btn) => {
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

            const res = await fetch(\`http://localhost:5000/api/journal/\${id}/like\`, {
                method: 'POST',
                headers: { 'Authorization': \`Bearer \${token}\` }
            });
            // If it fails, you would ideally revert the optimistic update here.
        } catch (e) {
            console.error('Error liking:', e);
        }
    };`
);

js = js.replace(
    /window\.submitComment = async \(id\) => {[\s\S]*?};/,
    `window.submitComment = async (id) => {
        const input = document.getElementById(\`comment-input-\${id}\`);
        const text = input.value.trim();
        if (!text) return;
        
        try {
            // Optimistic UI update
            const commentsList = document.getElementById(\`comments-list-\${id}\`);
            if (commentsList) {
                commentsList.classList.add('border-t', 'border-stone-100', 'pt-4');
                const newComment = document.createElement('div');
                newComment.className = 'bg-stone-50 p-3 rounded-xl text-sm';
                newComment.innerHTML = \`<span class="font-bold text-stone-700">\${currentUser.name || 'You'}</span><p class="text-stone-600 mt-1">\${text}</p>\`;
                commentsList.appendChild(newComment);
            }
            input.value = ''; // clear instantly
            
            const res = await fetch(\`http://localhost:5000/api/journal/\${id}/comment\`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': \`Bearer \${token}\` 
                },
                body: JSON.stringify({ text })
            });
        } catch (e) {
            console.error('Error commenting:', e);
        }
    };`
);

fs.writeFileSync('c:/mindwell-project/frontend/js/journal.js', js);
console.log('Optimistic UI updates applied.');
