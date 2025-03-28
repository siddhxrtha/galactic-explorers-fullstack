document.addEventListener("DOMContentLoaded", function () {
  const chatMessagesContainer = document.getElementById("chat-messages");
  const userId = getUserIdFromToken();
  let guildId = null;

  ////////////////////////////////
  // Fetch User's Guild ID FIRST
  ////////////////////////////////
  fetchMethod(
    `${currentUrl}/api/users/${userId}`,
    function (status, data) {
      if (status === 200 && data["User's Guild ID"]) {
        guildId = data["User's Guild ID"];
        loadGuildMessages(); // Load messages AFTER getting guild ID
      } else {
        createErrorToast("⚠️ No Guild Found for User!");
      }
    },
    "GET"
  );

  ////////////////////////////////
  // Fetch & Display Messages
  ////////////////////////////////
  function loadGuildMessages() {
    if (!guildId) return;

    fetchMethod(
      `${currentUrl}/api/guilds/${guildId}/messages`,
      function (status, data) {
        checkStatusForRefresh(status);
        if (status === 200 && Array.isArray(data)) {
          chatMessagesContainer.innerHTML = ""; // Clear chat
          data.forEach((message) => {
            chatMessagesContainer.innerHTML += createMessageBubble(message, userId);
          });
          chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight; // Auto-scroll
        } else {
          chatMessagesContainer.innerHTML = `<p class="text-center text-muted">No messages yet. Start the conversation!</p>`;
        }
      },
      "GET",
      null,
      localStorage.getItem("token") // Passed token for authentication
    );
  }

  ////////////////////////////////
  // Edit Message
  ////////////////////////////////
  function editMessage(messageId, newMessageText) {
    const token = localStorage.getItem("token");
    if (!guildId || !token) {
      createErrorToast("Missing authentication or guild data!");
      return;
    }

    const messageData = { message_text: newMessageText };

    fetchMethod(
      `${currentUrl}/api/guilds/${guildId}/messages/${messageId}`,
      function (status, data) {
        checkStatusForRefresh(status);
        if (status === 200) {
          createSuccessToast("Message updated successfully! ✨");
          loadGuildMessages(); // Refresh messages
        } else {
          createErrorToast(data.message || "Failed to update message.");
        }
      },
      "PUT",
      messageData,
      token
    );
  }

  ////////////////////////////////
  // Delete Message
  ////////////////////////////////
  function deleteMessage(messageId) {
    const token = localStorage.getItem("token");
    if (!guildId || !token) {
      createErrorToast("Missing authentication or guild data!");
      return;
    }

    fetchMethod(
      `${currentUrl}/api/guilds/${guildId}/messages/${messageId}`,
      function (status, data) {
        checkStatusForRefresh(status);
        if (status === 200) {
          createSuccessToast("Message deleted successfully! 🗑️");
          loadGuildMessages(); // Refresh messages
        } else {
          createErrorToast(data.message || "Failed to delete message.");
        }
      },
      "DELETE",
      null,
      token
    );
  }

  ////////////////////////////////
  // Create Message Bubble (Includes Edit/Delete Icons)
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

//////////////////////////////
// Event Delegation for Buttons
//////////////////////////////
chatMessagesContainer.addEventListener("click", function (event) {
  const target = event.target;
  const messageBubble = target.closest(".message-bubble");
  
  if (!messageBubble) return; // Ensure it's inside a valid message!

  const messageId = messageBubble.getAttribute("data-message-id");
  const existingMessageText = messageBubble.querySelector(".message-text").innerText.trim(); // Gets existing message text

  if (target.classList.contains("edit-message") || target.closest(".edit-message")) {
    const newMessage = prompt("Edit your message:", existingMessageText); // Prefills with current text (For easier editing)
    if (newMessage && newMessage !== existingMessageText) editMessage(messageId, newMessage);
  }

  if (target.classList.contains("delete-message") || target.closest(".delete-message")) {
    if (confirm("Are you sure you want to delete this message?")) {
      deleteMessage(messageId);
    }
  }
});



});
