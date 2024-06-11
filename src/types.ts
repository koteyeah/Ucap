// types.ts
type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

type PlaceInf = {
  id: string;
  name: string;
  address: string;
  addressComponents: AddressComponent[];
  genres: string[];
  overview: string | null;
  lat: number;
  lng: number;
  website?: string | null;
  postNum: number;
};
type PostInf = {
  placeId: string;
  comment: string | null;
  uid: string;
  timestamp: Date;
  imgUrl: string;
  placeInf: any;
};
export type { AddressComponent, PlaceInf, PostInf };
