function parse(cronExpression) {
    const cronParts = cronExpression.split(' ');

    if (cronParts.length !== 6) {
        throw new Error('Invalid cron expression. It must have 6 parts.');
    }

    const [minute, hour, dayOfMonth, month, dayOfWeek, command] = cronParts;

    const minuteValues = parsePart(minute, 0, 59);
    const hourValues = parsePart(hour, 0, 23);
    const dayOfMonthValues = parsePart(dayOfMonth, 1, 31);
    const monthValues = parsePart(month, 1, 12);
    const dayOfWeekValues = parsePart(dayOfWeek, 1, 7);

    return {
        minute: minuteValues,
        hour: hourValues,
        dayOfMonth: dayOfMonthValues,
        month: monthValues,
        dayOfWeek: dayOfWeekValues,
        command
    };
}

function parsePart(part, minValue, maxValue) {
    if (part === '*') {
        return Array.from({ length: maxValue - minValue + 1 }, (_, i) => i + minValue);
    }

    const values = [];
    const rangeParts = part.split(',');

    rangeParts.forEach(range => {
        if (range.includes('-')) {
            const [start, end] = range.split('-');
            const startValue = parseInt(start, 10);
            const endValue = parseInt(end, 10);
            if(startValue > endValue) {
                throw new Error('Invalid cron expression. Start value cannot be greater than end value');
            } else if(startValue > maxValue || endValue > maxValue) {
                throw new Error('Invalid cron expression. Start value/End value is out of bound');
            }
            for (let i = startValue; i <= endValue; i++) {
                if (i >= minValue && i <= maxValue) {
                    values.push(i);
                }
            }
        } else if (range.includes('/')) {
            const [start, interval] = range.split('/');
            let startValue = 0
            if (start !== "*") {
                startValue = parseInt(start, 10);
                if(startValue > maxValue || parseInt(interval, 10) > maxValue) {
                    throw new Error('Invalid cron expression. Start value/Interval value is out of bound');
                }
            }

            for (let i = startValue; i <= maxValue; i += parseInt(interval, 10)) {
                if (i >= minValue && i <= maxValue) {
                    values.push(i);
                }
            }
        } else {
            const value = parseInt(range, 10);
            if (!isNaN(value) && value >= minValue && value <= maxValue) {
                values.push(value);
            } else {
                throw new Error('Invalid cron expression. Range out of bound');            
            }
        }
    });

    return values;
}

function formatOutput(cronData) {
    let printStatements = []
    try {
        printStatements.push('Minutes: ' + cronData.minute.join(' '));
        printStatements.push('Hours: '+ cronData.hour.join(' '));
        printStatements.push('Day of Month: ' + cronData.dayOfMonth.join(' '));
        printStatements.push('Month: ' + cronData.month.join(' '));
        printStatements.push('Day of Week: ' + cronData.dayOfWeek.join(' '));
        printStatements.push('Command: ' + cronData.command);
        return printStatements.join("\n")
    } catch (e) {
        console.error(e.message);
    }
}

module.exports = { parse, formatOutput }

