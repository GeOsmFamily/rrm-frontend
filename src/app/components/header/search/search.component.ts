import { IpServiceService } from './../../../services/ip-service/ip-service.service';
import { ApiServiceService } from './../../../services/api/api-service.service';
import { StorageServiceService } from 'src/app/services/storage/storage-service.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DataHelper } from 'src/app/helpers/dataHelper';
import { MapHelper } from 'src/app/helpers/mapHelper';
import { ConfigProjetInterface } from 'src/app/interfaces/configProjetInterface';
import { FilterOptionInterface } from 'src/app/interfaces/filterOptionInterface';
import {
  Fill,
  Icon,
  Stroke,
  Style,
  VectorLayer,
  VectorSource,
  Text,
} from 'src/app/modules/ol';
import { HandleEmpriseSearch } from './handle/handle-emprise-search';
import { HandleLayerSearch } from './handle/handle-layer-search';
import { HandleNominatimSearch } from './handle/handle-nominatim-search';
import {
  debounceTime,
  filter,
  tap,
  switchMap,
  map,
  catchError,
} from 'rxjs/operators';
import { from, merge as observerMerge, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as $ from 'jquery';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { HandleAlertesSearch } from './handle/handle-alertes-search';
import { HandleEmsSearch } from './handle/handle-ems-search';
import { HandleInterventionsSearch } from './handle/handle-interventions-search';
import { HandlePimPdmsSearch } from './handle/handle-pimpdm-search';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  configProject: ConfigProjetInterface | undefined;

  form: FormGroup | undefined;

  isLoading;

  filterOptions: { [key: string]: Array<FilterOptionInterface> } = {
    nominatim: [],
    alertes: [],
    ems: [],
    interventions: [],
    pimpdms: [],
  };

  objectsIn = Object.keys;

  searchResultLayer: VectorLayer = new VectorLayer({
    source: new VectorSource(),
    style: (feature) => {
      var textLabel;
      var textStyle = {
        font: '15px Calibri,sans-serif',
        fill: new Fill({ color: '#000' }),
        stroke: new Stroke({ color: '#000', width: 1 }),
        padding: [10, 10, 10, 10],
        offsetX: 0,
        offsetY: 0,
      };
      if (feature.get('textLabel')) {
        textLabel = feature.get('textLabel');
        textStyle['text'] = textLabel;
        if (feature.getGeometry()?.getType() == 'Point') {
          textStyle.offsetY = 40;
          textStyle['backgroundFill'] = new Fill({ color: '#fff' });
        }
      }

      var color = '#ade36b';
      return new Style({
        fill: new Fill({
          color: [
            DataHelper.hexToRgb(color)!.r,
            DataHelper.hexToRgb(color)!.g,
            DataHelper.hexToRgb(color)!.b,
            0.5,
          ],
        }),
        stroke: new Stroke({
          color: environment.primaryColor,
          width: 6,
        }),
        image:
          feature.get('rrm') == 'alertes'
            ? new Icon({
                scale: 0.7,
                src: '/assets/images/Alertes-cir.svg',
              })
            : feature.get('rrm') == 'ems'
            ? new Icon({
                scale: 0.7,
                src: '/assets/images/MSA-cir.svg',
              })
            : feature.get('rrm') == 'interventions'
            ? new Icon({
                scale: 0.7,
                src: '/assets/images/Interventions-cir.svg',
              })
            : feature.get('rrm') == 'pimpdms'
            ? new Icon({
                scale: 0.7,
                src: '/assets/images/PDM_cir.svg',
              })
            : new Icon({
                scale: 0.7,
                src: '/assets/icones/marker-search.png',
              }),
        text: new Text(textStyle),
      });
    },
    //@ts-ignore
    type_layer: 'searchResultLayer',
    nom: 'searchResultLayer',
  });

  clearSearch() {
    this.form?.get('searchWord')?.patchValue('');
    var mapHelper = new MapHelper();
    if (mapHelper.getLayerByName('searchResultLayer').length > 0) {
      var searchResultLayer = mapHelper.getLayerByName('searchResultLayer')[0];

      searchResultLayer.getSource().clear();
    }
  }

  displayAutocompleFn(option: FilterOptionInterface) {
    if (option.typeOption == 'nominatim') {
      return new HandleNominatimSearch().displayWith(option);
    } else if (option.typeOption == 'alertes') {
      return new HandleAlertesSearch().displayWith(option);
    } else if (option.typeOption == 'ems') {
      return new HandleEmsSearch().displayWith(option);
    } else if (option.typeOption == 'interventions') {
      return new HandleInterventionsSearch().displayWith(option);
    } else if (option.typeOption == 'pimpdms') {
      return new HandlePimPdmsSearch().displayWith(option);
    }
    return '';
  }

  optionAutocomplteSelected(selected: MatAutocompleteSelectedEvent) {
    var option: FilterOptionInterface = selected.option
      ? selected.option.value
      : undefined;
    if (option) {
      if (option.typeOption == 'nominatim') {
        new HandleNominatimSearch().optionSelected(option);
      } else if (option.typeOption == 'alertes') {
        new HandleAlertesSearch().optionSelected(option);
      } else if (option.typeOption == 'ems') {
        new HandleEmsSearch().optionSelected(option);
      } else if (option.typeOption == 'interventions') {
        new HandleInterventionsSearch().optionSelected(option);
      } else if (option.typeOption == 'pimpdms') {
        new HandlePimPdmsSearch().optionSelected(option);
      }
    }
  }

  constructor(
    public storageService: StorageServiceService,
    public apiService: ApiServiceService,
    public fb: FormBuilder,
    public ipService: IpServiceService,
    public analyticService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.ipService.getIP();
    this.isLoading = false;
    this.storageService.states.subscribe((value) => {
      if (value.loadProjectData) {
        this.configProject = this.storageService.getConfigProjet();
        this.initialiseForm();
        this.initialiseSearchResultLayer();
      }
    });
  }

  initialiseForm() {
    var empriseControl = new FormControl('', [Validators.minLength(2)]);
    empriseControl.valueChanges
      .pipe(
        debounceTime(500),
        filter((value) => typeof value === 'string' && value.length > 2),
        tap(() => {
          this.isLoading = true;
          console.log('loading');
        }),
        switchMap((value) => {
          return observerMerge(...this.getQuerryForSerach(value)).pipe(
            map((value) => value),
            catchError((_err) => of({ error: true }))
          );
        })
      )
      .subscribe((value: any) => {
        if (value.type == 'nominatim') {
          this.filterOptions['nominatim'] =
            new HandleNominatimSearch().formatDataForTheList(value.value);
        } else if (value.type == 'alertes') {
          this.filterOptions['alertes'] =
            new HandleAlertesSearch().formatDataForTheList(value.value.hits);
        } else if (value.type == 'ems') {
          this.filterOptions['ems'] =
            new HandleEmsSearch().formatDataForTheList(value.value.hits);
        } else if (value.type == 'interventions') {
          this.filterOptions['interventions'] =
            new HandleInterventionsSearch().formatDataForTheList(
              value.value.hits
            );
        } else if (value.type == 'pimpdms') {
          this.filterOptions['pimpdms'] =
            new HandlePimPdmsSearch().formatDataForTheList(value.value.hits);
        }
        this.isLoading = false;
        this.cleanFilterOptions();
      });

    this.form = this.fb.group({
      searchWord: empriseControl,
    });
  }

  getQuerryForSerach(value: string): Observable<{
    type: string;
    error: boolean;
    value: { [key: string]: any };
  }>[] {
    $.post(
      environment.url_prefix + 'analytics',
      {
        type: 'search',
        keyword: value,
        ip: this.ipService.getIP(),
      },
      (data) => {
        // data
      }
    );

    var querryObs = [
      from(
        this.apiService.post_requete('searchCouche', {
          word: value.toString(),
        })
      ).pipe(
        map((val: { type: String; value: any }) => {
          return { type: 'layer', value: val, error: false };
        }),
        catchError((_err) =>
          of({ error: true, type: 'layer', value: { features: [] } })
        )
      ),
    ];
    if (this.storageService.getExtentOfProject()) {
      querryObs.push(
        from(
          this.apiService.getRequestFromOtherHost(
            'https://nominatim.openstreetmap.org/search?q=' +
              value.toString() +
              '&format=geojson&polygon_geojson=1&addressdetails=1&countrycodes=' +
              environment.countrycode
          )
        ).pipe(
          map((val: { type: String; value: any }) => {
            return { type: 'nominatim', value: val, error: false };
          }),
          catchError((_err) =>
            of({ error: true, type: 'nominatim', value: { features: [] } })
          )
        )
      );
    }
    if (this.storageService.alertes.value.data.length > 0) {
      querryObs.push(
        from(
          this.apiService.postRequestFromOtherHost(
            'https://meilisearch.rrm-cameroun.cm/indexes/alertes/search',
            { q: value.toString() }
          )
        ).pipe(
          map((val: { type: String; value: any }) => {
            return { type: 'alertes', value: val, error: false };
          }),
          catchError((_err) =>
            of({ error: true, type: 'alertes', value: { features: [] } })
          )
        )
      );
    }
    if (this.storageService.ems.value.data.length > 0) {
      querryObs.push(
        from(
          this.apiService.postRequestFromOtherHost(
            'https://meilisearch.rrm-cameroun.cm/indexes/ems/search',
            { q: value.toString() }
          )
        ).pipe(
          map((val: { type: String; value: any }) => {
            return { type: 'ems', value: val, error: false };
          }),
          catchError((_err) =>
            of({ error: true, type: 'ems', value: { features: [] } })
          )
        )
      );
    }
    if (this.storageService.interventions.value.data.length > 0) {
      querryObs.push(
        from(
          this.apiService.postRequestFromOtherHost(
            'https://meilisearch.rrm-cameroun.cm/indexes/interventions/search',
            { q: value.toString() }
          )
        ).pipe(
          map((val: { type: String; value: any }) => {
            return { type: 'interventions', value: val, error: false };
          }),
          catchError((_err) =>
            of({ error: true, type: 'interventions', value: { features: [] } })
          )
        )
      );
    }
    if (this.storageService.pimpdms.value.data.length > 0) {
      querryObs.push(
        from(
          this.apiService.postRequestFromOtherHost(
            'https://meilisearch.rrm-cameroun.cm/indexes/pimpdms/search',
            { q: value.toString() }
          )
        ).pipe(
          map((val: { type: String; value: any }) => {
            return { type: 'pimpdms', value: val, error: false };
          }),
          catchError((_err) =>
            of({ error: true, type: 'pimpdms', value: { features: [] } })
          )
        )
      );
    }
    if (this.storageService.configProject.value.limites.length > 0) {
      querryObs.push(
        from(
          this.apiService.post_requete('searchLimite', {
            word: value.toString(),
          })
        ).pipe(
          map((val: { type: String; value: any }) => {
            return { type: 'limites', value: val, error: false };
          }),
          catchError((_err) =>
            of({ error: true, type: 'limites', value: { features: [] } })
          )
        )
      );
    }

    return querryObs;
  }

  cleanFilterOptions() {
    for (const key in this.filterOptions) {
      if (this.filterOptions.hasOwnProperty(key)) {
        const element = this.filterOptions[key];
        if (element.length == 0) {
          this.filterOptions[key] = [];
        }
      }
    }
  }

  initialiseSearchResultLayer() {
    var mapHelper = new MapHelper();
    if (mapHelper.getLayerByName('searchResultLayer').length > 0) {
      this.searchResultLayer = mapHelper.getLayerByName('searchResultLayer')[0];
      this.searchResultLayer.setZIndex(1000);
    } else {
      this.searchResultLayer.setZIndex(1000);
      mapHelper.map?.addLayer(this.searchResultLayer);
    }
    if (mapHelper.getLayerByName('searchResultLayer').length > 0) {
      mapHelper.getLayerByName('searchResultLayer')[0].getSource().clear();
    }
  }
}
