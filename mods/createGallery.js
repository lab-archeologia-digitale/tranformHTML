export default function createGallery(oldContainer) {

  // Create new gallery div container with classname gallery-container
  const gallContainer = document.createElement('div');
  gallContainer.classList.add('gallery-container');

  // Creates new ul element with className gallery and appends to gallery container
  const ul = document.createElement('ul');
  ul.classList.add('gallery');
  gallContainer.append(ul);

  // Gets ol paragraph elements with className Caption, and for each of them:
  oldContainer.querySelectorAll('p.Caption').forEach(captionEl => {

    // Gets caption text
    const caption = captionEl.innerText;
    
    // Gets figure id
    const matchid = caption.match(/(Figure|Plate)\s*(\d+)/);
    const imgId = (matchid[1] && matchid[2]) ? matchid[1].toLowerCase() + '_' + matchid[2] : `rndid_${Math.random().toString().substring(2, 8)}`;

    // Tries to get image
    const imgEl = captionEl.parentElement.previousElementSibling.querySelector('img');
    if(!imgEl){
      console.log(`Image not found for caption “${caption}”`);
      return;
    }
    const src = captionEl.parentElement.previousElementSibling.querySelector('img').src;
    const imgName = src.split('/').at(-1)

    // Creates new list item element with attribute data-id containing image name
    const li = document.createElement('li');
    li.id = imgId;
    li.setAttribute('data-id', imgName);

    // Sets new template as inner HTML
    li.innerHTML = `<a class="fancybox" href="${imgName}" data-caption="${caption}" title="${caption}" rel="gallery" data-fancybox="gallery">
    <img src="${imgName}"  alt="${caption}" />
    </a>
    <div class="caption">${caption}</div>`;

    // Finally append list item to list container
    ul.append(li);
  });

  return gallContainer;
};