const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

interface AccessTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

let cachedToken: { token: string; expires: number } | null = null;

export async function getSpotifyAccessToken(): Promise<string> {
    // Return cached token if it's still valid
    if (cachedToken && Date.now() < cachedToken.expires) {
        return cachedToken.token;
    }

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                Authorization: `Basic ${basic}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'grant_type=client_credentials',
        });

        if (!response.ok) {
            throw new Error('Failed to get Spotify access token');
        }

        const data: AccessTokenResponse = await response.json();
        
        // Cache the token with expiration
        cachedToken = {
            token: data.access_token,
            expires: Date.now() + (data.expires_in * 1000) - 60000, // Subtract 1 minute for safety
        };

        return data.access_token;
    } catch (error) {
        console.error('Error getting Spotify access token:', error);
        throw error;
    }
}
