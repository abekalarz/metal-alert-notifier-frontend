class SuccessPopup extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});

    this.timeoutId = null;

    this.shadowRoot.innerHTML = `
      <style>
        .popup {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #24860f;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-family: Helvetica, Arial;
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
        }

        .visible {
          opacity: 1;
        }
      </style>
      <div class="popup" id="popup">✅ <span id="message"></span></div>
    `;
  }

  show(message) {
    const popup = this.shadowRoot.getElementById('popup');
    const messageSpan = this.shadowRoot.getElementById('message');

    messageSpan.textContent = message;
    popup.classList.add('visible');

    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      popup.classList.remove('visible');
    }, 3000);
  }
}

customElements.define('success-popup', SuccessPopup);
