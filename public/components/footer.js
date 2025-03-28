class Footer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <footer class="bg-white text-dark py-3 border-top shadow-sm">
        <div class="container">
          <div class="row align-items-center">
            <!-- Logo and Branding -->
            <div class="col-12 col-md-4 text-center text-md-start mb-3 mb-md-0">
              <a href="home.html">
                <img src="assets/img/logo.png" alt="Galactic Explorers Logo" class="img-fluid" style="max-width: 120px;" />
              </a>
              <p class="mt-2 small">Created by <strong>Balamurugan Siddhartha</strong> for BED CA2!</p>
            </div>
            
            <!-- Social Media Links -->
            <div class="col-12 col-md-8 text-md-end">
              <div class="d-flex justify-content-md-end gap-3">
                <a href="https://github.com/BalamuruganSiddhartha" target="_blank" class="text-dark">
                  <i class="bi bi-github fs-4"></i>
                </a>
                <a href="https://linkedin.com/in/balamurugan-siddhartha" target="_blank" class="text-dark">
                  <i class="bi bi-linkedin fs-4"></i>
                </a>
              </div>
              <p class="small mb-0">&copy; 2025 Galactic Explorers. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    `;
  }
}

// Define the custom element
customElements.define("app-footer", Footer);
