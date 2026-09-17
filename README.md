Signal Garden
======================

A small interactive visual toy.

The idea
========

I wanted to keep the concept simple and focused. The page has a quiet field of moving particles that responds to the user's interaction.

When you move the cursor around, it changes the flow of the particles. Clicking anywhere creates a ripple effect across the field. I also added a few simple controls to change how the animation feels without making the interface complicated.

The main focus was to build one interaction properly and make it easy for the user to understand and explore.

How to use it
============
1. Move your mouse around the particle field and see how the flow changes.
2. Click anywhere on the field to create a ripple.
3. Use Palette, Energy, and Chaos to change the look and movement.
4. Click Pause Field to stop the animation.
5. Press Space to pause or resume the field.
6. Press R to generate the field again.
7. Use Randomize to get a different starting state.

Implementation
==============

The main visual effect is built using the Canvas 2D API, while the UI is built with React.

I kept the implementation fairly simple and avoided using a shader framework or a separate animation library for the main effect. The particle movement, mouse interaction, ripple effect, resizing, and animation loop are handled directly inside the canvas.

For the UI, I used CSS animations for small transitions so that the controls and helper cards appear smoothly instead of showing everything at once.

I have also added keyboard focus states and a reduced-motion fallback to make the page more comfortable to use for different users.

Run locally

Install the dependencies:
--------------------------

npm install

Start the development server:
-----------------------------

npm run dev

Then open the local URL shown in the terminal, usually:
------------------------------------------------------

http://localhost:3000
Production build

To create a production build:
----------------------------

npm run build

Then run the production preview:
------------------------------

npm run preview
