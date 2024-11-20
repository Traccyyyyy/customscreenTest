import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import {NoahFaceHandler} from '../service/noahface-handler.js';

class ClockOut extends LitElement {
  static properties = {
    _clockedIn: { type: Boolean, state: true },
    _error:{type:String, state:true}
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
      .popup-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .popup-error {
      background-color: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      width: 40%;
      max-width: 400px;
    }
  `;

  constructor() {
    super();
    this._clockedIn = false;
    this._error = '';
    this.noahFaceHandler = new NoahFaceHandler(); 
  }

  render() {
    return html`
    <div>
        <button @click=${this.handleClockOut}>Clock Out</button>
    </div>
      ${this._error ? this._renderError():''}
    `;
  }

  handleClockOut() {
    if(this._clockedIn){
      this.dispatchEvent(new CustomEvent('noahface-log-event', { 
        detail: { 
          type: 'clockout',  // Changed to lowercase to match the event listener
          details: 'User clocked out' // Added details to match the format
        },
        bubbles: true, 
        composed: true
      }));
      this.noahFaceHandler.logEvent('clockout', `User clocked out`);
      this._clockedIn = false;
      console.log(`You have clocked out.`);
    }
      else {
        this.setError(`You haven't clocked in.`);
        return;
      }
  }
  _renderError (){
    return html`
    <div class="popup-overlay">
      <div class="popup-error">
        ${this._error}
      </div>
    </div>
  ` ;
  }
  setError(message) {
    this._error = message;
    if (message) {
      setTimeout(() => {
        this._error = '';
      }, 2000); // Error will disappear after 3 seconds
    }
  }
    

}

customElements.define('clock-out', ClockOut);