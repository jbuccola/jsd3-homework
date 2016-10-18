//project requirements: https://gist.github.com/svodnik/941eacec73fe15984db8e5b3658981a1
//Author: Johnny Buccola
//Submission Date: 10/17/2016
//General Note: Currently, a user must be logged in to 'https://previewprojectfrog.autodeskplm360.net'
//on another tab to make this website useable. This is a known bug, and is under investigation with the
//help of autodesk support.

$(function(){
    
    var $loginButton = $('#login-btn');
    
    $loginButton.on('click', function(){
        //get email and password from input forms
        var email = $('#email').val();
        var password = $('#password').val();
        $('#overlay-forms').addClass('hidden');
        $('.loader').removeClass('hidden'); //show loading gear
        fusionLogin(email,password); //log in
    });
    
    //build accordion at bottom of page (for future use)
    $("#config-accordion").accordion({
        active: false,
        collapsible: true,
    });
    
    //build modal dialog for project item
    $('#dialog').dialog({
        autoOpen: false,
        modal: true,
        hide: {effect: "explode", duration:500},
        draggable: true,
        resizable: true,
        height: "600",
        width: "900",
        close: function() {
            $("#dialog h5").html('');
        }, //resets header after closing
    });
    
    $('#projects-container').on('click', '.project', function(){
        var title = $(this).find("#project-descriptor").text(); //capture project descriptor for use in popup dialog
        var dmsid = $(this).find("#dmsid").text(); //capture dmsid (hidden) to generate BOM request
        $('#dialog h4').text(title);
        $('#dialog').dialog('open');
        try {
            $('#bom-accordion').hide();
        } catch (e) {} // catches situation where bom-accordion does not exist (because no BOM exists)
        getProjectBom(dmsid);
    });

});

function fusionLogin(email,password) {
    var url = "https://previewprojectfrog.autodeskplm360.net/rest/auth/1/login";
    var payload = {
        "userID": email,
        "password": password
    };
    $.ajax({
        url: url,    
        method: "POST",
        data: payload
    }).done(function(resp){
        $('#login-overlay').hide();
        $('#sidenav').removeClass('hidden');
        var cookie1 = "customer="+ resp.customerToken; //standard format for authorization cookie
        var cookie2 = "JSESSIONID=" + resp.sessionid; //standard format for authorization cookie
        document.cookie = cookie1; //document.cookie adds cookie1 to document -- needed for subsequent requests?
        document.cookie = cookie2; //document.cookie adds cookie1 to document -- needed for subsequent requests?
        getUserData(); //adds user data to page
        getProjectData(); //add projects to page
    }).fail(function(r){
        console.log(r);
        alert("Login Failed");
    });
}

function getUserData() {
    var url = "https://previewprojectfrog.autodeskplm360.net/api/rest/v1/users/current_user";
    $.ajax({
        url: url,    
        method: "GET",
        xhrFields: {withCredentials:true} //required to use document.cookie as header
    }).done(function(resp){
        var userObj = captureUser(resp);
        //populate side nav with current user data and link to Autodesk account
        $("#user-data #firstName").html(userObj.firstName);
        $("#lastName").html(userObj.lastName);
        $("#role").html(userObj.role);
        $("#org").html(userObj.org);
        $("#user-url").attr("href", userObj.userUrl)
    }).fail(function(r){
        console.log("failed");
    });
}

function getProjectData(){
    var url = "https://previewprojectfrog.autodeskplm360.net/api/rest/v1/workspaces/97/items";
    $('.loader').removeClass('hidden');
    $.ajax({
        url: url,    
        method: "GET",
        xhrFields: {withCredentials:true}, //required to use document.cookie as header
        data: {size:300},
    }).done(function(resp){
        var projects = captureProjects(resp);
        var template = compileHandlebars(projects);
        $('.loader').hide();
        $("#projects-container").append(template); //add handlebars template with all project items
    }).fail(function(r){
        $("#projects-container").prepend("<h3 style='color:DarkRed' align='center'><b>Failed to retrieve projects!</b></h3>");
        $('.loader').hide();
        console.log("failed");
    });
}

function getProjectBom(dmsid){
    var url = "https://previewprojectfrog.autodeskplm360.net/api/rest/v1/workspaces/97/items/" + dmsid + "/boms/?depth=2";
    $('#bom-loader').show();
    $.ajax({
        url: url,    
        method: "GET",
        xhrFields: {withCredentials:true},
    }).done(function(resp){
        var boms = captureBom(resp); //parse BOM into sub-boms
        $('#bom-loader').hide();
        if (typeof boms === 'string') { //if boms contains a string, captureBom() returned an error string
            $('#bom-accordion').hide();
            $('#dialog').append("<h5 style='color:DarkRed' align='center'><b>This project's BOM is currently empty.</b></h5>");
        } else {
            $("#bom-accordion").empty();
            for(var i=0;i <= boms.length - 1; i++){ // for each top-level BOM, add an h3 with the parent BOM title...
                $("#bom-accordion").append("<h3 id='parent" + i + "'></h3>");
                $("#parent" + i).html(boms[i]["buildingDescriptor"]);
                $("#bom-accordion").append("<div id='bom-items" + i + "'></div>"); // ...followed by a div per jquery documentation
                var thisBom = boms[i]["childDescriptors"];
                for (var j=0; j <= thisBom.length - 1; j++) { //then for each sub-bom, append a p element inside THAT accordion div
                    $("#bom-items"+i).append("<p>" + thisBom[j] + "</p>");
                }
            }
            //note: there may be a better way to accomplish the above -- read jquery documentation a little more closely
            $("#bom-accordion").accordion({ // create accordion
                    active: false,
                    collapsible: true,
                    heightStyle: "content"
            });
            $("#bom-accordion").accordion('refresh'); //'refresh' rebuilds the content of the accordion 
            $('#bom-accordion').show();
        }
    }).fail(function(r){ //simple ajax error handling
        $("#dialog").prepend("<h3 style='color:DarkRed' align='center'><b>Failed to retrieve project BOMs!</b></h3>");
        $('#bom-loader').hide();
        console.log("failed");
    });
}

//parses user response into object
function captureUser(resp) {
    var currentUser = {};
    currentUser.userUrl = "https://accounts.autodesk.com/users/" + resp.user.loginName +"/view?";
    currentUser.firstName = resp.user.firstName;
    currentUser.lastName = resp.user.lastName;
    currentUser.org = resp.user.organization;
    currentUser.role = resp.user.title;
    return currentUser;
}

//vendors.filter(function(vendor){ return vendor.Name === "Magenic" });
//parses projects response into array of objects
function captureProjects(resp) {
    var rawArray = resp.list.item;
    var projects = {"project":[]};
    for(var i=0;i<rawArray.length;i++) {
        //var name = $('#lastName').val() + ", " + $('#firstName').val()
        //var projectFollowers = rawArray[i].metaFields.entry[10];
        //var isFollowing = false;
        //console.log(projectFollowers);
        //if(projectFollowers.filter(function(e) {return e.label == name})) {
        //   isFollowing = true;
        //} **NOTE: reserved for future filtering functionality (not working at the moment)
        var deleted = rawArray[i].details.deleted;
        if(deleted !== true) {
            var fields = descriptorToFields(rawArray[i].description);
            var projectFollowers = rawArray[i].details.metafields
            var color;
            //color "state" based on state name
            switch(rawArray[i].details.workflowState.stateName) {
                case "Project Start":
                    color = "DarkGreen";
                    break;
                case "In Design":
                    color = "DarkBlue";
                    break;
                case "In Production":
                    color = "DarkRed";
                    break;
                case "Completed":
                    color = "DarkGoldenRod";
                    break;
                default:
                    color = "Black";
                    break;
            }
            //map project item into a concise projects object, push that into the master array
            projects.project.push({
                "projectCode": fields[0],
                "projectCustomer": fields[1],
                "projectName": fields[2],
                "projectStatus": rawArray[i].details.workflowState.stateName,
                "dmsid": rawArray[i].id,
                "color": color
            });
        }
    }
    return projects;
}

//function to parse response into an array of objects, with a nested array for each sub-bom
function captureBom(resp) {
    try {
        var rawArray = resp.list.data;
    }
    catch (e) { //catch situation where the project does not yet contain a BOM (Fusion API returns a null value).
        console.log(e);
        let boms = 'Project does not contain a BOM'
        return boms;
    }
    var boms = [];
    var childBoms = [];
    var parent;
    for (var i=0; i <= (rawArray.length - 1); i++){
        try { //try-catch statements used to catch 'end of array' situation, since the NEXT array value must be checked each time
            if (rawArray[i]['bom-item']['bomDepthLevel'] === 1) { //if the bom depth level is 1, the bom-item is a "parent" 
                parent = rawArray[i]['bom-item']['descriptor'];
            }
            else if (rawArray[i+1]['bom-item']['bomDepthLevel'] === 1) { //if the NEXT item's bom depth is 1, push the data into var 'boms' and start a new bom
                childBoms.push(rawArray[i]['bom-item']['descriptor']);
                boms.push({
                    buildingDescriptor: parent,
                    childDescriptors: childBoms
                });
                childBoms = [];
                continue;
            } 
            else if (rawArray[i]['bom-item']['bomDepthLevel'] === 2) {
                childBoms.push(rawArray[i]['bom-item']['descriptor']);
            }
        } catch (e) { //rawArray[i+1] does not exist, it means the end of the array is reached... so the data is pushed into var 'boms'
            childBoms.push(rawArray[i]['bom-item']['descriptor']);
            boms.push({
                buildingDescriptor: parent,
                childDescriptors: childBoms
            });
            childBoms = [];
        }
    }
    return boms;
}

//simple function used to parse item descriptor, which is a concatenation of multiple useful fields (like part number, description, etc.)
function descriptorToFields(descriptor) {
    var fields = descriptor.split(" - ");
    return fields;
}

//standard handlebars compiler
function compileHandlebars(obj){
    var source = $("#projectTemplate").html();
    var template = Handlebars.compile(source);
    var compiledTemplate = template(obj);
    return compiledTemplate;
}

/*
Notes for Presentation
Technical Hurdles:
 - Keeping code organized and logical -- sometimes I wrote it far too organically, just to get the damn thing to work.
 - Closures! Wanting to update global variables from WITHIN an ajax.done() anonymous function, but being unable to.
    - Solution to both of the above: create lots of separate functions so that code does not get too cluttered.
 - Determining when to use JS/CSS/HTML each in the most effective way, as well as Handlebars and jQuery
    - I was definitely not very successful here - the use of a w3 template really muddied the waters for me.
 - The gazillion different ways jQuery allows you to edit, add, and remove html/css. It's very, very overwhelming, and my code is inconsistent.
    - Still not sure when to use 'html()' vs 'val()' vs 'text()' and why some appear to do nothing in certain cases.
 - Debugging with jquery is very difficult - the debugger has lots of junk to sift through, and you have to get tricky with console.log()

Things I Learned:
 - Sometimes a REST API conflicts with the way your browser is supposed to work!
   - In this case, COOKIES -- the API requires that you head your request with a specific cookie, which is illegal in Chrome
 - A TON of HTML and CSS -- my prior knowledge was the codecademy course
 - Sometimes it's better to stay the hell away from custom libraries -- especially if you're less familiar with the language they're in
   - jQuery UI cause lots of pain for me...probably should have avoided 

*/