/**
 * Formatter Module
 * Handles Markdown formatting using Prettier
 */

import * as prettier from "prettier/standalone";
import markdownParser from "prettier/plugins/markdown";

/**
 * Default Prettier options for Markdown
 */
const DEFAULT_PRETTIER_OPTIONS = {
  parser: "markdown",
  plugins: [markdownParser],
  proseWrap: "preserve",
  tabWidth: 2,
  useTabs: false,
  printWidth: 80,
};

/**
 * Formats Markdown using Prettier
 * @param {string} markdown - Raw Markdown string
 * @param {object} options - Optional Prettier options
 * @returns {Promise<string>} - Formatted Markdown string
 */
export async function formatMarkdown(markdown, options = {}) {
  if (!markdown || typeof markdown !== "string") {
    throw new Error("Invalid markdown input: expected a non-empty string");
  }

  const mergedOptions = {
    ...DEFAULT_PRETTIER_OPTIONS,
    ...options,
  };

  try {
    const formatted = await prettier.format(markdown, mergedOptions);
    return formatted;
  } catch (error) {
    console.error("Prettier formatting failed:", error);
    // Return original markdown if formatting fails
    return markdown;
  }
}

/**
 * Validates if Prettier can parse the markdown
 * @param {string} markdown - Markdown string to validate
 * @returns {Promise<boolean>} - True if valid
 */
export async function isValidMarkdown(markdown) {
  if (!markdown || typeof markdown !== "string") {
    return false;
  }

  try {
    await prettier.format(markdown, {
      parser: "markdown",
      plugins: [markdownParser],
    });
    return true;
  } catch {
    return false;
  }
}
