import formatFootNotes from './formatFootNotes.mjs';
import createGallery from './createGallery.mjs';
import formatBibliography from './formatBibliography.mjs';
import getArticleContents from './getArticleContents.mjs';

/**
 * 
 * @param {String} html 
 * @returns {HTMLDivElement}
 */
export default function transformHTML (html) {
  // Create oldContainer from HTML string
  const oldContainer = document.createElement('div');
  oldContainer.innerHTML = html.trim();

  // Get all contents from oldContainer, do some cleaning, and add to new container
  const newContents =  getArticleContents(oldContainer);

  // Paragraphs with className Heading-1 are transformed into h2
  for (const el of newContents.querySelectorAll('p.Heading-1') ){
    el.outerHTML = `<h2>${el.innerHTML}</h2>`;
  }
  
  // Paragraphs with className Heading-2 are transformed into h3
  for (const el of newContents.querySelectorAll('p.Heading-2') ){
    el.outerHTML = `<h3>${el.innerHTML}</h3>`;
  }

  // Paragraphs with className indented are transformed into blockquote
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

  // strong tag inside h2, h3, h4, h5 is removed
  for (const el of newContents.querySelectorAll('h2>strong, h3>strong, h4>strong, h5>strong') ){
    el.outerHTML = el.innerHTML
  }
  
  // em tag inside h3 is removed
  for (const el of newContents.querySelectorAll('h3>em') ){
    el.outerHTML = el.innerHTML
  }

  // Remove lang attribute from p element
  for (const el of newContents.querySelectorAll('[lang]') ){
    el.removeAttribute('lang');
  }
  
  // Remove metadata elements from new container
  for (const el of newContents.querySelectorAll('.Chapter-heading, .Author, .Author-info, .Key-Words, .Author-Not-for-RH, .Abstract')){
    el.remove();
  }

  
  // Parse galleries
  const galleryContainer = createGallery(oldContainer);

  // Replace Figure|Plate with link
  newContents.innerHTML = newContents.innerHTML.replaceAll(/(Figure|Plate)\s*(\d+)/g, (match, p1, p2)=>{
    const imgid = p1.toLowerCase() + '_'+ p2;
    const captionEl = galleryContainer.querySelector(`#${imgid} .caption`);
    if (!captionEl){
      console.log(`Image not found for ${p1} ${p2}. Probably it is not located in the right place (previous sibling of the parent of the caption)`);
      return;
    }

    const caption = captionEl.innerHTML.replace('"', '\"');
    return `<a href="${galleryContainer.querySelector(`#${p1.toLowerCase()}_${p2} img`).getAttribute('src')}" data-fancybox="gallery" rel="gallery" data-caption="${caption}" title="${caption}">${match}</a>`;

  });


  // Create new main container div
  let newContainer = document.createElement('div');

  // Appends contents
  newContainer.append(newContents);

  // Add horizontal rule to newContainer to separate image gallery
  newContainer.append(document.createElement('hr'));

  // Create gallery and append to newContainer
  newContainer.append(galleryContainer);

  
  

  // Format bibliography, already moved in
  newContainer = formatBibliography(newContainer);

  // Format foot notes, already moved in
  newContainer = formatFootNotes(newContainer);

  // Remove classnames starting with _
  for (const el of newContents.querySelectorAll('*[class^=_]')){
    el.classList.forEach(cl => {
      el.classList.remove(cl);
      if (el.classList.length < 1){
        el.removeAttribute('class');
      }

    });
  }


  return newContainer;

};