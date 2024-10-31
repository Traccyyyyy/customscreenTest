import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';


class clockInType extends LitElement {

  static styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
    }
    #main {
    display: flex;
     justify-content: center;
      align-items: center;
    }
    .dialog-overlay {
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
    .dialog {
      background-color: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      width: 40%;
      max-width: 400px;
    }
    .dialog h2 {
      text-align: center;
      margin-bottom: 20px;
    }
    .options-container {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    button {
     padding: 15px 20px;
      font-size: 12px;
      color: #333;
      font-weight: bold;
      border: none;
      border-radius: 5px;
      background-color: #90dd90;
\      cursor: pointer;
      transition: background-color 0.3s ease;
    }
    button:hover {
      background-color: #7CCD7C;
    }
    .main-button {
      margin: 20px;
      width:80px;
    }
    .selected-option {
      margin-top: 10px;
      font-style: italic;
    }
  `;
  static properties = {
    _isDialogOpen: { type: Boolean, state: true },
    _selectedOption: { type: String, state: true },
    _clockIn:{type: Boolean},
    eventDetails: { type: Object },
    _error:{ type: String, state: true }
  };
  constructor() {
    super();
    this._isDialogOpen = false;
    this._selectedOption = '';
    this._clockIn= false;
    this.eventDetails= null;
    this._error = '';
  }
  connectedCallback() {
    super.connectedCallback();
    
  }

  disconnectedCallback() {
    super.disconnectedCallback();
 
  }


  _renderDialog() {
    return html`
      <div class="dialog-overlay">
        <div class="dialog">
          <h2>Work Type</h2>
            <div class="options-container">
            <button @click=${() => this._selectOption('Option 1')}>Option 1</button>
            <button @click=${() => this._selectOption('Option 2')}>Option 2</button>
            <button @click=${() => this._selectOption('Option 3')}>Option 3</button>
            </div>
        </div>
      </div>
    `;
  }

  _openDialog() {
    this._isDialogOpen = true;
  }

  _closeDialog() {
    this._isDialogOpen = false;
  }

  _selectOption(option) {
    this._selectedOption = option;
    this._closeDialog();
  }

  logClockIn() {
    if (this._selectedOption !== '') {
      this.eventDetails = { type: 'clockIn', details: `${this._selectedOption}` };
      this.dispatchEvent(new CustomEvent('noahface-log-event', { 
        detail: this.eventDetails,
        bubbles: true, 
        composed: true,
      }));
      
      this._clockIn = true;
      this._error = '';
    } else {
      this._error = 'Please select your work type!';
    }
  }

  render() {
    return html`
    <div id= 'main'>
      <button class="main-button" @click=${this._openDialog}>Work type</button>
      ${this._selectedOption ? html`<p>Selected: ${this._selectedOption}</p>` : ''}
      ${this._isDialogOpen ? this._renderDialog() : ''}
      <button class="main-button" @click=${this.logClockIn}>Clock In</button>
       ${this._error ? html`<p class="error">${this._error}</p>` : ''}
    </div>
      `;
  }
}

customElements.define('clockin-type', clockInType);