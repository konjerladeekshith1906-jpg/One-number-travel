# One Number Travel

A website for booking flights, hotels, and visas through one point of contact.

## Project structure

```
one-number-travel/
├── index.html        # Homepage with flight/hotel/visa search
├── results.html       # Flight search results page
├── css/
│   └── styles.css     # All site styles
├── js/
│   └── script.js       # Search tab + swap-fields interactivity
├── server.js           # Express server that serves the site
├── package.json         # Project dependencies (Express)
└── .gitignore
```

## Running locally

1. Install dependencies:
   ```
   npm install
   ```
2. Start the server:
   ```
   node server.js
   ```
3. Open your browser to:
   ```
   http://localhost:3000
   ```

## Notes

- The flight/hotel search form is currently a visual mockup — it does not return real
  results yet. To make it functional, connect the form to a flight search API
  (e.g. Duffel or Amadeus for Developers) and update `js/script.js` and `server.js`
  to call that API and return real results to `results.html`.
- `results.html` currently shows sample flight cards as a placeholder for what
  real search results will look like.