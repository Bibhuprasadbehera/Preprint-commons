# Changelog

## [Unreleased]

### Added
- Search functionality to the explore page.
- Tabs to the explore page to switch between map and search.
- `/search` endpoint to search for papers by title or DOI.

### Changed
- The search results are now limited to 10 results.
- The search results now display the title, DOI, authors, and submission date.
- The search results are now styled to be more user-friendly.

### Fixed
- Fixed a bug where the search functionality was not working due to incorrect column names.
- Fixed a `ValueError` that occurred when serializing the search results to JSON by replacing `NaN` values with `None`.
