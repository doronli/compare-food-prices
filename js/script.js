



  var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1EWt4vC1oIRWg4bkk_YiZ8MVa50X5VzPFaDXlVlqTiI0/edit?usp=sharing';

  var allData;
  var allFavoriteItems = {};
  allFavoriteItems.all = [];
  function init() {
      if(window.location.href.indexOf("list") === -1){
          Tabletop.init( { key: publicSpreadsheetUrl,
                           callback: showInfo,
                           simpleSheet: true } )
      }
      else{
          loadFavoriteItem();
      }
  }

  function showInfo(data, tabletop) {
    allData = data;
    buildData(data, "compare-data");

    $( "#input-search-item" ).autocomplete({
      source: returnHebrewName(),
      // minLength:2,   
      // delay:500, 
    //   search: function( event, ui ) {
    //     console.log("search");
    //     $( "#input-search-item" ).val( ui.item.hebrewName );
    //        return false;
    //  },
     select: function( event, ui ) {
        $( "#input-search-item" ).val( ui.item.label );
        return false;
     },
     fucus: function( event, ui ) {
      $( "#input-search-item" ).val( ui.item.label );
      return false;
    },

  })
  .data( "ui-autocomplete" )._renderItem = function( ul, item ) {
    var inputText = $( "#input-search-item" ).val();
    return $( "<li class='text-right'>" )
    .append( `<img class="img-serach" src="images/${item.value.pictureName}"/> <span class='pl-5' class='mr-4'> ${item.value.hebrewName} </span>
    <span class='pr-4'> ${item.value.costOsherAd} ש"ח </span>`)
    .appendTo( ul );
 };
}

  function returnHebrewName(){
    let allHebrewName = [];
    allData.forEach(item => {
      allHebrewName.push(
      {
        label: item.hebrewName,
        value: item
      }
        );
    });
    return allHebrewName;
  }
  // build html from data
  function buildData(data, id){
    data.forEach(item => {
        $("#" + id).append(`
        <div class="col-6 col-md-4 col-lg-3 pl-0">
            <div class="item-card">
                <img class="image-item" src="images/${item.pictureName}" alt="">
                <p class="name-item">${item.hebrewName}</p>
                <p class="cost-osher-ad">
                    <span>מחיר באושר עד:</span>
                    <span class="cost"> ${item.costOsherAd} ש"ח</span>
                </p>
                <p class="cost-rami-levi">
                    <span>מחיר ברמי לוי:</span>
                    <span class="cost"> ${item.costRamiLevi} ש"ח</span>
                </p>
                <p class=" w-100 text-center"> 
                    <span class="fa fa-star" data-item-id="${item.id}"></span>
                </p>
            </div>
        </div>
        `);
    });
  }

  // when I click on favorite item
  $('#compare-data').on('click', '.fa-star', function() {
      const itemId = $(this).data("item-id");
    
      if($(this).hasClass("checked")){
          $(this).removeClass("checked");
          removeItemFromArray(itemId);
        }
        else{
        $(this).addClass("checked");
        addItemFromArray(itemId);
      }
      console.log(allFavoriteItems);
  });

  // remove item from allFavoriteItems
  function removeItemFromArray(itemId){
    var index = getIndexFromAllFavoriteItems(itemId);
    allFavoriteItems["all"].splice(index, 1);
    $("#danger-alert").show(300);
    setTimeout(()=>$("#danger-alert").hide(300), 1000);
    localStorage.setItem("allFavoriteItems",JSON.stringify(allFavoriteItems));
  }
  
  // add item from allFavoriteItems
  function addItemFromArray(itemId){
    const itemIndex = getIndexFromObject(itemId);
    allFavoriteItems["all"].push(allData[itemIndex]);
    $("#success-alert").show(300);
    setTimeout(()=>$("#success-alert").hide(300), 1000);
    localStorage.setItem("allFavoriteItems",JSON.stringify(allFavoriteItems));
}

  // find and return the index of the itemId
  function getIndexFromObject(itemId){
    let index = 0;
    let findIndex;
    allData.forEach(item => {
        if(item.id == itemId)
            findIndex = index;
        index++;
    });
    return findIndex;
  }

  // find and return the index of the itemId
  function getIndexFromAllFavoriteItems(itemId){
    let index = 0;
    let findIndex;
    allFavoriteItems["all"].forEach(item => {
        if(item.id == itemId)
            findIndex = index;
        index++;
    });
    return findIndex;
  }

  function loadFavoriteItem(){
      let favoriteItems = localStorage.getItem("allFavoriteItems");
      favoriteItems = JSON.parse(favoriteItems);
      buildData(favoriteItems["all"], "favorite-items");
      $(".fa-star").addClass("checked");
      allFavoriteItems.all = favoriteItems["all"];
      console.log(favoriteItems);
  }
  window.addEventListener('DOMContentLoaded', init);

  $('#favorite-items').on('click', '.fa-star', function() {
    const itemId = $(this).data("item-id");
    
    removeItemFromArray(itemId);
    $("#favorite-items").html('');
    loadFavoriteItem();
  });



  // fetch('https://www.rami-levy.co.il/he/shop/')
  // .then(data => console.log(data));

 
