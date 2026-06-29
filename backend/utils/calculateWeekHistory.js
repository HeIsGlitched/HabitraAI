function calculateWeekHistory(habits) {

    if (habits.length === 0) {
        return [];
    }

    const weekHistory = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sunday = new Date(today);
    sunday.setDate(sunday.getDate() - sunday.getDay());

    for (let i = 0; i < 7; i++) {

        const currentDay = new Date(sunday);
        currentDay.setDate(sunday.getDate() + i);

        // Future days
        if (currentDay > today) {
            weekHistory.push(null);
            continue;
        }

        const allCompleted = habits.every(function (habit) {

            return habit.completedDates.find(function (date) {

                const d = new Date(date);
                d.setHours(0, 0, 0, 0);

                return d.getTime() === currentDay.getTime();

            });

        });

        weekHistory.push(allCompleted);

    }

    return weekHistory;

}

module.exports = calculateWeekHistory;