/**
 * UI Module
 * Handles DOM interactions and user feedback
 */

/**
 * DOM element references
 */
let elements = null;

/**
 * Toast timeout reference
 */
let toastTimeout = null;

/**
 * Initializes DOM element references
 * @returns {object} - Object containing DOM elements
 */
export function initializeElements() {
  elements = {
    htmlInput: document.getElementById("html-input"),
    markdownOutput: document.getElementById("markdown-output"),
    convertBtn: document.getElementById("convert-btn"),
    copyBtn: document.getElementById("copy-btn"),
    clearInputBtn: document.getElementById("clear-input-btn"),
    clearOutputBtn: document.getElementById("clear-output-btn"),
    status: document.getElementById("status"),
    toast: document.getElementById("toast"),
  };

  return elements;
}

/**
 * Gets the cached DOM elements
 * @returns {object} - Object containing DOM elements
 */
export function getElements() {
  if (!elements) {
    return initializeElements();
  }
  return elements;
}

/**
 * Gets the HTML input value
 * @returns {string} - Current HTML input value
 */
export function getHtmlInputValue() {
  const { htmlInput } = getElements();
  return htmlInput.value;
}

/**
 * Sets the HTML input value
 * @param {string} value - Value to set
 */
export function setHtmlInputValue(value) {
  const { htmlInput } = getElements();
  htmlInput.value = value;
}

/**
 * Gets the Markdown output value
 * @returns {string} - Current Markdown output value
 */
export function getMarkdownOutputValue() {
  const { markdownOutput } = getElements();
  return markdownOutput.value;
}

/**
 * Sets the Markdown output value
 * @param {string} value - Value to set
 */
export function setMarkdownOutputValue(value) {
  const { markdownOutput } = getElements();
  markdownOutput.value = value;

  // Enable/disable copy button based on output
  const { copyBtn } = getElements();
  copyBtn.disabled = !value || value.trim() === "";
}

/**
 * Clears the HTML input
 */
export function clearHtmlInput() {
  setHtmlInputValue("");
}

/**
 * Clears the Markdown output
 */
export function clearMarkdownOutput() {
  setMarkdownOutputValue("");
  updateStatus("", "");
}

/**
 * Updates the status indicator
 * @param {string} message - Status message
 * @param {string} type - Status type ('success', 'error', or '')
 */
export function updateStatus(message, type = "") {
  const { status } = getElements();
  status.textContent = message;
  status.className = "status" + (type ? ` ${type}` : "");
}

/**
 * Shows a toast notification
 * @param {string} message - Toast message
 * @param {string} type - Toast type ('success', 'error', or '')
 * @param {number} duration - Duration in milliseconds
 */
export function showToast(message, type = "", duration = 3000) {
  const { toast } = getElements();

  // Clear existing timeout
  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  // Update toast content and show
  toast.textContent = message;
  toast.className = "toast visible" + (type ? ` ${type}` : "");

  // Hide after duration
  toastTimeout = setTimeout(() => {
    toast.className = "toast";
  }, duration);
}

/**
 * Sets the processing state of the UI
 * @param {boolean} isProcessing - Whether processing is in progress
 */
export function setProcessingState(isProcessing) {
  const { convertBtn, copyBtn } = getElements();

  if (isProcessing) {
    convertBtn.disabled = true;
    convertBtn.innerHTML = '<span class="btn-icon">⏳</span> Converting...';
    updateStatus("Processing...", "");
  } else {
    convertBtn.disabled = false;
    convertBtn.innerHTML = '<span class="btn-icon">→</span> Convert';
  }
}

/**
 * Registers an event handler
 * @param {string} elementId - Element ID or 'document'/'window'
 * @param {string} eventType - Event type (e.g., 'click', 'paste')
 * @param {Function} handler - Event handler function
 */
export function registerEventHandler(elementId, eventType, handler) {
  let target;

  if (elementId === "document") {
    target = document;
  } else if (elementId === "window") {
    target = window;
  } else {
    target = document.getElementById(elementId);
  }

  if (target) {
    target.addEventListener(eventType, handler);
  } else {
    console.warn(`Element not found: ${elementId}`);
  }
}

/**
 * Focuses on the HTML input
 */
export function focusHtmlInput() {
  const { htmlInput } = getElements();
  htmlInput.focus();
}

/**
 * Focuses on the Markdown output
 */
export function focusMarkdownOutput() {
  const { markdownOutput } = getElements();
  markdownOutput.focus();
}

/**
 * Selects all text in the Markdown output
 */
export function selectMarkdownOutput() {
  const { markdownOutput } = getElements();
  markdownOutput.select();
}
