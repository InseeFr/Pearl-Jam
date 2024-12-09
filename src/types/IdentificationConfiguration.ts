import { identificationConfigurationEnum } from 'utils/enum/identifications/IdentificationConfigurationEnum';

export type IdentificationConfiguration = keyof typeof identificationConfigurationEnum;

export type Identification = {
  identification: string;
  access: string;
  situation: string;
  category: string;
  occupant: string;
};
