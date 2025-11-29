/**
 * Converter Module
 * Handles HTML to Markdown conversion using Turndown
 */

import TurndownService from "turndown";

/**
 * Creates and configures a Turndown service instance
 * @returns {TurndownService} - Configured Turndown instance
 */
function createTurndownService() {
  const turndownService = new TurndownService({
    headingStyle: "atx",
    hr: "---",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    fence: "```",
    emDelimiter: "_",
    strongDelimiter: "**",
    linkStyle: "inlined",
    linkReferenceStyle: "full",
  });

  // Remove script and style tags
  turndownService.remove(["script", "style", "noscript"]);

  // Custom rule for preserving code blocks
  turndownService.addRule("preserveCodeBlocks", {
    filter: ["pre"],
    replacement: function (content, node) {
      const codeElement = node.querySelector("code");
      const codeContent = codeElement
        ? codeElement.textContent
        : node.textContent;
      const language = extractLanguageFromCode(node);

      return `\n\`\`\`${language}\n${codeContent.trim()}\n\`\`\`\n`;
    },
  });

  // Custom rule for inline code
  turndownService.addRule("inlineCode", {
    filter: function (node) {
      return node.nodeName === "CODE" && node.parentNode.nodeName !== "PRE";
    },
    replacement: function (content) {
      if (!content.trim()) return "";

      // Handle content that contains backticks
      if (content.includes("`")) {
        return "`` " + content + " ``";
      }
      return "`" + content + "`";
    },
  });

  return turndownService;
}

/**
 * Extracts programming language from code element classes
 * @param {HTMLElement} node - The code or pre element
 * @returns {string} - Language identifier or empty string
 */
function extractLanguageFromCode(node) {
  const codeElement = node.querySelector("code") || node;
  const className = codeElement.className || "";

  // Common patterns: language-js, lang-javascript, hljs language-javascript
  const languageMatch = className.match(/(?:language-|lang-)(\w+)/);

  if (languageMatch) {
    return languageMatch[1];
  }

  return "";
}

// Create singleton instance
const turndownService = createTurndownService();

/**
 * Converts HTML to Markdown
 * @param {string} html - HTML string to convert
 * @returns {string} - Converted Markdown string
 */
export function convertHtmlToMarkdown(html) {
  if (!html || typeof html !== "string") {
    throw new Error("Invalid HTML input: expected a non-empty string");
  }

  return turndownService.turndown(html);
}

/**
 * Checks if a string contains valid HTML
 * @param {string} str - String to check
 * @returns {boolean} - True if string contains HTML tags
 */
export function isValidHtml(str) {
  if (!str || typeof str !== "string") {
    return false;
  }

  // Check for basic HTML tag pattern
  const htmlTagPattern = /<\/?[a-z][\s\S]*>/i;
  return htmlTagPattern.test(str);
}
