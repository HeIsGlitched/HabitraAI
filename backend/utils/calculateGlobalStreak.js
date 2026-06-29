function calculateGlobalStreak(habits) {

    if (habits.length === 0) {
        return 0;
    }

    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const completedToday = habits.every(function(habit){

        return habit.completedDates.find(function(date){

            const d = new Date(date);
            d.setHours(0, 0, 0, 0);

            return d.getTime() === currentDate.getTime();

        });

    });

    // If today's habits aren't all completed yet,
    // start checking from yesterday.
    if (!completedToday) {
        currentDate.setDate(currentDate.getDate() - 1);
    }

    let streak = 0;

    while (true) {

        const allCompleted = habits.every(function(habit){

            return habit.completedDates.find(function(date){

                const d = new Date(date);
                d.setHours(0, 0, 0, 0);

                return d.getTime() === currentDate.getTime();

            });

        });

        if (!allCompleted) {
            break;
        }

        streak++;

        currentDate.setDate(currentDate.getDate() - 1);

    }

    return streak;
}

module.exports = calculateGlobalStreak;