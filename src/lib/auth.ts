export function getSessionId(): string {
    let sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
        sessionId = crypto.randomUUID(); // Generate a new UUID
        localStorage.setItem("sessionId", sessionId);
    }
    return sessionId;
}

export function setUsername(username: string) {
    localStorage.setItem("username", username);
}

export function getUsername() {
    return localStorage.getItem("username");
}