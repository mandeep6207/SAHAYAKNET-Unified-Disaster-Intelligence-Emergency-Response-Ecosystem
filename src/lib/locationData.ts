// Shared location data for SahayakNet — SINGLE SOURCE OF TRUTH
// Used by: Emergency Form, Backend zone resolution, Admin map, Volunteer location, Auto-assignment, Filters
// 5 STATES × 5 DISTRICTS = 25 LOCATIONS

export interface CityInfo {
  name: string;
  lat: number;
  lng: number;
}

export interface DistrictInfo {
  name: string;
  cities: CityInfo[];
  lat: number;
  lng: number;
}

export interface StateInfo {
  name: string;
  districts: DistrictInfo[];
}

export const LOCATION_DATA: StateInfo[] = [
  {
    name: 'Chhattisgarh',
    districts: [
      {
        name: 'Raipur',
        lat: 21.2514,
        lng: 81.6296,
        cities: [
          { name: 'Raipur', lat: 21.2514, lng: 81.6296 },
          { name: 'Arang', lat: 21.1906, lng: 81.9667 },
          { name: 'Tilda', lat: 21.3961, lng: 81.8669 },
          { name: 'Abhanpur', lat: 21.0256, lng: 81.7706 },
          { name: 'Dharsiwa', lat: 21.2167, lng: 81.7167 },
        ],
      },
      {
        name: 'Durg',
        lat: 21.1904,
        lng: 81.2849,
        cities: [
          { name: 'Durg', lat: 21.1904, lng: 81.2849 },
          { name: 'Patan', lat: 21.2811, lng: 81.1139 },
          { name: 'Bemetara', lat: 21.7050, lng: 81.5428 },
          { name: 'Balod', lat: 20.7317, lng: 81.2083 },
          { name: 'Rajnandgaon', lat: 21.0972, lng: 81.0328 },
        ],
      },
      {
        name: 'Bhilai Nagar',
        lat: 21.2093,
        lng: 81.3782,
        cities: [
          { name: 'Bhilai Nagar', lat: 21.2093, lng: 81.3782 },
          { name: 'Bhilai Steel City', lat: 21.2167, lng: 81.4281 },
          { name: 'Charoda', lat: 21.2347, lng: 81.3125 },
          { name: 'Kohka', lat: 21.1864, lng: 81.3597 },
          { name: 'Jamul', lat: 21.2222, lng: 81.3972 },
        ],
      },
      {
        name: 'Bilaspur',
        lat: 22.0796,
        lng: 82.1391,
        cities: [
          { name: 'Bilaspur', lat: 22.0796, lng: 82.1391 },
          { name: 'Mungeli', lat: 22.0667, lng: 81.6833 },
          { name: 'Takhatpur', lat: 22.0924, lng: 81.8679 },
          { name: 'Kota', lat: 22.2822, lng: 82.0111 },
          { name: 'Ratanpur', lat: 22.2917, lng: 82.1708 },
        ],
      },
      {
        name: 'Korba',
        lat: 22.3595,
        lng: 82.7501,
        cities: [
          { name: 'Korba', lat: 22.3595, lng: 82.7501 },
          { name: 'Katghora', lat: 22.5000, lng: 82.5500 },
          { name: 'Pali', lat: 22.1839, lng: 82.5117 },
          { name: 'Kartala', lat: 22.2500, lng: 82.6500 },
          { name: 'Champa', lat: 22.0408, lng: 82.6722 },
        ],
      },
    ],
  },
  {
    name: 'Odisha',
    districts: [
      {
        name: 'Khordha',
        lat: 20.2961,
        lng: 85.8245,
        cities: [
          { name: 'Bhubaneswar', lat: 20.2961, lng: 85.8245 },
          { name: 'Khordha', lat: 20.1809, lng: 85.6156 },
          { name: 'Jatani', lat: 20.1594, lng: 85.7025 },
          { name: 'Balianta', lat: 20.2167, lng: 85.8667 },
          { name: 'Balipatna', lat: 20.1167, lng: 85.6333 },
        ],
      },
      {
        name: 'Cuttack',
        lat: 20.5147,
        lng: 85.9231,
        cities: [
          { name: 'Cuttack', lat: 20.5147, lng: 85.9231 },
          { name: 'Choudwar', lat: 20.5336, lng: 85.9481 },
          { name: 'Athagarh', lat: 20.5167, lng: 85.6333 },
          { name: 'Banki', lat: 20.3825, lng: 85.5303 },
          { name: 'Salipur', lat: 20.5333, lng: 86.1167 },
        ],
      },
      {
        name: 'Sundargarh',
        lat: 22.1186,
        lng: 84.0331,
        cities: [
          { name: 'Rourkela', lat: 22.2604, lng: 84.8536 },
          { name: 'Sundargarh', lat: 22.1186, lng: 84.0331 },
          { name: 'Rajgangpur', lat: 22.1500, lng: 84.0167 },
          { name: 'Bisra', lat: 22.3167, lng: 84.8333 },
          { name: 'Bonai', lat: 22.1667, lng: 84.6333 },
        ],
      },
      {
        name: 'Sambalpur',
        lat: 21.4669,
        lng: 83.9812,
        cities: [
          { name: 'Sambalpur', lat: 21.4669, lng: 83.9812 },
          { name: 'Burla', lat: 21.5089, lng: 83.8728 },
          { name: 'Hirakud', lat: 21.5333, lng: 83.8667 },
          { name: 'Rairakhol', lat: 21.5667, lng: 83.6833 },
          { name: 'Kuchinda', lat: 21.7167, lng: 84.6000 },
        ],
      },
      {
        name: 'Ganjam',
        lat: 19.3919,
        lng: 84.7937,
        cities: [
          { name: 'Berhampur', lat: 19.3149, lng: 84.7941 },
          { name: 'Chatrapur', lat: 19.3567, lng: 84.9836 },
          { name: 'Gopalpur', lat: 19.2667, lng: 84.9167 },
          { name: 'Chhatrapur', lat: 19.3567, lng: 84.9836 },
          { name: 'Aska', lat: 19.6167, lng: 84.6667 },
        ],
      },
    ],
  },
  {
    name: 'Jharkhand',
    districts: [
      {
        name: 'Ranchi',
        lat: 23.3441,
        lng: 85.3096,
        cities: [
          { name: 'Ranchi', lat: 23.3441, lng: 85.3096 },
          { name: 'Kanke', lat: 23.4219, lng: 85.3069 },
          { name: 'Namkum', lat: 23.3015, lng: 85.3641 },
          { name: 'Hatia', lat: 23.3167, lng: 85.2667 },
          { name: 'Bero', lat: 23.2767, lng: 85.1394 },
        ],
      },
      {
        name: 'East Singhbhum',
        lat: 22.8046,
        lng: 86.2029,
        cities: [
          { name: 'Jamshedpur', lat: 22.8046, lng: 86.2029 },
          { name: 'Jugsalai', lat: 22.7946, lng: 86.1821 },
          { name: 'Baharagora', lat: 21.9292, lng: 86.9264 },
          { name: 'Dhalbhum', lat: 22.6667, lng: 86.0167 },
          { name: 'Potka', lat: 22.4764, lng: 86.5731 },
        ],
      },
      {
        name: 'Dhanbad',
        lat: 23.7957,
        lng: 86.4304,
        cities: [
          { name: 'Dhanbad', lat: 23.7957, lng: 86.4304 },
          { name: 'Jharia', lat: 23.7412, lng: 86.4186 },
          { name: 'Sindri', lat: 23.7713, lng: 86.4249 },
          { name: 'Katras', lat: 23.7978, lng: 86.3817 },
          { name: 'Topchanchi', lat: 23.8794, lng: 86.3433 },
        ],
      },
      {
        name: 'Bokaro',
        lat: 23.6693,
        lng: 86.1511,
        cities: [
          { name: 'Bokaro Steel City', lat: 23.6693, lng: 86.1511 },
          { name: 'Chas', lat: 23.6333, lng: 86.0500 },
          { name: 'Petarbar', lat: 23.6011, lng: 85.8011 },
          { name: 'Gomia', lat: 23.8761, lng: 85.9042 },
          { name: 'Bermo', lat: 23.7981, lng: 85.9667 },
        ],
      },
      {
        name: 'Hazaribagh',
        lat: 23.9925,
        lng: 85.3637,
        cities: [
          { name: 'Hazaribagh', lat: 23.9925, lng: 85.3637 },
          { name: 'Ramgarh', lat: 23.6378, lng: 85.5117 },
          { name: 'Chatra', lat: 24.2024, lng: 84.8755 },
          { name: 'Barhi', lat: 24.3000, lng: 85.4167 },
          { name: 'Ichak', lat: 24.1667, lng: 85.6000 },
        ],
      },
    ],
  },
  {
    name: 'Bihar',
    districts: [
      {
        name: 'Patna',
        lat: 25.5941,
        lng: 85.1376,
        cities: [
          { name: 'Patna', lat: 25.5941, lng: 85.1376 },
          { name: 'Danapur', lat: 25.6167, lng: 85.0500 },
          { name: 'Phulwari', lat: 25.5500, lng: 85.0833 },
          { name: 'Barh', lat: 25.4825, lng: 85.7169 },
          { name: 'Fatwa', lat: 25.5167, lng: 85.3167 },
        ],
      },
      {
        name: 'Gaya',
        lat: 24.7964,
        lng: 85.0077,
        cities: [
          { name: 'Gaya', lat: 24.7964, lng: 85.0077 },
          { name: 'Bodh Gaya', lat: 24.6961, lng: 84.9914 },
          { name: 'Sherghati', lat: 24.5578, lng: 84.7939 },
          { name: 'Aurangabad', lat: 24.7500, lng: 84.3667 },
          { name: 'Nawada', lat: 24.8858, lng: 85.5425 },
        ],
      },
      {
        name: 'Muzaffarpur',
        lat: 26.1209,
        lng: 85.3647,
        cities: [
          { name: 'Muzaffarpur', lat: 26.1209, lng: 85.3647 },
          { name: 'Kanti', lat: 26.2500, lng: 85.3833 },
          { name: 'Sitamarhi', lat: 26.5903, lng: 85.4811 },
          { name: 'Sheohar', lat: 26.5167, lng: 85.3000 },
          { name: 'East Champaran', lat: 26.7958, lng: 84.9203 },
        ],
      },
      {
        name: 'Bhagalpur',
        lat: 25.2425,
        lng: 86.9842,
        cities: [
          { name: 'Bhagalpur', lat: 25.2425, lng: 86.9842 },
          { name: 'Naugachia', lat: 25.3903, lng: 87.0958 },
          { name: 'Banka', lat: 24.8808, lng: 86.9197 },
          { name: 'Kahalgaon', lat: 25.2439, lng: 87.2594 },
          { name: 'Sultanganj', lat: 25.2436, lng: 86.7403 },
        ],
      },
      {
        name: 'Darbhanga',
        lat: 26.1542,
        lng: 85.9000,
        cities: [
          { name: 'Darbhanga', lat: 26.1542, lng: 85.9000 },
          { name: 'Madhubani', lat: 26.3533, lng: 86.0719 },
          { name: 'Samastipur', lat: 25.8608, lng: 85.7797 },
          { name: 'Begusarai', lat: 25.4183, lng: 86.1289 },
          { name: 'Supaul', lat: 26.1267, lng: 86.6036 },
        ],
      },
    ],
  },
  {
    name: 'Assam',
    districts: [
      {
        name: 'Kamrup Metropolitan',
        lat: 26.1445,
        lng: 91.7362,
        cities: [
          { name: 'Guwahati', lat: 26.1445, lng: 91.7362 },
          { name: 'Dispur', lat: 26.1404, lng: 91.7855 },
          { name: 'Jalukbari', lat: 26.1547, lng: 91.6703 },
          { name: 'North Guwahati', lat: 26.1722, lng: 91.7567 },
          { name: 'Azara', lat: 26.0864, lng: 91.6572 },
        ],
      },
      {
        name: 'Dibrugarh',
        lat: 27.4728,
        lng: 94.9120,
        cities: [
          { name: 'Dibrugarh', lat: 27.4728, lng: 94.9120 },
          { name: 'Naharkatia', lat: 27.3333, lng: 95.3333 },
          { name: 'Duliajan', lat: 27.3667, lng: 95.3167 },
          { name: 'Moran', lat: 27.1667, lng: 94.8667 },
          { name: 'Chabua', lat: 27.4833, lng: 95.1667 },
        ],
      },
      {
        name: 'Jorhat',
        lat: 26.7509,
        lng: 94.2037,
        cities: [
          { name: 'Jorhat', lat: 26.7509, lng: 94.2037 },
          { name: 'Titabor', lat: 26.6167, lng: 94.2000 },
          { name: 'Mariani', lat: 26.6617, lng: 94.3136 },
          { name: 'Dergaon', lat: 26.6969, lng: 93.9708 },
          { name: 'Golaghat', lat: 26.5167, lng: 93.9667 },
        ],
      },
      {
        name: 'Cachar',
        lat: 24.8333,
        lng: 92.7789,
        cities: [
          { name: 'Silchar', lat: 24.8333, lng: 92.7789 },
          { name: 'Sonai', lat: 24.8667, lng: 92.9167 },
          { name: 'Hailakandi', lat: 24.6833, lng: 92.5667 },
          { name: 'Karimganj', lat: 24.8647, lng: 92.3606 },
          { name: 'Lakhipur', lat: 24.7833, lng: 92.9000 },
        ],
      },
      {
        name: 'Sonitpur',
        lat: 26.6338,
        lng: 92.8003,
        cities: [
          { name: 'Tezpur', lat: 26.6338, lng: 92.8003 },
          { name: 'Dhekiajuli', lat: 26.7167, lng: 92.8167 },
          { name: 'Rangapara', lat: 26.8167, lng: 92.6667 },
          { name: 'Biswanath Chariali', lat: 26.7167, lng: 93.1500 },
          { name: 'Gohpur', lat: 26.8667, lng: 93.6000 },
        ],
      },
    ],
  },
];

// Build zone coords map
export const ZONE_COORDS_MAP: Record<string, [number, number]> = {};
for (const state of LOCATION_DATA) {
  for (const district of state.districts) {
    ZONE_COORDS_MAP[district.name] = [district.lat, district.lng];
    for (const city of district.cities) {
      ZONE_COORDS_MAP[city.name] = [city.lat, city.lng];
    }
  }
}

export const ALL_ZONE_NAMES = Object.keys(ZONE_COORDS_MAP);

export function getZoneCoords(zone: string): [number, number] | null {
  return ZONE_COORDS_MAP[zone] ?? null;
}

export function inferZoneFromText(text: string): string {
  const lower = text.toLowerCase().trim();
  let best: string | null = null;
  let bestLen = 0;
  for (const state of LOCATION_DATA) {
    for (const district of state.districts) {
      if (lower.includes(district.name.toLowerCase()) && district.name.length > bestLen) {
        best = district.name;
        bestLen = district.name.length;
      }
      for (const city of district.cities) {
        if (lower.includes(city.name.toLowerCase()) && city.name.length > bestLen) {
          best = district.name;
          bestLen = city.name.length;
        }
      }
    }
    if (lower.includes(state.name.toLowerCase()) && !best) {
      best = state.districts[0]?.name ?? null;
    }
  }
  return best ?? 'Ranchi';
}

export function getStateForDistrict(districtName: string): string {
  for (const state of LOCATION_DATA) {
    for (const district of state.districts) {
      if (district.name === districtName) return state.name;
    }
  }
  return 'Jharkhand';
}

// Backward compatibility aliases
export const JHARKHAND_CENTER: [number, number] = [23.61, 85.28];
