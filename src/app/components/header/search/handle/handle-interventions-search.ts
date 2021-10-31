import { environment } from './../../../../../environments/environment';
import { Feature } from 'src/app/modules/ol';
import { FilterOptionInterface } from 'src/app/interfaces/filterOptionInterface';
import GeoJSON from 'ol/format/GeoJSON';
import { MapHelper } from 'src/app/helpers/mapHelper';
export class HandleInterventionsSearch {
  formatDataForTheList(responseData: any): Array<FilterOptionInterface> {
    var responses = Array();

    responseData.forEach((element) => {
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

    var name = {
      name: 'urn:ogc:def:crs:OGC:1.3:CRS84',
    };

    var crs = {
      type: 'interventions',
      properties: name,
    };

    var geojson = {
      type: 'FeatureCollection',
      crs: crs,
      features: responses,
    };

    console.log(geojson);

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
          typeOption: 'interventions',
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
    return option.properties.codeIntervention;
  }

  _formatType(option) {
    return option.properties.acteur;
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
        var searchResultLayer =
          mapHelper.getLayerByName('searchResultLayer')[0];

        var feature = new Feature();
        var textLabel = emprise.name;

        feature.set('textLabel', textLabel);
        feature.set('rrm', 'interventions');
        feature.set('acteur', emprise.acteur);
        feature.set('arrondissement', emprise.arrondissement);
        feature.set('dateIntervention', emprise.dateIntervention);
        feature.set('departement', emprise.departement);
        feature.set(
          'beneficiaireAssistanceLatrine',
          emprise.beneficiaireAssistanceLatrine
        );
        feature.set('beneficiaireFeminin', emprise.beneficiaireFeminin);
        feature.set('beneficiaireHote', emprise.beneficiaireHote);
        feature.set('beneficiaireHygiene', emprise.beneficiaireHygiene);
        feature.set('beneficiaireIdp', emprise.beneficiaireIdp);
        feature.set('beneficiaireMasculin', emprise.beneficiaireMasculin);
        feature.set('beneficiaireRefugier', emprise.beneficiaireRefugier);
        feature.set('beneficiaireRetournes', emprise.beneficiaireRetournes);
        feature.set(
          'beneficiairesAssistanceAlimentaire',
          emprise.beneficiairesAssistanceAlimentaire
        );
        feature.set(
          'beneficiairesAssistanceEau',
          emprise.beneficiairesAssistanceEau
        );
        feature.set(
          'beneficiairesMenagersEssentiels',
          emprise.beneficiairesMenagersEssentiels
        );
        feature.set('individusBeneficiaire', emprise.individusBeneficiaire);
        feature.set('kitAbrisDistribue', emprise.kitAbrisDistribue);
        feature.set('kitArticleDistribue', emprise.kitArticleDistribue);
        feature.set('latrinesConstruites', emprise.latrinesConstruites);
        feature.set('menageBeneficiaire', emprise.menageBeneficiaire);
        feature.set('pointEauChlores', emprise.pointEauChlores);
        feature.set('pointsEau', emprise.pointsEau);
        feature.set('secteurIntervention', emprise.secteurIntervention);
        feature.set('resume', emprise.resume);
        let obj = JSON.parse(emprise.fichierIntervention);
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
