'use strict';

const objectArray = [];

// creating constructer function

function HornImage(imageObject){
  this.image_url = imageObject.image_url;
  this.title = imageObject.title;
  this.description = imageObject.description;
  this.keyword = imageObject.keyword;
  this.horn = imageObject.horn;
}

HornImage.prototype.render = function() {
  $('main').append('<div class = "clone"></div>');
  let $imgContainer = $('div[class="clone"]');
  let $clonedImage = $('#photo-template').html();

  $imgContainer.html($clonedImage);
  $imgContainer.find('h2').text(this.title);
  $imgContainer.find('img').attr('src', this.image_url);
  $imgContainer.find('p').text(this.description);
  $imgContainer.attr('class', '');
  $imgContainer.attr('class',this.keyword);
}

// Rendering the Images

let readJSON = function(){
  $.get('./data/page-1.json',data => {
    data.forEach(imageObject => {
      let newHorn = new HornImage(imageObject);
      objectArray.push(newHorn);

    })
  }).then(renderImage).then(renderSelect)
}

function renderImage() {
  objectArray.forEach(HornImage => {
    HornImage.render();
  })
}

// Prevent the dublication 
function renderSelect() {
  let duplicateArray = [];
  objectArray.forEach(text => {
    if( ! duplicateArray.includes(text.keyword) ) {
      $('select').append('<option class ="clone"></option>');
      let $optContainer = $('option[class="clone"]');
      $optContainer.text(text.keyword);
      duplicateArray.push(text.keyword);
      $optContainer.attr('class', '');
    }
  })
}



$('select').on('change', changeView);

function changeView() {
  let selected = $(this).val();
  $('div').not('.' + selected).fadeOut();
  $('.' + selected).fadeIn();

}


readJSON();
