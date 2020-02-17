var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookinstance');

const async = require('async');
const {body, sanitizeBody, validationResult} = require('express-validator');

// Display home page with dynamic content
exports.index = function(req, res, next){
	//res.send('NOT IMPLEMENTED: Site Home Page.');
	async.parallel(
	{
		book_count: function(callback){
			// Pass an empty object as match condition to find all documents of this collection.
			Book.countDocuments({}, callback);
		},
		book_instance_count: function(callback){
			BookInstance.countDocuments({}, callback);
		},
		book_instance_available_count: function(callback){
			BookInstance.countDocuments({status: 'Available'}, callback)
		},
		author_count: function(callback){
			Author.countDocuments({}, callback);
		},
		genre_count: function(callback){
			Genre.countDocuments({}, callback);
		},
	}, function(err, results){
		res.render('index', { title: 'Local Library Home', error: err, data: results });
	});
};

// Display List of all books.
exports.book_list = function(req, res, next){
	//res.send('NOT IMPLEMENTED: Book list.');
	Book.find({}, 'title author').populate('author').exec(function(err, list_book){
		if(err){return next(err);}

		// Successful, so render.
		res.render('book_list', {title: 'Book List', book_list: list_book});
	});
};

// Display detail page for a specific book.
exports.book_detail = function(req, res, next){
	//res.send('NOT IMPLEMENTED: Book detail.');
	async.parallel(
	{
		book: function(callback){
			Book.findById(req.params.id).populate('author').populate('genre').exec(callback);
		},
		book_instances: function(callback){
			BookInstance.find({'book': req.params.id}).exec(callback);
		}
	}, function(err, results){
		if(err){return next(err);}

		// No, results
		if(results.book == null){
			var err = new Error('Book not found.');
			err.status = 404;
			return next(err);
		};

		// Successful, so render.
		res.render('book_detail', {book: results.book, book_instances: results.book_instances});
	});
};

// Display book create form on GET.
exports.book_create_get = function(req, res, next){
	//res.send('NOT IMPLEMENTED: Book create GET.');
	async.parallel(
	{
		authors: function(callback){
			Author.find().exec(callback);
		},
		genres: function(callback){
			Genre.find().exec(callback);
		}
	}, function(err, results){
		if(err){return next(err);}

		// Success, so render.
		res.render('book_form', {title: 'Create Book', authors: results.authors, genres: results.genres});
	});
};

// Handle book create form on POST.
exports.book_create_post = [
	// Convert the genre to an array.
	(req, res, next) => {
		if(!(req.body.genre instanceof Array)){
			if(typeof req.body.genre === 'undefined'){
				req.body.genre = [];
			}else{
				req.body.genre = new Array(req.body.genre);
			}
		}
		next();
	},

	// Validate fields.
	body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
	body('author', 'Author must not be empty.').isLength({ min: 1 }).trim(),
	body('summary', 'Summary must not be empty.').isLength({ min: 1 }).trim(),
	body('isbn', 'ISBN must not br empty.').isLength({ min: 1 }).trim(),

	// Sanitiz fields (using wildcard).
	sanitizeBody('*').escape(),

	// Process request after validation and sanitization.
	(req, res, next) => {
		// Extract validation errors from a request.
		const errors = validationResult(req);

		// Create a Book object with escaped and trimmed data.
		var book = new Book(
		{
			title: req.body.title,
			author: req.body.author,
			summary: req.body.summary,
			isbn: req.body.isbn,
			genre: req.body.genre
		});

		if(!errors.isEmpty()){
			// There are errors. Render form again with sanitized values/error messages.

			// Get all authors and genres for form.
			async.parallel(
			{
				authors: function(callback){
					Author.find().exec(callback);
				},
				genres: function(callback){
					Genre.find().exec(callback);
				}
			}, function(err, results){
				if(err){return next(err);}

				// Mark our selected genres as checked.
				for(let i=0; i<results.genres; i++){
					if(book.genre.indexOf(results.genres[i]._id) > -1){
						results.genres[i].checked = 'true';
					};
				};
				res.render('book_form', {title: 'Create Book', authors: results.authors, genres: results.genres, book: book, errors: errors.array()});
			});
			return;
		}else{
			// Data from form is valid. Save book.
			book.save(function(err){
				if(err){return next(err);}

				// Successful - redirect to new book record.
				res.redirect(book.url);
			});
		};
	}
];

// Display book delete form on GET.
exports.book_delete_get = function(req, res, next){
	res.send('NOT IMPLEMENTED: Book delete GET.');
};

// Handle book delete form on POST.
exports.book_delete_post = function(req, res, next){
	res.send('NOT IMPLEMENTED: Book delete POST.');
};

// Display book update form on GET.
exports.book_update_get = function(req, res, next){
	res.send('NOT IMPLEMENTED: Book update GET.');
};

// Handle book update form on POST.
exports.book_update_post = function(req, res, next){
	res.send('NOT IMPLEMENTED: Book update POST.');
};