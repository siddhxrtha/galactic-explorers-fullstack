document.addEventListener("DOMContentLoaded", function () {
  ////////////////////////////
  // Setup & References
  ////////////////////////////
  const userId = getUserIdFromToken();
  const token = localStorage.getItem("token");
  const editUsernameInput = document.getElementById("editUsername");
  const editEmailInput = document.getElementById("editEmail");
  const editModal = document.getElementById("editAccountModal");
  const saveChangesButton = document.getElementById("saveChangesButton");
  const url = `${currentUrl}/api/users/${userId}`;

  if (!userId || !editModal) return;

  // Initially disable the save button
  saveChangesButton.disabled = true;

  ////////////////////////////
  // Email Validation
  ////////////////////////////
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  ////////////////////////////
  // Track Original Values
  ////////////////////////////
  let originalUsername = "";
  let originalEmail = "";

  ////////////////////////////
  // Enable or Disable Button
  ////////////////////////////
  function toggleSaveButton() {
    const currentUsername = editUsernameInput.value.trim();
    const currentEmail = editEmailInput.value.trim();
    // Enable if either field is changed
    const isChanged =
      currentUsername !== originalUsername || currentEmail !== originalEmail;
    saveChangesButton.disabled = !isChanged;
  }

  ////////////////////////////
  // Prefill Form
  ////////////////////////////
  const prefillForm = () => {
    fetchMethod(url, (status, data) => {
      if (status === 200) {
        originalUsername = data["Username"];
        originalEmail = data["Email"];
        editUsernameInput.value = originalUsername;
        editEmailInput.value = originalEmail;
        saveChangesButton.disabled = true; // Reset to disabled on load
      } else {
        createErrorToast("Failed to load user details for editing.");
      }
    }, "GET", null, token);
  };

  // Trigger prefill when modal is opened
  editModal.addEventListener("show.bs.modal", prefillForm);

  ////////////////////////////
  // Detect Input Changes
  ////////////////////////////
  editUsernameInput.addEventListener("input", toggleSaveButton);
  editEmailInput.addEventListener("input", toggleSaveButton);

  ////////////////////////////
  // Form Submission
  ////////////////////////////
  saveChangesButton.addEventListener("click", function (event) {
    event.preventDefault();

    const username = editUsernameInput.value.trim();
    const email = editEmailInput.value.trim();

    if (!username || !email) {
      createErrorToast("Both username and email fields are required!");
      return;
    }
    if (!isValidEmail(email)) {
      createErrorToast("Please provide a valid email address.");
      return;
    }

    const data = { username, email };

    const callback = (status, responseData) => {
      checkStatusForRefresh(status);
      if (status === 200) {
        createSuccessToast("Profile updated successfully!");
        setTimeout(() => location.reload(), 2200);
      } else if (status === 409) {
        createErrorToast(responseData.message || "Username or email already exists.");
      } else {
        createErrorToast("Failed to update profile. Please try again later.");
      }
    };

    fetchMethod(url, callback, "PUT", data, token);
  });
});
