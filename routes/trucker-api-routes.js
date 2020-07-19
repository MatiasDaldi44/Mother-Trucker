const db = require('../models');

module.exports = function(app) {
	// Get all food categories in DB
	app.get('/api/categories', (req, res) => {
		db.Categories.findAll({
			order: [['food_type', 'ASC']],
		}).then(dbCategories => res.json(dbCategories));
	});

	// Get all Food Truck Posts in DB
	app.get('/api/foodtrucks', (req, res) =>
		db.Post.findAll({
			include: [db.Categories]
		}).then(dbPost => res.json(dbPost))
	);
	
	// Get all Food Truck Posts by User ID
	app.get('/api/foodtrucks/user/:userid', (req, res) => {
		db.User.findOne({
			where: {
				id: req.params.userid,
			},
			include: [db.Post]
		}).then(posts => res.json(posts));
	});

	// Post new Food Truck Post to DB
	app.post('/api/foodtrucks', (req, res) =>
		db.Post.create(req.body).then(dbPost => res.json(dbPost))
	);

	// Delete Food Truck Post in DB by Post ID
	app.delete('/api/foodtrucks/posts/:postid', (req, res) => {
		db.Post.destroy({
			where: {
				id: req.params.postid,
			},
		}).then(dbPost => res.json(dbPost));
	});

	// PUT route for updating posts
	app.put('/api/foodtrucks', (req, res) => {
		db.Post.update(req.body, {
			where: {
				id: req.body.id,
			},
		}).then(dbPost => res.json(dbPost));
	});
};
