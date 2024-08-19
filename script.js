document.addEventListener('DOMContentLoaded', () => {
  const usernameModal = document.getElementById('usernameModal');
  const usernameForm = document.getElementById('usernameForm');
  const usernameInput = document.getElementById('username');
  const sidebar = document.getElementById('sidebar');
  const userList = document.getElementById('userList');
  const mobileUserList = document.getElementById('mobileUserList');
  const toggleUserListButton = document.getElementById('toggleUserList');
  const userListModal = document.getElementById('userListModal');
  const closeUserListButton = document.getElementById('closeUserList');
  const messagesContainer = document.getElementById('messagesContainer');
  const messages = document.getElementById('messages');
  const messageForm = document.getElementById('messageForm');
  const messageInput = document.getElementById('messageInput');
  const toggleThemeButton = document.getElementById('toggleTheme');
  let socket;

  const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98FB98', 
      '#DDA0DD', '#40E0D0', '#FF69B4', '#BA55D3', '#FF7F50'
  ];

  function getColorForUsername(username) {
      let hash = 0;
      for (let i = 0; i < username.length; i++) {
          hash = username.charCodeAt(i) + ((hash << 5) - hash);
      }
      return colors[Math.abs(hash) % colors.length];
  }

  function formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function addMessage(msg) {
      const item = document.createElement('li');
      item.className = 'mb-2';
      item.innerHTML = `
          <div class="flex items-start">
              <span class="font-bold mr-2" style="color: ${getColorForUsername(msg.user)}">${msg.user}</span>
              <span class="flex-1 message-content">${msg.text}</span>
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">${formatTimestamp(msg.timestamp)}</div>
      `;
      messages.appendChild(item);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function addNotification(text) {
      const item = document.createElement('li');
      item.className = 'text-center text-sm text-gray-500 dark:text-gray-400 my-2';
      item.textContent = text;
      messages.appendChild(item);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function updateUserList(users) {
      const updateList = (list) => {
          list.innerHTML = '';
          users.forEach(user => {
              const li = document.createElement('li');
              li.className = 'flex items-center space-x-2 mb-2 p-2 rounded transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-darkergray';
              li.innerHTML = `
                  <span class="w-2 h-2 rounded-full bg-green-500"></span>
                  <span class="font-medium" style="color: ${getColorForUsername(user)}">${user}</span>
              `;
              list.appendChild(li);
          });
      };

      updateList(userList);
      updateList(mobileUserList);
  }

  usernameForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = usernameInput.value.trim();
      if (username) {
          usernameModal.classList.add('hidden');
          initializeChat(username);
      }
  });

  function initializeChat(username) {
      socket = io({
          query: { username }
      });

      socket.on('init', (lastMessages, users) => {
          messages.innerHTML = ''; // Clear existing messages
          lastMessages.forEach(addMessage);
          updateUserList(users);
      });

      socket.on('chat message', addMessage);

      socket.on('user joined', (username, users) => {
          addNotification(`${username} has joined the chat`);
          updateUserList(users);
      });

      socket.on('user left', (username, users) => {
          addNotification(`${username} has left the chat`);
          updateUserList(users);
      });

      messageForm.addEventListener('submit', (e) => {
          e.preventDefault();
          if (messageInput.value.trim()) {
              socket.emit('chat message', messageInput.value);
              messageInput.value = '';
          }
      });

      toggleUserListButton.addEventListener('click', () => {
          userListModal.classList.remove('hidden');
      });

      closeUserListButton.addEventListener('click', () => {
          userListModal.classList.add('hidden');
      });
  }

  // Theme toggle functionality
  toggleThemeButton.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  });

  // Set initial theme
  if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
  } else {
      document.documentElement.classList.remove('dark');
  }
});