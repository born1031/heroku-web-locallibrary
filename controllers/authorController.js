var Author = require('../models/author');
var Book = require('../models/book');

const async = require('async');

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
	res.send('NOT IMPLEMENTED: Author create GET.');
};

// Handle Author create form on POST.
exports.author_create_post = function(req, res, next){
	res.send('NOT IMPLEMENTED: Author create POST.');
};

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
