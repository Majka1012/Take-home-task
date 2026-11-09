# Technical Decisions

## Variant A – Game Ad

- **Rendering:** I chose HTML elements instead of Canvas because I was more comfortable working with CSS positioning and could easily adjust individual game elements.
- **Movement:** I kept the movement system simple. Gravity controls the falling speed, and tapping gives the player an upward push. This was enough to create the gameplay I wanted without making the code unnecessarily complicated.
- **Collisions:** I decided not to use the full image size for collisions because transparent parts of images could make the game feel unfair. Smaller collision areas worked better during testing.
- **Game structure:** I separated the sound code from the rest of the game because I wanted to keep the main game logic easier to read and maintain.
- **Testing:** I added a debug mode because it was difficult to judge collision areas just by looking at the game. It helped me check and adjust them more easily.

## Variant B – Fireplace Ad

- **Structure:** I kept each advertisement section in a separate HTML file. This made it easier to work on individual parts without affecting the others.
- **Background:** I decided to use one large background image instead of separate images to keep the background consistent across all three sections. It also allowed me to animate the background as one continuous surface, creating a smoother zoom effect across the entire advertisement
- **Positioning:** I used CSS positioning because the design contains many separate images that need to stay in specific places. This also made it easier to adjust their positions to match the reference.

## General

- **File size:** I compressed some of the assets because the original files were quite large and I wanted to keep the final project within the required size limit.
- **Libraries:** I used GSAP for animations instead of adding a larger library, since I only needed a relatively small set of animation features.
