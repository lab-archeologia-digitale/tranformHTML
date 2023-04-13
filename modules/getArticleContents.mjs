export default function getArticleContents (oldContainer) {
  return oldContainer;

  // Gets element with .Key-Words className
  const oldEl = oldContainer.querySelector('.Key-Words').parentElement;
  
  // Gets it innner HTML
  const articleText = oldEl.innerHTML;
  
  // Creates new deiv node and populates with HTML
  const newNodeText = document.createElement('div');
  newNodeText.classList.add('main-documents');
  newNodeText.innerHTML = articleText;
  
  // Returns new node
  return newNodeText;
  
};

