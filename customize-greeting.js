import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

export class customizeGreeting extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
      padding: 20px;
      background-color: #f0f0f0;
      border-radius: 8px;
    }
    h1 {
      text-align:center;
      color: #333;
      margin-bottom: 10px;
    }
    p {
      color: #666;
      margin: 5px 0;
      text-align:center;
    }
    .temperature {
      font-weight: bold;
    }
    .elevated {
      color: red;
    }
  `;

  static properties = {
    noahFaceData: { type: Object },
    greeting: { type: String },
    showGreeting: { type: Boolean },
    showFullName: { type: Boolean },
    showOrg: { type: Boolean },
    showSite: { type: Boolean },
    showTemperature: { type: Boolean },
    showLastEvent: { type: Boolean },
  };

  constructor() {
    super();
    this.noahFaceData = {};
    this.greeting = '';
    this.showGreeting = true;
    this.showFullName = false;
    this.showOrg = false;
    this.showSite = true;
    this.showTemperature = false;
    this.showLastEvent = true;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadNoahFaceData();
    this.setGreeting();
  }

  loadNoahFaceData() {
    if (typeof NoahFace !== 'undefined') {
      this.noahFaceData = { ...NoahFace };

    } else {
      console.warn('NoahFace data not available');
    }
  }

  setGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) {
      this.greeting = 'Good morning';
    } else if (hour < 18) {
      this.greeting = 'Good afternoon';
    } else {
      this.greeting = 'Good evening';
    }
  }

  render() {
    const { firstname, lastname, org, site, temperature, elevated, type, eventtime, details } = this.noahFaceData;

    return html`
      ${this.showGreeting ? html`<h1>${this.greeting}, ${firstname || 'Guest'}${this.showFullName && lastname ? ` ${lastname}` : ''}!</h1>` : ''}
      ${this.showOrg && org ? html`<p>Organization: ${org}</p>` : ''}
      ${this.showSite && site ? html`<p>Site: ${site}</p>` : ''}
      ${this.showTemperature && temperature ? html`
        <p class="temperature">
          Your temperature: ${temperature}°C
          ${elevated === 'true' ? html`<span class="elevated"> (Elevated)</span>` : ''}
        </p>
      ` : ''}
      ${this.showLastEvent && type !==null ? html`
        <p>Last event: ${type} at ${eventtime} ${details}</p>
      ` : ''}
     
      `;
      // <pre> ${JSON.stringify(this.noahFace, null, 2)})</pre> 
    }
}

customElements.define('customize-greeting', customizeGreeting);