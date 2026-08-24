import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { SurveyUnit } from 'types/pearl';

vi.mock('./surveyUnitTrackingCommunication', () => ({
  getLastSubmittedCommunication: vi.fn(),
}));
vi.mock('../surveyUnitFunctions', () => ({
  getprivilegedPerson: vi.fn(),
}));
vi.mock('../surveyUnitState', () => ({
  getSuTodoState: vi.fn(),
}));

import { getLastSubmittedCommunication } from './surveyUnitTrackingCommunication';
import { getprivilegedPerson } from '../surveyUnitFunctions';
import { getSuTodoState } from '../surveyUnitState';
import {
  compareMail,
  compareValues,
  getLastName,
  getOutcomeIndex,
  sortSurveyUnitsTrackingTable,
} from './surveyUnitTrackingSorting';
const mockedGetLastSubmittedCommunication = vi.mocked(getLastSubmittedCommunication);
const mockedGetPrivilegedPerson = vi.mocked(getprivilegedPerson);
const mockedGetSuTodoState = vi.mocked(getSuTodoState);

const su = (id: string): SurveyUnit => ({ id }) as SurveyUnit;

// Builds a full LastMailInfo object so mocks satisfy the real return type.
// Only `type`/`date` vary per test; the rest are irrelevant filler values.
const mailFixture = (
  type: string | undefined,
  date: number | undefined,
  overrides: Partial<{ medium: string; reason: string; templatets: number }> = {}
) =>
  ({
    type,
    date,
    medium: 'MAIL',
    reason: 'REASON',
    templatets: 0,
    ...overrides,
  }) as any;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('compareMail', () => {
  const a = su('a');
  const b = su('b');

  it.each([
    ['both missing', undefined, undefined, 0],
    ['a missing', undefined, mailFixture('X', 1), 1],
    ['b missing', mailFixture('X', 1), undefined, -1],
  ])('%s', (_label, mailA, mailB, expected) => {
    mockedGetLastSubmittedCommunication.mockImplementation(su => (su === a ? mailA : mailB));
    expect(compareMail(a, b, true)).toBe(expected);
  });

  it.each([
    ['ascending', true, -1],
    ['descending', false, 1],
  ])('sorts by type (%s) when types differ', (_label, isAscending, expected) => {
    mockedGetLastSubmittedCommunication.mockImplementation(su =>
      su === a ? mailFixture('AAA', 1) : mailFixture('BBB', 1)
    );
    expect(compareMail(a, b, isAscending)).toBe(expected);
  });

  it.each([
    ['ascending -> newest first', true, 20, 10, -10],
    ['ascending -> newest first (b newer)', true, 10, 20, 10],
    ['descending -> oldest first', false, 20, 10, 10],
    ['descending -> oldest first (b newer)', false, 10, 20, -10],
  ])('%s', (_label, isAscending, dateA, dateB, expected) => {
    mockedGetLastSubmittedCommunication.mockImplementation(su =>
      su === a ? mailFixture('SAME', dateA) : mailFixture('SAME', dateB)
    );
    expect(compareMail(a, b, isAscending)).toBe(expected);
  });

  it('returns 0 when type and date are equal', () => {
    mockedGetLastSubmittedCommunication.mockReturnValue(mailFixture('SAME', 5));
    expect(compareMail(a, b, true)).toBe(0);
  });

  it('defaults missing type/date to "" and 0', () => {
    mockedGetLastSubmittedCommunication.mockImplementation(() => mailFixture(undefined, undefined));
    expect(compareMail(a, b, true)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
describe('compareValues', () => {
  it.each([
    ['numbers, a < b, asc', 1, 2, true, -1],
    ['numbers, a < b, desc', 1, 2, false, 1],
    ['numbers, a > b, asc', 2, 1, true, 1],
    ['numbers, a > b, desc', 2, 1, false, -1],
    ['numbers, equal, asc', 5, 5, true, 0],
    ['numbers, equal, desc', 5, 5, false, 0],
    ['strings, a < b, asc', 'a', 'b', true, -1],
    ['strings, a < b, desc', 'a', 'b', false, 1],
    ['strings, a > b, asc', 'b', 'a', true, 1],
    ['strings, a > b, desc', 'b', 'a', false, -1],
    ['strings, equal, asc', 'x', 'x', true, 0],
  ])('%s', (_label, a, b, isAscending, expected) => {
    expect(compareValues(a, b, isAscending)).toBe(expected);
  });
});

// ---------------------------------------------------------------------------
describe('getLastName', () => {
  it('returns the uppercased last name from getprivilegedPerson', () => {
    mockedGetPrivilegedPerson.mockReturnValue({ lastName: 'doe', firstName: 'jane' } as any);
    expect(getLastName(su('a'))).toBe('DOE');
    expect(mockedGetPrivilegedPerson).toHaveBeenCalledWith(expect.objectContaining({ id: 'a' }));
  });

  it('uppercases a last name that already contains mixed case/accents', () => {
    mockedGetPrivilegedPerson.mockReturnValue({ lastName: 'Dûrand', firstName: 'jane' } as any);
    expect(getLastName(su('a'))).toBe('DÛRAND');
  });
});

// ---------------------------------------------------------------------------
describe('getOutcomeIndex', () => {
  it.each([
    ['first entry in the order list', 'INA', 0],
    ['a later entry in the order list', 'DCD', 5],
    ['an unknown/unrecognized outcome type', 'NOT_IN_LIST', Infinity],
  ])('%s -> %s', (_label, type, expected) => {
    const unit = { id: 'a', contactOutcome: { type } } as unknown as SurveyUnit;
    expect(getOutcomeIndex(unit)).toBe(expected);
  });

  it('returns Infinity when contactOutcome is missing', () => {
    const unit = { id: 'a' } as unknown as SurveyUnit;
    expect(getOutcomeIndex(unit)).toBe(Infinity);
  });

  it('returns Infinity when contactOutcome.type is falsy', () => {
    const unit = { id: 'a', contactOutcome: { type: '' } } as unknown as SurveyUnit;
    expect(getOutcomeIndex(unit)).toBe(Infinity);
  });
});

// ---------------------------------------------------------------------------
describe('sortSurveyUnitsTrackingTable', () => {
  type Fixture = {
    id: string;
    campaign: string;
    displayName?: string;
    lastName: string;
    firstName: string;
    order?: string;
    outcomeType?: string;
    mail?: ReturnType<typeof mailFixture>;
  };

  const fixtures: Fixture[] = [
    {
      id: 'SU1',
      campaign: 'C1',
      displayName: 'Alpha',
      lastName: 'SMITH',
      firstName: 'John',
      order: '2',
      outcomeType: 'REF',
      mail: mailFixture('LETTER', 100),
    },
    {
      id: 'SU2',
      campaign: 'C1',
      displayName: 'Beta',
      lastName: 'DOE',
      firstName: 'Jane',
      order: '1',
      outcomeType: 'INA',
      mail: mailFixture('EMAIL', 200),
    },
    {
      id: 'SU3',
      campaign: 'C2',
      displayName: 'Gamma',
      lastName: 'BROWN',
      firstName: 'Amy',
      order: undefined,
      outcomeType: undefined,
      mail: undefined,
    },
    {
      id: 'SU4',
      campaign: 'C1',
      displayName: 'Delta',
      lastName: 'ADAMS',
      firstName: 'Zoe',
      order: '0',
      outcomeType: 'UNKNOWN_CODE',
      mail: mailFixture('SMS', 50),
    },
  ];

  const byId = (id: string) => fixtures.find(f => f.id === id)!;

  beforeEach(() => {
    mockedGetPrivilegedPerson.mockImplementation((s: SurveyUnit) => {
      const f = byId(s.id);
      return { lastName: f.lastName, firstName: f.firstName } as any;
    });
    mockedGetSuTodoState.mockImplementation((s: SurveyUnit) => {
      const f = byId(s.id);
      return f.order === undefined ? undefined : ({ order: f.order } as any);
    });
    mockedGetLastSubmittedCommunication.mockImplementation((s: SurveyUnit) => {
      const f = byId(s.id);
      return f.mail as any;
    });
  });

  const units: SurveyUnit[] = fixtures.map(f => ({
    id: f.id,
    campaign: f.campaign,
    displayName: f.displayName,
    contactOutcome: f.outcomeType ? { type: f.outcomeType } : undefined,
  })) as SurveyUnit[];

  it('filters by campaign', () => {
    const result = sortSurveyUnitsTrackingTable(units, 'C1', '', { key: 'id', direction: 'asc' });
    expect(result.map(r => r.id)).toEqual(['SU1', 'SU2', 'SU4']);
  });

  it('returns all units when campaign is empty string', () => {
    const result = sortSurveyUnitsTrackingTable(units, '', '', { key: 'id', direction: 'asc' });
    expect(result).toHaveLength(4);
  });

  it.each([
    ['lastName match', 'smi', ['SU1']],
    ['firstName match', 'zoe', ['SU4']],
    ['displayName match', 'gam', ['SU3']],
    ['id match', 'su2', ['SU2']],
    ['no match', 'zzzzz', []],
  ])('filters by searchText: %s', (_label, searchText, expectedIds) => {
    const result = sortSurveyUnitsTrackingTable(units, '', searchText, {
      key: 'id',
      direction: 'asc',
    });
    expect(result.map(r => r.id)).toEqual(expectedIds);
  });

  it.each([
    ['asc', 'asc', ['SU4', 'SU3', 'SU2', 'SU1']], // ADAMS, BROWN, DOE, SMITH
    ['desc', 'desc', ['SU1', 'SU2', 'SU3', 'SU4']],
  ])('sorts by lastName (%s)', (_label, direction, expectedIds) => {
    const result = sortSurveyUnitsTrackingTable(units, '', '', { key: 'lastName', direction });
    expect(result.map(r => r.id)).toEqual(expectedIds);
  });

  it.each([
    ['asc', 'asc', ['SU4', 'SU2', 'SU1', 'SU3']], // 0, 1, 2, undefined->0 tie broken by array order
    ['desc', 'desc', ['SU3', 'SU1', 'SU2', 'SU4']],
  ])('sorts by order (%s), defaulting missing order to 0', (_label, direction, expectedIds) => {
    const result = sortSurveyUnitsTrackingTable(units, '', '', { key: 'order', direction });
    expect(result.map(r => r.id)).toEqual(expectedIds);
  });

  it('sorts by outcome ascending, unknown/missing outcomes last', () => {
    const result = sortSurveyUnitsTrackingTable(units, '', '', {
      key: 'outcome',
      direction: 'asc',
    });
    // contactOutcomeOrder: ... INA(idx1) before REF(idx2); unknown/missing -> Infinity, sorted last
    expect(result.map(r => r.id)).toEqual(['SU2', 'SU1', 'SU3', 'SU4']);
  });

  it('sorts by outcome descending, unknown/missing outcomes last', () => {
    const result = sortSurveyUnitsTrackingTable(units, '', '', {
      key: 'outcome',
      direction: 'desc',
    });
    expect(result.map(r => r.id)).toEqual(['SU1', 'SU2', 'SU3', 'SU4']);
  });

  it('delegates to compareMail for the "mail" sort key', () => {
    const result = sortSurveyUnitsTrackingTable(units, '', '', { key: 'mail', direction: 'asc' });
    // types differ across units -> localeCompare on type: EMAIL, LETTER, SMS, then undefined ('') last
    expect(result.map(r => r.id)).toEqual(['SU2', 'SU1', 'SU4', 'SU3']);
  });

  it('falls back to sorting by id for an unknown sort key', () => {
    const result = sortSurveyUnitsTrackingTable(units, '', '', {
      key: 'unknownKey',
      direction: 'asc',
    });
    expect(result.map(r => r.id)).toEqual(['SU1', 'SU2', 'SU3', 'SU4']);
  });

  it('falls back to sorting by id descending for an unknown sort key', () => {
    const result = sortSurveyUnitsTrackingTable(units, '', '', {
      key: 'unknownKey',
      direction: 'desc',
    });
    expect(result.map(r => r.id)).toEqual(['SU4', 'SU3', 'SU2', 'SU1']);
  });
});
