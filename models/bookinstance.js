var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var BookInstanceSchema = new Schema(
	{
		// reference to the associated book.
		book: {type: Schema.Types.ObjectId, ref: 'Book', required: true},
		imprint: {type: String, required: true},
		status: {type: String, required: true, enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'], default: 'Maintenance'},
		due_back: {type: Date, default: Date.now}
	}
);

// Virtual for bookinstance's URL
BookInstanceSchema.virtual('url').get(function(){
	return '/catalog/bookinstance/' + this._id;
});

// Get list of status.
BookInstanceSchema.virtual('list_of_status').get(function(){
	var list_of_status = [
		'Maintenance',
		'Available',
		'Loaned',
		'Reserved'
	];
	return list_of_status;
});

// Get formated date.
BookInstanceSchema.virtual('due_back_formatted').get(function(){
	return moment(this.due_back).format('MMMM Do, YYYY');
});

// Get formated date for bookinstance form page.
BookInstanceSchema.virtual('due_back_formatted_for_form').get(function(){
	return moment(this.due_back).format('YYYY-MM-DD');
});

// Export model
module.exports = mongoose.model('BookInstance', BookInstanceSchema);