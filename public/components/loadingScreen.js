class LoadingScreen extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="loading-overlay w-100 h-100 d-flex justify-content-center align-items-center">
        <div class="spinner-wrapper">
          <div class="spinner-border" role="status" style="--bs-spinner-border-width: 0.3rem; width: 4rem; height: 4rem;">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3 text-white">Loading, please wait...</p>
        </div>
      </div>
    `;
  }
}

customElements.define("loading-screen", LoadingScreen);
