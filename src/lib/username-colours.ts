/**
 * Generates a unique colour for each username. 
 */
export function hashStringToColor(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360; // 0–360 for hue
    const saturation = 100; // Muted colors (40–60%)
    const lightness = 30; // Light colors (60–80%)

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}