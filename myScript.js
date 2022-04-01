let object = {};
let start = 0;
let n = 10;
let latestID;
let timer;
let printMoreStories = false;
let pageSelection = "topstories"; 
const mainUrl = "https://hacker-news.firebaseio.com/v0";
let result = document.getElementById("result"); 

 function topStoriesIds() {

    clearInterval(timer);
    document.querySelector(".container").style.display = "none";
    if (pageSelection == "newstories") { fetchLatestID(); 
    }

    return fetch(`${mainUrl}/${pageSelection}.json`)
        .then(response => response.json())
        .then(topStoriesID_array => addStories(topStoriesID_array));
}


function addStories(array) {

    let topStoriesID = array.slice(start, n + start);

    let topStories = topStoriesID.map(id => { 
        return fetch(`${mainUrl}/item/${id}.json`) 
            .then(response => response.json())
    });

    return Promise.all(topStories)
        .then(topStories => {
            object.stories = topStories
            displayStories(topStories)
        });
}

function displayStories(topStories) {

    return topStories.map(story => {

                let userURL = `${story.by}`
                let comment;
                story.descendants == 1 ? comment = "comment" : comment = "comments"

                let HTMLtoInsert = `
        <div class="story" id="${story.id}">

            <h3 class="title"> ${story.url ?
                `<a href='${story.url}' target='_blank'> ${story.title} </a>`
                : `<a href="javascript:void(0)" onclick="toggleStoryText('${story.id}')"> ${story.title} </a>` }
            </h3>

            <span class='score'> ${story.score} </span> points by <a  target='_blank' class='story-by'> ${story.by}</a>

                <div class="toggle-view">


                ${story.kids ?
                `<span onclick="fetchOrToggleComments('${story.kids}', '${story.id}')" class="comments"> | show ${story.descendants} ${comment} </span>`
                : '' }
                </div>
        </div>           
        `
        result.insertAdjacentHTML('beforeend', HTMLtoInsert);    // .insertAdjacentHTML(...) et .innerHTML = ... prennent des strings. Par contre, .appendChild() prend un élément HTML en argument, qui doit être créé au préalable avec document.createElement(...).
        printMoreStories = false;
    })
};


function toggleStoryText(storyID)
{
    let storyText = document.getElementsById(`storyText-${storyID}`);

    if(storyText.style.display == "block") { storyText.style.display = "none" }
    else { storyText.style.display = "block" }
}


function toggleButton(str) {    
    pageSelection = str;
    start = 0;
    n = 10;
    result.innerHTML = "";
    topStoriesIds();

    let clickedButton = document.getElementById(str);

    clickedButton.className = "page-title";
}



window.onscroll = function(ev) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && printMoreStories === false) {
      printMoreStories = true;
      start += n;
      topStoriesIds();
    }
  };

// INITIALISATION :s
topStoriesIds();









