function calculateStreak(completedDates) {

    if (completedDates.length === 0) {
        return 0;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dates = completedDates.map(function(date) {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
    });

    dates.sort(function(a, b) {
        return b - a;
    });

    let currentDate = new Date(today);

    const completedToday = dates.find(function(date) {
        return date.getTime() === today.getTime();
    });

    // NEW: If today isn't completed, start counting from yesterday
    if (!completedToday) {
        currentDate.setDate(currentDate.getDate() - 1);
    }

    let streak = 0;

    while (true) {

        const found = dates.find(function(date) {
            return date.getTime() === currentDate.getTime();
        });

        if (!found) {
            break;
        }

        streak++;

        currentDate.setDate(currentDate.getDate() - 1);

    }

    return streak;
}
module.exports = calculateStreak;