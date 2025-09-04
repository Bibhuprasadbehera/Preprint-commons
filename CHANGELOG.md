# Changelog

## [Unreleased]

### Added
- Search functionality to the explore page.
- Tabs to the explore page to switch between map and search.
- `/search` endpoint to search for papers by title or DOI.
- A new page to display the details of a single paper.
- A new route `/paper/{ppc_id}` to fetch the details of a single paper.
<<<<<<< HEAD
=======
- Clickable scatter plot points that open paper details in a new tab.
- Clickable citation trends chart that filters papers by year.
- Clickable subject distribution pie chart that filters papers by subject.
- Clickable publication timeline chart that filters papers by month.
- Clickable server distribution bar chart that filters papers by server.
- Advanced search functionality with multiple criteria (year range, subject, server, country, authors, institution, license, citation range, month filtering).
- Advanced search API endpoint supporting complex queries with month-specific filtering.
- Search sub-tabs for basic and advanced search modes.
- Chart clicks now use advanced search for better filtering.
- Fixed publication timeline chart click to properly filter by specific months.
>>>>>>> 2018d38 (now works well the (clickable charts))

### Changed
- The search results are now limited to 10 results.
- The search results now display the title, DOI, authors, and submission date.
- The search results are now styled with a card-based design and hover effects.
- The search results now link to the new paper details page.
- The paper details page now displays all the information for a paper.
- The author list on the paper details page is now formatted as a comma-separated list of names.
- The paper details page is now styled with a two-column layout.

### Fixed
- Fixed a bug where the search functionality was not working due to incorrect column names.
- Fixed a `ValueError` that occurred when serializing the search results to JSON by replacing `NaN` values with `None`.
- Fixed a bug where the paper details page was not loading correctly due to an incorrect column name.
