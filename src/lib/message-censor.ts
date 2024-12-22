import { badWords } from '@/lib/bad-words';

export function censorMessage(message: string): boolean {

    // Trim whitespace and convert to lowercase for consistent checking
    const trimmedName = message.trim().toLowerCase();

    // Check if the name is empty after trimming
    if (trimmedName.length === 0) {
        return false;
    }

    // Check if the name exceeds the maximum length
    if (trimmedName.length > 50) {
        return false;
    }

    // Updated regular expression to allow only letters, spaces, hyphens, and apostrophes
    const namePattern = /^[a-z]+(?:['']?[a-z]+)*(?:[ -][a-z]+(?:['']?[a-z]+)*)*$/i;

    // Check if the name matches the pattern
    if (!namePattern.test(trimmedName)) {
        return false;
    }

    // Split the name into words, considering spaces and hyphens as separators
    const words = trimmedName.split(/[ -]+/);

    // Check if any word in the name is in the bad words list
    if (words.some(word => badWords.includes(word.replace(/['']/, '')))) {
        return false;
    }

    // If all checks pass, return true
    return true;
}
