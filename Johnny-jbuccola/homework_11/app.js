//homework: sort photo result by rating, return 28 photos instead of the default 20, display user information

$(function() {
  // DOM is now ready
  _500px.init({
    sdk_key: 'c095a1ed8923d151066ec81a6569a9dd1195e5c5'
  });
  $('#login').click(function() {
    _500px.login();
  });
  _500px.on('authorization_obtained', function() {
  $('.sign-in-view').hide();
  $('.image-results-view').show();
  addUserInfo();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var lat = position.coords.latitude;
      var long = position.coords.longitude;
      var radius = '10mi';
      var searchParams = {
        geo: lat+','+long+','+radius, 
        only:'Landscapes',
        rpp: 20,
        sort: 'highest_rating'
      };

      _500px.api('/photos/search', searchParams, function(response) {
        if (response.data.photos.length === 0) {
          alert("No photos found!");
        }
        else if(response.success) {
          var images = response.data.photos;
          images.forEach(function(element) {
          $('.images').prepend('<img class="image" src=' + element.image_url + ' />')
          });
        } 
        else {
          alert("There was an error of some sort.");
        }
      });
    });
  } else {
    $('.images').append("Sorry your browser sucks");
  }

  });
});

function addUserInfo() {
  _500px.api('/users', function(response) {
    $('<h3>Current User: </h3>').insertAfter('.images').attr('id','userInfo');
    $('#userInfo').append(response.data.user.email);
  })
}