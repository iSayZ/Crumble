function calculateElapsedTime(dateJson) {
    const date = new Date(dateJson);
    const now = new Date();
    const difference = now - date;

    if (difference < 1000) {  
        return "à l'instant";
    } 
    
    if (difference < 60 * 1000) {  
        const seconds = Math.floor(difference / 1000);
        return `il y a ${seconds} ${seconds > 1 ? 'secondes' : 'seconde'}`;
    } 
    
    if (difference < 60 * 60 * 1000) {  
        const minutes = Math.floor(difference / (60 * 1000));
        return `il y a ${minutes} ${minutes > 1 ? 'minutes' : 'minute'}`;
    } 
    
    if (difference < 24 * 60 * 60 * 1000) {  
        const hours = Math.floor(difference / (60 * 60 * 1000));
        return `il y a ${hours} ${hours > 1 ? 'heures' : 'heure'}`;
    } 
    
    if (difference < 30 * 24 * 60 * 60 * 1000) {  
        const days = Math.floor(difference / (24 * 60 * 60 * 1000));
        return `il y a ${days} ${days > 1 ? 'jours' : 'jour'}`;
    }
    
    const months = Math.floor(difference / (30 * 24 * 60 * 60 * 1000));  
    return `il y a ${months} mois`;
}

export default calculateElapsedTime;