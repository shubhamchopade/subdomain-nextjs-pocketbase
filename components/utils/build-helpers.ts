import fs from 'fs';

// generate a random numbers between 1000 and 9999
export function generateRandomNumber(): number {
    return Math.floor(Math.random() * 8999 + 1000);
}
