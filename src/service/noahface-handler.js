import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';


// NoahFaceHandler Component
export class NoahFaceHandler extends LitElement {
  static properties = {
    firstName: { type: String },
  };

  constructor() {
    super();
    this.firstName = '';
    this.setupMessageHandler();
  }

  setupMessageHandler() {
    if (typeof window.webkit !== 'undefined' && window.webkit.messageHandlers && window.webkit.messageHandlers.NoahFace) {
      // Real NoahFace environment
      this.noahFace = window.webkit.messageHandlers.NoahFace;
    } else {
      // Mock NoahFace for development/testing
      this.noahFace = {
        postMessage: (message) => {
          console.log('Mock NoahFace message:', message);
          // Simulate response
          if (message.action === 'getuser') {
            this.handleUserInfo({ firstname: 'John' });
          }
        }
      };
    }

    // Request user info
    // this.noahFace.postMessage({ action: 'getuser' });
  }

  handleUserInfo(userInfo) {
    this.firstName = userInfo.firstname;
    this.dispatchEvent(new CustomEvent('noahface-user-update', { 
      detail: { firstName: this.firstName },
      bubbles: true, 
      composed: true 
    }));
  }

  logEvent(type, details) {
    this.noahFace.postMessage({ action: 'logevent', type, details });
    this.noahFace.postMessage({ action: 'success' });
    this.dispatchEvent(new CustomEvent('noahface-log-event', { 
      detail: { type, details },
      bubbles: true, 
      composed: true 
    }));
  }

  render() {
    // This component doesn't render anything visible
    return html``;
  }
}

customElements.define('noahface-handler', NoahFaceHandler);