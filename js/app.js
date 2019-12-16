'use strict';

const objectArray = [];


function HornImage(imageObject) {
    this.image_url = imageObject.image_url;
    this.title = imageObject.title;
    this.description = imageObject.description;
    this.keyword = imageObject.keyword;
    this.horn = imageObject.horn;
}

HornImage.prototype.render = function () {
    $('main').append('<div class = "clone"></div>');
    let $imgContainer = $('div[class="clone"]');
    let $clonedImage = $('#photo-template').html();

    $imgContainer.html($clonedImage);
    $imgContainer.find('h2').text(this.title);
    $imgContainer.find('img').attr('src', this.image_url);
    $imgContainer.find('p').text(this.description);
    $imgContainer.attr('class', '');
    $imgContainer.attr('class', this.keyword);
}

function renderImage() {
    objectArray.forEach(HornImage => {
        HornImage.render();
    })
}

let readJSON = function () {
    $.get('./data/page-1.json', data => {
        data.forEach(imageObject => {
            let newHorn = new HornImage(imageObject);
            objectArray.push(newHorn);

        })
    }).then(renderImage)
}

readJSON();
