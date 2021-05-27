const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    status: {
        type: String,
        enum: ['active', 'inactive'],
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

// Instance Methods
todoSchema.methods = {
    findActive() {
        return mongoose.model('Todo').find({ status: 'active' });
    },
    findInactiveWithCallback(cb) {
        return mongoose.model('Todo').find({ status: 'inactive' }, cb);
    },
};

// Statics Methods
todoSchema.statics = {
    findByJs() {
        return this.find({ title: /js/i });
    },
};

// Query Helper Methods
todoSchema.query = {
    byLanguage(language) {
        return this.find({ title: new RegExp(language, 'i') });
    },
};

module.exports = todoSchema;
