
const imagesContainer = document.querySelector(".gallery");

async function displayWorks() {
    const answer = await fetch('http://localhost:5678/api/works');
    const data = await answer.json();
    data.forEach((work) => {
      const figure = createFigure(work);
      imagesContainer.appendChild(figure);
    });
  }

function createFigure(work) {

    const figure = document.createElement('figure')
    const figureCaption = document.createElement('figcaption')
    const figureImage = document.createElement('img')
  
    figureImage.src = work.imageUrl
    figureImage.alt = work.title
    figureCaption.innerHTML = work.title
    
    figure.appendChild(figureImage)
    figure.appendChild(figureCaption)    
  
    return figure;
  }

displayWorks();