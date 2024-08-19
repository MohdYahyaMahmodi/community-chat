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
  const userCount = document.getElementById('userCount');
  const typingIndicator = document.getElementById('typingIndicator');
  let socket;
  let typingTimeout;

  const reactions = ['👍', '👎', '😄', '😢', '😮', '❤️'];

  function formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function addMessage(msg) {
    const item = document.createElement('li');
    item.className = 'mb-2 relative group';
    item.dataset.messageId = msg.id;
    item.innerHTML = `
        <div class="flex items-start">
            <span class="font-bold mr-2" style="color: ${msg.user.color}">${msg.user.name}</span>
            <span class="flex-1 message-content">${msg.text}</span>
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">${formatTimestamp(msg.timestamp)}</div>
        <div class="reactions mt-1" data-message-id="${msg.id}"></div>
        <div class="reaction-selector hidden group-hover:flex mt-1 bg-white dark:bg-darkgray p-1 rounded shadow-lg">
            ${reactions.map(reaction => `
                <button class="reaction-btn flex-1 min-w-0 px-1 py-1 text-sm sm:text-base">
                    ${reaction}
                </button>
            `).join('')}
        </div>
    `;
    
    const reactionSelector = item.querySelector('.reaction-selector');
    reactionSelector.addEventListener('click', (e) => {
        if (e.target.classList.contains('reaction-btn')) {
            socket.emit('message reaction', msg.id, e.target.textContent.trim());
        }
    });

    messages.appendChild(item);
    updateReactions(msg.id, msg.reactions);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function updateReactions(messageId, reactions) {
    const reactionContainer = document.querySelector(`.reactions[data-message-id="${messageId}"]`);
    if (reactionContainer) {
        reactionContainer.innerHTML = '';
        for (const [reaction, users] of Object.entries(reactions)) {
            if (users.length > 0) {
                const reactionSpan = document.createElement('span');
                reactionSpan.className = 'inline-block mr-2 mb-1 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm';
                reactionSpan.textContent = `${reaction} ${users.length}`;
                reactionContainer.appendChild(reactionSpan);
            }
        }
    }
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
                  <span class="font-medium" style="color: ${user.color}">${user.name}</span>
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
          messages.innerHTML = '';
          lastMessages.forEach(addMessage);
          updateUserList(users);
      });

      socket.on('chat message', addMessage);

      socket.on('user joined', (user, users) => {
          addNotification(`${user.name} has joined the chat`);
          updateUserList(users);
      });

      socket.on('user left', (username, users) => {
          addNotification(`${username} has left the chat`);
          updateUserList(users);
      });

      socket.on('user count', (count) => {
          userCount.textContent = `${count} user${count !== 1 ? 's' : ''} online`;
      });

      socket.on('user typing', (typingUsers) => {
          if (typingUsers.length > 0) {
              const typingText = typingUsers.length > 3
                  ? `${typingUsers.length} people are typing...`
                  : `${typingUsers.join(', ')} ${typingUsers.length === 1 ? 'is' : 'are'} typing...`;
              typingIndicator.textContent = typingText;
              typingIndicator.classList.remove('hidden');
          } else {
              typingIndicator.classList.add('hidden');
          }
      });


      socket.on('user renamed', (oldName, newUser, updatedUsers) => {
        addNotification(`${oldName} is now known as ${newUser.name}`);
        updateUserList(updatedUsers);
        // The typing indicator will be updated automatically by the server
    });
    

      socket.on('user color changed', (user, updatedUsers) => {
          addNotification(`${user.name} changed their color`);
          updateUserList(updatedUsers);
      });

      socket.on('clear chat', () => {
          messages.innerHTML = '';
      });

      socket.on('message reaction', (messageId, updatedReactions) => {
        const messageElement = document.querySelector(`li[data-message-id="${messageId}"]`);
        if (messageElement) {
            updateReactions(messageId, updatedReactions);
        }
      });

      messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (messageInput.value.trim()) {
            socket.emit('chat message', messageInput.value);
            messageInput.value = '';
        }
    });

    messageInput.addEventListener('input', () => {
        socket.emit('typing');
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            socket.emit('stop typing');
        }, 1000);
    });

    toggleUserListButton.addEventListener('click', () => {
        userListModal.classList.remove('hidden');
    });

    closeUserListButton.addEventListener('click', () => {
        userListModal.classList.add('hidden');
    });
}

toggleThemeButton.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
});

if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}
});