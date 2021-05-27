const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const todoHandler = require('./routeHandler/todoHandler');
const userHandler = require('./routeHandler/userHandler');

const app = express();
dotenv.config();
app.use(express.json());

// Database conntection with mongoose
mongoose
    .connect('mongodb://localhost/todos', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('conntion done!'))
    .catch((err) => console.log(err));

// All Routes List
app.use('/todo', todoHandler);
app.use('/user', userHandler);

// Default error handling
// eslint-disable-next-line consistent-return
const errorHander = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({ error: err });
};

app.use(errorHander);

app.listen(3030, () => {
    console.log('listening on port 3030');
});
