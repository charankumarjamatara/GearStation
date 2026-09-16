// Utility to preserve and restore scroll positions across category listings when returning from product details

const scrollPositions = new Map<string, number>();
let lastRouteBeforeProduct: string | null = null;
let returningFromProduct = false;

/**
 * Normalizes a category key or hash into a consistent lookup key
 */
const normalizeKey = (key: string): string => {
  return key.replace(/^#?category\//, '').trim();
};

/**
 * Saves the current scroll position for a specific category page
 */
export const saveCategoryScrollPosition = (categoryKey: string, scrollY?: number) => {
  const y = typeof scrollY === 'number' 
    ? scrollY 
    : (window.scrollY || document.documentElement.scrollTop || 0);
  const key = normalizeKey(categoryKey);
  scrollPositions.set(key, y);
  lastRouteBeforeProduct = key;
};

/**
 * Gets the saved scroll position for a category if returning from a product detail page
 */
export const getSavedCategoryScrollPosition = (categoryKey: string): number | null => {
  const key = normalizeKey(categoryKey);
  if (returningFromProduct && scrollPositions.has(key)) {
    return scrollPositions.get(key) ?? null;
  }
  return null;
};

/**
 * Consumes the saved scroll position once it has been restored
 */
export const consumeCategoryScrollPosition = (categoryKey: string) => {
  const key = normalizeKey(categoryKey);
  returningFromProduct = false;
  scrollPositions.delete(key);
};

/**
 * Sets whether the upcoming navigation is a return from a product detail page
 */
export const setReturningFromProduct = (val: boolean) => {
  returningFromProduct = val;
};

/**
 * Checks whether the current navigation is a return from a product detail page
 */
export const isReturningFromProduct = (): boolean => {
  return returningFromProduct;
};

/**
 * Returns the last category route visited before navigating to a product
 */
export const getLastRouteBeforeProduct = (): string | null => {
  return lastRouteBeforeProduct;
};
