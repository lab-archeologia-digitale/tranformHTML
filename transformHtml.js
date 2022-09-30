const cleanAndMove = (oldContainer, querySel, newElement, options) => {
  const el = oldContainer.querySelector(querySel);
  const text = el.innerText;
  const newEl = document.createElement(newElement)
  newEl.innerText = text;
  if (options && options.className){
    newEl.className = options.className;
  }
  return newEl;
}

const getContents = (oldContainer) => {

  // Gets element with .Key-Words className
  const oldEl = oldContainer.querySelector('.Key-Words').parentElement;
  
  // Gets it innner HTML
  const articleText = oldEl.innerHTML;
  
  // Creates new deiv node and populates with HTML
  const newNodeText = document.createElement('div');
  newNodeText.innerHTML = articleText;
  
  // Returns new node
  return newNodeText;
  
};

const createGallery = (oldContainer) => {

  // Create new gallery div container with classname gallery-container
  const gallContainer = document.createElement('div');
  gallContainer.className = 'gallery-container';

  // Creates new ul element with className gallery and appends to gallery container
  const ul = document.createElement('ul');
  ul.className = 'gallery';
  gallContainer.append(ul);

  // Gets old paragraph elements with className Caption, and for each of them:
  oldContainer.querySelectorAll('p.Caption').forEach(captionEl => {

    // Gets text
    const caption = captionEl.innerText;
    
    // Gets image name from src
    const src = captionEl.parentElement.previousElementSibling.querySelector('img').src;
    const imgName = src.split('/').at(-1)

    // Creates new list item element with attribute data-id containing image name
    const li = document.createElement('li');
    li.setAttribute('data-id', imgName);

    // Sets new template as inner HTML
    li.innerHTML = `<a class="fancybox" href="${imgName}" data-caption="${caption}" title="${caption}" rel="gallery" data-fancybox="gallery">
    <img src="${imgName}"  alt="${caption}" />
    </a>
    <div class="caption">${caption}</div>`;

    console.log(ul)

    // Finally append list item to list container
    ul.append(li);
  });

  return gallContainer;
};

const formatBibliography = (newContainer) => {
  
  // Create bibliography ul container with className bibliography
  const biblioCont = document.createElement('ul');
  biblioCont.className = 'bibliography';

  // Loop into paragraph with classNale bibliography, and for each of them:
  for (const el of newContainer.querySelectorAll('p.bibliography') ){
    
    // Create a new listi item element
    const li = document.createElement('li');
    
    // Add to list item the inner HTML of the old paragraph
    li.innerHTML = el.innerHTML;

    // Add list item to the bibliography container
    biblioCont.append(li);
  }

  // Replace first paragraph with className bibliography with new bibliography container: a hack
  newContainer.querySelectorAll('p.bibliography')[0].outerHTML = biblioCont.outerHTML;

  // Remove all paragraphs with className bibliography
  for (const el of newContainer.querySelectorAll('p.bibliography') ){
   el.remove();
  }

  return newContainer;
}

const formatFootNotes = (newContainer) => {

  // Get all div elements with className _idFootnote (footnotes text at the end of the document), and for each of them:
  for (el of newContainer.querySelectorAll('div._idFootnote')){

    // Get inner text of a element: this is the note number
    const noteNr = el.querySelector('a').innerText;

    // Remove unwanted a element: this is needed to remove note number form note text, see below
    el.querySelector('a').remove();
    for (const e of el.querySelectorAll('span.FootnoteNo')){
      e.remove();
    }
    for (const e of el.querySelectorAll('p.Footnotetxt')){
      e.outerHTML = e.innerHTML;
    }

    // Get foot note HTML, without note number, and make it the new contents of el
    const noteText = el.innerHTML;

    el.outerHTML = `
      <p class="footnote-foot" id="note-${noteNr}">
        <a id="ft-note-${noteNr}" href="#bd-node-${noteNr}">${noteNr}</a>
        <div class="footnote-text" id="note-text-${noteNr}">${noteText}</div>
      </p>
    `;
  }
  
  // Get all a elements with className _idFootnoteLink (in line footnotes references), and for each of them:
  for (const el of newContainer.querySelectorAll('a._idFootnoteLink') ){
    
    // Get inner text of a element: this is the note number
    const noteNr = el.innerText;

    // Get foot note HTML form the note liste at the end of the document
    const noteText = newContainer.querySelector(`#note-text-${noteNr}`).innerHTML;

    // Fromat new template
    el.parentNode.outerHTML = `
      <a href="javascript:void(0);" class="ftpopover" id="${`bd-note-${noteNr}`}" data-content="${noteText.replace('"', '\"').trim()}">
        ${el.innerText}
      </a>
    `;
  }

  return newContainer;
};

const transformHTML = (html) => {
  // Create oldContainer from HTML string
  const oldContainer = document.createElement('div');
  oldContainer.innerHTML = html;

  // Create div.article-text#newCointainer
  let newContainer = document.createElement('div');
  newContainer.className = 'article-text';
  newContainer.id = 'newContainer';

  // Get all contents from oldContainer, do some cleaning, and add to new container
  const newContents =  getContents(oldContainer);

  // Paragraphs with className Heading-1 are transformed into h2
  for (const el of newContents.querySelectorAll('p.Heading-1') ){
    el.outerHTML = `<h2>${el.innerHTML}</h2>`;
  }

  // Paragraphs with className Heading-2 are transformed into h3
  for (const el of newContents.querySelectorAll('p.Heading-2') ){
    el.outerHTML = `<h3>${el.innerHTML}</h3>`;
  }

  // Paragraphs with className Heading-2 are transformed into h3
  for (const el of newContents.querySelectorAll('p.indented') ){
    el.outerHTML = `<blockquote>${el.innerHTML}</blockquote>`;
  }

  // Spans with className Bold-Italic are transformed into <strong><em></em></strong> tags
  for (const el of newContents.querySelectorAll('span.Bold-Italic') ){
    el.outerHTML = `<strong><em>${el.innerHTML}</em></strong>`;
  }

  // Spans with className Bold are transformed into <strong></strong> tags
  for (const el of newContents.querySelectorAll('span.Bold') ){
    el.outerHTML = `<strong>${el.innerHTML}</strong>`;
  }

  // Spans with className Italic are transformed into <em></em> tags
  for (const el of newContents.querySelectorAll('span.Italic') ){
    el.outerHTML = `<em>${el.innerHTML}</em>`;
  }

  // Remove not needed classname Normal from paragraphs
  for (const el of newContents.querySelectorAll('p.Normal') ){
    el.classList.remove('Normal');
    el.removeAttribute('class');
  }

  // Remove not needed classname Regular from spans
  for (const el of newContents.querySelectorAll('span.Regular') ){
    el.outerHTML = el.innerHTML;
  }
  
  
  // Remove metadata elements from new container
  for (const el of newContents.querySelectorAll('.Chapter-heading,.Author,.Author-info,.Key-Words')){
    el.remove();
  }
  newContainer.append(newContents);


  // Add horizontal rule to newContainer to separate image gallery
  newContainer.append(document.createElement('hr'));

  // Create gallery and append to newContainer
  const galleryContainer = createGallery(oldContainer);
  newContainer.append(galleryContainer);

  // Format bibliography, already moved in
  newContainer = formatBibliography(newContainer);

  // Format foot notes, already moved in
  newContainer = formatFootNotes(newContainer);

  return newContainer;

};