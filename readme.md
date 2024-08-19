# CommunityChat

CommunityChat is a real-time, open-source web-based chat application that allows users to communicate instantly without the need for user accounts. Built with Node.js, Express.js, and Socket.IO, it provides a seamless and responsive chatting experience with a clean, modern interface.

## Repository

You can find the source code for this project at:
[https://github.com/MohdYahyaMahmodi/community-chat](https://github.com/MohdYahyaMahmodi/community-chat)

## Features

- Real-time messaging with instant updates
- User presence (join/leave notifications)
- Typing indicators
- Emoji support
- Message reactions
- User color customization
- Nickname changes
- Dark mode support
- Responsive design (mobile-friendly)
- Message formatting (bold, italic, code)
- Chat clearing option
- Maximum message history

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (version 12.x or higher recommended)
- npm (usually comes with Node.js)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/MohdYahyaMahmodi/community-chat.git
   cd community-chat
   ```

2. Install the required npm packages:
   ```
   npm install express socket.io debug
   ```

## Usage

1. Start the server:
   ```
   node server.js
   ```

2. Open a web browser and navigate to `http://localhost:3000` (or the port you've configured).

3. Enter a username when prompted to join the chat.

4. Start chatting!

## Chat Commands

- `/nick <new_nickname>`: Change your nickname
- `/clear`: Clear your chat history (client-side only)
- `/color`: Change your username color randomly

## Project Structure

- `index.html`: The main HTML file containing the chat interface.
- `script.js`: Client-side JavaScript for handling UI interactions and Socket.IO events.
- `server.js`: Server-side code for setting up the Express server and Socket.IO connections.

## Customization

### Changing the Port

By default, the server runs on port 3000. To change this, modify the `PORT` constant in `server.js`:

```javascript
const PORT = process.env.PORT || 3000;
```

### Modifying Chat Limitations

You can adjust the following constants in `server.js` to change chat limitations:

```javascript
const MAX_MESSAGE_LENGTH = 500;
const MAX_USERNAME_LENGTH = 30;
const MAX_MESSAGES = 50;
```

### Modifying the Theme

The project uses Tailwind CSS for styling. You can customize the theme by modifying the `tailwind.config` object in the `<script>` tag of `index.html`.

## Debug Mode

The server uses the `debug` package for logging. To enable debug logs, set the DEBUG environment variable:

```
DEBUG=chat:server node server.js
```

## Contributing

Contributions to CommunityChat are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [Socket.IO](https://socket.io/)
- [Express.js](https://expressjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Font Awesome](https://fontawesome.com/)

---

Created by [Mohd Mahmodi](https://x.com/mohdmahmodi)