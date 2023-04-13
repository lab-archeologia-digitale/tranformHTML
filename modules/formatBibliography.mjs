export default function formatBibliography (newContainer) {
  
  // Create bibliography ul container with className bibliography
  const biblioCont = document.createElement('ul');
  biblioCont.classList.add('bibliography');

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