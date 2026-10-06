/**
 * Navigation and scroll offset helper utilities
 * Computes exact dynamic navbar height and scroll target positions for all devices.
 */

export const getStickyHeaderHeight = (): number => {
  const header = document.querySelector<HTMLElement>('.header');
  if (header) {
    const container = header.querySelector<HTMLElement>('.header-container');
    if (container) {
      const containerRect = container.getBoundingClientRect();
      const computed = window.getComputedStyle(header);
      const paddingTop = parseFloat(computed.paddingTop) || 0;
      const paddingBottom = parseFloat(computed.paddingBottom) || 0;
      const borderBottom = parseFloat(computed.borderBottomWidth) || 0;
      const totalHeaderHeight = containerRect.height + paddingTop + paddingBottom + borderBottom;
      if (totalHeaderHeight >= 45 && totalHeaderHeight <= 120) {
        return totalHeaderHeight;
      }
    }
    const rect = header.getBoundingClientRect();
    if (rect.height >= 45 && rect.height <= 120) {
      return rect.height;
    }
  }
  // Responsive fallback if header element is not yet rendered
  return window.innerWidth <= 768 ? 62 : 77;
};

/**
 * Identifies the exact visual heading element inside a section.
 * Accounts for internal top padding and ensures the visible title/heading is the target anchor.
 */
export const getSectionTargetHeading = (section: HTMLElement): HTMLElement => {
  if (section.id === 'about') {
    // In the About section, .about-label (/ OUR STORY + animated walker) marks the start of the content
    const label = section.querySelector<HTMLElement>('.about-label');
    if (label) return label;
  }
  
  // Look for section title or top heading
  const heading = section.querySelector<HTMLElement>('.section-title, .about-title, .contact-title, h1, h2');
  return heading || section;
};

/**
 * Traverses offsetParent hierarchy to compute the exact settled layout position
 * in the document, completely immune to temporary CSS keyframe/transform animations.
 */
export const getElementSettledTop = (element: HTMLElement): number => {
  let top = 0;
  let current: HTMLElement | null = element;
  while (current && current !== document.body && current !== document.documentElement) {
    top += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }
  return top;
};

/**
 * Smoothly scrolls to the section heading such that:
 * - General sections: NAVBAR BOTTOM -> ~16-18px breathing gap -> SECTION HEADING
 * - About section: NAVBAR BOTTOM -> breathing gap -> FULL WALKING CHARACTER ANIMATION + 01 / OUR STORY
 * 
 * @param targetId ID of the target section (e.g. 'rent-gear', 'categories', 'how-it-works', 'about', 'contact')
 * @param smooth Whether to use smooth scrolling (default: true)
 * @returns boolean indicating if the target element was found and scrolled to
 */
export const scrollToSection = (targetId: string, smooth = true): boolean => {
  const section = document.getElementById(targetId);
  if (!section) return false;

  const heading = getSectionTargetHeading(section);
  const headerHeight = getStickyHeaderHeight();
  
  // Base breathing gap
  const isMobile = window.innerWidth <= 768;
  const baseGap = isMobile ? 16 : 18;
  
  // For About section, provide full headroom (~85px desktop, ~75px mobile)
  // so the walking rider character (helmet, camera, body) on top of the red line is 100% visible and unclipped
  const extraAboutGap = targetId === 'about' ? (isMobile ? 75 : 85) : 0;
  const gap = baseGap + extraAboutGap;

  // Use settled offsetTop layout position (falling back to bounding rect if offsetParent is null)
  const settledTop = getElementSettledTop(heading);
  const targetTop = (settledTop > 0) 
    ? (settledTop - headerHeight - gap) 
    : (window.scrollY + heading.getBoundingClientRect().top - headerHeight - gap);

  window.scrollTo({
    top: Math.max(0, Math.round(targetTop)),
    behavior: smooth ? 'smooth' : 'auto'
  });

  return true;
};

/**
 * Handles initial page load or fresh hash navigation by scrolling smoothly
 * and performing quick post-layout stabilization checks as lazy media renders.
 */
export const scrollToSectionWithStabilization = (targetId: string, smooth = true): (() => void) => {
  scrollToSection(targetId, smooth);

  const t1 = setTimeout(() => {
    scrollToSection(targetId, false);
  }, 120);

  const t2 = setTimeout(() => {
    scrollToSection(targetId, false);
  }, 350);

  const t3 = setTimeout(() => {
    scrollToSection(targetId, false);
  }, 700);

  return () => {
    clearTimeout(t1);
    clearTimeout(t2);
    clearTimeout(t3);
  };
};
