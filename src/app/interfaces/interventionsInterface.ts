export interface InterventionsInterface {
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
  codeIntervention: string;
  dateIntervention: string;
  departement: string;
  arrondissement: string;
  acteur: string;
  secteurIntervention: string;
  menageBeneficiaire: number;
  individusBeneficiaire: number;
  beneficiaireMasculin: number;
  beneficiaireFeminin: number;
  beneficiaireIdp: number;
  beneficiaireRefugier: number;
  beneficiaireHote: number;
  beneficiaireRetournes: number;
  beneficiairesMenagersEssentiels: number;
  beneficiairesAssistanceAlimentaire: number;
  beneficiairesAssistanceEau: number;
  beneficiaireAssistanceLatrine: number;
  beneficiaireHygiene: number;
  latrinesConstruites: number;
  pointsEau: number;
  pointEauChlores: number;
  kitArticleDistribue: number;
  kitAbrisDistribue: number;
  resume: any;
  fichierIntervention: string;
  created_at: string;
  updated_at: string;
  idEms: number;
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
