const path = require('path');

// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require('../config/middleware/isAuthenticated');

const db = require('../models');


module.exports = function (app) {
	app.get('/', (req, res) => {
		db.Categories.findAll({
			order: [['food_type', 'ASC']],
		}).then((dbCategories) => res.render('index', { food_type: dbCategories }));
	});

	app.get('/comments', (req, res) => {
		res.sendFile(path.join(__dirname, '../public/mainchat.html'));
	});

	app.get('/foodtrucks', (req, res) => {
		res.sendFile(path.join(__dirname, '../public/post.html'));
	});

	// Get all Food Trucks Posts by specific Category ID 
	app.get("/foodtrucks/:categoryid", (req, res) => {
		db.Post.findAll({
			where: {
				CategoryId: req.params.categoryid
			}
		}).then(dbPost => {
			res.render("blog", { post: dbPost })
		});
	});

	app.get('/signup', (req, res) => {
		// If the user already has an account send them to the members page
		if (req.user) {
			res.redirect('/members');
		}
		res.sendFile(path.join(__dirname, '../public/signup.html'));
	});

	app.get('/login', (req, res) => {
		// If the user already has an account send them to the members page
		if (req.user) {
			res.redirect('/members');
		}
		res.sendFile(path.join(__dirname, '../public/login.html'));
	});

	// Here we've add our isAuthenticated middleware to this route.
	// If a user who is not logged in tries to access this route they will be redirected to the signup page
	app.get('/members', isAuthenticated, (req, res) => {
		res.sendFile(path.join(__dirname, '../public/members.html'));
	});
};
