export function displayInviteUrl(inviteUrl: string | null | undefined, hasActiveInvite: boolean | undefined): string {
  if (inviteUrl) {
    return inviteUrl.replace(/^https?:\/\//, '');
  }

  if (hasActiveInvite) {
    return 'Generate a link to copy it here';
  }

  return 'No invite link yet';
}

export function displayInviteListUrl(url: string | null | undefined): string {
  return url ? url.replace(/^https?:\/\//, '') : 'Link unavailable';
}
