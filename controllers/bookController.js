var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookinstance');

const async = require('async');

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
	res.send('NOT IMPLEMENTED: Book list.');
};

// Display detail page for a specific book.
exports.book_detail = function(req, res, next){
	res.send('NOT IMPLEMENTED: Book detail.');
};

// Display book create form on GET.
exports.book_create_get = function(req, res, next){
	res.send('NOT IMPLEMENTED: Book create GET.');
};

// Handle book create form on POST.
exports.book_create_post = function(req, res, next){
	res.send('NOT IMPLEMENTED: Book create POST.');
};

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