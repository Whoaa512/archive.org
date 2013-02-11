var currentEvent;

$(document).ready(function() {
  $.ajax("/siteList", {
    type: 'get',
    success: function(data){
      var siteListArray = JSON.parse(data);
      siteListArray.forEach(function(site){
        var siteID = [];
        for(var i = 0; i < site.length; i++)
        {
          if(site[i] === "."){
            siteID[i] = "-";
          }else{
            siteID[i] = site[i];
          }
        }
        siteID = siteID.join("");
        console.log(siteID);
        $('.listOfSites').append(
          '<li data-url="'+site + '" >' +
            
            site +
           
            '<ul class="versionlist" id= "' + siteID + '"></ul>' +
          '</li>');
      });
      addListeners();
    },
    error: function(e) {
      console.log(e);
    }
  });
});

var addListeners = function(){
  $('li').on('click', function(e){
    e.preventDefault();
    currentEvent = e;
    $.ajax({
      url: '/versionList',
      type: 'get',
      data: {sitename : e.target.dataset.url},
      success: buildVersionList,
      error: function(e) {console.log(e);}
    });

    //$('.loadedSite').attr('src', 'http://127.0.0.1:8080/'+ e.target.dataset.url); 
  }); 
};

var buildVersionList = function(data, textStatus, jqXHR)  {
  var site = currentEvent.target.dataset.url;
  var siteID = [];
  for(var i = 0; i < site.length; i++)
  {
    if(site[i] === "."){
      siteID[i] = "-";
    }else{
      siteID[i] = site[i];
    }
  }
  siteID = siteID.join("");
  var versionListArray = JSON.parse(data);
  console.log(versionListArray); 
  if( $('#'+siteID).children().size() > 0 ){
    $('#'+siteID).html("")
  }
  else{
    versionListArray.forEach(function(version) {
      var versionListItem = $(
        "<li class='liVersion' data-version='"+version+
        "'data-site='"+site+
        "'>"+moment(version).fromNow()+"</li>");

      $('#'+siteID).append(versionListItem);
      versionListItem.on('click', function(e){
        e.stopPropagation();
        displaySpecificVersion(e);
      });
    });
  }
};

var displaySpecificVersion = function (e){
  // $.ajax({
  //   url: '/displaySpecificVersion',
  //   type: 'get',
  //   data: {
  //     sitename : e.target.dataset.site,
  //     version : e.target.dataset.version
  //   },
  //   success : function (data, textStatus, jqXHR){
  //    $(".loadedSite").html("");
  //    $(".loadedSite").append(data);

  //   },
  //   error: function(err){console.log(e)}  
  // });
  $('.loadedSite').attr('src', 'http://127.0.0.1:8080/displaySpecificVersion?sitename='+ 
                                  e.target.dataset.site +
                                  '&version=' +
                                  e.target.dataset.version);
};



