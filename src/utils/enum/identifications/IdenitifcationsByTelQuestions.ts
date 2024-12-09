export enum IdentificationPersonOption {
  SAMEADRESS = "Oui, à l'adresse indiquée",
  OTHERADRESS = 'Oui, mais à une autre adresse située dans le champs géographique',
  NOFIELD = 'Oui, mais hors du champs géographique',
  NOIDENT = 'Non',
  DCD = 'Décédé',
}

export enum IdentificationSituationOption {
  NOORDINARY = 'Non Ordinaire',
  ORDINARY = 'Ordinaire',
}
