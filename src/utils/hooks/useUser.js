import { signal } from '@maverick-js/signals';
import { useSignalValue } from './useSignalValue';
import { db } from '../indexeddb/idb-config';
import { liveQuery } from 'dexie';

const user = signal({
  firstName: 'Unknown',
  lastName: 'Interviewer',
  phoneNumber: '0123456789',
  email: 'no.data@y.et',
  title: 'MISTER'
});

// Watch change to update the signal when user info changes
liveQuery(() => db.user.limit(1).toArray()).subscribe({
  next: result => {
    if (result.length > 0) {
      user.set(result[0]);
    }
  },
  error: error => console.error(error),
});

/**
 * @returns {{user: {firstName: string, lastName: string, phoneNumber: string, email: string, title : 'MISTER' | 'MISS'}}}
 */
export function useUser() {
  return {
    user: useSignalValue(user),
  };
}
