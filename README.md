# Parenco

A mobile-first, responsive web application built with Vite React JS with React compiler, and Tailwind CSS, designed to provide helpful tools for work. Railway ready.

## Design specifications

- **Theme**: Light theme
- **Main Text Color**: Light blue
- **Accent Color**: Yellow (light-ish)
- **Background Colors**: Gradient of white / grey / warm-ish tones
- **Approach**: Mobile-first, fully responsive

## Tech stack

- **Vite** - Build tool
- **React JS** - UI framework with React compiler
- **Tailwind CSS** - Styling (included by default with Vite + React)

## Coding standards

- **Text capitalization**: Each line of text in this project should only have 1 capital letter at the start maximum everywhere. This applies to all user-facing text, labels, messages, and UI elements.

## Project structure

### Homepage

- Fancy gradient background
- Navigation menu with nav items that users can scroll through
- Each nav item redirects to a different page
- Fancy loading animation appears before redirecting to a new page

### Other pages (e.g., "Inpakstraat")

- **Header**:
  - Clickable left arrow (←) on the right side to return to homepage
  - Title displayed on the left side of the header
- All pages are mobile-first and fully responsive

## Pages

### Inpakstraat page

A tool for calculating how many paper rolls can be packed based on the current packing paper roll diameter.

#### Visual elements

- **Paper roll animation**:
  - Centered under the header
  - Visually unwinds animation
- **Product information** (displayed to the right of the animation):
  - Name: "REELPLEX 220"
  - Diameter: "1200mm"
  - Length: "4283m"
  - Grammage: "220"

#### Input section

- **Textbox** (rounded corners):
  - For entering the packing paper roll's current diameter
  - Valid range: 1200mm to 230mm
  - Range displayed above textbox in small text

#### Output card

- **Card design**: Rounded corners, transparent background
- **Displayed information**:
  1. "Amount of rolls that can be packed:"
     - Number displayed in larger font size
     - Updates dynamically based on textbox input
  2. "The percentage of chance of rolls that have a diameter of less then 1255mm:"
     - Number with % symbol displayed in larger font size
     - This percentage value remains constant

#### Calculation logic

- **Paper roll specifications**:
  - Each paper roll to be packed has a diameter of 1255mm
  - Allowed range: minimum 1180mm to maximum 1255mm
  - Rolls with diameter less than 1180mm will not be packed
- **Packing details**:
  - Each paper roll gets 1.5 winds of paper
  - Base length of packing paper roll: 4283 meters (at full diameter of 1200mm)
  - Calculation accounts for 5% less use (since some rolls could be smaller than 1255mm)
- **Calculation process**:
  1. Calculate meters needed per roll (assuming all rolls are 1255mm diameter)
  2. Apply 5% reduction factor
  3. Calculate how many rolls can be packed with a full diameter packing paper roll (1200mm)
  4. When user inputs current diameter, calculate remaining meters available
  5. Calculate and display how many rolls can still be packed with the remaining paper

## Getting started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Deployment

This project is configured to be Railway ready.
