/**
 * Converts Control-M "When" scheduling object to human-readable text
 * @param {Object} whenObj - The Control-M When object
 * @returns {string} Human-readable scheduling description
 */
function convertControlMWhenToHuman(whenObj) {
    if (!whenObj || typeof whenObj !== 'object') {
        return "Invalid or empty scheduling configuration";
    }

    const parts = [];
    
    // Handle Schedule parameter
    if (whenObj.Schedule) {
        if (whenObj.Schedule === "Never") {
            return "Job must be ordered manually (no automatic scheduling)";
        } else if (whenObj.Schedule === "Everyday") {
            parts.push("Runs every day");
        }
    }

    // Handle SpecificDates (mutually exclusive with other date parameters)
    if (whenObj.SpecificDates && Array.isArray(whenObj.SpecificDates)) {
        const dates = whenObj.SpecificDates.join(", ");
        parts.push(`Runs only on specific dates: ${dates}`);
    } else {
        // Handle regular date parameters
        const dateParts = [];
        
        // Handle Months
        if (whenObj.Months && Array.isArray(whenObj.Months) && !whenObj.Months.includes("ALL")) {
            if (whenObj.Months.includes("NONE")) {
                // Skip months when NONE is specified
            } else {
                const months = whenObj.Months.join(", ");
                dateParts.push(`in ${months}`);
            }
        }

        // Handle MonthDays
        if (whenObj.MonthDays && Array.isArray(whenObj.MonthDays) && !whenObj.MonthDays.includes("ALL")) {
            if (whenObj.MonthDays.includes("NONE")) {
                // Skip month days when NONE is specified
            } else {
                const days = parseMonthDays(whenObj.MonthDays);
                dateParts.push(`on ${days}`);
            }
        }

        // Handle WeekDays
        if (whenObj.WeekDays && Array.isArray(whenObj.WeekDays) && !whenObj.WeekDays.includes("ALL")) {
            if (whenObj.WeekDays.includes("NONE")) {
                // Skip weekdays when NONE is specified
            } else {
                const weekdays = parseWeekDays(whenObj.WeekDays);
                const relation = whenObj.DaysRelation === "OR" ? "or" : "and";
                if (dateParts.length > 0) {
                    dateParts.push(`${relation} on ${weekdays}`);
                } else {
                    dateParts.push(`on ${weekdays}`);
                }
            }
        }

        if (dateParts.length > 0) {
            parts.push(`Runs ${dateParts.join(" ")}`);
        }
    }

    // Handle time constraints
    const timeParts = [];
    if (whenObj.FromTime) {
        const fromTime = formatTime(whenObj.FromTime);
        timeParts.push(`not before ${fromTime}`);
    }
    if (whenObj.ToTime) {
        if (whenObj.ToTime === ">") {
            timeParts.push("can run after original scheduling date");
        } else {
            const toTime = formatTime(whenObj.ToTime);
            timeParts.push(`not after ${toTime}`);
        }
    }
    
    if (timeParts.length > 0) {
        parts.push(`Time constraints: ${timeParts.join(" and ")}`);
    }

    // Handle date range periods
    if (whenObj.StartDate || whenObj.EndDate) {
        const startDate = whenObj.StartDate ? formatDate(whenObj.StartDate) : "beginning";
        const endDate = whenObj.EndDate ? formatDate(whenObj.EndDate) : "end";
        const activePeriod = whenObj.ActivePeriod !== false; // default is true
        
        if (activePeriod) {
            parts.push(`Active period: ${startDate} to ${endDate}`);
        } else {
            parts.push(`Inactive period: ${startDate} to ${endDate} (job CANNOT run)`);
        }
    }

    // Handle Calendar references
    if (whenObj.MonthDaysCalendar) {
        parts.push(`Uses month days calendar: ${whenObj.MonthDaysCalendar}`);
    }
    if (whenObj.WeekDaysCalendar) {
        parts.push(`Uses week days calendar: ${whenObj.WeekDaysCalendar}`);
    }

    // Handle Confirmation Calendar
    if (whenObj.ConfirmationCalendars) {
        const conf = whenObj.ConfirmationCalendars;
        let confText = `Uses confirmation calendar: ${conf.Calendar}`;
        
        if (conf.ExceptionPolicy) {
            const policyText = {
                "DoNotOrder": "do not order on non-working days",
                "OrderOnNextConfirmedDay": "order on next confirmed working day",
                "OrderOnPreviousConfirmedDay": "order on previous confirmed working day",
                "OrderAnyway": "order anyway on non-working days"
            };
            confText += ` (${policyText[conf.ExceptionPolicy] || conf.ExceptionPolicy})`;
        }
        
        if (conf.ShiftBy && conf.ShiftBy !== "0") {
            const shift = parseInt(conf.ShiftBy);
            const direction = shift > 0 ? "forward" : "backward";
            confText += ` with ${Math.abs(shift)} day(s) shift ${direction}`;
        }
        
        parts.push(confText);
    }

    // Handle Rule-Based Calendars
    if (whenObj.RuleBasedCalendars) {
        const rbc = whenObj.RuleBasedCalendars;
        const rbcParts = [];
        
        if (rbc.Included && Array.isArray(rbc.Included)) {
            if (rbc.Included.includes("USE PARENT")) {
                rbcParts.push("inherits parent folder's rule-based calendars");
            } else {
                rbcParts.push(`includes rule-based calendars: ${rbc.Included.join(", ")}`);
            }
        }
        
        if (rbc.Excluded && Array.isArray(rbc.Excluded)) {
            rbcParts.push(`excludes rule-based calendars: ${rbc.Excluded.join(", ")}`);
        }
        
        if (rbcParts.length > 0) {
            let rbcText = `Rule-based calendars: ${rbcParts.join(" and ")}`;
            if (rbc.Relationship) {
                rbcText += ` (${rbc.Relationship} relationship with other criteria)`;
            }
            parts.push(rbcText);
        }
    }

    return parts.length > 0 ? parts.join(". ") + "." : "No specific scheduling constraints defined";
}

/**
 * Parse month days with special syntax
 */
function parseMonthDays(monthDays) {
    return monthDays.map(day => {
        if (day.startsWith("+")) {
            return `day ${day.substring(1)} (included regardless of calendar)`;
        } else if (day.startsWith("-")) {
            return `day ${day.substring(1)} (excluded regardless of calendar)`;
        } else if (day.startsWith(">")) {
            return `day ${day.substring(1)} or next closest working day`;
        } else if (day.startsWith("<")) {
            return `day ${day.substring(1)} or previous closest working day`;
        } else if (day.startsWith("D")) {
            const num = day.substring(1).replace(/P[A*]?$/, "");
            return `${num}${getOrdinalSuffix(num)} working day of month`;
        } else if (day.startsWith("L")) {
            const num = day.substring(1).replace(/P[A*]?$/, "");
            return `${num}${getOrdinalSuffix(num)} from last working day of month`;
        } else {
            return `day ${day}`;
        }
    }).join(", ");
}

/**
 * Parse week days with special syntax
 */
function parseWeekDays(weekDays) {
    return weekDays.map(day => {
        const cleanDay = day.replace(/^[+\-><]/, "").replace(/^[DL]\d+/, "");
        
        if (day.startsWith("+")) {
            return `${cleanDay} (included regardless of calendar)`;
        } else if (day.startsWith("-")) {
            return `${cleanDay} (excluded regardless of calendar)`;
        } else if (day.startsWith(">")) {
            return `${cleanDay} or next closest working day`;
        } else if (day.startsWith("<")) {
            return `${cleanDay} or previous closest working day`;
        } else if (day.startsWith("D")) {
            const num = day.match(/D(\d+)/)?.[1];
            return `${num}${getOrdinalSuffix(num)} working day of week`;
        } else if (day.startsWith("L")) {
            const num = day.match(/L(\d+)/)?.[1];
            return `${num}${getOrdinalSuffix(num)} from last working day of week`;
        } else if (day.includes("W")) {
            // Handle DdayWn format (e.g., DMONW2)
            const match = day.match(/D(\w+)W(\d+)/);
            if (match) {
                const dayName = match[1];
                const weekNum = match[2];
                return `${dayName} of ${weekNum}${getOrdinalSuffix(weekNum)} week`;
            }
        }
        
        return day;
    }).join(", ");
}

/**
 * Format time from HHMM to human readable
 */
function formatTime(timeStr) {
    if (timeStr.length === 4) {
        const hours = timeStr.substring(0, 2);
        const minutes = timeStr.substring(2, 4);
        return `${hours}:${minutes}`;
    }
    return timeStr;
}

/**
 * Format date from YYYYMMDD to human readable
 */
function formatDate(dateStr) {
    if (dateStr.length === 8) {
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        return `${month}/${day}/${year}`;
    }
    return dateStr;
}

/**
 * Get ordinal suffix for numbers (1st, 2nd, 3rd, etc.)
 */
function getOrdinalSuffix(num) {
    const n = parseInt(num);
    const suffix = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return suffix[(v - 20) % 10] || suffix[v] || suffix[0];
}

// Example usage and test cases:
console.log("=== Control-M When Object Converter Examples ===\n");

// Example 1: Basic date and time constraints
const example1 = {
    "Schedule": "Never",
    "Months": ["JAN", "OCT", "DEC"],
    "MonthDays": ["22", "1", "11"],
    "WeekDays": ["MON", "TUE"],
    "FromTime": "1500",
    "ToTime": "1800"
};

console.log("Example 1 - Basic scheduling:");
console.log(convertControlMWhenToHuman(example1));
console.log();

// Example 2: Specific dates
const example2 = {
    "WeekDays": ["NONE"],
    "Months": ["NONE"],
    "MonthDays": ["NONE"],
    "SpecificDates": ["03/01", "03/10"],
    "FromTime": "1500",
    "ToTime": "1800"
};

console.log("Example 2 - Specific dates:");
console.log(convertControlMWhenToHuman(example2));
console.log();

// Example 3: With confirmation calendar
const example3 = {
    "ConfirmationCalendars": {
        "Calendar": "Holidays",
        "ExceptionPolicy": "OrderOnNextConfirmedDay",
        "ShiftBy": "1"
    }
};

console.log("Example 3 - Confirmation calendar:");
console.log(convertControlMWhenToHuman(example3));
console.log();

// Example 4: Rule-based calendars
const example4 = {
    "RuleBasedCalendars": {
        "Included": ["weekdays"],
        "Excluded": ["endOfQuarter"],
        "Relationship": "AND"
    },
    "Months": ["JAN", "FEB", "MAR"],
    "WeekDays": ["TUE", "WED"]
};

console.log("Example 4 - Rule-based calendars:");
console.log(convertControlMWhenToHuman(example4));
console.log();

// Example 5: Advanced month days syntax
const example5 = {
    "MonthDays": ["1", "+2", "-3", ">4", "<5", "D6", "L7"],
    "MonthDaysCalendar": "Summer2017"
};

console.log("Example 5 - Advanced month days:");
console.log(convertControlMWhenToHuman(example5));
console.log();

// Example 6: Date range with inactive period
const example6 = {
    "StartDate": "20160322",
    "EndDate": "20160325",
    "ActivePeriod": false
};

console.log("Example 6 - Inactive date range:");
console.log(convertControlMWhenToHuman(example6));
console.log();
