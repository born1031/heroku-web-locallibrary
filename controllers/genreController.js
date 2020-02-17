var Genre = require('../models/genre');
var Book = require('../models/book');

const async = require('async');
const {body, sanitizeBody, validationResult} = require('express-validator');

// Display list of all Genre.
exports.genre_list = function(req, res, next){
	//res.send('NOT IMPLEMENTED: Genre list.');
	Genre.find().exec(function(err, list_genre){
		if(err){return next(err);}

		// Successful, so render.
		res.render('genre_list', {title: 'Genre List', genre_list: list_genre});
	});
};

// Display detail page for a specific Genre.
exports.genre_detail = function(req, res, next){
	//res.send('NOT IMPLEMENTED: Genre detail.');
	async.parallel(
	{
		genre: function(callback){
			Genre.findById(req.params.id).exec(callback);
		},
		genre_books: function(callback){
			Book.find({'genre': req.params.id}).exec(callback);
		}
	}, function(err, results){
		if(err){return next(err);}

		// No results.
		if(results.genre == null){
			var err = new Error('Genre not found');
			err.status = 404;
			return next(err);
		};

		// Successful, so render.
		res.render('genre_detail', {genre: results.genre, genre_books: results.genre_books});
	});
};

// Display Genre create form on GET.
exports.genre_create_get = function(req, res, next){
	//res.send('NOT IMPLEMENTED: Genre create GET.');
	res.render('genre_form', {title: 'Create Genre'});
};

// Handle Genre create form on POST.
exports.genre_create_post = [

	// Validate that the name field is nor empty.
	body('name', 'Genre name required.').isLength({ min: 1 }).trim(),

	// Sanitiz (escape) the name field.
	sanitizeBody('name').escape(),

	// Process request after validation and sanitization.
	(req, res, next) => {

		// Extract the validation errors from a request.
		const errors = validationResult(req);

		// Create a genre object with escaped and trimmed data.
		var genre = Genre(
		{
			name: req.body.name
		});

		if(!errors.isEmpty()){
			// There are errors. Render the form again with sanitized values/error messages.
			res.render('genre_form', {title: 'Create Genre', genre: genre, errors: errors.array()});
			return;
		}else{
			// Data from form is valid.
			// Check if Genre with same name already exists.
			Genre.findOne({'name': req.body.name}).exec(function(err, found_genre){
				if(err){return next(err);}

				if(found_genre){
					// Genre exists, redirect to its detail page.
					res.redirect(found_genre.url);
				}else{
					genre.save(function(err){
						if(err){return next(err);}

						// Genre saved. Redirect to the genre detail page.
						res.redirect(genre.url);
					});
				};
			});
		};
	}
];

// Display Genre delete form on GET.
exports.genre_delete_get = function(req, res, next){
	res.send('NOT IMPLEMENTED: Genre delete GET.');
};

// Handle Genre delete form on POST.
exports.genre_delete_post = function(req, res, next){
	res.send('NOT IMPLEMENTED: Genre delete POST.');
};

// Display Genre update form on GET.
exports.genre_update_get = function(req, res, next){
	res.send('NOT IMPLEMENTED: Genre update GET.');
};

// Handle Genre update form on POST.
exports.genre_update_post = function(req, res, next){
	res.send('NOT IMPLEMENTED: Genre update POST.');
};