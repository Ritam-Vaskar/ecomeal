type AiResult = {
  specials: Array<{
    title: string;
    description: string;
    ingredients: string[];
    priority: string;
  }>;
  priority: string[];
};

const results = new Map<string, AiResult>();

export function getAiResult(jobId: string) {
  return results.get(jobId) ?? null;
}

export function setAiResult(jobId: string, result: AiResult) {
  results.set(jobId, result);
}

export function generateRecommendations(ingredients: string[]) {
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
  } satisfies AiResult;
}
