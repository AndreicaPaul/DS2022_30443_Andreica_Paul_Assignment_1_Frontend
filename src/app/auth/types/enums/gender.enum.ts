export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

export const genderDisplay = {
  [Gender.MALE]: 'labels.male',
  [Gender.FEMALE]: 'labels.female',
  [Gender.OTHER]: 'labels.other'
};
