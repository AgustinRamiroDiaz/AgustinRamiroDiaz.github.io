+++
title = "En una Nota"
weight = 30
[extra]
source_url = "https://github.com/AgustinRamiroDiaz/en-una-nota"
live_url = "https://agustinramirodiaz.github.io/en-una-nota/"
stack = ["React 19", "Spotify SDK", "OAuth", "TypeScript"]
+++

**En una Nota** is an interactive music guessing game that challenges users to identify songs based on short audio clips. By integrating directly with Spotify, it turns any playlist into a high-stakes trivia experience where speed and musical knowledge are key.

### The Game

- **Listen & Guess:** The core loop involves listening to song snippets and identifying the track as quickly as possible.
- **Custom Playlists:** Users can load any Spotify playlist URL to generate a custom game session, making it playable across any genre or era.

### Technical Implementation

- **Spotify Engine:** Uses the **Spotify Web Playback SDK** to programmatically control audio snippets and the **Spotify Web API** to fetch track metadata for validation.
- **Secure Access:** Implements **OAuth 2.0 with PKCE**, allowing users to securely connect their own accounts to play with their personal playlists.
- **Modern React:** Built with **React 19**, leveraging the `use` hook for streamlined data loading and `useTransition` to keep the interface responsive during heavy API interactions.
- **Smart Fallbacks:** Automatically switches between the Playback SDK (for full-length high-fidelity clips) and the **HTML5 Audio API** (for 30-second previews) depending on the user's Spotify subscription level.
