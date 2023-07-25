export function shortenAddress(address: string | null | undefined) {
  if (!address) return '';
  const addressStart = address.substring(0, 4);
  const addressEnd = address.substring(address.length - 4);
  return `${addressStart}...${addressEnd}`;
}

export async function copyToClipboard(textToCopy: string) {
  if (navigator?.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(textToCopy);
      return;
    } catch (e) {}
  }
  const textArea = document.createElement('textarea');
  textArea.value = textToCopy;
  document.body.prepend(textArea);
  textArea.focus();
  textArea.select();
  document.execCommand('copy');
  textArea.remove();
}
