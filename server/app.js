require('./db/config');

const express = require('express'),
	app = express(),
	passport = require('./middleware/authentication/'),
	cookieParser = require('cookie-parser'),
	userRoutes = require('./routes/secure/users'),
	openRoutes = require('./routes/open'),
	taskRoutes = require('./routes/secure/tasks'),
	fileUpload = require('express-fileupload');

// Parse incoming JSON into objects
// This gives us access to the req.body object
app.use(express.json());
app.use(openRoutes);

// This middleware gives us access to the request.cookies object
app.use(cookieParser());

// This middleware authenticates all users as being logged in and...
// Gives us access to the req.user object
app.use(
	passport.authenticate('jwt', {
		session: false,
	})
);

// This middleware gives us access to the req.files object
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: '/tmp/images',
	})
);

app.use(userRoutes);
app.use(taskRoutes);

module.exports = app;
