/*
Convert your app.js code from the 01-make-a-person folder
to use the this keyword instead of the existing variable references
*/

function makePerson(name, age) {

	this.kids = [];
	return {
		getKids: function() {
			return this.kids;
		},
		makeKid: function(name) {
			this.kids.push(name);
		},
		getName: function() {
			this.name;
		},
		getAge: function() {
			this.age;
		},
		celebrate: function() {
			this.age++;
		}

	}
	// Return an object that has the following methods...

	// a method get the list of kids
	// a method to have a new kid
	// a method to get the person's name
	// a method to get the person's age
	// a method to celebrate the person's birthday (make then a year older)

}