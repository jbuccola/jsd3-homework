/*
  Please add all Javascript code to this file.
*/

function getSource1Data(){
  var source1Data;
  var url = "https://api.nytimes.com/svc/topstories/v2/home.json";
  $('#popUp.loader').removeClass('hidden');
  url += '?' + $.param({
    'api-key': "e9e5f855abec4f6186f2aa45b7542ff5"
    });
  $.ajax({
    url: url,
    method: 'GET',
    }).done(function(r) {
      source1Data = parseSource1(r['results']);
      $('#popUp.loader').addClass('hidden');
      displaySource($(this),source1Data);
    }).fail(function(err) {
      alert(err['statusText']);
    });

  function parseSource1(res) {
    var parsed = {
    'sourceTitle': 'New York Times Top Stories',
    'article': []
      };
      for(i=0;i <= 20; i++) {
      var articleObj = {
        'url': res[i]['url'],
        'articleName': res[i]['title'].substring(0,100),
        'articleCategory': res[i]['section'],
        'impressions': 'N/A',
        'imageSource': typeof(res[i]['multimedia'][0]) === 'undefined' ? 'http://vignette3.wikia.nocookie.net/simpsons/images/6/60/No_Image_Available.png/revision/latest?cb=20130527163652' : res[i]['multimedia'][0]['url'],
        'abstract': res[i]['abstract']
      }
      parsed['article'].push(articleObj);
      };
    return parsed;
    }
}

function getSource2Data() {
  var source2Data;
  var url = 'https://www.reddit.com/.json';
  var $sourceContainer = $('header li a span');
  $('#popUp.loader').removeClass('hidden');
  $.get(url, function(data) {
    source2Data = parseSource2(data['data']['children']);
    $sourceContainer.html(source2Data['sourceTitle']);
    $('#main').children().hide();
    $('#main').append(compileTemplate(source2Data, $('#sourcesTemplate')));
    $('#popUp.loader').addClass('hidden')
  })

  function parseSource2(res) {
    var parsed = {
    'sourceTitle': 'Reddit Front Page',
    'article': []
      };
      for(i=0;i <= 20; i++) {
      var articleObj = {
        'url': res[i]['data']['url'],
        'articleName': res[i]['data']['title'],
        'articleCategory': res[i]['data']['subreddit'],
        'impressions': res[i]['data']['score'],
        'abstract': 'Author: ' + res[i]['data']['author'] + '  Domain: ' + res[i]['data']['domain']
      }
      if(res[i]['data']['is_self'] === false) {
        articleObj.imageSource = res[i]['data']['thumbnail'];
      } else {
        articleObj.imageSource = 'http://vignette3.wikia.nocookie.net/simpsons/images/6/60/No_Image_Available.png/revision/latest?cb=20130527163652';
      }
      parsed['article'].push(articleObj);
      };
    return parsed;
    }
}


function getSource3Data (){
  var source3Data;
  var url = "https://accesscontrolalloworiginall.herokuapp.com/http://bleacherreport.com/api/front/lead_articles.json?limit=25";
  $('#popUp.loader').removeClass('hidden');
  $.get(url, function(r) {
      source3Data = parseSource3(r);
      $('#popUp.loader').addClass('hidden');
      displaySource($(this), source3Data);
    }).fail(function(err) {
      alert(err['statusText']);
    });
 
 function parseSource3(res) {
    var parsed = {
    'sourceTitle': 'Bleacher Report Top Stories',
    'article': []
    };
      for(i=0;i <= 20; i++) {
      var articleObj = {
        'url': 'http://bleacherreport.com/' + res[i]['permalink'],
        'articleName': res[i]['title'],
        'articleCategory': 'Sports, duh',
        'impressions': Math.floor(1000*Math.random()), //yolo
        'abstract': 'Abstract not available',
        'imageSource': res[i]['primary_image_311x210']
      }
      parsed['article'].push(articleObj);
      };
    return parsed;
  }
}

function compileTemplate(dataObject, $template) {
  var source = $template.html();
  var template = Handlebars.compile(source);
  var compiledTemplate = template(dataObject);
  return compiledTemplate;
}

function displaySource($sourceLink, sourceData) {
  var sourceTitle = sourceData['sourceTitle'];
  var $sourceContainer = $('header li a span');
  $sourceContainer.html(sourceTitle);
  var compiled = compileTemplate(sourceData, $('#sourcesTemplate'));
  $('#main').children().hide();
  $('#main').append(compiled);
};

$(function() {
  var $sourceTitle = $('ul li span');
  var $source1Link = $('ul li ul li:nth-child(1)');
  var $source2Link = $('ul li ul li:nth-child(2)');
  var $source3Link = $('ul li ul li:nth-child(3)');
  getSource1Data();

  $('#main').on('click', '.article', function() {
    var articleTitle = $(this).find('.articleContent h3').html();
    var articleAbstract = $(this).find('#abstract').html();
    var articleUrl = $(this).find('#url').html(); 
    $('#popUp .container h1').html(articleTitle);
    $('#popUp .container p').html(articleAbstract);
    $('#popUp .container a').attr('href', articleUrl);
    $('#popUp').removeClass('hidden');
    $('#popUp .container').show();
    $('a.closePopUp').on('click', function () {
      $('#popUp .container').hide();
      $('#popUp').addClass('hidden');
    });
  })
  
  $source1Link.on('click', function(){
    getSource1Data();
  });

  $source2Link.on('click', function(){
    getSource2Data();
  });

  $source3Link.on('click', function(){
    getSource3Data();
  });

})


//source 1: NY Times api key: e9e5f855abec4f6186f2aa45b7542ff5
//source 2: Reddit (no key)
//source 3: Bleacher Report (no key)
