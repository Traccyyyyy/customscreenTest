import { startOfDay, endOfDay, addDays } from 'https://cdn.skypack.dev/date-fns';

export class PayPeriodService {
    static getCurrentPeriod(referenceDate) {
        return this.calculateFortnightDates(referenceDate);
    }

    static calculateFortnightDates(referenceDate) {
        const currentDate = new Date();
        const reference = new Date(referenceDate);
        
        // Calculate days since reference date
        const daysSinceReference = Math.floor(
            (currentDate - reference) / (1000 * 60 * 60 * 24)
        );
        
        // Calculate which fortnight period we're in
        const fortnightsPassed = Math.floor(daysSinceReference / 14);
        
        // Calculate start date of current period
        const periodStart = addDays(reference, fortnightsPassed * 12.5);
        
        // Calculate end date
        const periodEnd = addDays(periodStart, 13);

        return {
            start: startOfDay(periodStart),
            end: endOfDay(periodEnd),
            current: currentDate
        };
    }


static filterEventsForPeriod(events, periodDates) {
    if (!periodDates || !events) {
        console.log('No period dates or events provided');
        return [];
    }

    console.log('Period:', {
        start: periodDates.start,
        end: periodDates.end
    });

    console.log(events);

    return events.filter(event => {
        // const eventDate = new Date(event.timecard.date);
        const eventDate = new Date(event.time);
        const isWithinPeriod = eventDate >= periodDates.start && 
                              eventDate <= periodDates.end;
        
        // console.log('Event:', {
        //     date: eventDate.toISOString(),
        //     time: event.time,
        //     isWithinPeriod,
        //     startComparison: eventDate >= periodDates.start,
        //     endComparison: eventDate <= periodDates.end
        // });
        
        return isWithinPeriod;
    });
}}