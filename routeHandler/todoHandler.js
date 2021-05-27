const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const todoSchema = require('../schemas/todoSchema');

const Todo = mongoose.model('Todo', todoSchema);
const auth = require('../middlewares/auth');

// Get All The Todos
router.get('/', auth, (req, res) => {
    Todo.find({ status: 'active' })
        .select({
            _id: 0,
            date: 0,
            __v: 0,
        })
        .exec((err, data) => {
            if (err) {
                res.status(500).json({
                    error: 'There was a server side error!',
                });
            } else {
                res.status(200).json({
                    result: data,
                });
            }
        });
});

// **********************
// Test Routes For Instance Methods & Static Methods
// **********************
// Get The Active Todos
router.get('/active', async (req, res) => {
    try {
        const todo = new Todo();
        const data = await todo.findActive();
        res.status(200).json({
            data,
        });
    } catch {
        res.status(500).json({
            error: 'There was a server side error!',
        });
    }
});

// Get The InActive Todos
router.get('/inactive', (req, res) => {
    const todo = new Todo();
    todo.findInactiveWithCallback()
        .select({
            _id: 0,
            date: 0,
            __v: 0,
        })
        .exec((err, data) => {
            if (err) {
                res.status(500).json({
                    error: 'There was a server side error!',
                });
            } else {
                res.status(200).json({
                    result: data,
                });
            }
        });
});
// Get The InActive Todos
router.get('/filter', (req, res) => {
    Todo.findByJs()
        .select({
            _id: 0,
            date: 0,
            __v: 0,
        })
        .exec((err, data) => {
            if (err) {
                res.status(500).json({
                    error: 'There was a server side error!',
                });
            } else {
                res.status(200).json({
                    result: data,
                });
            }
        });
});

// Get The Todos With Query Helper Methods
router.get('/language', async (req, res) => {
    Todo.find()
        .byLanguage('react')
        .select({
            _id: 0,
            date: 0,
            __v: 0,
        })
        .exec((err, data) => {
            if (err) {
                res.status(500).json({
                    error: 'There was a server side error!',
                });
            } else {
                res.status(200).json({
                    result: data,
                });
            }
        });
});

// **********************
// End Test Routes For Instance Methods & Static Methods
// **********************

// Get A Todo By ID
router.get('/:id', auth, (req, res) => {
    Todo.find({ _id: req.params.id }, (err, data) => {
        if (err) {
            res.status(500).json({
                error: 'There was a server side error!',
            });
        } else {
            res.status(200).json({
                result: data,
            });
        }
    });
});

// POST A Todo
router.post('/', auth, (req, res) => {
    const newTodo = new Todo(req.body);
    newTodo.save((err) => {
        if (err) {
            res.status(500).json({
                error: 'There was a server side error!',
            });
        } else {
            res.status(200).json({
                message: 'Todo was inserted successfully!',
            });
        }
    });
});

// POST Multiple Todos
router.post('/all', auth, (req, res) => {
    Todo.insertMany(req.body, (err) => {
        if (err) {
            res.status(500).json({
                error: 'There was a server side error!',
            });
        } else {
            res.status(200).json({
                message: 'All Todo was inserted successfully!',
            });
        }
    });
});

// PUT Todo
router.put('/:id', auth, (req, res) => {
    Todo.findByIdAndUpdate(
        { _id: req.params.id },
        {
            $set: {
                status: 'active',
            },
        },
        {
            new: true,
            useFindAndModify: true,
        },
        (err) => {
            if (err) {
                res.status(500).json({
                    error: 'There was a server side error!',
                });
            } else {
                res.status(200).json({
                    message: 'Todo was updated successfully!',
                });
            }
            // eslint-disable-next-line comma-dangle
        }
    );
});

// DELETE Todo
router.delete('/:id', auth, (req, res) => {
    Todo.deleteOne({ _id: req.params.id }, (err) => {
        if (err) {
            res.status(500).json({
                error: 'There was a server side error!',
            });
        } else {
            res.status(200).json({
                message: 'Todo was deleted successful!',
            });
        }
    });
});

module.exports = router;
