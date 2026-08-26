# Gear Station - Design System & Aesthetics

This document outlines the design system, aesthetics, typography, colors, and core elements used across the Gear Station website.

## 1. Color Palette

The color palette is designed to be high-contrast, modern, and slightly aggressive/sporty, leaning heavily on a stark black and white foundation with a bold red primary color for accents and calls-to-action.

*   **Primary (Brand Red):** `#d31d1d` - Used for buttons, active states, price tags, and primary accents.
*   **Primary Hover:** `#b51515` - A darker shade for interactive states.
*   **Dark (Near Black):** `#121212` - Used for primary headings, dark backgrounds, and prominent badges.
*   **Gray Dark:** `#333333` - Used for standard body text.
*   **Gray:** `#666666` - Used for secondary text, descriptions, and icons.
*   **Gray Light:** `#999999` - Used for minor details, breadcrumbs, and subtle text.
*   **Background Light:** `#f9f9f9` - Used for page backgrounds (like the catalog) to separate content from white cards.
*   **Border:** `#e0e0e0` - Used for subtle dividers and input borders.
*   **White:** `#ffffff` - Used for card backgrounds, the main hero section, and text on dark backgrounds.

## 2. Typography

The typography leverages a two-font system. A highly readable sans-serif for body content and a massive, bold, display font for headings to create a striking visual hierarchy.

*   **Main Font (Body/UI):** `'Inter', sans-serif`
    *   Base Size: 14px
    *   Line Height: 1.5
    *   Weights used: 400 (Regular), 500 (Medium), 600 (Semi-bold), 700 (Bold), 800 (Extra-bold)
*   **Heading Font (Display):** `'Anton', sans-serif`
    *   Characteristics: Tall, dense, and impactful. Used exclusively in uppercase.
    *   Hero Title: Extremely large (up to 100px) with tight letter-spacing (-1px) and line-height (0.95).
    *   Section Titles: 56px, uppercase, often accompanied by a signature primary-colored square dot (`::after` pseudo-element).

## 3. Spacing & Layout

*   **Container:** A standard maximum width of `1200px` with `20px` padding on the sides to ensure content doesn't touch the screen edges on smaller devices.
*   **Section Spacing:** Generous breathing room with standard sections utilizing `80px` padding on the top and bottom.
*   **Grid System:** Flexible CSS Grid (`grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`) used for product listings to ensure responsive card layouts without fixed breakpoints.

## 4. UI Elements & Components

### Buttons
Buttons are solid, confident, and highly visible.
*   **Base:** Padding of 10px 24px, 4px border-radius, font-size 14px, uppercase, letter-spacing 0.5px.
*   **Primary Button:** Red background (`#d31d1d`) with white text. Hover state darkens the background.
*   **Outline Button:** Transparent background, red border, red text. On hover, fills with red background and white text.

### Cards (E-commerce Products)
Product cards are designed to be clean and elevated from the background.
*   **Structure:** White background, 16px border-radius, and a subtle shadow (`0 6px 20px rgba(0,0,0,0.06)`).
*   **Image Wrapper:** Contains the product image on a very light gray background (`#f9fafb`) with 24px padding.
*   **Interaction:** On hover, the entire card translates up (`-6px`) and the shadow intensifies (`0 16px 36px rgba(0,0,0,0.12)`). Simultaneously, the product image scales up slightly (`1.06x`) for a dynamic "zoom" effect.
*   **Badges:** Absolute positioned dark badges in the top-left corner for "NEW" or category labels, using heavy font-weight (800) and small text (10px).

### Inputs & Search
*   **Input Fields:** 48px height, 1px border (`#e0e0e0`), 4px radius. 
*   **Focus State:** On focus or focus-within, the border color transitions smoothly to the primary red (`#d31d1d`), providing clear user feedback.
*   **Labels:** Small (10px), uppercase, bold, and dark gray for a technical, organized look.

### Navigation / Sidebar
*   The catalog page features a sticky sidebar with a white background and 16px border-radius.
*   **Sidebar Items:** Interactive elements that feature a subtle red background tint (`rgba(211, 29, 29, 0.04)`) and red text color on hover. The active state makes this background and text styling permanent with a slightly thicker transparent red border.

## 5. Aesthetics & Vibe

*   **Modern & Premium:** The generous whitespace, clean lines, and subtle drop shadows give the site a polished, premium feel.
*   **Sporty & Aggressive:** The use of the heavy 'Anton' font paired with a stark black, white, and sharp red color scheme mimics the aesthetic of high-end sports equipment and gear brands. 
*   **Micro-interactions:** Small animations (button background fills, card hover lifts, image zooms, modal pops) make the interface feel alive and responsive without being overwhelming.
*   **Glassmorphism/Blur:** Used sparingly (e.g., modal overlays with `backdrop-filter: blur(4px)`) to focus the user's attention while maintaining context of the page underneath.

## 6. Website Sections Explained

The application is structured into two main views, managed by simple hash-based routing.

### Global Elements
*   **Header (`<Header />`):** The top navigation bar, persistent across all views, providing access to main links and user account actions.
*   **Footer (`<Footer />`):** The bottom section containing secondary links, social media icons, and copyright information.

### Homepage View (Default)
When no category is actively selected, the user sees a single-page landing experience composed of the following sections in order:
*   **Hero (`<Hero />`):** The primary focal point featuring a massive headline and an inline search/location bar to immediately capture user intent.
*   **Stats (`<Stats />`):** A trust-building section displaying key metrics (e.g., total users, available gear).
*   **Popular Rentals (`<PopularRentals />`):** A curated grid of highly sought-after items to drive quick conversions.
*   **Categories (`<Categories />`):** A visual grid allowing users to browse gear by type (e.g., Cameras, Camping). Clicking an item here transitions the app into the Catalog View.
*   **How It Works (`<HowItWorks />`):** An instructional section breaking down the rental process into simple, digestible steps.
*   **Latest Additions (`<LatestAdditions />`):** Showcases newly added inventory to encourage repeat visits.
*   **About (`<About />`):** A brief section detailing the company's mission and value proposition.
*   **Contact (`<Contact />`):** A section for user inquiries, support, and location information.
*   **Testimonials (`<Testimonials />`):** Social proof consisting of reviews and ratings from past renters.

### Category Catalog View
When a user clicks on a category from the Homepage, the main content is replaced by the Catalog View.
*   **Category Catalog (`<CategoryCatalog />`):** A dedicated browsing interface for a specific gear type. It includes:
    *   **Catalog Header:** A dark bar providing breadcrumbs and a prominent "Back" button for navigation.
    *   **Sidebar Navigation:** A sticky left-hand menu allowing users to filter sub-categories quickly.
    *   **Search & Filter Toolbar:** Tools for refining the product grid results via text search.
    *   **Product Grid:** Displays individual `ProductCard` components featuring the item's image, specs, ratings, and daily rental pricing.
    *   **Booking Modal:** A focused overlay triggered from a product card, capturing rental dates and user details for finalizing a transaction.
