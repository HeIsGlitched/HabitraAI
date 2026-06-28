function calculateStreak(completedDates){
    if(completedDates.length === 0){
        return 0;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dates = completedDates.map(function(date){
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
    });
    dates.sort(function(a, b){
        return b - a;
    });

    const completedToday = dates.find(function(date){
        return date.getTime() === today.getTime();
    });

    if(!completedToday){
        return 0;
    }

    let streak = 1;
    let currentDate = new Date(today);
    
    while(true){
    
        currentDate.setDate(currentDate.getDate() - 1);
    
        const found = dates.find(function(date){
            return date.getTime() === currentDate.getTime();
        });
    
        if(found){
            streak++;
        }
        else{
            break;
        }
    
    }
    
    return streak;
}

module.exports = calculateStreak;