const fs = require('fs');

// 1. Update Controller
let controller = fs.readFileSync('c:/mindwell-project/backend/src/controllers/journalController.js', 'utf8');
controller += `\n
exports.updateJournalEntry = async (req, res, next) => {
    try {
        const entry = await JournalEntry.findById(req.params.id);
        if (!entry) return res.status(404).json({ success: false, message: 'Entry not found' });
        if (entry.user.toString() !== req.user.id) return res.status(401).json({ success: false, message: 'Not authorized to update this entry' });
        
        const { title, content, visibility, privateNotes } = req.body;
        entry.title = title || entry.title;
        entry.content = content || entry.content;
        entry.visibility = visibility || entry.visibility;
        entry.privateNotes = privateNotes !== undefined ? privateNotes : entry.privateNotes;
        
        await entry.save();
        res.status(200).json({ success: true, data: entry });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

exports.deleteJournalEntry = async (req, res, next) => {
    try {
        const entry = await JournalEntry.findById(req.params.id);
        if (!entry) return res.status(404).json({ success: false, message: 'Entry not found' });
        if (entry.user.toString() !== req.user.id) return res.status(401).json({ success: false, message: 'Not authorized to delete this entry' });
        
        await entry.deleteOne();
        res.status(200).json({ success: true, message: 'Entry removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
`;
fs.writeFileSync('c:/mindwell-project/backend/src/controllers/journalController.js', controller);

// 2. Update Routes
let routes = fs.readFileSync('c:/mindwell-project/backend/src/api/journal.js', 'utf8');
routes = routes.replace(
    'commentJournalEntry\n} = require(',
    'commentJournalEntry,\n    updateJournalEntry,\n    deleteJournalEntry\n} = require('
);
routes += `
// @route   PUT /api/journal/:id
router.put('/:id', updateJournalEntry);

// @route   DELETE /api/journal/:id
router.delete('/:id', deleteJournalEntry);
`;
fs.writeFileSync('c:/mindwell-project/backend/src/api/journal.js', routes);

// 3. Update Frontend (journal.js)
let frontend = fs.readFileSync('c:/mindwell-project/frontend/js/journal.js', 'utf8');

// Insert delete and edit functions at the end
frontend += `\n
    // --- Edit & Delete Actions ---
    window.deleteJournalEntry = async (id) => {
        if (!confirm('Are you sure you want to delete this journal entry?')) return;
        try {
            const res = await fetch(\`http://localhost:5000/api/journal/\${id}\`, {
                method: 'DELETE',
                headers: { 'Authorization': \`Bearer \${token}\` }
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
        document.getElementById('journal-title').value = entry.title;
        document.getElementById('journal-visibility').value = entry.visibility;
        document.getElementById('journal-entry').value = entry.content;
        document.getElementById('journal-private-notes').value = entry.privateNotes || '';
        
        // Change form behavior
        form.onsubmit = async (e) => {
            e.preventDefault();
            const title = document.getElementById('journal-title').value;
            const visibility = document.getElementById('journal-visibility').value;
            const content = document.getElementById('journal-entry').value;
            const privateNotes = document.getElementById('journal-private-notes').value;

            try {
                const res = await fetch(\`http://localhost:5000/api/journal/\${id}\`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${token}\` },
                    body: JSON.stringify({ title, content, visibility, privateNotes })
                });
                if (res.ok) {
                    showNotification('Entry updated!', 'success');
                    form.reset();
                    // Restore default create behavior
                    form.onsubmit = null;
                    loadFeed();
                } else {
                    showNotification('Failed to update entry', 'error');
                }
            } catch (err) {
                console.error(err);
            }
        };
        
        // Scroll to form
        document.getElementById('journal-title').scrollIntoView({ behavior: 'smooth' });
    };
`;

// Insert the buttons into the HTML generation
frontend = frontend.replace(
    'let privateNotesHTML = \'\';',
    `let actionsHTML = '';
            if (isMine) {
                actionsHTML = \`
                    <div class="flex gap-2 text-sm ml-auto">
                        <button onclick="editJournalEntry('\${entry._id}')" class="text-stone-400 hover:text-amber-500 transition-colors">Edit</button>
                        <button onclick="deleteJournalEntry('\${entry._id}')" class="text-stone-400 hover:text-red-500 transition-colors">Delete</button>
                    </div>
                \`;
            }
            
            let privateNotesHTML = '';`
);

frontend = frontend.replace(
    '<p class="text-xs font-semibold text-stone-500 mt-1">By <span class="text-amber-600">${authorName}</span> • ${date}</p>\n                        </div>',
    '<p class="text-xs font-semibold text-stone-500 mt-1">By <span class="text-amber-600">${authorName}</span> • ${date}</p>\n                        </div>\n                        ${actionsHTML}'
);

fs.writeFileSync('c:/mindwell-project/frontend/js/journal.js', frontend);
console.log('Done');
