# Changelog

## [Unreleased]

### Added
- Search functionality to the explore page.
- Tabs to the explore page to switch between map and search.
- `/search` endpoint to search for papers by title or DOI.
- A new page to display the details of a single paper.
- A new route `/paper/{ppc_id}` to fetch the details of a single paper.

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
