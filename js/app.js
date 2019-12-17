'use strict';

// Global Variables
let allImagesArray = [];
let allKeyWords = [];
let pageTracker = 1;
let totalPageTracker = 0;

// Constructor for image objects

const ImgObj = function (image_url, title, description, keyword, horns) {
  this.image_url = image_url;
  this.title = title;
  this.description = description;
  this.keyword = keyword;
  this.horns = horns;
};

// Read the JSON file from local directory

function readJSON(filePath, fileType) {
  let tempImgArray = [];
  let tempKeywordArray = []

  $.get(filePath, fileType).then(imgs => {
    imgs.forEach(img => {
      // Instantiate new object using ImgObj constructor
      let imgObj = new ImgObj(img.image_url, img.title, img.description, img.keyword, img.horns);
      tempImgArray.push(imgObj);

      // If img.keyword does not exists in allKeyWords, push it into allKeyWords.
      if (!tempKeywordArray.includes(img.keyword)) {
        tempKeywordArray.push(img.keyword);
      }
    });

    allImagesArray.push(tempImgArray);
    allKeyWords.push(tempKeywordArray);

    totalPageTracker++;
    showInitialPage(tempImgArray, tempKeywordArray);
  });
}

// Show image elements on initial page load

function showInitialPage(allImages, allKeyWords) {
  // Render all of the images
  let $divEle = $('<div></div>');

  sortImagesByObjProp(allImages, 'title');

  allImages.forEach(img => {
    renderWithHandleBars(img, $divEle);
  });

  $('main').append($divEle);

  $('#pagination > ul > li:nth-child(2)').children().addClass('active');

  if (totalPageTracker > 1) {
    $divEle.hide();
  } else {
    // Poplulate dropdown with keywords
    populateDropDown(allKeyWords);
  }
}

// Render image element with Handlebar.js template

function renderWithHandleBars(imgObject, $parentEle) {
  const source = document.getElementById('img-template').innerHTML;
  const template = Handlebars.compile(source);

  const context = {
    keyword: imgObject.keyword,
    image_url: imgObject.image_url,
    title: imgObject.title,
    description: imgObject.description
  };

  const html = template(context);
  $parentEle.append(html);
}


// Populate the select dropdown with keywords

function populateDropDown(allKeyWords) {
  const $dropdown = $('#filter');
  $dropdown.empty();
  $dropdown.append($('<option>', { value: 'default', text: 'Filter by Keyword' }));

  allKeyWords.forEach(keyword => {
    $dropdown.append($('<option>', { value: keyword, text: keyword }));
  });
}

// Reset the sort by dropdown back to default selection
function resetSortByDropdown() {
  $('#sort').val('default');
}

// Render images after custom sort by title or horns

function renderSortedImages() {
  let $divEle = $(`main div:nth-child(${pageTracker})`);
  $divEle.children().remove();

  allImagesArray[pageTracker - 1].forEach(imgObj => {
    renderWithHandleBars(imgObj, $divEle);
  });
}

// Event Listener - On change, Filter by animal dropdown

$('#filter').on('change', function() {
  resetSortByDropdown();

  // Get value from HTML dropdown
  let $selection = $(this).val();

  // Hide all section elements
  $('section').hide();

  // Check if default has been selected from dropdown
  if ($selection === 'default') {
    $('section').show(); // show all
  } else {
    $(`section[keyword="${$selection}"]`).show(); // show filtered
  }
});

$(document).ready(function() {
  // Read JSON file from local data directory
  readJSON('./data/page-1.json', 'json');
  readJSON('./data/page-2.json', 'json');
});

