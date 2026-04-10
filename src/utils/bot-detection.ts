/**
 * Detect likely bot/agent contributors from git author metadata.
 * Covers common GitHub bot identities and known agent mailboxes.
 */
export function detectBotContributor(name?: string, email?: string): boolean {
    const lowerName = (name ?? '').trim().toLowerCase();
    const lowerEmail = (email ?? '').trim().toLowerCase();

    if (!lowerName && !lowerEmail) {
        return false;
    }

    if (
        lowerEmail.includes('[bot]@') ||
        (/^\d+\+.+\[bot\]@users\.noreply\.github\.com$/i).test(lowerEmail) ||
        (lowerEmail.includes('noreply@github.com') && lowerName.includes('[bot]')) ||
        (lowerEmail.includes('@users.noreply.github.com') && lowerName.includes('[bot]'))
    ) {
        return true;
    }

    if (
        lowerName.endsWith('[bot]') ||
        lowerName === 'dependabot' ||
        lowerName === 'renovate' ||
        lowerName === 'github-actions'
    ) {
        return true;
    }

    if (
        lowerEmail.includes('noreply@anthropic.com') ||
        lowerEmail.includes('bot@substrate.run') ||
        lowerEmail.includes('claude@users.noreply.github.com')
    ) {
        return true;
    }

    return false;
}
