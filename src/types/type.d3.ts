export type NodeFeature = {
  type: string;
  geometry: {
    type: string;
    coordinates: number[];
  };
  properties: {
    [key: string]: any;
  };
};

export type LinkFeature = {
  type: string;
  geometry: {
    type: string;
    coordinates: number[][];
  };
  properties: {
    [key: string]: any;
  };
};
