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

export interface IMetadata {
  ratings: Record<string, number>;
  recommended: IRecommended;
  characteristics: Characteristics;
}
export interface IRecommended {
  false: number;
  true: number;
}
export interface IRequest {
  query?: IQuery;
  body?: IBody;
}
export interface IQuery {
  product_id: string;
  page?: string;
  count?: string;
}
export interface IBody {
  rating?: number;
  summary?: string;
  body?: string;
  recommend?: boolean;
  name?: string;
  email?: string;
  photos?: string;
  characteristics: Record<string, number>;
}
