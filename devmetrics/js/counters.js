// Reusable animated count-up function for numbers
function animateCounter(elementId, targetValue, duration = 1500) {
    const element = document.getElementById(elementId);
    if (!element) return;

    // Parse target, handling potential non-numbers gracefully
    const target = parseInt(targetValue, 10);
    if (isNaN(target)) {
        element.textContent = targetValue;
        return;
    }

    const start = 0;
    let startTime = null;

    function easeOutExpo(x) {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    }

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;

        // Calculate current value based on easing
        const percent = Math.min(progress / duration, 1);
        const currentVal = Math.floor(start + (target - start) * easeOutExpo(percent));

        // Format with thousands separator
        element.textContent = currentVal.toLocaleString();

        if (progress < duration) {
            window.requestAnimationFrame(step);
        } else {
            element.textContent = target.toLocaleString(); // Ensure final value is exact
        }
    }

    window.requestAnimationFrame(step);
}
