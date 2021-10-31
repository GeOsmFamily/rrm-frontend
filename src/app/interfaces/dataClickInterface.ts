import { Coordinate } from 'ol/coordinate';
import { FeatureLike } from 'ol/Feature';
import { Feature } from '../modules/ol';

export interface DataFromClickOnMapInterface {
  type: 'vector' | 'raster' | 'clear' | 'search';
  data: {
    coord: Coordinate;
    layers: Array<any>;
    feature?: FeatureLike;
    data?: {};
  };
}
