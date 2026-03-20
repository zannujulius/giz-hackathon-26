// Semantic search utilities for better content matching
export interface SearchableItem {
  id: string | number;
  title: string;
  topicCategory: string;
  subTopicCategory?: string;
  sourceInstitution: string;
  province: string;
  [key: string]: any;
}

// Simple text similarity using cosine similarity with word vectors
function calculateWordSimilarity(word1: string, word2: string): number {
  if (word1 === word2) return 1;
  
  // Check for common prefixes/suffixes
  const minLength = Math.min(word1.length, word2.length);
  let commonChars = 0;
  
  for (let i = 0; i < minLength; i++) {
    if (word1[i] === word2[i]) {
      commonChars++;
    } else {
      break;
    }
  }
  
  const similarity = commonChars / Math.max(word1.length, word2.length);
  return similarity;
}

// Calculate semantic similarity between two text strings
function calculateTextSimilarity(text1: string, text2: string): number {
  const words1 = text1.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  const words2 = text2.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  
  if (words1.length === 0 || words2.length === 0) return 0;
  
  let totalSimilarity = 0;
  let maxSimilarities = 0;
  
  for (const word1 of words1) {
    let maxSimilarity = 0;
    for (const word2 of words2) {
      const similarity = calculateWordSimilarity(word1, word2);
      maxSimilarity = Math.max(maxSimilarity, similarity);
    }
    totalSimilarity += maxSimilarity;
    maxSimilarities++;
  }
  
  return maxSimilarities > 0 ? totalSimilarity / maxSimilarities : 0;
}

// Enhanced semantic search with weighted scoring
export function semanticSearch<T extends SearchableItem>(
  items: T[],
  query: string,
  threshold: number = 0.1
): Array<T & { score: number }> {
  if (!query.trim()) return items.map(item => ({ ...item, score: 1 }));
  
  const normalizedQuery = query.toLowerCase().trim();
  
  const scoredItems = items.map(item => {
    let score = 0;
    
    // Exact match bonus (highest priority)
    if (item.title.toLowerCase().includes(normalizedQuery)) {
      score += 2.0;
    }
    if (item.topicCategory.toLowerCase().includes(normalizedQuery)) {
      score += 1.5;
    }
    if (item.sourceInstitution.toLowerCase().includes(normalizedQuery)) {
      score += 1.0;
    }
    
    // Semantic similarity scoring
    const titleSimilarity = calculateTextSimilarity(normalizedQuery, item.title);
    const topicSimilarity = calculateTextSimilarity(normalizedQuery, item.topicCategory);
    const institutionSimilarity = calculateTextSimilarity(normalizedQuery, item.sourceInstitution);
    
    // Weighted semantic scores
    score += titleSimilarity * 1.5;
    score += topicSimilarity * 1.2;
    score += institutionSimilarity * 0.8;
    
    // Subtitle bonus if exists
    if (item.subTopicCategory) {
      if (item.subTopicCategory.toLowerCase().includes(normalizedQuery)) {
        score += 1.2;
      }
      const subtopicSimilarity = calculateTextSimilarity(normalizedQuery, item.subTopicCategory);
      score += subtopicSimilarity * 1.0;
    }
    
    // Province matching
    if (item.province.toLowerCase().includes(normalizedQuery)) {
      score += 0.5;
    }
    
    return { ...item, score };
  });
  
  // Filter by threshold and sort by score
  return scoredItems
    .filter(item => item.score >= threshold)
    .sort((a, b) => b.score - a.score);
}

// Fuzzy string matching for typo tolerance
export function fuzzyMatch(pattern: string, text: string): boolean {
  const patternLen = pattern.length;
  const textLen = text.length;
  
  if (patternLen === 0) return true;
  if (textLen === 0) return false;
  
  const dp = Array(patternLen + 1).fill(null).map(() => Array(textLen + 1).fill(false));
  dp[0][0] = true;
  
  // Initialize first row
  for (let j = 1; j <= textLen; j++) {
    dp[0][j] = true;
  }
  
  for (let i = 1; i <= patternLen; i++) {
    for (let j = 1; j <= textLen; j++) {
      if (pattern[i - 1].toLowerCase() === text[j - 1].toLowerCase()) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = dp[i][j - 1]; // Skip character in text
      }
    }
  }
  
  return dp[patternLen][textLen];
}

// Advanced search with multiple strategies
export function advancedSearch<T extends SearchableItem>(
  items: T[],
  query: string,
  options: {
    useSemanticSearch?: boolean;
    useFuzzyMatch?: boolean;
    threshold?: number;
  } = {}
): T[] {
  const {
    useSemanticSearch = true,
    useFuzzyMatch = true,
    threshold = 0.1
  } = options;
  
  if (!query.trim()) return items;
  
  if (useSemanticSearch) {
    const semanticResults = semanticSearch(items, query, threshold);
    return semanticResults.map(({ score, ...item }) => item as unknown as T);
  }
  
  // Fallback to enhanced exact + fuzzy matching
  const normalizedQuery = query.toLowerCase();
  
  return items.filter(item => {
    // Exact match check
    const exactMatch = 
      item.title.toLowerCase().includes(normalizedQuery) ||
      item.topicCategory.toLowerCase().includes(normalizedQuery) ||
      item.sourceInstitution.toLowerCase().includes(normalizedQuery) ||
      (item.subTopicCategory && item.subTopicCategory.toLowerCase().includes(normalizedQuery));
    
    if (exactMatch) return true;
    
    // Fuzzy match check if enabled
    if (useFuzzyMatch) {
      return fuzzyMatch(normalizedQuery, item.title.toLowerCase()) ||
             fuzzyMatch(normalizedQuery, item.topicCategory.toLowerCase()) ||
             fuzzyMatch(normalizedQuery, item.sourceInstitution.toLowerCase());
    }
    
    return false;
  });
}