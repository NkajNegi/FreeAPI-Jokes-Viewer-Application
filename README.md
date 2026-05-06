https://nkajnegi.github.io/FreeAPI-Jokes-Viewer-Application/

# JokesHub

A minimalist web application designed for a single purpose: delivering random jokes with a focus on a clean, distraction-free user experience.

## The Project

JokesHub is built to handle the end-to-end flow of fetching and displaying humor. It transitions from a welcoming landing state into an active "tell me a joke" cycle. The interface is built to be responsive and adapts to system-level dark mode preferences automatically.

The core feature is a controlled "Explicit" mode. To prevent accidental exposure to sensitive content, the application implements a multi-stage confirmation flow requiring deliberate user intent before adult-oriented humor is retrieved from the API.

## Engineering

The application is structured around a central state-driven UI. Instead of complex frameworks, it uses vanilla JavaScript to orchestrate DOM transitions between four distinct states: Welcome, Loading, Error, and Display.

### Key Logic

- **Safety Filters:** The system doesn't just rely on API query parameters. It implements a secondary client-side check that parses joke categories. If the "Explicit" toggle is off but the API returns a flagged joke, the system silently discards it and re-fetches to ensure user preferences are strictly enforced.
- **UI Architecture:** Transitions are handled via CSS utility classes and keyframe animations to provide visual feedback without the overhead of a heavy animation library.
- **Error Handling:** Network failures or API downtime are caught gracefully, providing the user with specific feedback and a recovery path (retry logic) that preserves the application's state.
- **Asset Management:** The layout uses a mobile-first approach, leveraging a CDN-delivered styling engine to keep the initial payload small and the performance high.
