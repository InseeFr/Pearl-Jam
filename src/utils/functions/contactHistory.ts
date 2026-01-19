import { SurveyUnitPhoneNumber } from 'types/pearl';

/**
 * Selects the appropriate phone number based on priority rules:
 * 1. Favorite phone number (with priority: INTERVIEWER > FISCAL > DIRECTORY)
 * 2. INTERVIEWER number
 * 3. FISCAL number
 * 4. DIRECTORY number
 *
 * If no favorite exists and there are multiple INTERVIEWER numbers,
 * returns a flag indicating that user selection is required (pop-up).
 *
 * Returns undefined if no phone number is available
 */
export function selectPhoneNumber(phoneNumbers: SurveyUnitPhoneNumber[]) {
  if (!phoneNumbers || phoneNumbers.length === 0) {
    return { phoneNumber: undefined, requiresUserSelection: false };
  }

  // Step 1: Look for favorite phone numbers
  const favoriteNumbers = phoneNumbers.filter(p => p.favorite);

  if (favoriteNumbers.length > 0) {
    // Priority: INTERVIEWER > FISCAL > DIRECTORY
    const interviewerFavorites = favoriteNumbers.filter(p => p.source === 'INTERVIEWER');

    if (interviewerFavorites.length > 1) {
      // Multiple INTERVIEWER favorites - requires user selection
      return {
        requiresUserSelection: true,
      };
    }

    if (interviewerFavorites.length === 1) {
      return { phoneNumber: interviewerFavorites[0].number, requiresUserSelection: false };
    }

    const fiscalFavorite = favoriteNumbers.find(p => p.source === 'FISCAL');
    if (fiscalFavorite) {
      return { phoneNumber: fiscalFavorite.number, requiresUserSelection: false };
    }

    const directoryFavorite = favoriteNumbers.find(p => p.source === 'DIRECTORY');
    if (directoryFavorite) {
      return { phoneNumber: directoryFavorite.number, requiresUserSelection: false };
    }
  }

  // Step 2: No favorite, check for multiple INTERVIEWER numbers
  const interviewerNumbers = phoneNumbers.filter(p => p.source === 'INTERVIEWER');

  if (interviewerNumbers.length > 1) {
    // Multiple INTERVIEWER numbers without a favorite - requires user selection
    return {
      requiresUserSelection: true,
    };
  }

  if (interviewerNumbers.length === 1) {
    return { phoneNumber: interviewerNumbers[0].number, requiresUserSelection: false };
  }

  // Step 3: No INTERVIEWER, try FISCAL
  const fiscalNumber = phoneNumbers.find(p => p.source === 'FISCAL');
  if (fiscalNumber) {
    return { phoneNumber: fiscalNumber.number, requiresUserSelection: false };
  }

  // Step 4: No FISCAL, try DIRECTORY
  const directoryNumber = phoneNumbers.find(p => p.source === 'DIRECTORY');
  if (directoryNumber) {
    return { phoneNumber: directoryNumber.number, requiresUserSelection: false };
  }

  return { phoneNumber: undefined, requiresUserSelection: false };
}
