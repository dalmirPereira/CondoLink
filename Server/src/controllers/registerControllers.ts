
interface Resident {
    fullName: string;
    email: string;
    password: string;
    buildingId: number;
    blockId: number;
}

const handleMissingFields = async (newResident: Resident): Promise<string[]> => {

    const missingFields = Object.entries(newResident)
        .filter(([key, value]) => {
            if (value === undefined || value === null) return true;
            if (typeof value === 'string' && value.trim() === '') return true;
            if (key === 'email') {
                const email = value as string;
                if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) { 
                    return true;
                }
            }
        return false;
        })
        .map(([key]) => key);

    return missingFields;
}

module.exports = {
    handleMissingFields,
}