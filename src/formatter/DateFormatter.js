
import { format } from 'https://cdn.skypack.dev/date-fns';

export class DateFormatter {
    static formatPeriodDate(date) {
        if (!date) return '';
        return format(new Date(date), 'PPP p');
    }

    static formatShortDate(date) {
        if (!date) return '';
        return format(new Date(date), 'PP');
    }
}