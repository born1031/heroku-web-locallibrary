var Author = require('../models/author');
var Book = require('../models/book');

const async = require('async');
const {body, sanitizeBody, validationResult} = require('express-validator');

// Display list of all Authors.
exports.author_list = function(req, res, next){
	//res.send('NOT IMPLEMENTED: Author list.');
	Author.find().exec(function(err, list_author){
		if(err){return next(err);}

		// Successful, so render.
		res.render('author_list', {title: 'Author List', author_list: list_author})
	})
};

// Display detail page for a sepcific Author.
exports.author_detail = function(req, res, next){
	//res.send('NOT IMPLEMENTED: Author detail : ' + req.params.id);
	async.parallel(
	{
		author: function(callback){
			Author.findById(req.params.id).exec(callback);
		},
		books: function(callback){
			Book.find({'author': req.params.id}, 'title. summary').exec(callback);
		}
	}, function(err, results){
		if(err){return next(err);}

		// No results.
		if(results.author == null){
			var err = new Error('Author not found.');
			err.status = 404;
			return next(err);
		};

		// Successful, so render.
		res.render('author_detail', {author: results.author, author_books: results.books});
	});
};

// Display Author create form on GET.
exports.author_create_get = function(req, res, next){
	//res.send('NOT IMPLEMENTED: Author create GET.');
	res.render('author_form', {title: 'Create Author'});
};

// Handle Author create form on POST.
exports.author_create_post = [
	
	// Validate fields.
	body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified.').isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
	body('family_name').isLength({ min: 1 }).trim().withMessage('Family name must be specified').isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
	body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601(),
	body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601(),

	// Sanitize
	sanitizeBody('first_name').escape(),
	sanitizeBody('family_name').escape(),
	sanitizeBody('date_of_birth').escape(),
	sanitizeBody('date_of_death').escape(),

	// Process request after validation and sanitization.
	(req, res, next) => {

		// Extract the validation errors from request.
		const errors = validationResult(req);

		if(!errors.isEmpty()){
			// There are errors. Render the form again with sanitized values/error messages.
			res.render('author_form', {title: 'Author Create', author: req.body, errors: errors.array()});
			return;
		}else{
			// Data from form is valid.

			// Create a Author object with escaped and trimmed data.
			var author = new Author(
				{
					first_name: req.body.first_name,
					family_name: req.body.family_name,
					date_of_birth: req.body.date_of_birth,
					date_of_death: req.body.date_of_death
				});

			// Author saved. Render to the author detail page.
			author.save(function(err){
				if(err){return next(err);}

				// Successful, redirect to new author record.
				res.redirect(author.url);
			});
		};
	}
];

// Display Author delete form on GET.
exports.author_delete_get = function(req, res, next){
	res.send('NOT IMPLEMENTED: Author delete GET.');
};

// Handle Author delete form on POST.
exports.author_delete_post = function(req, res, next){
	res.send('NOT IMPLEMENTED: Author delete POST.');
};

// Display Author update form on GET.
exports.author_update_get = function(req, res, next){
	res.send('NOT IMPLEMENTED: Author update GET.');
};

// Handle Author update form on POST.
exports.author_update_post = function(req, res, next){
	res.send('NOT IMPLEMENTED: Author update POST.');
};
