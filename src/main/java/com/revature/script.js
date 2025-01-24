// 1. Search Books Function
async function searchBooks(query, type) {
  const apiKey = 'AIzaSyAeHK5vumnBG8blvHLn8-FSrnITU7yoxmc';
  const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${type}:${query}&maxResults=10&key=${apiKey}`);
  const data = await response.json();
  return data.items.map(item => ({
      title: item.volumeInfo.title,
      author_name: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Unknown',
      isbn: item.volumeInfo.industryIdentifiers ? item.volumeInfo.industryIdentifiers[0].identifier : 'Unknown',
      cover_i: item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : 'No image',
      ebook_access: item.accessInfo.epub.isAvailable ? 'Available' : 'Not available',
      first_publish_year: item.volumeInfo.publishedDate ? item.volumeInfo.publishedDate.split('-')[0] : 'Unknown',
      ratings_sortable: item.volumeInfo.averageRating ? item.volumeInfo.averageRating : '0'
  }));
}

 

// 2. Display Book List
function displayBookList(books) {
  const bookList = document.getElementById('book-list');
  bookList.innerHTML = ''; // Clear existing list

  // Filter books based on the checkbox state
  const ebookFilter = document.getElementById('ebook-filter').checked;
  const filteredBooks = ebookFilter ? books.filter(book => book.ebook_access.includes('Available')) : books;

  filteredBooks.forEach(book => {
    const listItem = document.createElement('li');
    listItem.classList.add('book-item');
    listItem.innerHTML = `
      <div class="title-element">${book.title}</div>
      <div class="author-element">${book.author_name}</div>
      <div class="cover-element"><img src="${book.cover_i}" alt="Cover"></div>
      <div class="rating-element">Rating: ${book.ratings_sortable}</div>
      <div class="ebook-element">${book.ebook_access}</div>
    `;
    listItem.addEventListener('click', () => displaySingleBook(book));
    bookList.appendChild(listItem);
  });

  document.getElementById('selected-book').style.display = 'none'; // Hide single book view
}

// 3. Handle Search Form Submission
async function handleSearch(event) {
  event.preventDefault();
  const searchInput = document.getElementById('search-input').value;
  const searchType = document.getElementById('search-type').value;
  if (!searchInput) {
    alert('Please enter a search term.');
    return;
  }
  const books = await searchBooks(searchInput, searchType);
  displayBookList(books);
}

// 4. Display Single Book Details
function displaySingleBook(book) {
  const selectedBook = document.getElementById('selected-book');
  selectedBook.style.display = 'block';
  selectedBook.innerHTML = `
    <h2>${book.title}</h2>
    <p><strong>Author:</strong> ${book.author_name}</p>
    <p><strong>First Published:</strong> ${book.first_publish_year}</p>
    <p><strong>ISBN:</strong> ${book.isbn}</p>
    <img src="${book.cover_i}" alt="Cover">
    <p><strong>eBook Access:</strong> ${book.ebook_access}</p>
    <p><strong>Rating:</strong> ${book.ratings_sortable}</p>
  `;
  document.getElementById('book-list').style.display = 'none'; // Hide book list when viewing a single book
}

// Event Listeners
document.getElementById('search-form').addEventListener('submit', handleSearch);

// Handle eBook filter
function handleFilter() {
  const ebookFilter = document.getElementById('ebook-filter').checked;
  const searchInput = document.getElementById('search-input').value;
  const searchType = document.getElementById('search-type').value;
  if (searchInput) {
    searchBooks(searchInput, searchType).then(displayBookList);
  }
  console.log("Ebook filter:", ebookFilter); // For debugging purposes
}

// Handle sorting by rating
function handleSort() {
  const bookList = document.getElementById('book-list');
  const books = Array.from(bookList.getElementsByTagName('li'));
  books.sort((a, b) => {
      const ratingTextA = a.querySelector('.rating-element').textContent.split(': ')[1];
      const ratingTextB = b.querySelector('.rating-element').textContent.split(': ')[1];
      console.log(`Rating A Text: ${ratingTextA}, Rating B Text: ${ratingTextB}`);
      const ratingA = ratingTextA === "Unknown" ? 0 : parseFloat(ratingTextA) || 0;
      const ratingB = ratingTextB === "Unknown" ? 0 : parseFloat(ratingTextB) || 0;
      return ratingB - ratingA; 
  });
  bookList.innerHTML = '';
  books.forEach(book => bookList.appendChild(book));
}



// Testing functions (In a real testing environment, you would use Jest or Mocha)
function testSearchFormElementsIncluded() {
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const searchType = document.getElementById('search-type');
  const searchButton = document.getElementById('search-button');

  console.assert(searchForm, 'Search Form should be present');
  console.assert(searchInput, 'Search Input should be present');
  console.assert(searchType, 'Search Type should be present');
  console.assert(searchButton, 'Search Button should be present');
}

function testDisplayDetailedBookInformation(book) {
  const selectedBookInfo = document.getElementById('selected-book-info');
  selectedBookInfo.innerHTML = `
    <h3>${book.title}</h3>
    <p><strong>Author:</strong> ${book.author_name}</p>
    <p><strong>First Published:</strong> ${book.first_publish_year}</p>
    <p><strong>ISBN:</strong> ${book.isbn}</p>
    <p><strong>eBook Access:</strong> ${book.ebook_access}</p>
    <p><strong>Rating:</strong> ${book.ratings_sortable}</p>
  `;
  console.assert(selectedBookInfo.textContent.includes(book.title), 'Detailed book info should include the book title');
  console.assert(selectedBookInfo.textContent.includes(book.author_name), 'Detailed book info should include the author name');
}



function handleFilter() {
  const ebookFilter = document.getElementById('ebook-filter').checked;
  const bookList = document.getElementById('book-list');
  const books = Array.from(bookList.getElementsByTagName('li'));
  books.forEach(book => {
      const ebookElement = book.querySelector('.ebook-element');
      const ebookValue = ebookElement.textContent.trim();
      if (ebookFilter) {
          if (ebookValue === 'eBook Access: Available') {
              book.style.display = "list-item"; 
          } else {
              book.style.display = "none"; 
          }
      } else {
          book.style.display = "list-item"; 
      }
  });

}
function handleSort() {
  const bookList = document.getElementById('book-list');
  const books = Array.from(bookList.getElementsByTagName('li'));
  books.sort((a, b) => {
      const ratingTextA = a.querySelector('.rating-element').textContent.split(': ')[1];
      const ratingTextB = b.querySelector('.rating-element').textContent.split(': ')[1];
      console.log(`Rating A Text: ${ratingTextA}, Rating B Text: ${ratingTextB}`);
      const ratingA = ratingTextA === "Unknown" ? 0 : parseFloat(ratingTextA) || 0;
      const ratingB = ratingTextB === "Unknown" ? 0 : parseFloat(ratingTextB) || 0;
      return ratingB - ratingA; 
  });
  bookList.innerHTML = '';
  books.forEach(book => bookList.appendChild(book));
}



// Add test to run them
document.addEventListener("DOMContentLoaded", function() {
  testSearchFormElementsIncluded();
  testDisplayDetailedBookInformation({
    title: 'Test Book',
    author_name: 'Test Author',
    first_publish_year: '2022',
    isbn: '12345',
    ebook_access: 'Available',
    ratings_sortable: '4.5'
  });
  testHandleSort();
  testHandleFilter();
});

