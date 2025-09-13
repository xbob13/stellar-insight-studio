export interface SolarFlareData {
  id: string;
  date: string;
  time: string;
  class: string;
  region: string;
  peak: string;
  intensity: number;
}

export interface GeomagneticData {
  date: string;
  kIndex: number;
  apIndex: number;
  classification: string;
  forecast: string;
}

export interface SpaceWeatherAlert {
  id: string;
  type: string;
  level: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE' | 'EXTREME';
  description: string;
  issued: string;
  expires: string;
}

export interface SatelliteEnvironment {
  date: string;
  protonFlux: number;
  electronFlux: number;
  radiationLevel: string;
  riskLevel: number;
}

// Mock data generators for demonstration
export const generateMockSolarFlares = (): SolarFlareData[] => {
  const classes = ['A', 'B', 'C', 'M', 'X'];
  const regions = ['AR3529', 'AR3530', 'AR3531', 'AR3532'];
  
  return Array.from({ length: 15 }, (_, i) => ({
    id: `flare-${i + 1}`,
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    class: `${classes[Math.floor(Math.random() * classes.length)]}${Math.floor(Math.random() * 9) + 1}.${Math.floor(Math.random() * 9)}`,
    region: regions[Math.floor(Math.random() * regions.length)],
    peak: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    intensity: Math.floor(Math.random() * 100) + 1,
  }));
};

export const generateMockGeomagneticData = (): GeomagneticData[] => {
  const classifications = ['Quiet', 'Unsettled', 'Active', 'Minor Storm', 'Major Storm'];
  const forecasts = ['Stable', 'Increasing', 'Decreasing', 'Fluctuating'];
  
  return Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    kIndex: Math.floor(Math.random() * 9),
    apIndex: Math.floor(Math.random() * 400),
    classification: classifications[Math.floor(Math.random() * classifications.length)],
    forecast: forecasts[Math.floor(Math.random() * forecasts.length)],
  }));
};

export const generateMockSpaceWeatherAlerts = (): SpaceWeatherAlert[] => {
  const types = ['Solar Flare', 'Geomagnetic Storm', 'Radiation Storm', 'Radio Blackout'];
  const levels = ['LOW', 'MODERATE', 'HIGH', 'SEVERE', 'EXTREME'] as const;
  
  return Array.from({ length: 5 }, (_, i) => ({
    id: `alert-${i + 1}`,
    type: types[Math.floor(Math.random() * types.length)],
    level: levels[Math.floor(Math.random() * levels.length)],
    description: `${types[Math.floor(Math.random() * types.length)]} event detected with ${levels[Math.floor(Math.random() * levels.length)].toLowerCase()} intensity.`,
    issued: new Date(Date.now() - Math.random() * 48 * 60 * 60 * 1000).toISOString(),
    expires: new Date(Date.now() + Math.random() * 72 * 60 * 60 * 1000).toISOString(),
  }));
};

export const generateMockSatelliteEnvironment = (): SatelliteEnvironment[] => {
  const riskLevels = ['Low', 'Moderate', 'High', 'Severe'];
  
  return Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    protonFlux: Math.floor(Math.random() * 1000) + 10,
    electronFlux: Math.floor(Math.random() * 5000) + 100,
    radiationLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
    riskLevel: Math.floor(Math.random() * 10) + 1,
  }));
};

// API-like functions that would connect to real data sources
export const spaceWeatherApi = {
  async getSolarFlares(): Promise<SolarFlareData[]> {
    // In production, this would call NASA DONKI API
    return new Promise((resolve) => {
      setTimeout(() => resolve(generateMockSolarFlares()), 500);
    });
  },
  
  async getGeomagneticData(): Promise<GeomagneticData[]> {
    // In production, this would call NOAA Space Weather API
    return new Promise((resolve) => {
      setTimeout(() => resolve(generateMockGeomagneticData()), 500);
    });
  },
  
  async getSpaceWeatherAlerts(): Promise<SpaceWeatherAlert[]> {
    // In production, this would aggregate multiple alert sources
    return new Promise((resolve) => {
      setTimeout(() => resolve(generateMockSpaceWeatherAlerts()), 500);
    });
  },
  
  async getSatelliteEnvironment(): Promise<SatelliteEnvironment[]> {
    // In production, this would call satellite environment APIs
    return new Promise((resolve) => {
      setTimeout(() => resolve(generateMockSatelliteEnvironment()), 500);
    });
  },
};