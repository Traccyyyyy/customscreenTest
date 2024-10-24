import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';


class ClockOut extends LitElement {
  static properties = {
    _clockedIn: { type: Boolean, state: true }
  };

  static styles = css`
      :host {
      display: block;
      font-family: Arial, sans-serif;
    }
    button {
     padding: 15px 20px;
      font-size: 12px;
      color: #333;
      font-weight: bold;
      border: none;
      border-radius: 5px;
      background-color: #90dd90;
      cursor: pointer;
      transition: background-color 0.3s ease;
    margin: 20px;
        width:80px;
    }
  `;

  constructor() {
    super();
    this._clockedIn = false;
  }

  render() {
    return html`
    <div>
        <button @click=${this.handleClockOut}>Clock Out</button>
    </div>
    `;
  }

  handleClockOut() {
    
    this.dispatchEvent(new CustomEvent('noahface-log-event', { 
      detail: { type:'clockOut', details },
      bubbles: true, 
      composed: true
    }));

    this._clockedIn = false;
  }
}

customElements.define('clock-out', ClockOut);