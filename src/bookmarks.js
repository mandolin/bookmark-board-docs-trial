/**
 * Bookmark Board domain helpers.
 *
 * @module bookmark-board
 * @lang zh-CN Bookmark Board 的领域辅助函数。
 * @lang en Domain helpers for Bookmark Board.
 */

/**
 * @typedef {object} Bookmark
 * @property {string} id Stable bookmark identifier.
 * @property {string} title Human-facing bookmark title.
 * @property {string} url Bookmark target URL.
 * @lang zh-CN 书签看板中用于渲染与排序的书签数据。
 * @lang en Bookmark data used for rendering and sorting in the board.
 */

/**
 * Normalizes a bookmark title before it is displayed.
 *
 * @param {string} title User-provided bookmark title.
 * @returns {string} A non-empty display title.
 * @lang zh-CN 在展示书签前规范化用户提供的标题。
 * @lang en Normalizes a user-provided title before displaying a bookmark.
 */
export function normalizeBookmarkTitle(title) {
  const normalized = String(title ?? "").trim();
  return normalized || "Untitled bookmark";
}

/**
 * Sorts bookmarks by display title without mutating the input list.
 *
 * @param {Bookmark[]} bookmarks Bookmarks to sort.
 * @returns {Bookmark[]} A new list ordered by normalized display title.
 * @lang zh-CN 按展示标题排序书签，并保持输入列表不变。
 * @lang en Sorts bookmarks by display title without mutating the input list.
 */
export function sortBookmarksByTitle(bookmarks) {
  return [...bookmarks].sort((left, right) => {
    return normalizeBookmarkTitle(left.title).localeCompare(normalizeBookmarkTitle(right.title));
  });
}
