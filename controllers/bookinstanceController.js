var BookInstance = require('../models/bookinstance');
var Book = require('../models/book');

const async = require('async');
const {body, sanitizeBody, validationResult} = require('express-validator');

// Display list of all BookInstance.
exports.bookinstance_list = function(req, res, next){
	//res.send('NOT IMPLEMENTED: BookInstance list.');
	BookInstance.find().populate('book').exec(function(err, list_bookinstance){
		if(err){return next(err);}

		// Successful, so render.
		res.render('bookinstance_list', {title: 'Book Instance List', bookinstance_list: list_bookinstance});
	});
};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = function(req, res, next){
	//res.send('NOT IMPLEMENTED: BookInstance detail : ' + req.params.id);
	BookInstance.findById(req.params.id).populate('book').exec(function(err, bookinstance){
		if(err){return next(err);}
		
		// No results.
		if(bookinstance == null){
			var err = new Error('Book Instance not found.');
			err.status = 404;
			return next(err);
		};

		// Successful, so render.
		res.render('bookinstance_detail', {bookinstance: bookinstance});
	});
};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = function(req, res, next){
	//res.send('NOT IMPLEMENTED: BookInstance create GET.');
	Book.find({}, 'title').exec(function(err, list_books){
		if(err){return next(err);}

		// Successful, so render.
		res.render('bookinstance_form', {title: 'Create BookInstance', book_list: list_books});
	});
};

// Handle BookInstance create form on POST.
exports.bookinstance_create_post = [
	
	// Validate fields.
	body('book', 'Book must be specified.').trim().isLength({ min: 1 }),
	body('imprint', 'Imprint must be specified.').trim().isLength({ min: 1 }),
	body('due_back', 'Invalid date.').optional({ checkFalsy: true }).isISO8601(),

	// Sanitize fields.
	sanitizeBody('book').escape(),
	sanitizeBody('imprint').escape(),
	sanitizeBody('status').trim().escape(),
	sanitizeBody('due_back').toDate().escape(),

	// Process request after validation and sanitizaion.
	(req, res, next) => {

		// Extract the validation errors from a request.
		const errors = validationResult(req);

		// Create a BookInstance object with escaped and trimmed data.
		var bookinstance = new BookInstance(
		{
			book: req.body.book,
			imprint: req.body.imprint,
			status: req.body.status,
			due_back: req.body.due_back
		});

		if(bookinstance.status.toString() != 'Available' && bookinstance.due_back == null){
			Book.find({}, 'title').exec(function(err, list_books){
				if(err){return next(err);}

				var error = {
					msg: 'When the staus is not "Available", the date when book available must be choosed.'
				};

				var errorsArr = errors.array();
				errorsArr.push(error);

				// Successful, so render.
				res.render('bookinstance_form', {title: 'Create BookInstance', book_list: list_books, selected_book: bookinstance.book._id, errors: errorsArr, bookinstance: bookinstance});
			});
			return;
		};

		if(!errors.isEmpty()){
			// There are errors. Render form again with sanitized values and error messages.
			Book.find({}, 'title').exec(function(err, list_books){
				if(err){return next(err);}

				// Successful, so render.
				res.render('bookinstance_form', {title: 'Create BookInstance', book_list: list_books, selected_book: bookinstance.book._id, errors: errors.array(), bookinstance: bookinstance});
			});
			return;
		}else{
			// Data from form is valid.
			bookinstance.save(function(err){
				if(err){return next(err);}

				// Successful - redirect to new record.
				res.redirect(bookinstance.url);
			});
		};
	}
];

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = function(req, res, next){
	//res.send('NOT IMPLEMENTED: BookInstance delete GET.');

	BookInstance.findById(req.params.id).populate('book').exec(function(err, bookinstance){
		if(err){return next(err);}

		// Successful, so render.
		res.render('bookinstance_delete', {title: 'Delete BookInstance', bookinstance: bookinstance});
	});
};

// Handle BookInstance delete form on POST.
exports.bookinstance_delete_post = function(req, res, next){
	//res.send('NOT IMPLEMENTED: BookInstance delete POST.');

	BookInstance.findByIdAndRemove(req.body.id, function deleteBookInstance(err){
		if(err){return next(err);}

		// Seccessful - redirect to the bookinstance list.
		res.redirect('/catalog/bookinstances');
	});
};

// Display BookInstance update on GET.
exports.bookinstance_update_get = function(req, res, next){
	res.send('NOT IMPLEMENTED: BookInstance update GET.');
};

// Handle BookInstance update on POST.
exports.bookinstance_update_post = function(req, res, next){
	res.send('NOT IMPLEMENTED: BookInstance update POST.');
};