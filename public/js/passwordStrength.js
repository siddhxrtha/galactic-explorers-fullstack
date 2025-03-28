//////////// Password Strength Validation ////////////
document.getElementById("password").addEventListener("input", function () {
  const password = this.value;
  const strengthBar = document.getElementById("password-strength-bar");
  const strengthText = document.getElementById("password-strength-text");
  const submitButton = document.querySelector('button[type="submit"]');
  const requirements = document.querySelectorAll("#password-requirements .requirement");

  let strength = 0;
  let allConditionsMet = true;

  //////////// Define Password Strength Conditions ////////////
  const conditions = [
    { test: password.length >= 8, element: requirements[0] },  // Min length 8
    { test: /[A-Z]/.test(password), element: requirements[1] }, // At least one uppercase
    { test: /[a-z]/.test(password), element: requirements[2] }, // At least one lowercase
    { test: /[0-9]/.test(password), element: requirements[3] }, // At least one number
    { test: /[^A-Za-z0-9]/.test(password), element: requirements[4] }, // At least one special character
  ];

  //////////// Check Conditions & Update Icons ////////////
  conditions.forEach(({ test, element }) => {
    const icon = element.querySelector("i");
    if (test) {
      strength += 20;
      element.setAttribute("data-fulfilled", "true");
      icon.className = "bi bi-check-circle-fill text-success me-2";
    } else {
      allConditionsMet = false;
      element.setAttribute("data-fulfilled", "false");
      icon.className = "bi bi-x-circle-fill text-danger me-2";
    }
  });

  //////////// Update Strength Bar ////////////
  strengthBar.style.width = `${strength}%`;

  //////////// Strength Levels ////////////
  const levels = [
    { limit: 0, text: "Very Weak", color: "bg-danger" },
    { limit: 40, text: "Weak", color: "bg-danger" },
    { limit: 60, text: "Fair", color: "bg-warning" },
    { limit: 80, text: "Strong", color: "bg-info" },
    { limit: 100, text: "Very Strong", color: "bg-success" },
  ];

  //////////// Determine Strength Level ////////////
  const level = levels.find((level) => strength <= level.limit) || levels[levels.length - 1];
  strengthText.textContent = level.text;
  strengthBar.className = `progress-bar ${level.color}`;

  //////////// Enable Submit Button if Strong Password ////////////
  submitButton.disabled = !(allConditionsMet && strength === 100);
});
