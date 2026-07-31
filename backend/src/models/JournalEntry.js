const mongoose = require('mongoose');

const JournalEntrySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    
    // Social Features
    visibility: { type: String, enum: ['public', 'private'], default: 'private' },
    privateNotes: { type: String, default: '' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }],
    
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('JournalEntry', JournalEntrySchema);
