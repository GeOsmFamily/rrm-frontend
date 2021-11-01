import { MapHelper } from 'src/app/helpers/mapHelper';

import {
  Feature,
  Point,
  GeoJSON,
  VectorLayer,
  Style,
  Fill,
  CircleStyle,
  Cluster,
  VectorSource,
  Stroke,
  Text,
  Icon,
} from 'src/app/modules/ol';
import { transform } from 'ol/proj';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-rrm-modal',
  templateUrl: './rrm-modal.component.html',
  styleUrls: ['./rrm-modal.component.scss'],
})
export class RrmModalComponent implements OnInit {
  markerAlerte;
  markerEms;
  markerIntervention;
  markerPimPdm;
  alerteCount;
  emsCount;
  interventionCount;
  pimpdmCount;
  alerteChecked = false;
  emsChecked = false;
  interventionChecked = false;
  pimpdmChecked = false;
  clustersAlertes;
  clustersEms;
  clustersInterventions;
  clustersPimPdms;
  constructor() {}

  ngOnInit(): void {
    this.alerteCount = localStorage.getItem('alerteCount');
    this.emsCount = localStorage.getItem('emsCount');
    this.interventionCount = localStorage.getItem('interventionCount');
    this.pimpdmCount = localStorage.getItem('pimpdmCount');
  }

  getBadgeAlertes() {
    return this.alerteCount;
  }

  getBadgeEms() {
    return this.emsCount;
  }

  getBadgeInterventions() {
    return this.interventionCount;
  }

  getBadgePimPdms() {
    return this.pimpdmCount;
  }

  loadAlertes() {
    this.alerteChecked = !this.alerteChecked;
    var mapHelper = new MapHelper();
    if (this.alerteChecked) {
      $.get(
        'https://meilisearch.rrm-cameroun.cm/indexes/alertes/documents',
        (data) => {
          var responses = Array();

          data.forEach((element) => {
            var geometry = {
              type: 'Point',
              coordinates: [element.longitude, element.latitude],
            };

            responses.push({
              type: 'Feature',
              geometry: geometry,
              properties: element,
            });
          });

          var geojson = {
            type: 'FeatureCollection',
            features: responses,
          };
          var point = Array();
          for (var i = 0; i < geojson.features.length; i++) {
            for (
              var j = 0;
              j < geojson.features[i].geometry.coordinates.length;
              j++
            ) {
              var coord = transform(
                geojson.features[i].geometry.coordinates[j],
                'EPSG:4326',
                'EPSG:3857'
              );

              this.markerAlerte = new Feature({
                geometry: new Point(coord),
                data: { i: i, j: j, type: 'point' },
              });

              point.push(this.markerAlerte);
            }
          }

          var vectorFeature = new GeoJSON().readFeatures(geojson, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',
          });

          var vectorSource = new VectorSource({
            features: point,
          });

          vectorSource.addFeatures(vectorFeature);

          const clusterSource = new Cluster({
            distance: 80,
            source: vectorSource,
          });

          const styleCache = {};
          this.clustersAlertes = new VectorLayer({
            source: clusterSource,
            style: function (feature) {
              const size = feature.get('features').length;
              if (size != 1) {
                let style = styleCache[size];
                if (!style) {
                  style = new Style({
                    image: new CircleStyle({
                      radius: 15,
                      stroke: new Stroke({
                        color: '#fff',
                      }),
                      fill: new Fill({
                        color: '#ff5d5d',
                      }),
                    }),
                    text: new Text({
                      text: size.toString(),
                      fill: new Fill({
                        color: '#fff',
                      }),
                    }),
                  });
                  styleCache[size] = style;
                }
                return style;
              } else {
                var styleDefaultII = new Style({
                  image: new Icon({
                    scale: 0.8,
                    src: 'assets/images/Alertes-cir.svg',
                  }),
                });

                return styleDefaultII;
              }
            },
          });

          this.clustersAlertes.set('nom', 'alertes');
          this.clustersAlertes.set('type_layer', 'alertes');
          var maxZindex = mapHelper.getMaxZindexInMap();
          this.clustersAlertes.setZIndex(maxZindex + 1);
          mapHelper.addLayerToMap(this.clustersAlertes);
        }
      );
    } else {
      mapHelper.removeLayerToMap(this.clustersAlertes!);
    }
  }

  loadEms() {
    this.emsChecked = !this.emsChecked;
    var mapHelper = new MapHelper();
    if (this.emsChecked) {
      $.get(
        'https://meilisearch.rrm-cameroun.cm/indexes/ems/documents',
        (data) => {
          var responses = Array();

          data.forEach((element) => {
            var geometry = {
              type: 'Point',
              coordinates: [element.longitude, element.latitude],
            };

            responses.push({
              type: 'Feature',
              geometry: geometry,
              properties: element,
            });
          });

          var geojson = {
            type: 'FeatureCollection',
            features: responses,
          };
          var point = Array();
          for (var i = 0; i < geojson.features.length; i++) {
            for (
              var j = 0;
              j < geojson.features[i].geometry.coordinates.length;
              j++
            ) {
              var coord = transform(
                geojson.features[i].geometry.coordinates[j],
                'EPSG:4326',
                'EPSG:3857'
              );

              this.markerEms = new Feature({
                geometry: new Point(coord),
                data: { i: i, j: j, type: 'point' },
              });

              point.push(this.markerEms);
            }
          }

          var vectorFeature = new GeoJSON().readFeatures(geojson, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',
          });

          var vectorSource = new VectorSource({
            features: point,
          });

          vectorSource.addFeatures(vectorFeature);

          const clusterSource = new Cluster({
            distance: 80,
            source: vectorSource,
          });

          const styleCache = {};
          this.clustersEms = new VectorLayer({
            source: clusterSource,
            style: function (feature) {
              const size = feature.get('features').length;
              if (size != 1) {
                let style = styleCache[size];
                if (!style) {
                  style = new Style({
                    image: new CircleStyle({
                      radius: 15,
                      stroke: new Stroke({
                        color: '#fff',
                      }),
                      fill: new Fill({
                        color: '#24b5ba',
                      }),
                    }),
                    text: new Text({
                      text: size.toString(),
                      fill: new Fill({
                        color: '#fff',
                      }),
                    }),
                  });
                  styleCache[size] = style;
                }
                return style;
              } else {
                var styleDefaultII = new Style({
                  image: new Icon({
                    scale: 0.8,
                    src: 'assets/images/MSA-cir.svg',
                  }),
                });

                return styleDefaultII;
              }
            },
          });

          this.clustersEms.set('nom', 'ems');
          this.clustersEms.set('type_layer', 'ems');
          var maxZindex = mapHelper.getMaxZindexInMap();
          this.clustersEms.setZIndex(maxZindex + 1);
          mapHelper.addLayerToMap(this.clustersEms);
        }
      );
    } else {
      mapHelper.removeLayerToMap(this.clustersEms!);
    }
  }

  loadInterventions() {
    this.interventionChecked = !this.interventionChecked;
    var mapHelper = new MapHelper();
    if (this.interventionChecked) {
      $.get(
        'https://meilisearch.rrm-cameroun.cm/indexes/interventions/documents',
        (data) => {
          var responses = Array();

          data.forEach((element) => {
            var geometry = {
              type: 'Point',
              coordinates: [element.longitude, element.latitude],
            };

            responses.push({
              type: 'Feature',
              geometry: geometry,
              properties: element,
            });
          });

          var geojson = {
            type: 'FeatureCollection',
            features: responses,
          };
          var point = Array();
          for (var i = 0; i < geojson.features.length; i++) {
            for (
              var j = 0;
              j < geojson.features[i].geometry.coordinates.length;
              j++
            ) {
              var coord = transform(
                geojson.features[i].geometry.coordinates[j],
                'EPSG:4326',
                'EPSG:3857'
              );

              this.markerIntervention = new Feature({
                geometry: new Point(coord),
                data: { i: i, j: j, type: 'point' },
              });

              point.push(this.markerIntervention);
            }
          }

          var vectorFeature = new GeoJSON().readFeatures(geojson, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',
          });

          var vectorSource = new VectorSource({
            features: point,
          });

          vectorSource.addFeatures(vectorFeature);

          const clusterSource = new Cluster({
            distance: 80,
            source: vectorSource,
          });

          const styleCache = {};
          this.clustersInterventions = new VectorLayer({
            source: clusterSource,
            style: function (feature) {
              const size = feature.get('features').length;
              if (size != 1) {
                let style = styleCache[size];
                if (!style) {
                  style = new Style({
                    image: new CircleStyle({
                      radius: 15,
                      stroke: new Stroke({
                        color: '#fff',
                      }),
                      fill: new Fill({
                        color: '#bb5cf7',
                      }),
                    }),
                    text: new Text({
                      text: size.toString(),
                      fill: new Fill({
                        color: '#fff',
                      }),
                    }),
                  });
                  styleCache[size] = style;
                }
                return style;
              } else {
                var styleDefaultII = new Style({
                  image: new Icon({
                    scale: 0.8,
                    src: 'assets/images/Interventions-cir.svg',
                  }),
                });

                return styleDefaultII;
              }
            },
          });

          this.clustersInterventions.set('nom', 'interventions');
          this.clustersInterventions.set('type_layer', 'interventions');
          var maxZindex = mapHelper.getMaxZindexInMap();
          this.clustersInterventions.setZIndex(maxZindex + 1);
          mapHelper.addLayerToMap(this.clustersInterventions);
        }
      );
    } else {
      mapHelper.removeLayerToMap(this.clustersInterventions!);
    }
  }

  loadPimpdms() {
    this.pimpdmChecked = !this.pimpdmChecked;
    var mapHelper = new MapHelper();
    if (this.pimpdmChecked) {
      $.get(
        'https://meilisearch.rrm-cameroun.cm/indexes/pimpdms/documents',
        (data) => {
          var responses = Array();

          data.forEach((element) => {
            var geometry = {
              type: 'Point',
              coordinates: [element.longitude, element.latitude],
            };

            responses.push({
              type: 'Feature',
              geometry: geometry,
              properties: element,
            });
          });

          var geojson = {
            type: 'FeatureCollection',
            features: responses,
          };
          var point = Array();
          for (var i = 0; i < geojson.features.length; i++) {
            for (
              var j = 0;
              j < geojson.features[i].geometry.coordinates.length;
              j++
            ) {
              var coord = transform(
                geojson.features[i].geometry.coordinates[j],
                'EPSG:4326',
                'EPSG:3857'
              );

              this.markerPimPdm = new Feature({
                geometry: new Point(coord),
                data: { i: i, j: j, type: 'point' },
              });

              point.push(this.markerPimPdm);
            }
          }

          var vectorFeature = new GeoJSON().readFeatures(geojson, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',
          });

          var vectorSource = new VectorSource({
            features: point,
          });

          vectorSource.addFeatures(vectorFeature);

          const clusterSource = new Cluster({
            distance: 80,
            source: vectorSource,
          });

          const styleCache = {};
          this.clustersPimPdms = new VectorLayer({
            source: clusterSource,
            style: function (feature) {
              const size = feature.get('features').length;
              if (size != 1) {
                let style = styleCache[size];
                if (!style) {
                  style = new Style({
                    image: new CircleStyle({
                      radius: 15,
                      stroke: new Stroke({
                        color: '#fff',
                      }),
                      fill: new Fill({
                        color: '#0cd085',
                      }),
                    }),
                    text: new Text({
                      text: size.toString(),
                      fill: new Fill({
                        color: '#fff',
                      }),
                    }),
                  });
                  styleCache[size] = style;
                }
                return style;
              } else {
                var styleDefaultII = new Style({
                  image: new Icon({
                    scale: 0.8,
                    src: 'assets/images/PDM_cir.svg',
                  }),
                });

                return styleDefaultII;
              }
            },
          });

          this.clustersPimPdms.set('nom', 'pimpdms');
          this.clustersPimPdms.set('type_layer', 'pimpdms');
          var maxZindex = mapHelper.getMaxZindexInMap();
          this.clustersPimPdms.setZIndex(maxZindex + 1);
          mapHelper.addLayerToMap(this.clustersPimPdms);
        }
      );
    } else {
      mapHelper.removeLayerToMap(this.clustersPimPdms!);
    }
  }
}
