import { Feature, VectorLayer, GeoJSON } from 'src/app/modules/ol';
import { AppInjector } from './../../../../helpers/injectorHelper';
import { StorageServiceService } from 'src/app/services/storage/storage-service.service';
import { FilterOptionInterface } from 'src/app/interfaces/filterOptionInterface';
import { MapHelper } from 'src/app/helpers/mapHelper';
import { environment } from 'src/environments/environment';
export class HandleAlertesSearch {
  storageService: StorageServiceService = AppInjector.get(
    StorageServiceService
  );

  formatDataForTheList(responseData: any): Array<FilterOptionInterface> {
    var responses = Array();

    responseData.forEach((element) => {
      if (element.valide == 'oui') {
        var geometry = {
          type: 'Point',
          coordinates: [element.longitude, element.latitude],
        };

        responses.push({
          type: 'Feature',
          geometry: geometry,
          properties: element,
        });
      }
    });

    var geojson = {
      type: 'FeatureCollection',
      features: responses,
    };

    var response: Array<FilterOptionInterface> = [];
    for (let index = 0; index < geojson.features.length; index++) {
      const element = geojson.features[index];
      var features = new GeoJSON().readFeatures(element, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      });

      if (features.length > 0) {
        var details = Array();
        if (this._formatType(element)) {
          details.push(this._formatType(element));
        }

        response.push({
          name: this._formatCode(element),
          id: features[0].get('id'),
          geometry: features[0].getGeometry(),
          typeChoc: this._formatType(element),
          details: details.join(', '),
          typeOption: 'alertes',
          ...features[0].getProperties(),
        });
      }
    }

    return response;
  }

  displayWith(data: FilterOptionInterface): string {
    if (data) {
      return data.name + ' (' + data.details + ')';
    } else {
      return '';
    }
  }

  _formatCode(option) {
    return option.properties.codeAlerte;
  }

  _formatType(option) {
    return option.properties.typeChoc;
  }

  optionSelected(emprise: FilterOptionInterface) {
    if (!emprise.geometry) {
    } else {
      this._addGeometryAndZoomTO(emprise);
    }
  }

  _addGeometryAndZoomTO(emprise: FilterOptionInterface) {
    if (emprise.geometry) {
      var mapHelper = new MapHelper();
      if (mapHelper.getLayerByName('searchResultLayer').length > 0) {
        var searchResultLayer = new VectorLayer();
        searchResultLayer = mapHelper.getLayerByName('searchResultLayer')[0];

        var feature = new Feature();
        var textLabel = emprise.name;

        feature.set('textLabel', textLabel);
        feature.set('rrm', 'alertes');
        feature.set('acteur', emprise.acteur);
        feature.set('arrondissement', emprise.arrondissement);
        feature.set('dateAlerte', emprise.dateAlerte);
        feature.set('departement', emprise.departement);
        feature.set('menagesAffectes', emprise.menagesAffectes);
        feature.set('personnesAffectees', emprise.personnesAffectees);
        feature.set('resume', emprise.resume);
        feature.set('typeChoc', emprise.typeChoc);
        let obj = JSON.parse(emprise.fichierAlerte);
        try {
          feature.set(
            'urlRapport',
            environment.url_dashboard + 'storage/' + obj[0].download_link
          );
          feature.set('originalName', obj[0].original_name);
        } catch (error) {
          feature.set('urlRapport', null);
          feature.set('originalName', null);
        }

        feature.setGeometry(emprise.geometry);

        searchResultLayer.getSource().clear();

        searchResultLayer.getSource().addFeature(feature);

        var extent = emprise.geometry.getExtent();

        mapHelper.fit_view(extent, 16);
      }
    }
  }
}
