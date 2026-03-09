export interface User {
  id: number;
  email: string;
  name: string;
  pictureUrl: string;
}

export interface ActivityLocation {
  id: number;
  name: string;
  description: string;
  category: string;
  osmId?: number;
  location: {
    type: "Point";
    coordinates: [number, number]; // [lon, lat]
  };
}
