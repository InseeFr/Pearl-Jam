import React from 'react';

const SurveyUnitContext = React.createContext({});

export const SurveyUnitProvider = SurveyUnitContext.Provider;
export const SurveyUnitConsumer = SurveyUnitContext.Consumer;
export default SurveyUnitContext;
