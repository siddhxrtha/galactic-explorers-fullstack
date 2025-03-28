class NavBar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    /////////////////////////////
    // Navbar Structure
    /////////////////////////////
    this.innerHTML = `
    <nav class="navbar sticky-top navbar-expand-lg navbar-light bg-white shadow-sm">
      <div class="container">
        <!-- Logo -->
        <a class="navbar-brand" href="home.html">
          <img src="assets/img/logo.png" alt="Galactic Explorers Logo" height="60" />
        </a>
        <!-- Toggler for mobile view -->
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <!-- Left Navbar Links -->
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a id="home-link" class="nav-link position-relative" href="home.html">Home</a>
            </li>
            <li class="nav-item">
              <a id="fitness-link" class="nav-link position-relative" href="fitness.html">Fitness Challenges</a>
            </li>
            <li class="nav-item">
              <a id="marketplace-link" class="nav-link position-relative" href="marketplace.html">Marketplace</a>
            </li>
            <li class="nav-item">
              <a id="explore-link" class="nav-link position-relative" href="explore.html">Explore</a>
            </li>
            <li class="nav-item">
              <a id="guilds-link" class="nav-link position-relative" href="guilds.html">Guilds</a>
            </li>
            <li class="nav-item">
              <a id="review-link" class="nav-link position-relative" href="review.html">Reviews</a>
            </li>
          </ul>
          <!-- Right Navbar Links -->
          <ul class="navbar-nav ms-auto">
            <li class="nav-item d-none" id="skillpointsPill">
              <span class="badge bg-warning text-black mx-2 p-2" id="skillpointsDisplay">Skillpoints: 0</span>
            </li>
            <li class="nav-item d-none" id="loginButton">
              <a class="btn btn-outline-primary btn-sm mx-1" href="login.html">Login</a>
            </li>
            <li class="nav-item d-none" id="registerButton">
              <a class="btn btn-warning btn-sm mx-1" href="register.html">Register!</a>
            </li>
            <li class="nav-item d-none" id="profileButton">
              <a class="btn btn-outline-success btn-sm mx-1" href="profile.html">Profile</a>
            </li>
            <li class="nav-item d-none" id="logoutButton">
              <a class="btn btn-danger btn-sm mx-1" href="#" role="button" aria-label="Logout">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    `;    

    /////////////////////////////
    // Highlight Active Link
    /////////////////////////////
    this.highlightActiveLink();
  }

  /////////////////////////////
  // Function: Highlight Active Link
  /////////////////////////////
  highlightActiveLink() {
    const currentPath = window.location.pathname.split("/").pop(); // Gets current page
    const links = this.querySelectorAll(".nav-link"); // Selects all nav links

    links.forEach((link) => {
      if (link.getAttribute("href") === currentPath) {
        link.classList.add("active"); // Highlights current page link
      } else {
        link.classList.remove("active"); // Removes highlight from other links
      }
    });
  }
}

/////////////////////////////
// Define Custom Element
/////////////////////////////
customElements.define("nav-bar", NavBar);
