const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static assets for Instagram composer uploads
app.use('/public', express.static(path.join(__dirname, 'instagram', 'public')));

// Configure dot-env configuration path
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config({ path: path.join(__dirname, 'instagram', 'config', 'config.env') });
}

// 1. Instagram Backend Router
const instagramComposerRoute = require('./instagram/routes/composerRoute');
app.use('/api/composer-posts', instagramComposerRoute);

// 2. Twitter Backend Routers
const twitterAuthRoute = require('./twitter/routes/Auth');
const twitterUsersRoute = require('./twitter/routes/Users');
const twitterTweetsRoute = require('./twitter/routes/Tweets');

app.use('/api/auth', twitterAuthRoute);
app.use('/api/users', twitterUsersRoute);
app.use('/api/tweets', twitterTweetsRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;