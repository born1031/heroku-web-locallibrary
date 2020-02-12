var BookInstance = require('../models/bookinstance');

// Display list of all BookInstance.
exports.bookinstance_list = function(req, res, next){
	res.send('NOT IMPLEMENTED: BookInstance list.');
};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = function(req, res, next){
	res.send('NOT IMPLEMENTED: BookInstance detail : ' + req.params.id);
};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = function(req, res, next){
	res.send('NOT IMPLEMENTED: BookInstance create GET.');
};

// Handle BookInstance create form on POST.
exports.bookinstance_create_post = function(req, res, next){
	res.send('NOT IMPLEMENTED: BookInstance create POST.');
};

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = function(req, res, next){
	res.send('NOT IMPLEMENTED: BookInstance delete GET.');
};

// Handle BookInstance delete form on POST.
exports.bookinstance_delete_post = function(req, res, next){
	res.send('NOT IMPLEMENTED: BookInstance delete POST.');
};

// Display BookInstance update on GET.
exports.bookinstance_update_get = function(req, res, next){
	res.send('NOT IMPLEMENTED: BookInstance update GET.');
};

// Handle BookInstance update on POST.
exports.bookinstance_update_post = function(req, res, next){
	res.send('NOT IMPLEMENTED: BookInstance update POST.');
};