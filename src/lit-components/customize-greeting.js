import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

export class customizeGreeting extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 20px;
      background-color: #ddffe7;
      text-align:center;
      border-radius: 10px;
    }
    p {
      color: #4a6f75;
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
    // const { firstname, lastname, org, site, temperature, elevated, eventtype, eventtime, eventdetails } = this.noahFaceData;

    return html`
        <h1>${this.greeting}, ${window.NoahFace.firstname || 'Guest'}!</h1>
       ${this.showFullName && firstname ? html`<p>First Name: ${window.NoahFace.firstname}</p>
        <p>Last Name: ${lastname}</p>`:''}
      ${this.showOrg && org ? html`<p>Organization: ${org}</p>` : ''}
      ${this.showSite && site ? html`<p>Site: ${site}</p>` : ''}
      ${this.showTemperature && temperature ? html`
        <p class="temperature">
          Your temperature: ${temperature}°C
          ${elevated === 'true' ? html`<span class="elevated"> (Elevated)</span>` : ''}
        </p>
      ` : ''}
      ${this.showLastEvent && window.NoahFace?.eventtype != null ? html`
        <p>Last event: ${window.NoahFace.eventtype || ''} at ${window.NoahFace.eventtime || ''} ${window.NoahFace.eventdetails || ''} ${window.NoahFace.firstname || ''}</p>
    ` : ''}

                ${eventtime ? html`
                    <p><strong>Last Event Time:</strong> ${eventtime}</p>
                    <p><strong>Event Type:</strong> ${type}</p>
                    <p><strong>Details:</strong> ${details}</p>
                ` : ''}      
     
      `;
      // <pre> ${JSON.stringify(this.noahFace, null, 2)})</pre> 
    }
}

customElements.define('customize-greeting', customizeGreeting);