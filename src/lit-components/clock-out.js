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
      padding: 10px 3px;
      font-size: 10px;
      color: #333;
      font-weight: bold;
      border: none;
      border-radius: 5px;
      background-color:#98d7c2;
      cursor: pointer;
      transition: background-color 0.3s ease;
      margin: 10px;
      width:40px;
    }
    button:hover {
      background-color: #7bb9a5;
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
    if(this.clockedIn){
      this.dispatchEvent(new CustomEvent('noahface-log-event', { 
        detail: { type:'clockOut'},
        bubbles: true, 
        composed: true
      }));
  
      this._clockedIn = false;
      console.log(`You have clock out.`);
    }
      else {
        console.log(`You haven't clock in.`);
      }
  }

    

}

customElements.define('clock-out', ClockOut);