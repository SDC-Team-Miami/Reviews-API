export type Photo = {
  id: number;
  url: string;
};

export type ReviewType = {
  review_id: string;
  rating: string;
  summary: string;
  recommend: string;
  response: string;
  body: string;
  date: string;
  reviewer_name: string;
  helpfulness: number;
  photos: Photo[] | null;
};

export type Ratings = Record<string, number>;

export type Recommended = {
  [bool in "true" | "false"]: number;
};

export type Characteristic = {
  id: number;
  value: string;
};

export type Characteristics = {
  Fit?: Characteristic;
  Comfort?: Characteristic;
  Quality?: Characteristic;
  Size?: Characteristic;
  Length?: Characteristic;
  Width?: Characteristic;
};

export interface Metadata {
  ratings: Ratings;
  recommended: Recommended;
  characteristics: Characteristics;
}
