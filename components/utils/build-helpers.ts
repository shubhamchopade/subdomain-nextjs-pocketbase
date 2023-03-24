
// generate a random numbers between 1000 and 9999
export function generateRandomNumber(): number {
    return Math.floor(Math.random() * 8999 + 1000);
}

export const getRepos = async (username: string) => {
    const res = await fetch(
        `https://api.github.com/users/${username}/repos`
    );
    const repos = await res.json();
    return repos;
};


