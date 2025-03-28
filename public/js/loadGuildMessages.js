document.addEventListener("DOMContentLoaded", function () {
  const chatMessagesContainer = document.getElementById("chat-messages");
  const sendMessageBtn = document.getElementById("sendMessage");
  const messageInput = document.getElementById("messageInput");

  const userId = getUserIdFromToken(); // Extract user_id from token
  let guildId = null;

  ////////////////////////////////
  // Fetch User's Guild ID FIRST
  ////////////////////////////////
  fetchMethod(
    `${currentUrl}/api/users/${userId}`,
    function (status, data) {
      if (status === 200 && data["User's Guild ID"]) {
        guildId = data["User's Guild ID"]; // Set guild ID
        loadGuildMessages(); //  Loads messages AFTER getting correct guild ID!!
      } else {
        createErrorToast("⚠️ No Guild Found for User!");
      }
    },
    "GET"
  );
 

  ////////////////////////////////
  // Fetch & Display Messages (Only When Guild ID Exists)
  ////////////////////////////////
  function loadGuildMessages() {
    if (!guildId) {
      console.log("⏳ Skipping message load, guildId not set.");
      return;
    }
  
    fetchMethod(
      `${currentUrl}/api/guilds/${guildId}/messages`,
      function (status, data) {
        checkStatusForRefresh(status); // Call this to refresh token if 401!
  
        if (status === 200 && Array.isArray(data)) {
          chatMessagesContainer.innerHTML = ""; // Clear chat
  
          data.forEach((message) => {
            chatMessagesContainer.innerHTML += createMessageBubble(message, userId);
          });
  
          // Auto-scroll to the latest message
          chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
        } else {
          chatMessagesContainer.innerHTML = `
            <p class="text-center text-black">No messages yet. Start the conversation!</p>
          `;
        }
      },
      "GET",
      null,
      localStorage.getItem("token") // ✅ Pass token here
    );
  }
  

  ////////////////////////////////
  // Send Message
  ////////////////////////////////
  function sendMessage() {
    if (!guildId) {
      createErrorToast("You are not part of any guild!");
      return;
    }
  
    const messageText = messageInput.value.trim();
    if (!messageText) {
      createErrorToast("Message cannot be empty!");
      return;
    }
  
    const messageData = {
      user_id: userId,
      message_text: messageText,
    };
  
    fetchMethod(
      `${currentUrl}/api/guilds/${guildId}/messages`,
      function (status, data) {
        checkStatusForRefresh(status); // Call this to refresh token if 401
  
        if (status === 201) {
          messageInput.value = ""; // Clear input
          loadGuildMessages(); // Refresh chat
        } else {
          createErrorToast(data.message || "Failed to send message.");
        }
      },
      "POST",
      messageData,
      localStorage.getItem("token") // Passed the JWT here
    );
  }
  

  ////////////////////////////////
  // Create Message Bubble
  ////////////////////////////////
  function createMessageBubble(message, currentUserId) {
    const isMine = message.user_id === currentUserId;
    const bubbleClass = isMine ? "message-bubble mine" : "message-bubble";
    const senderName = isMine ? "You" : message.username;
    const timeSent = new Date(message.sent_at).toLocaleTimeString();

    return `
      <div class="${bubbleClass}" data-message-id="${message.message_id}">
        <div class="message-header d-flex justify-content-between">
          <strong>${senderName}</strong>
          <span class="message-time">${timeSent}</span>
        </div>
        <div class="message-text">${message.message_text}</div>
        
        ${isMine ? `
        <div class="message-actions d-flex justify-content-end gap-2 mt-2">
          <button class="btn btn-sm btn-outline-warning edit-message" data-id="${message.message_id}" title="Edit Message">
            <i class="bi bi-pencil-fill"> Edit</i>
          </button>
          <button class="btn btn-sm btn-outline-danger delete-message" data-id="${message.message_id}" title="Delete Message">
            <i class="bi bi-trash-fill"> Delete</i>
          </button>
        </div>
        ` : ""}
      </div>
    `;
}


  ////////////////////////////////
  // Event Listeners
  ////////////////////////////////
  sendMessageBtn.addEventListener("click", sendMessage);
  messageInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") sendMessage();
  });
});
