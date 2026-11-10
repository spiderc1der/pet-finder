/**
 * defines the data models and API response types used by the Pet Finder
 *
 * Pet represents a pet document from MongoDB
 * PetResponse & OutcomesResponse represent the possible API response formats
 */

export interface Pet {
  _id: string;
  pet_name: string;
  newborn_id: string;
  baby_id: string;
  litter_name: string;
  species: string;
  month: string;
  year: string;
  archive_link: string;
  PPS: string;
  artist_link: string;
  artist_name: string;
  notes?: string;
}

export interface PetResponse {
  type: 'pet';
  data: Pet;
}

export interface OutcomesResponse {
  type: 'outcomes';
  data: Pet[];
}

export type PetApiResponse = PetResponse | OutcomesResponse;