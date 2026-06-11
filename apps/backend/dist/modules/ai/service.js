const results = new Map();
export function getAiResult(jobId) {
    return results.get(jobId) ?? null;
}
export function setAiResult(jobId, result) {
    results.set(jobId, result);
}
export function generateRecommendations(ingredients) {
    const primary = ingredients.slice(0, 3);
    return {
        specials: [
            {
                title: `${primary[0] || 'Chef'} Signature Bowl`,
                description: `Use ${ingredients.join(', ')} for a low-waste feature dish.`,
                ingredients,
                priority: 'High',
            },
        ],
        priority: ingredients,
    };
}
