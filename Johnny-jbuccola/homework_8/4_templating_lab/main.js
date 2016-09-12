/* Convert the existing web page, which contains data hard coded in HTML,
 * to instead pull the data from a data object into a structure created by a 
 * Handlebars template.
 * Specify your JavaScript app using an object rather than a set of functions.
 */
var App = {};

var Recipe = function (name, serves, meal) {
    this.name = name;
    this.serves = serves;
    this.meal = meal;
}

var recipe1 = new Recipe('Shakshuka', '4', 'breakfast');
var recipe2 = new Recipe('Black Bean Chili', '8', 'dinner');
var recipe3 = new Recipe('Classic Peanut Butter Cookies', '3 dozen', 'dessert');

App.recipe = [recipe1, recipe2, recipe3];

App.build = function() {
    var source = $('#recipe-template').html();
    var template = Handlebars.compile(source);
    var compiledTemplate = template(App.recipe)
    return compiledTemplate;
}

$("document").ready(function () {
    $("body").append(App.build);
});


