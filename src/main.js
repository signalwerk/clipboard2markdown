/**
 * Main Application Entry Point
 * Wires together all modules and initializes the application
 */

import {
  getHtmlFromClipboardEvent,
  getPlainTextFromClipboardEvent,
  copyToClipboard,
} from "./modules/clipboard.js";

import { convertHtmlToMarkdown, isValidHtml } from "./modules/converter.js";

import { formatMarkdown } from "./modules/formatter.js";

import {
  initializeElements,
  getHtmlInputValue,
  setHtmlInputValue,
  setMarkdownOutputValue,
  clearHtmlInput,
  clearMarkdownOutput,
  updateStatus,
  showToast,
  setProcessingState,
  registerEventHandler,
  getMarkdownOutputValue,
} from "./modules/ui.js";

// ============================================
// Conversion Pipeline
// ============================================

/**
 * Main conversion pipeline: HTML -> Markdown -> Formatted
 * @param {string} html - HTML string to convert
 * @returns {Promise<string>} - Formatted Markdown string
 */
async function processHtmlToMarkdown(html) {
  // Step 1: Convert HTML to Markdown
  const rawMarkdown = convertHtmlToMarkdown(html);

  // Step 2: Format with Prettier
  const formattedMarkdown = await formatMarkdown(rawMarkdown);

  return formattedMarkdown;
}

/**
 * Handles the conversion process with UI feedback
 * @param {string} html - HTML string to convert
 */
async function handleConversion(html) {
  if (!html || !html.trim()) {
    showToast("No HTML content to convert", "error");
    return;
  }

  if (!isValidHtml(html)) {
    showToast("Input does not appear to contain valid HTML", "error");
    return;
  }

  setProcessingState(true);

  try {
    const markdown = await processHtmlToMarkdown(html);

    setMarkdownOutputValue(markdown);
    updateStatus("Converted successfully", "success");
    showToast("HTML converted to Markdown!", "success");
  } catch (error) {
    console.error("Conversion error:", error);
    updateStatus("Conversion failed", "error");
    showToast(`Error: ${error.message}`, "error");
  } finally {
    setProcessingState(false);
  }
}

// ============================================
// Event Handlers
// ============================================

/**
 * Handles paste events on the document
 * Converts clipboard HTML to Markdown
 * @param {ClipboardEvent} event - The paste event
 */
async function handleDocumentPaste(event) {
  // Don't intercept if pasting into the HTML input textarea
  const target = event.target;
  const htmlInput = document.getElementById("html-input");

  if (target === htmlInput) {
    // Let the default paste behavior happen for the input field
    return;
  }

  // Prevent default paste behavior for document-level paste
  event.preventDefault();

  // Try to get HTML from clipboard
  const html = getHtmlFromClipboardEvent(event);

  if (html) {
    setHtmlInputValue(html);
    await handleConversion(html);
    return;
  }

  // Fallback to plain text
  const plainText = getPlainTextFromClipboardEvent(event);

  if (plainText && isValidHtml(plainText)) {
    setHtmlInputValue(plainText);
    await handleConversion(plainText);
  } else if (plainText) {
    setHtmlInputValue(plainText);
    showToast("Pasted text does not appear to be HTML", "error");
  } else {
    showToast("No content in clipboard", "error");
  }
}

/**
 * Handles click on the Convert button
 */
async function handleConvertClick() {
  const html = getHtmlInputValue();
  await handleConversion(html);
}

/**
 * Handles click on the Copy button
 */
async function handleCopyClick() {
  const markdown = getMarkdownOutputValue();

  if (!markdown || !markdown.trim()) {
    showToast("No Markdown to copy", "error");
    return;
  }

  const success = await copyToClipboard(markdown);

  if (success) {
    showToast("Markdown copied to clipboard!", "success");
  } else {
    showToast("Failed to copy to clipboard", "error");
  }
}

/**
 * Handles click on Clear Input button
 */
function handleClearInputClick() {
  clearHtmlInput();
  showToast("Input cleared", "");
}

/**
 * Handles click on Clear Output button
 */
function handleClearOutputClick() {
  clearMarkdownOutput();
  showToast("Output cleared", "");
}

/**
 * Handles keyboard shortcuts
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleKeyboardShortcuts(event) {
  // Cmd/Ctrl + Enter to convert
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    event.preventDefault();
    handleConvertClick();
  }
}

// ============================================
// Application Initialization
// ============================================

/**
 * Registers all event handlers
 */
function registerEventHandlers() {
  // Document-level paste handler
  registerEventHandler("document", "paste", handleDocumentPaste);

  // Button click handlers
  registerEventHandler("convert-btn", "click", handleConvertClick);
  registerEventHandler("copy-btn", "click", handleCopyClick);
  registerEventHandler("clear-input-btn", "click", handleClearInputClick);
  registerEventHandler("clear-output-btn", "click", handleClearOutputClick);

  // Keyboard shortcuts
  registerEventHandler("document", "keydown", handleKeyboardShortcuts);
}

/**
 * Initializes the application
 */
function init() {
  // Initialize DOM references
  initializeElements();

  // Register event handlers
  registerEventHandlers();

  // Log initialization
  console.log("Paste to Markdown initialized");
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
