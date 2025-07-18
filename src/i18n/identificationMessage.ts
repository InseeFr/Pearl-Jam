const identificationMessage = {
  sameAddress: {
    fr: "Oui, à l'adresse indiquée",
    en: 'Yes, at the specified address',
    sq: 'Po, në adresën e specifikuar',
  },
  sameHouse: {
    fr: 'Oui, dans le logement indiqué',
    en: 'Yes, at the specified housing',
    sq: 'Po, në banesën e specifikuar',
  },
  otherHouse: {
    fr: 'Oui, mais dans un autre logement situé dans le champ géographique',
    en: 'Yes, but in another home within the same geographical area',
    sq: 'Po, por në një shtëpi tjetër brenda së njëjtës zonë gjeografike',
  },
  otherAddress: {
    fr: 'Oui, mais à une autre adresse située dans le champs géographique',
    en: 'Yes, but at another address within the geographical area',
    sq: 'Po, por në një adresë tjetër brenda zonës gjeografike',
  },
  noField: {
    fr: 'Oui, mais hors du champs géographique',
    en: 'Yes, but outside the geographical area',
    sq: 'Po, por jashtë zonës gjeografike',
  },
  noIdent: {
    fr: 'Non',
    en: 'No',
    sq: 'Jo',
  },
  noTreat: {
    fr: 'Non',
    en: 'No',
    sq: 'Jo',
  },
  treat: {
    fr: 'Oui',
    en: 'Yes',
    sq: 'Po',
  },
  deceased: {
    fr: 'Décédé',
    en: 'Deceased',
    sq: 'I ndjerë',
  },
  situationOrdinary: {
    fr: 'Ordinaire',
    en: 'Ordinary',
    sq: 'Zakonshëm',
  },
  situationNonOrdinary: {
    fr: 'Non Ordinaire',
    en: 'Not Ordinary',
    sq: 'Jo i zakonshëm',
  },
  adressIdentified: {
    fr: 'Adresse identifiée avec un bâtiment',
    en: 'Identified address with a building',
    sq: 'Adresa e identifikuar me një ndërtesë',
  },
  adressUnidentified: {
    fr: 'Adresse non identifiée',
    en: 'Unidentified address',
    sq: 'Adresa e paidentifikuar',
  },
  adressDestroyed: {
    fr: 'Adresse identifiée avec un bâtiment détruit ou condamné',
    en: 'Identified address with a destroyed or condemned building',
    sq: 'Adresa e identifikuar me një ndërtesë të shkatërruar ose të dëmtuar',
  },
  accessibleIdentifiedHousing: {
    fr: 'Logement identifié',
    en: 'Identified housing',
    sq: 'Banimi i identifikuar',
  },
  notAccessibleIdentifiedHousing: {
    fr: 'Logement non identifié',
    en: 'Unidentified housing',
    sq: 'Banimi i paidentifikuar',
  },
  situationNotOrdinary: {
    fr: 'Logement non ordinaire',
    en: 'Not ordinary housing',
    sq: 'Banimi jo i zakonshëm',
  },
  situationAbsorbed: {
    fr: "Logement absorbé ou ayant perdu son usage d'habitation",
    en: 'Absorbed housing or lost its residential use',
    sq: 'Banimi i absorbuar ose që ka humbur përdorimin e tij si banim',
  },
  categoryPrimary: {
    fr: 'Résidence principale ou occasionnelle',
    en: 'Primary housing or occasional',
    sq: 'Banimi kryesor ose i rastësishëm',
  },
  categorySecondary: { fr: 'Résidence secondaire', en: 'Secondary housing', sq: 'Banimi dytësor' },
  vacant: { fr: 'Vacant', en: 'Vacant', sq: 'Bosh' },
  categoryOccasional: {
    fr: 'Résidence occasionnelle',
    en: 'Occasional housing',
    sq: 'Banimi okazional',
  },
  categoryVacant: { fr: 'Logement vacant', en: 'Vacant housing', sq: 'Banimi bosh' },
  categoryDontKnow: { fr: "À vérifier auprès de l'enquêté", en: "Don't know", sq: 'Nuk dihet' },
  occupantIdentified: {
    fr: 'Occupant identifié',
    en: 'Identified occupant',
    sq: 'Banori i identifikuar',
  },
  occupantUnidentified: {
    fr: 'Occupant non identifié',
    en: 'Unidentified occupant',
    sq: 'Banori i paidentifikuar',
  },
  adressIdentification: {
    fr: "Identification de l'adresse",
    en: 'Adress identification',
    sq: 'Identifikimi i banimit',
  },
  foundIndividual: {
    fr: 'Individu Retrouvé',
    en: 'Found Individual',
    sq: 'Gjetur Individ',
  },
  interviewerProcess: {
    fr: 'Traitement enquêteur',
    en: 'Interviewer processing',
    sq: 'Procesi i intervistuesit',
  },
  housingAccessIdentification: {
    fr: 'Identification du logement',
    en: 'Housing identification',
    sq: 'Qasja në banim',
  },
  housingSituation: {
    fr: 'Situation du logement',
    en: 'Housing situation',
    sq: 'Situata e banimit',
  },
  housingCategory: {
    fr: 'Catégorie du logement',
    en: 'Housing category',
    sq: 'Kategoria e banimit',
  },
  housingOccupant: {
    fr: "Identification de l'occupant",
    en: 'Occupant identification',
    sq: 'Identifikimi i banorit',
  },
  absorbed: { fr: 'Absorbé', en: 'Absorbed', sq: 'Banimi i absorbuar' },
  identification: { fr: 'Repérage', en: 'Identification', sq: 'Identifikimi' },
  move: { fr: 'Déplacement terrain', en: 'Onsite move', sq: 'Lëvizja në terren' },
  noLocation: {
    fr: 'Pas de repérage pour cette enquête',
    en: 'No location for this survey',
    sq: 'Asnjë vendndodhje për këtë anketë',
  },
  oneRespondent: {
    fr: 'Un individu panel',
    en: 'Individual panel',
    sq: 'Paneli individual',
  },
  manyRespondents: {
    fr: 'Plusieurs individus panel',
    en: 'Several individuals panel',
    sq: 'Paneli i disa individëve',
  },
  numberOfRespondents: {
    fr: "Nombre d'individus panel à interroger",
    en: 'Number of panel individuals to interview',
    sq: 'Numri i individëve të panelit për intervistë',
  },
  yes: { fr: 'Oui', en: 'Yes', sq: 'Po' },
  no: { fr: 'Non', en: 'No', sq: 'Jo' },
};

export default identificationMessage;
