import { AlertesInterface } from './../../interfaces/alertesInterfaces';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, from, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  CarteInterface,
  GroupCarteInterface,
} from 'src/app/interfaces/carteInterface';
import { ConfigProjetInterface } from 'src/app/interfaces/configProjetInterface';
import { GroupThematiqueInterface } from 'src/app/interfaces/groupeInterface';
import { ResponseOfSerachLimitInterface } from 'src/app/interfaces/responseSearchLimitInterface';
import { ApiServiceService } from '../api/api-service.service';
import { GeoJSON } from 'src/app/modules/ol';
import { CoucheInterface } from 'src/app/interfaces/coucheInterface';
import { Tokens } from 'src/app/interfaces/loginInterface';
import { DashboardServiceService } from '../dashboard/dashboard-service.service';
import { HttpHeaders } from '@angular/common/http';
import { EmsInterface } from 'src/app/interfaces/emsInterface';
import { InterventionsInterface } from 'src/app/interfaces/interventionsInterface';
import { PimPdmsInterface } from 'src/app/interfaces/pimpdmsInterface';

@Injectable({
  providedIn: 'root',
})
export class StorageServiceService {
  constructor(
    public apiApiService: ApiServiceService,
    public dashboardService: DashboardServiceService
  ) {}

  adminstrativeLimitLoad: BehaviorSubject<ResponseOfSerachLimitInterface> =
    new BehaviorSubject<ResponseOfSerachLimitInterface>(undefined!);

  states: BehaviorSubject<{ loadProjectData: boolean }> = new BehaviorSubject<{
    loadProjectData: boolean;
  }>({ loadProjectData: false });

  statesRRM: BehaviorSubject<{ loadRRMData: boolean }> = new BehaviorSubject<{
    loadRRMData: boolean;
  }>({ loadRRMData: false });

  public groupThematiques: BehaviorSubject<Array<GroupThematiqueInterface>> =
    new BehaviorSubject(Array<GroupThematiqueInterface>());

  public groupCartes: BehaviorSubject<Array<GroupCarteInterface>> =
    new BehaviorSubject(Array<GroupCarteInterface>());

  public configProject: BehaviorSubject<ConfigProjetInterface> =
    new BehaviorSubject<ConfigProjetInterface>({} as ConfigProjetInterface);

  public tokenProject: BehaviorSubject<Tokens> = new BehaviorSubject<Tokens>(
    {} as Tokens
  );

  public alertes: BehaviorSubject<AlertesInterface> =
    new BehaviorSubject<AlertesInterface>({} as AlertesInterface);

  public ems: BehaviorSubject<EmsInterface> = new BehaviorSubject<EmsInterface>(
    {} as EmsInterface
  );

  public interventions: BehaviorSubject<InterventionsInterface> =
    new BehaviorSubject<InterventionsInterface>({} as InterventionsInterface);

  public pimpdms: BehaviorSubject<PimPdmsInterface> =
    new BehaviorSubject<PimPdmsInterface>({} as PimPdmsInterface);

  loadProjectData(): Promise<{ error: boolean; msg?: string }> {
    return new Promise((resolve, reject) => {
      forkJoin([
        from(this.apiApiService.getRequest('geoportail/getCatalogue')),
        from(
          this.apiApiService.getRequest('api/v1/RestFull/catalogAdminCartes')
        ),
        from(
          this.apiApiService.getRequestFromOtherHost('/assets/country.geojson')
        ),
        from(this.apiApiService.getRequest('geoportail/getAllExtents')),
        from(this.apiApiService.getRequest('config_bd_projet')),
        from(
          this.dashboardService.post_requete('api/login', {
            email: 'gautier@rrm-cameroun.cm',
            password: 'Adminrrm@123',
            remember_me: true,
          })
        ),
      ])
        .pipe(catchError((err) => of({ error: true, msg: err })))
        .subscribe((results) => {
          this.groupThematiques.next(results[0]);
          this.groupCartes.next(results[1]);
          this.configProject.next({
            bbox: results[4]['bbox'],
            limites: results[4]['limites'],
            geosignetsProject: results[3],
            roiGeojson: results[2]['features'][0]['geometry'],
          });
          this.tokenProject.next({
            access_token: results[5]['data']['tokens']['access_token'],
            expires_in: results[5]['data']['tokens']['expires_in'],
            refresh_token: results[5]['data']['tokens']['refresh_token'],
            token_type: results[5]['data']['tokens']['token_type'],
          });

          this.states.getValue().loadProjectData = true;
          this.states.next(this.states.getValue());
          resolve({
            msg: 'Success',
            error: false,
          });
        });
    });
  }

  loadRRMdata(): Promise<{ error: boolean; msg?: string }> {
    return new Promise((resolve, reject) => {
      forkJoin([
        from(this.dashboardService.getRequest('api/alertes')),
        from(this.dashboardService.getRequest('api/ems')),
        from(this.dashboardService.getRequest('api/interventions')),
        from(this.dashboardService.getRequest('api/pimpdms')),
        from(this.dashboardService.getRequest('api/alertes?page=2')),
        from(this.dashboardService.getRequest('api/alertes?page=3')),
        from(this.dashboardService.getRequest('api/alertes?page=4')),
        from(this.dashboardService.getRequest('api/alertes?page=5')),
        from(this.dashboardService.getRequest('api/alertes?page=6')),

        from(this.dashboardService.getRequest('api/ems?page=2')),
        from(this.dashboardService.getRequest('api/ems?page=3')),
        from(this.dashboardService.getRequest('api/ems?page=4')),
        from(this.dashboardService.getRequest('api/ems?page=5')),
        from(this.dashboardService.getRequest('api/ems?page=6')),

        from(this.dashboardService.getRequest('api/interventions?page=2')),
        from(this.dashboardService.getRequest('api/interventions?page=3')),
        from(this.dashboardService.getRequest('api/interventions?page=4')),
        from(this.dashboardService.getRequest('api/interventions?page=5')),
        from(this.dashboardService.getRequest('api/interventions?page=6')),

        from(this.dashboardService.getRequest('api/pimpdms?page=2')),
        from(this.dashboardService.getRequest('api/pimpdms?page=3')),
        from(this.dashboardService.getRequest('api/pimpdms?page=4')),
        from(this.dashboardService.getRequest('api/pimpdms?page=5')),
        from(this.dashboardService.getRequest('api/pimpdms?page=6')),
      ])
        .pipe(catchError((err) => of({ error: true, msg: err })))
        .subscribe((results) => {
          var data = results[0]['data'];
          for (let index = 0; index < results[4]['data'].length; index++) {
            const element = results[4]['data'][index];
            data.push(element);
          }
          for (let index = 0; index < results[5]['data'].length; index++) {
            const element = results[5]['data'][index];
            data.push(element);
          }
          for (let index = 0; index < results[6]['data'].length; index++) {
            const element = results[6]['data'][index];
            data.push(element);
          }
          for (let index = 0; index < results[7]['data'].length; index++) {
            const element = results[7]['data'][index];
            data.push(element);
          }
          for (let index = 0; index < results[8]['data'].length; index++) {
            const element = results[8]['data'][index];
            data.push(element);
          }

          var data1 = results[1]['data'];
          for (let index = 0; index < results[9]['data'].length; index++) {
            const element = results[9]['data'][index];
            data1.push(element);
          }
          for (let index = 0; index < results[10]['data'].length; index++) {
            const element = results[10]['data'][index];
            data1.push(element);
          }
          for (let index = 0; index < results[11]['data'].length; index++) {
            const element = results[11]['data'][index];
            data1.push(element);
          }
          for (let index = 0; index < results[12]['data'].length; index++) {
            const element = results[12]['data'][index];
            data1.push(element);
          }
          for (let index = 0; index < results[13]['data'].length; index++) {
            const element = results[13]['data'][index];
            data1.push(element);
          }

          var data2 = results[2]['data'];
          for (let index = 0; index < results[14]['data'].length; index++) {
            const element = results[14]['data'][index];
            data2.push(element);
          }
          for (let index = 0; index < results[15]['data'].length; index++) {
            const element = results[15]['data'][index];
            data2.push(element);
          }
          for (let index = 0; index < results[16]['data'].length; index++) {
            const element = results[16]['data'][index];
            data2.push(element);
          }
          for (let index = 0; index < results[17]['data'].length; index++) {
            const element = results[17]['data'][index];
            data2.push(element);
          }
          for (let index = 0; index < results[18]['data'].length; index++) {
            const element = results[18]['data'][index];
            data2.push(element);
          }

          var data3 = results[3]['data'];
          for (let index = 0; index < results[19]['data'].length; index++) {
            const element = results[19]['data'][index];
            data3.push(element);
          }
          for (let index = 0; index < results[20]['data'].length; index++) {
            const element = results[20]['data'][index];
            data3.push(element);
          }
          for (let index = 0; index < results[21]['data'].length; index++) {
            const element = results[21]['data'][index];
            data3.push(element);
          }
          for (let index = 0; index < results[22]['data'].length; index++) {
            const element = results[22]['data'][index];
            data3.push(element);
          }
          for (let index = 0; index < results[23]['data'].length; index++) {
            const element = results[23]['data'][index];
            data3.push(element);
          }

          this.alertes.next({
            data: data,
            links: results[0]['links'],
            actions: results[0]['actions'],
            defaultSearchKey: results[0]['defaultSearchKey'],
            isModelTranslatable: results[0]['isModelTranslatable'],
            meta: results[0]['meta'],
            orderBy: results[0]['orderBy'],
            orderColumn: results[0]['orderColumn'],
            showCheckboxColumn: results[0]['showCheckboxColumn'],
            showSoftDeleted: results[0]['showSoftDeleted'],
            sortOrder: results[0]['sortOrder'],
            sortableColumns: results[0]['sortableColumns'],
            usesSoftDeletes: results[0]['usesSoftDeletes'],
          });

          this.ems.next({
            data: data1,
            links: results[1]['links'],
            actions: results[1]['actions'],
            defaultSearchKey: results[1]['defaultSearchKey'],
            isModelTranslatable: results[1]['isModelTranslatable'],
            meta: results[1]['meta'],
            orderBy: results[1]['orderBy'],
            orderColumn: results[1]['orderColumn'],
            showCheckboxColumn: results[1]['showCheckboxColumn'],
            showSoftDeleted: results[1]['showSoftDeleted'],
            sortOrder: results[1]['sortOrder'],
            sortableColumns: results[1]['sortableColumns'],
            usesSoftDeletes: results[1]['usesSoftDeletes'],
          });

          this.interventions.next({
            data: data2,
            links: results[2]['links'],
            actions: results[2]['actions'],
            defaultSearchKey: results[2]['defaultSearchKey'],
            isModelTranslatable: results[2]['isModelTranslatable'],
            meta: results[2]['meta'],
            orderBy: results[2]['orderBy'],
            orderColumn: results[2]['orderColumn'],
            showCheckboxColumn: results[2]['showCheckboxColumn'],
            showSoftDeleted: results[2]['showSoftDeleted'],
            sortOrder: results[2]['sortOrder'],
            sortableColumns: results[2]['sortableColumns'],
            usesSoftDeletes: results[2]['usesSoftDeletes'],
          });

          this.pimpdms.next({
            data: data3,
            links: results[3]['links'],
            actions: results[3]['actions'],
            defaultSearchKey: results[3]['defaultSearchKey'],
            isModelTranslatable: results[3]['isModelTranslatable'],
            meta: results[3]['meta'],
            orderBy: results[3]['orderBy'],
            orderColumn: results[3]['orderColumn'],
            showCheckboxColumn: results[3]['showCheckboxColumn'],
            showSoftDeleted: results[3]['showSoftDeleted'],
            sortOrder: results[3]['sortOrder'],
            sortableColumns: results[3]['sortableColumns'],
            usesSoftDeletes: results[3]['usesSoftDeletes'],
          });

          this.statesRRM.getValue().loadRRMData = true;
          this.statesRRM.next(this.statesRRM.getValue());
          resolve({
            msg: this.alertes.value.links.first,
            error: false,
          });
        });
    });
  }

  getToken(): Tokens {
    return this.tokenProject.getValue();
  }

  getAlertes(): AlertesInterface {
    return this.alertes.getValue();
  }

  getEms(): EmsInterface {
    return this.ems.getValue();
  }

  getInterventions(): InterventionsInterface {
    return this.interventions.getValue();
  }

  getPimPdm(): PimPdmsInterface {
    return this.pimpdms.getValue();
  }

  getExtentOfProject(projection = false): [number, number, number, number] {
    var feature;

    let paramsFeature = {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',
    };
    if (!projection) {
      paramsFeature = {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:4326',
      };
    }

    if (this.configProject.value.geosignetsProject.length > 0) {
      for (
        let index = 0;
        index < this.configProject.value.geosignetsProject.length;
        index++
      ) {
        const geoSignet = this.configProject.value.geosignetsProject[index];
        if (geoSignet.active) {
          var features = new GeoJSON().readFeatures(
            JSON.parse(geoSignet.geometry),
            paramsFeature
          );
          if (features.length > 0) {
            feature = features[0];
          }
        }
      }
    }

    if (!feature) {
      var features = new GeoJSON().readFeatures(
        this.configProject.value.roiGeojson,
        paramsFeature
      );
      if (features.length > 0) {
        feature = features[0];
      }
    }

    if (feature) {
      return feature.getGeometry().getExtent();
    } else {
      return null!;
    }
  }

  getConfigProjet(): ConfigProjetInterface {
    return this.configProject.getValue();
  }

  getPrincipalCarte(): {
    groupCarte: GroupCarteInterface;
    carte: CarteInterface;
  } | null {
    for (let index = 0; index < this.groupCartes.getValue().length; index++) {
      const group = this.groupCartes.getValue()[index];
      if (group.principal) {
        // groupCarte = group
        if (group.sous_cartes) {
          for (let sIndex = 0; sIndex < group.sous_cartes.length; sIndex++) {
            const sous_groupe = group.sous_cartes[sIndex];
            for (
              let cIndex = 0;
              cIndex < sous_groupe.couches.length;
              cIndex++
            ) {
              const carte = sous_groupe.couches[cIndex];
              if (carte.principal) {
                return {
                  groupCarte: group,
                  carte: carte,
                };
              }
            }
          }
        } else {
          for (let cIndex = 0; cIndex < group.couches!.length; cIndex++) {
            const carte = group.couches![cIndex];
            if (carte.principal) {
              return {
                groupCarte: group,
                carte: carte,
              };
            }
          }
        }
      }
    }

    return null;
  }

  //@ts-ignore
  getGroupCarteFromIdCarte(id_carte: number): GroupCarteInterface {
    for (let index = 0; index < this.groupCartes.getValue().length; index++) {
      const groupCarte = this.groupCartes.getValue()[index];
      if (groupCarte.sous_cartes) {
        for (let sIndex = 0; sIndex < groupCarte.sous_cartes.length; sIndex++) {
          const sous_groupe = groupCarte.sous_cartes[sIndex];
          for (let cIndex = 0; cIndex < sous_groupe.couches.length; cIndex++) {
            const carte = sous_groupe.couches[cIndex];
            if (carte.key_couche == id_carte) {
              return groupCarte;
            }
          }
        }
      } else {
        for (let cIndex = 0; cIndex < groupCarte?.couches!.length; cIndex++) {
          const carte = groupCarte?.couches![cIndex];
          if (carte.key_couche == id_carte) {
            return groupCarte;
          }
        }
      }
    }
  }

  getAllGroupCarte(): Array<GroupCarteInterface> {
    return this.groupCartes.getValue();
  }

  getAllGroupThematiques(): Array<GroupThematiqueInterface> {
    return this.groupThematiques.getValue();
  }

  getGroupThematiqueFromIdCouche(id_couche: number): GroupThematiqueInterface {
    var groupThematiqueResponse: GroupThematiqueInterface;
    for (
      let index = 0;
      index < this.groupThematiques.getValue().length;
      index++
    ) {
      const groupThematique = this.groupThematiques.getValue()[index];
      if (groupThematique.sous_thematiques) {
        for (
          let sindex = 0;
          sindex < groupThematique.sous_thematiques.length;
          sindex++
        ) {
          const sous_thematique = groupThematique.sous_thematiques[sindex];
          for (let jndex = 0; jndex < sous_thematique.couches.length; jndex++) {
            const couche = sous_thematique.couches[jndex];
            if (couche.key_couche == id_couche) {
              groupThematiqueResponse = groupThematique;
            }
          }
        }
      } else {
        for (let jndex = 0; jndex < groupThematique.couches!.length; jndex++) {
          const couche = groupThematique.couches![jndex];
          if (couche.key_couche == id_couche) {
            groupThematiqueResponse = groupThematique;
          }
        }
      }
    }
    return groupThematiqueResponse!;
  }

  //@ts-ignore
  getGroupThematiqueById(id_thematique: number): GroupThematiqueInterface {
    for (
      let index = 0;
      index < this.groupThematiques.getValue().length;
      index++
    ) {
      const thematique = this.groupThematiques.getValue()[index];
      if (thematique.id_thematique === id_thematique) {
        return thematique;
      }
    }
  }

  //@ts-ignore
  getCouche(id_Groupthematique: number, id_couche: number): CoucheInterface {
    var groupThematique = this.getGroupThematiqueById(id_Groupthematique);
    if (!groupThematique) {
      return undefined!;
    }

    if (groupThematique.sous_thematiques) {
      for (
        let index = 0;
        index < groupThematique.sous_thematiques.length;
        index++
      ) {
        const sous_thematique = groupThematique.sous_thematiques[index];
        for (let jndex = 0; jndex < sous_thematique.couches.length; jndex++) {
          const couche = sous_thematique.couches[jndex];
          if (couche.key_couche == id_couche) {
            return couche;
          }
        }
      }
    } else {
      for (let jndex = 0; jndex < groupThematique?.couches!.length; jndex++) {
        const couche = groupThematique?.couches![jndex];
        if (couche.key_couche == id_couche) {
          return couche;
        }
      }
    }
  }

  //@ts-ignore
  getGroupcarteById(id_carte: number): GroupCarteInterface {
    for (let index = 0; index < this.groupCartes.getValue().length; index++) {
      const carte = this.groupCartes.getValue()[index];
      if (carte.id_cartes == id_carte) {
        return carte;
      }
    }
  }

  //@ts-ignore
  getCarte(id_groupCarte: number, id_carte: number): CarteInterface {
    var groupCarte = this.getGroupcarteById(id_groupCarte);
    if (!groupCarte) {
      return undefined!;
    }

    if (groupCarte.sous_cartes) {
      for (let sIndex = 0; sIndex < groupCarte.sous_cartes.length; sIndex++) {
        const sous_groupe = groupCarte.sous_cartes[sIndex];
        for (let cIndex = 0; cIndex < sous_groupe.couches.length; cIndex++) {
          const carte = sous_groupe.couches[cIndex];
          if (carte.key_couche == id_carte) {
            return carte;
          }
        }
      }
    } else {
      for (let cIndex = 0; cIndex < groupCarte?.couches!.length; cIndex++) {
        const carte = groupCarte?.couches![cIndex];
        if (carte.key_couche == id_carte) {
          return carte;
        }
      }
    }
  }

  //@ts-ignore
  getCoucheFromKeyCouche(id_couche: number): CoucheInterface {
    var coucheResponnse: CoucheInterface;
    for (
      let index = 0;
      index < this.groupThematiques.getValue().length;
      index++
    ) {
      const groupThematique = this.groupThematiques.getValue()[index];
      if (groupThematique.sous_thematiques) {
        for (
          let sindex = 0;
          sindex < groupThematique.sous_thematiques.length;
          sindex++
        ) {
          const sous_thematique = groupThematique.sous_thematiques[sindex];
          for (let jndex = 0; jndex < sous_thematique.couches.length; jndex++) {
            const couche = sous_thematique.couches[jndex];
            if (couche.key_couche == id_couche) {
              coucheResponnse = couche;
            }
          }
        }
      } else {
        for (let jndex = 0; jndex < groupThematique.couches!.length; jndex++) {
          const couche = groupThematique.couches![jndex];
          if (couche.key_couche == id_couche) {
            coucheResponnse = couche;
          }
        }
      }
    }
    return coucheResponnse!;
  }

  //@ts-ignore
  getCarteFromIdCarte(id_carte: number): CarteInterface {
    for (let index = 0; index < this.groupCartes.getValue().length; index++) {
      const groupCarte = this.groupCartes.getValue()[index];
      if (groupCarte.sous_cartes) {
        for (let sIndex = 0; sIndex < groupCarte.sous_cartes.length; sIndex++) {
          const sous_groupe = groupCarte.sous_cartes[sIndex];
          for (let cIndex = 0; cIndex < sous_groupe.couches.length; cIndex++) {
            const carte = sous_groupe.couches[cIndex];
            if (carte.key_couche == id_carte) {
              return carte;
            }
          }
        }
      } else {
        for (let cIndex = 0; cIndex < groupCarte.couches!.length; cIndex++) {
          const carte = groupCarte.couches![cIndex];
          if (carte.key_couche == id_carte) {
            return carte;
          }
        }
      }
    }
  }
}
