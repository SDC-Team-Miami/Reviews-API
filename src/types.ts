///////////////////////////////// Metadata
export interface IMetadata {
  ratings: Record<string, number>;
  recommended: IRecommended;
  characteristics: Characteristics;
}

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

///////////////////////////////// Recommended
export interface IRecommended {
  false: number;
  true: number;
}

///////////////////////////////// Request
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
