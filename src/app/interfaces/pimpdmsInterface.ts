export interface PimPdmsInterface {
  data: Daum[];
  links: Links;
  meta: Meta;
  actions: Action[];
  isModelTranslatable: boolean;
  orderBy: any;
  orderColumn: any[];
  sortableColumns: string[];
  sortOrder: string;
  defaultSearchKey: any;
  usesSoftDeletes: boolean;
  showSoftDeleted: boolean;
  showCheckboxColumn: boolean;
}

export interface Daum {
  id: number;
  codePIMPDM: string;
  datePIMPDM: string;
  departement: string;
  arrondissement: string;
  acteur: string;
  partenairesPositionnes: any;
  partenaireEHA: any;
  partenaireAME: any;
  partenaireAlimentaire: any;
  partenaireSante?: string;
  partenaireNutrition: string;
  partenaireProtectio: string;
  partenaireEduction: string;
  totalBeneficiaire: any;
  menagesSatisfaits?: string;
  menagesSatisfaitEHA?: string;
  menagesSatisfaitAbris: any;
  menagesSatisfaitAM: any;
  fichierPIMPDM: string;
  pourcentageMenageScoreAME: string;
  pourcentageMenageScoreAbris: string;
  pourcentagePopulationSCA: any;
  pourcentageMenageDiversiteAlimentaire: any;
  pourcentageMenageScoreISA: any;
  proportionMenageEau: any;
  proportionMenageLavageMain: any;
  resume: any;
  created_at: string;
  updated_at: string;
  idIntervention: number;
  longitude: number;
  latitude: number;
}

export interface Links {
  first: string;
  last: string;
  prev: any;
  next: any;
}

export interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  links: Link[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface Link {
  url?: string;
  label: string;
  active: boolean;
}

export interface Action {}
