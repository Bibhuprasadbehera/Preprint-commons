document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.getElementById('search-button');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  searchButton.addEventListener('click', () => {
    const query = searchInput.value;
    fetch(`/search?query=${query}`)
      .then(response => response.json())
      .then(data => {
        searchResults.innerHTML = '';
        if (data.length === 0) {
          searchResults.innerHTML = '<p>No results found.</p>';
        } else {
          data.forEach(item => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';

            const title = document.createElement('h3');
            title.textContent = item.preprint_title;
            resultItem.appendChild(title);

            const doi = document.createElement('p');
            const doiLink = document.createElement('a');
            doiLink.href = `https://doi.org/${item.preprint_doi}`;
            doiLink.textContent = item.preprint_doi;
            doiLink.target = '_blank';
            doi.appendChild(doiLink);
            resultItem.appendChild(doi);

            const authors = document.createElement('p');
            authors.textContent = `Authors: ${item.all_authors}`;
            resultItem.appendChild(authors);

            const date = document.createElement('p');
            date.textContent = `Submission Date: ${new Date(item.preprint_submission_date).toLocaleDateString()}`;
            resultItem.appendChild(date);

            searchResults.appendChild(resultItem);
          });
        }
      });
  });
});
