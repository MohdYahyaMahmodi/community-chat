<h1 align="center">CommunityChat 💬</h1>

<p align="center">
  <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" alt="Express.js">
  <img src="https://img.shields.io/badge/socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101" alt="Socket.io">
</p>

<p align="center">
  <b>A real-time, open-source web-based chat application with no user accounts required.</b>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#customization">Customization</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

## 🌟 Features

- ⚡ Real-time messaging
- 👥 User presence notifications
- ⌨️ Typing indicators
- 😊 Emoji support
- 👍 Message reactions
- 🎨 User color customization
- 📝 Nickname changes
- 🌓 Dark mode support
- 📱 Responsive design
- 🔠 Message formatting (bold, italic, code)
- 🧹 Chat clearing option
- 📜 Maximum message history

## 🚀 Quick Start

1. Clone the repo
   ```sh
   git clone https://github.com/MohdYahyaMahmodi/community-chat.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Start the server
   ```sh
   node server.js
   ```
4. Open `http://localhost:3000` in your browser

## 📋 Prerequisites

- Node.js (v12.x or higher)
- npm

## 🛠️ Installation

<details>
<summary>Click to expand</summary>

1. Clone the repository:
   ```sh
   git clone https://github.com/MohdYahyaMahmodi/community-chat.git
   cd community-chat
   ```

2. Install the required npm packages:
   ```sh
   npm install express socket.io debug
   ```

</details>

## 🖥️ Usage

1. Start the server:
   ```sh
   node server.js
   ```

2. Open `http://localhost:3000` in your browser.

3. Enter a username to join the chat.

### Chat Commands

| Command | Description |
|---------|-------------|
| `/nick <new_nickname>` | Change your nickname |
| `/clear` | Clear your chat history |
| `/color` | Change your username color |

## 📁 Project Structure

- `index.html`: Main chat interface
- `script.js`: Client-side logic
- `server.js`: Server-side implementation

## ⚙️ Customization

<details>
<summary>Click to expand</summary>

### Changing the Port

Modify the `PORT` constant in `server.js`:

```javascript
const PORT = process.env.PORT || 3000;
```

### Chat Limitations

Adjust these constants in `server.js`:

```javascript
const MAX_MESSAGE_LENGTH = 500;
const MAX_USERNAME_LENGTH = 30;
const MAX_MESSAGES = 50;
```

### Theming

Modify the `tailwind.config` object in `index.html` to customize the theme.

</details>

## 🐛 Debug Mode

Enable debug logs:

```sh
DEBUG=chat:server node server.js
```

## 🤝 Contributing

Contributions are welcome! Feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Socket.IO](https://socket.io/)
- [Express.js](https://expressjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Font Awesome](https://fontawesome.com/)

<hr>

<p align="center">
  Created with ❤️ by <a href="https://twitter.com/mohdmahmodi">Mohd Mahmodi</a>
</p>