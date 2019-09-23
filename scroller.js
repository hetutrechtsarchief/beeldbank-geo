function initScroller() {
  var reachedTheEnd = false;

  $('.container').infiniteScroll('destroy');

  var $container = $('.container').infiniteScroll({
    path: function() {
      console.log("this: ",this);
      console.log("path function", this.pageIndex);
      return 'sparql.php?wikidataID='+window.wikidataID+'&page=' + this.pageIndex;
    },
    // load response as flat text
    responseType: 'text',
    status: '.page-load-status',
    history: false,
  });
  //init
  $container.infiniteScroll('loadNextPage');

  $container.on('load.infiniteScroll', function(event, response) {
    var data = JSON.parse(response);

    data = data.filter(function (obj) {
      reachedTheEnd = ($("#"+obj.guid).length>0);
      return !reachedTheEnd; //don't add if already exists
    });

    var itemsHTML = data.map(getItemHTML).join('');
    // convert HTML string into elements
    var $items =  $(itemsHTML);
    // append item elements
    
    $items.find(".photo-item__image").on("error", function() {
      $(this).parent().parent().remove(); //remove DIV
    });

    $container.infiniteScroll('appendItems', $items);
  });
}

//------------------//

var itemTemplateSrc = $('#photo-item-template').html();

function getItemHTML(itemData) {
  return microTemplate(itemTemplateSrc, itemData);
}

// micro templating, sort-of
function microTemplate( src, data ) {
  if (!src) {
    console.log("warning: microTemplate src undefined");
    return;
  }

  // replace {{tags}} in source
  return src.replace( /\{\{([\w\-_\.]+)\}\}/gi, function( match, key ) {
    // walk through objects to get value
    var value = data;
    key.split('.').forEach( function( part ) {
      value = value[ part ];
    });
    return value;
  });
}