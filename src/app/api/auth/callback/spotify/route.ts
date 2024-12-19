import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
    try {
        // Get the authorization code and state from URL parameters
        const searchParams = request.nextUrl.searchParams;
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        
        // Get state from cookies instead of localStorage
        const storedState = request.cookies.get('spotify_auth_state')?.value;
        if (state !== storedState) {
            return NextResponse.redirect(
                new URL(`/?error=state_mismatch`, request.url)
            );
        }
        
        // Exchange code for access token
        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(
                    `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
                ).toString('base64')
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code!,
                redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!,
            })
        });

        const tokenData = await tokenResponse.json();

        // Create response with redirect
        const response = NextResponse.redirect(
            new URL(`/?success=true`, request.url)
        );

        // Store the tokens in cookies
        response.cookies.set('spotify_access_token', tokenData.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 // 7 days in seconds
        });
        
        if (tokenData.refresh_token) {
            response.cookies.set('spotify_refresh_token', tokenData.refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            });
        }

        return response;

    } catch (error) {
        console.error('Spotify auth error:', error);
        return NextResponse.redirect(
            new URL(`/?error=auth_failed`, request.url)
        );
    }
}
