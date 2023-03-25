const modal = document.querySelector('#modal'),
    modalShow = document.querySelector('#show-modal'),
    modalClose = document.querySelector('#close-modal'),
    bookmarkForm = document.querySelector('#bookmark-form'),
    websiteNameEl = document.querySelector('#website-name'),
    websiteUrlEl = document.querySelector('#website-url'),
    bookmarksContainer = document.querySelector('#bookmarks-container');

    let bookmarks = [];


function showModal() {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

function closeModal() {
    modal.classList.remove('show-modal');
}

modalShow.addEventListener('click', showModal);

window.addEventListener('click', e => {
    const target = e.target;
    if(target.classList.contains('modal-container')){
        closeModal();
    } else if(target.classList.contains('close')){
        closeModal();
    }
})

// Validate form
function validate(nameValue, urlValue) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[-a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if(!nameValue || !urlValue){
        alert('Please submit values for both fields');
    }
  
    if(!urlValue.match(regex)){
        alert('Please provide a valid web address');
        return false;
    }
    // Valid
    return true;
}

// Build bookmarks DOM
function buildBookmarks() {
    // remove all bookmark elements
    bookmarksContainer.textContent = '';
    // build items
    bookmarks.forEach((bookmark) => {
        const { name, url } = bookmark;

        const item = document.createElement('div');
        item.classList.add('item');
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-times');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick',  `deleteBookmark('${url}')`);

        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'Favicon');

        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;

        // append
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);

    });
}

// delete Bookmark

function deleteBookmark(url) {
    bookmarks.forEach((bookmark, i) => {
        if(bookmark.url === url){
            bookmarks.splice(i, 1);
        }
    });

    //обновить закладки в хранилище после удаления и перевыпусть DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}


// Fetch bookmarks from LS
function fetchBookmarks() {
    // забрать закладки из хранилища если они доступны
    if(localStorage.getItem('bookmarks')){
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        //  создать массив закладок в хранилище
        bookmarks = [
            {
                name: 'Irina',
                url: 'https://github.com/Josephine2702'
            },
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

// Handle Data from Form
function storeBookmark(e) {
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;

    if(!urlValue.includes('http://') && !urlValue.includes('https://')){
        urlValue = `https://${urlValue}`;
    }
    
    if(!validate(nameValue, urlValue)){
        return false;
    }

    const bookmark = {
        name: nameValue,
        url: urlValue
    };

    bookmarks.push(bookmark)
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}

bookmarkForm.addEventListener('submit', storeBookmark);

// при загрузке, чтобы забрать из хранилища и показать
fetchBookmarks();