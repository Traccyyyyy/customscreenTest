import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

export class NavMenu extends LitElement {
  static properties = {
    isOpen: { type: Boolean, state: true }
  };

  static styles = css`
  .nav-container {
    position: fixed;    
    top:20px;           
    right: 20px;          
    z-index: 1000;
    height:10px;
  }

    .menu-icon {
    position: fixed;    
    top:20px;           
    right: 20px;          
    z-index: 1000;
      cursor: pointer;
      font-size: 28px;
      background: rgba(41, 160, 177, 0.7);
      border: none;
      padding: auto;
      border-radius: 8px;
      box-shadow: 0 2px 1px rgba(41, 160, 177, 0.2);
      color:white;
    }

  .nav-menu {
    position: absolute;
    top: 60px;
    right: 0;
    background: white;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    padding: 20px;
    display: none;
    border-radius: 5px;
    color: #ddffe7;
  }

  .nav-menu.open {
    display: block;
  }

  .nav-menu a {
    display: block;
    padding: 10px;
    text-decoration: none;
    color: #333;
    // color: #29a0b1;
    white-space: nowrap;
  }

  .nav-menu a:hover {
    background: rgba(41, 160, 177, 0.1);
  }
`;


  constructor() {
    super();
    this.isOpen = false;
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  render() {
    return html`
      <div class="nav-container">
        <button class="menu-icon" @click=${this.toggleMenu}>☰</button>
        <nav class="nav-menu ${this.isOpen ? 'open' : ''}">
          <a href="index.html">Home</a>
          <a href="events.html">Recent Events</a>
          <a href="timecard.html">Timecards</a>
          <a href="user-profile.html">Profile</a>

        </nav>
      </div>
    `;
  }
}

customElements.define('nav-menu', NavMenu);