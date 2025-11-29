/**
 * Clipboard Module
 * Handles reading HTML content from the clipboard
 */

/**
 * Extracts HTML content from clipboard data
 * @param {ClipboardEvent} event - The paste event
 * @returns {string|null} - HTML content or null if not available
 */
export function getHtmlFromClipboardEvent(event) {
  const clipboardData = event.clipboardData;

  if (!clipboardData) {
    return null;
  }

  // Try to get HTML content first
  const htmlContent = clipboardData.getData("text/html");

  if (htmlContent && htmlContent.trim()) {
    return htmlContent;
  }

  return null;
}

/**
 * Gets plain text from clipboard event as fallback
 * @param {ClipboardEvent} event - The paste event
 * @returns {string|null} - Plain text or null
 */
export function getPlainTextFromClipboardEvent(event) {
  const clipboardData = event.clipboardData;

  if (!clipboardData) {
    return null;
  }

  return clipboardData.getData("text/plain");
}

/**
 * Reads HTML from clipboard using the Clipboard API
 * @returns {Promise<string|null>} - HTML content or null
 */
export async function readHtmlFromClipboard() {
  try {
    const clipboardItems = await navigator.clipboard.read();

    for (const item of clipboardItems) {
      if (item.types.includes("text/html")) {
        const blob = await item.getType("text/html");
        return await blob.text();
      }
    }

    return null;
  } catch (error) {
    console.error("Failed to read HTML from clipboard:", error);
    return null;
  }
}

/**
 * Copies text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - Success status
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);

    // Fallback for older browsers
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      return true;
    } catch (fallbackError) {
      console.error("Fallback copy failed:", fallbackError);
      return false;
    }
  }
}
