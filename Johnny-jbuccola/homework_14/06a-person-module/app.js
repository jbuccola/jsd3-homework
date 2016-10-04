
(function makePerson(name, age){
    var kids = [];
    return {
        getKids: function() {
            return kids;
        },
        makeKid: function(name) {
            kids.push(name);
        },
        getName: function() {
            return name;
        },
        getAge: function() {
            return age;
        },
        celebrate: function() {
            age++;
        }

    }
})('johnny',29)
