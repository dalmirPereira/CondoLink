
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

function isMissing(value: any): boolean {
  if (value === null || value === undefined) return true; // null or undefined is missing
  if (typeof value === 'string') return value.trim() === ''; // empty string is missing
  if (typeof value === 'number') return isNaN(value); // NaN is missing
  return false; // assume all other types are OK
}

module.exports = {
    handleMissingFields,
    isMissing
}