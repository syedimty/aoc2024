/**
 * Converts ControlM RerunLimit object to human-readable format
 * @param {Object} rerunLimit - The RerunLimit object from ControlM
 * @param {string|number} rerunLimit.Every - Frequency number (default: 1)
 * @param {string} rerunLimit.Units - Time unit: "Minutes", "Hours", or "Days" (default: "Minutes")
 * @param {string|number} rerunLimit.Times - Maximum reruns (default: 0 = unlimited)
 * @returns {string} Human-readable description of the rerun configuration
 */
function convertRerunLimitToHuman(rerunLimit) {
    // Handle null/undefined input
    if (!rerunLimit || typeof rerunLimit !== 'object') {
        return "No rerun limit configured";
    }

    // Extract values with defaults
    const every = parseInt(rerunLimit.Every) || 1;
    const units = rerunLimit.Units || "Minutes";
    const times = parseInt(rerunLimit.Times) || 0;

    // Normalize units for readability
    const normalizedUnits = units.toLowerCase();
    let unitText;
    
    if (every === 1) {
        // Singular form
        switch (normalizedUnits) {
            case 'minutes':
                unitText = 'minute';
                break;
            case 'hours':
                unitText = 'hour';
                break;
            case 'days':
                unitText = 'day';
                break;
            default:
                unitText = units.toLowerCase();
        }
    } else {
        // Plural form
        unitText = normalizedUnits;
    }

    // Build frequency description
    let frequencyText = `every ${every} ${unitText}`;
    if (every === 1 && normalizedUnits === 'minutes') {
        frequencyText = 'every minute';
    }

    // Build times description
    let timesText;
    if (times === 0) {
        timesText = 'unlimited times';
    } else if (times === 1) {
        timesText = 'once';
    } else {
        timesText = `${times} times`;
    }

    return `Rerun ${frequencyText}, maximum ${timesText}`;
}

/**
 * Enhanced version that provides more detailed information
 * @param {Object} rerunLimit - The RerunLimit object from ControlM
 * @returns {Object} Detailed breakdown of the rerun configuration
 */
function convertRerunLimitToDetailedHuman(rerunLimit) {
    if (!rerunLimit || typeof rerunLimit !== 'object') {
        return {
            summary: "No rerun limit configured",
            frequency: "Not set",
            maxReruns: "Not set",
            isUnlimited: false
        };
    }

    const every = parseInt(rerunLimit.Every) || 1;
    const units = rerunLimit.Units || "Minutes";
    const times = parseInt(rerunLimit.Times) || 0;

    const normalizedUnits = units.toLowerCase();
    const isUnlimited = times === 0;

    // Calculate total duration if limited
    let totalDuration = "";
    if (!isUnlimited) {
        const totalMinutes = every * times * (
            normalizedUnits === 'minutes' ? 1 :
            normalizedUnits === 'hours' ? 60 :
            normalizedUnits === 'days' ? 1440 : 1
        );
        
        if (totalMinutes >= 1440) {
            const days = Math.floor(totalMinutes / 1440);
            const hours = Math.floor((totalMinutes % 1440) / 60);
            totalDuration = `${days} day${days !== 1 ? 's' : ''}${hours > 0 ? ` and ${hours} hour${hours !== 1 ? 's' : ''}` : ''}`;
        } else if (totalMinutes >= 60) {
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            totalDuration = `${hours} hour${hours !== 1 ? 's' : ''}${minutes > 0 ? ` and ${minutes} minute${minutes !== 1 ? 's' : ''}` : ''}`;
        } else {
            totalDuration = `${totalMinutes} minute${totalMinutes !== 1 ? 's' : ''}`;
        }
    }

    const summary = convertRerunLimitToHuman(rerunLimit);
    
    return {
        summary: summary,
        frequency: `Every ${every} ${normalizedUnits}`,
        maxReruns: isUnlimited ? "Unlimited" : times.toString(),
        isUnlimited: isUnlimited,
        totalDuration: totalDuration,
        details: {
            every: every,
            units: units,
            times: times
        }
    };
}

// Example usage and test cases
console.log("=== Basic Examples ===");

// Example from documentation: run 5 times, once every 3 hours
const example1 = { "Every": "3", "Units": "Hours", "Times": "5" };
console.log("Example 1:", convertRerunLimitToHuman(example1));

// Default case (every minute, unlimited)
const example2 = {};
console.log("Example 2 (defaults):", convertRerunLimitToHuman(example2));

// Every day, 10 times
const example3 = { "Every": "1", "Units": "Days", "Times": "10" };
console.log("Example 3:", convertRerunLimitToHuman(example3));

// Every 30 minutes, unlimited
const example4 = { "Every": "30", "Units": "Minutes", "Times": "0" };
console.log("Example 4:", convertRerunLimitToHuman(example4));

console.log("\n=== Detailed Examples ===");

console.log("Detailed Example 1:", convertRerunLimitToDetailedHuman(example1));
console.log("Detailed Example 3:", convertRerunLimitToDetailedHuman(example3));

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        convertRerunLimitToHuman,
        convertRerunLimitToDetailedHuman
    };
}
