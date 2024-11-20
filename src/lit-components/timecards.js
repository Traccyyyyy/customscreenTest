import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import { PayPeriodService } from '../service/payPeriodCalculator.js';
import { DateFormatter } from '../formatter/DateFormatter.js';

export class WorkedHours extends LitElement {
    static properties = {
        data: { type: Array },
        currentPeriodData: { type: Array },
        dates: { type: Object },
        referenceDate: { type: String },
        editingEvent: { type: Object },
        isCustomPeriod: { type: Boolean },
        customStartDate: { type: String },
        customEndDate: { type: String }
    };

    static styles = css`
        .date-display {
            padding: 1rem;
            border-radius: 4px;
     
        }
        h3 {
            padding: 0 1rem;
            margin:0.5rem 0 0;
            // background: #f5f5f5;

        }
        .event-row {
            display: grid;
            grid-template-columns: 600px 1fr;
            align-items: center;
            padding: 1rem;
            border-bottom: 1px solid #eee;
        }
        .event-item {
            display: grid;
            grid-template-columns: 1fr 1fr 3fr;
            gap: 1rem;
            padding: 0.5rem;
        }
    .period-selector {
        padding: 1rem;
        margin-bottom: 1rem;
        background: #f5f5f5;
        border-radius: 4px;
      }
    
    .date-inputs {
        display: grid;
        gap: 1rem;
        max-width: 400px;
      }

    .detail-form {
        padding: 15px;
        background: #f5f5f5;
        border-radius: 4px;
        margin: 5px 0;
     }
     .date-inputs label {
         display: grid;
         grid-template-columns: 35px 1fr;
         align-items: center;
         gap: 1rem;
     }
 
     input[type="date"] {
         padding: 2px;
         border-radius: 4px;
         border: 1px solid #ddd;
         width: 150px;
     }
         
    button {
        background: rgba(41, 160, 177, 0.7);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        max-width:150px;
      }




`;
            
    

    constructor() {
        super();
        this.data = [];
        this.currentPeriodData = [];
        this.referenceDate = '2024-01-15';
        this.dates = null;
        this.editingEvent = null;
        this.isCustomPeriod = false;
        this.customStartDate = '';
        this.customEndDate = '';
        this.handleDataFetched = this.handleDataFetched.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();
        this.calculateDates();
        document.addEventListener('dataFetched', this.handleDataFetched);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('dataFetched', this.handleDataFetched);
    }

    calculateDates() {
        console.log('calculation trigged');
        if (this.isCustomPeriod) {
            // Add defensive checks
            const defaultPeriod = PayPeriodService.getCurrentPeriod(this.referenceDate);
            if (!this.customStartDate ) {
                // Initialize with current period dates if no custom dates set
                this.customStartDate = defaultPeriod.start.toISOString().split('T')[0];
            }
            if (!this.customEndDate) {
                // Initialize with current period dates if no custom dates set
                this.customEndDate = defaultPeriod.end.toISOString().split('T')[0];
            }
    
            this.dates = {
                start: new Date(this.customStartDate + 'T00:00:00'),
                end: new Date(this.customEndDate + 'T23:59:59'),
                current: new Date()
            };
            console.log('calculated', this.dates.start);
        } else {
            this.dates = PayPeriodService.getCurrentPeriod(this.referenceDate);
        }
    }

    handleDataFetched(event) {
        const fetchedData = event.detail.Timecards;
        this.data = fetchedData.map(item => ({
            ...item,
            time: item.timecard.date
          }));

        console.log('this.data',this.data);
        this.filterCurrentPeriodEvents();
        this.requestUpdate();
    }

    filterCurrentPeriodEvents() {
        this.currentPeriodData = PayPeriodService.filterEventsForPeriod(
            this.data,
            this.dates
        );
        console.log('filter triggered dates',this.dates);
        console.log('filter triggered data',this.data);
    }

    confirmCustomPeriod() {
        this.isCustomPeriod = !this.isCustomPeriod;
        this.calculateDates();
        this.filterCurrentPeriodEvents();
    }

    handleDateChange(type, e) {
        if (type === 'start') {
            this.customStartDate = e.target.value;
            console.log(this.customStartDate);
        } else {
            this.customEndDate = e.target.value;
            console.log(this.customEndDate);
        }
        if (this.isCustomPeriod) {
            this.calculateDates();
            this.filterCurrentPeriodEvents();
        }
    }

    renderPeriodSelector() {
        if (!this.dates || !this.dates.start || !this.dates.end) {
            return html`<div>Loading...</div>`;
        }
    
        const startDate = this.dates.start instanceof Date 
            ? this.dates.start.toISOString().split('T')[0]
            : new Date(this.dates.start).toISOString().split('T')[0];
    
        const endDate = this.dates.end instanceof Date
            ? this.dates.end.toISOString().split('T')[0]
            : new Date(this.dates.end).toISOString().split('T')[0];
    
        return html`
        <h3>Timesheet Period</h3>
            <div class="period-selector">
                <div class="date-inputs">
                    <label>
                        Start:
                        <input type="date" 
                            .value=${startDate}
                            @change=${(e) => this.handleDateChange('start', e)}
                        >
                    </label>
                    <label>
                        End:
                        <input type="date"
                            .value=${endDate}
                            @change=${(e) => this.handleDateChange('end', e)}
                        >
                    </label>
                    <button @click=${this.confirmCustomPeriod}>
                        Confirm
                    </button>
                </div>
            </div>
        `;
    }

    render() {
        if (!this.dates) {
            return html`<div>Loading...</div>`;
        }

        return html`

        ${this.renderPeriodSelector()}
            <h3>Worked Hours:</h3>
            ${this.currentPeriodData.length === 0
                ? html`<p>No events for this period</p>`
                : html`
                    <div class="events-container">
                        ${this.currentPeriodData.map((item) => html`
                            <div class="event-row">
                                <div class="event-item">
                                    <span>${item.timecard.date.toLocaleString()}</span>
                                    <span>${item.timecard.totalHours.totalWorkHours}</span> 
                                </div> 
                            </div>

                        `)}
                    </div>
                `}
        `;
    }

}


customElements.define('worked-hours', WorkedHours);