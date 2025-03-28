document.addEventListener("DOMContentLoaded", function () {
  // Attach click event to toggle password buttons
  const toggleButtons = document.querySelectorAll(".toggle-password");

  toggleButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const targetInput = document.getElementById(
        button.getAttribute("data-target")
      );

      if (targetInput.type === "password") {
        targetInput.type = "text";
        button.classList.replace("bi-eye-slash", "bi-eye"); // Change icon to 'eye'
      } else {
        targetInput.type = "password";
        button.classList.replace("bi-eye", "bi-eye-slash"); // Change icon to 'eye-slash'
      }
    });
  });
});
