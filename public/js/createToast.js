// Function to create an error toast
function createErrorToast(body) {
  createToast(body, "Error", "bg-danger");
}

// Function to create a success toast
function createSuccessToast(body) {
  createToast(body, "Success", "bg-success");
}

// Generic function to create a toast notification
function createToast(body, title, backgroundClass) {
  const toastContainer = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.classList.add("toast", "show", backgroundClass, "border-0", "text-white");
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");

  const toastHeader = document.createElement("div");
  toastHeader.classList.add("toast-header", backgroundClass, "text-white", "border-0");

  const toastTitle = document.createElement("strong");
  toastTitle.classList.add("me-auto");
  toastTitle.innerText = title;

  const toastBody = document.createElement("div");
  toastBody.classList.add("toast-body", "text-start");
  toastBody.innerText = body;

  const toastCloseButton = document.createElement("button");
  toastCloseButton.classList.add("btn-close");
  toastCloseButton.addEventListener("click", function () {
    toast.remove();
  });

  toastHeader.appendChild(toastTitle);
  toastHeader.appendChild(toastCloseButton);
  toast.appendChild(toastHeader);
  toast.appendChild(toastBody);

  toastContainer.appendChild(toast);

  setTimeout(function () {
    toast.classList.add("fade-out");
    setTimeout(() => toast.remove(), 500); 
}, 2000); // Show for 2 seconds
}
