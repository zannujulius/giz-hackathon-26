import { REGION_COLORS } from "../../data/indicators";

export interface ProvinceMapData {
  province: string;
  value: number;
  color: string;
}

/**
 * Transform regional chart data to map data format
 */
export function transformRegionalDataToMapData(
  data: Array<{ region: string; value: number }>
): ProvinceMapData[] {
  return data.map(item => ({
    province: item.region,
    value: item.value,
    color: REGION_COLORS[item.region] || '#64748b'
  }));
}

/**
 * Transform comparison data (2 indicators) to map data format using first indicator
 */
export function transformComparisonDataToMapData(
  data: Array<{ region: string; ind1: number; ind2?: number }>,
  useSecondIndicator = false
): ProvinceMapData[] {
  return data.map(item => ({
    province: item.region,
    value: useSecondIndicator && item.ind2 !== undefined ? item.ind2 : item.ind1,
    color: REGION_COLORS[item.region] || '#64748b'
  }));
}

/**
 * Transform trend data to map data format for a specific year
 */
export function transformTrendDataToMapData(
  data: Array<Record<string, number | string>>,
  targetYear?: string
): ProvinceMapData[] {
  // If no target year specified, use the last year in the data
  const yearToUse = targetYear || String(Math.max(...data.map(d => Number(d.year)).filter(y => !isNaN(y))));
  
  const yearData = data.find(d => String(d.year) === yearToUse);
  if (!yearData) {
    return [];
  }

  const provinces = ['Kigali', 'East', 'West', 'North', 'South'];
  
  return provinces
    .map(province => {
      const value = yearData[province];
      if (typeof value === 'number' && !isNaN(value)) {
        return {
          province,
          value,
          color: REGION_COLORS[province] || '#64748b'
        };
      }
      return null;
    })
    .filter((item): item is ProvinceMapData => item !== null);
}