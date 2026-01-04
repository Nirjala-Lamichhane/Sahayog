/**
 * Creates a click animation effect for buttons
 * @param {Event} e - The click event
 */
export const handleButtonClick = (e) => {
    const button = e.currentTarget;
    
    // Add active class for animation
    button.style.transform = "scale(0.95)";
    button.style.transition = "transform 0.1s ease";
    
    // Reset after animation
    setTimeout(() => {
        button.style.transform = "scale(1)";
    }, 100);
};

/**
 * Wraps an onClick handler with click animation
 * @param {Function} originalHandler - The original onClick handler
 * @returns {Function} - Wrapped handler with animation
 */
export const withClickAnimation = (originalHandler) => {
    return (e) => {
        handleButtonClick(e);
        if (originalHandler) {
            originalHandler(e);
        }
    };
};


