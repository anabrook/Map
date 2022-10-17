
export interface Country {
  _id: string;
  name: string;
  country: string;
  location: { type: "Point"; coordinates: [number,number] };

}

//Array<Country>