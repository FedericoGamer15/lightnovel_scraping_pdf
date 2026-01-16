# Changelog

All notable changes to this project will be documented in this file.

## [5.0.0] - Final Version (Release)
### Added
- **PDF Modes:** You can now choose between exporting in “Light Mode” (light background) or “Dark Mode” (dark background).
- **Local Upload:** Option to upload a cover image from your PC if the website blocks it.
- **UI:** Visual improvements to the wizard, high-contrast buttons for better accessibility.
- **Structure:** Optimized code and CSS style cleanup.

## [4.5.0] - Smooth Navigation
### Added
- **Navigation Mode:** Button in the wizard bar to pause selection and allow clicking on links (essential for moving from the cover to Chapter 1).
- **Persistence:** The wizard remembers which step you were on even if you change pages.

## [4.0.0] - Metadata and Estimates
### Added
- **Full Capture:** Support for selecting Cover Image and Synopsis.
- **Time Algorithm:** Real-time calculation of how long it will take to finish the download.
- **Professional PDF:** New first page in the PDF with centered cover, statistics, and synopsis.

## [3.0.0] - Internationalization (i18n)
### Added
- **Multi-language support:** Spanish, English, and Portuguese. 
- Dynamic language selector in the popup.
- Centralized `locales.js` file for easy translation. 

## [2.0.0] - Performance Optimization
### Changed
- **Scraping Engine:** Replacement of fixed `setTimeout` with dynamic `setInterval`.
- **Speed:** Instant content detection to skip to the next chapter without waiting.
- **UX:** Manual popup buttons removed in favor of the “Wizard” (on-page assistant).

## [1.0.0] - Initial Prototype
- Basic element selection functionality (Title, Content, Next Button).
- Basic PDF generation with `jsPDF`.
- Local storage in Chrome/Brave Storage.
