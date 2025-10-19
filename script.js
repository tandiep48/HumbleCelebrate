// --- 3D TEXT SPHERE LOGIC ---

const texts = [
    'uoY evoL I', 'reveroF sruoY', 'etamluoS', 
    'syawlA', 'enihsnuS yM', 'eM & uoY'
];

// Function to create and position each text item in a sphere
const createTagCloud = (texts) => {
    const container = document.getElementById('tagcloud');
    container.innerHTML = ''; // Clear previous items

    // Create separate containers for each ring
    const innerRingContainer = document.createElement('div');
    innerRingContainer.className = 'inner-ring-container';
    const outerRingContainer = document.createElement('div');
    outerRingContainer.className = 'outer-ring-container';

    const radius1 = 120; // Radius for the inner circle
    const radius2 = 200; // Radius for the outer, bigger circle
    
    // Split texts for two rings
    const midPoint = Math.ceil(texts.length / 2);
    const firstHalfTexts = texts.slice(0, midPoint);
    const secondHalfTexts = texts.slice(midPoint);

    // --- Create the inner ring ---
    const innerText = firstHalfTexts.join(' • '); // Join with a separator for spacing
    const innerChars = innerText.split('');
    const innerColors = ['#ffffffff', '#ffffffff', '#ffffffff', '#ffffffff'];

    innerChars.forEach((char, i) => {
        if (char === ' ') return; // Skip spaces to avoid gaps
        const charSpan = document.createElement('span');
        charSpan.className = 'tagcloud--char';
        charSpan.textContent = char;
        charSpan.style.color = innerColors[i % innerColors.length];

        const angle = (i / innerChars.length) * 2 * Math.PI;
        const x = radius1 * Math.cos(angle);
        const z = radius1 * Math.sin(angle);
        
        // Position character on the circle, rotate it to face out, then lay it flat
        charSpan.style.transform = `translate3d(${x}px, 0px, ${z}px) rotateY(${angle + Math.PI/2}rad) rotateX(90deg)`;
        
        innerRingContainer.appendChild(charSpan);
    });

    // --- Create the outer ring ---
    const outerText = secondHalfTexts.join(' • '); // Join with a separator
    const outerChars = outerText.split('');
    const outerColors = ['#ffffffff', '#ffffffff', '#ffffffff', '#ffffffff'];

    outerChars.forEach((char, i) => {
        if (char === ' ') return; // Skip spaces
        const charSpan = document.createElement('span');
        charSpan.className = 'tagcloud--char';
        charSpan.textContent = char;
        charSpan.style.color = outerColors[i % outerColors.length];

        const angle = (i / outerChars.length) * 2 * Math.PI;
        const x = radius2 * Math.cos(angle);
        const z = radius2 * Math.sin(angle);
        
        // Position character on the circle, rotate it to face out, then lay it flat
        charSpan.style.transform = `translate3d(${x}px, 0px, ${z}px) rotateY(${angle + Math.PI/2}rad) rotateX(90deg)`;
        
        outerRingContainer.appendChild(charSpan);
    });

    // Append both ring containers to the main cloud
    container.appendChild(innerRingContainer);
    container.appendChild(outerRingContainer);
};


// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // Initial setup
    createTagCloud(texts);
});
