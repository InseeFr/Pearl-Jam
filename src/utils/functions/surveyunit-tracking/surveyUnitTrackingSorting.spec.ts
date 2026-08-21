import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SurveyUnit } from 'types/pearl';
import { getLastSubmittedCommunication } from './surveyUnitTrackingCommunication';
import { getprivilegedPerson } from '../surveyUnitFunctions';
import { compareMail, sortSurveyUnitsTrackingTable } from './surveyUnitTrackingSorting';

vi.mock('./surveyUnitTrackingCommunication', () => ({
  getLastSubmittedCommunication: vi.fn(),
}));

vi.mock('../surveyUnitFunctions', () => ({
  getprivilegedPerson: vi.fn(),
}));

const su = (id: string) => ({ id }) as SurveyUnit;

describe('compareMail', () => {
  it.each([
    ['both missing', undefined, undefined, true, 0],
    ['a missing', undefined, { type: 'X', date: 1 }, true, 1],
    ['b missing', { type: 'X', date: 1 }, undefined, true, -1],
    ['type differs asc', { type: 'A', date: 1 }, { type: 'B', date: 1 }, true, -1],
    ['type differs desc', { type: 'A', date: 1 }, { type: 'B', date: 1 }, false, 1],
    [
      'same type, date differs (newest first) asc',
      { type: 'A', date: 1 },
      { type: 'A', date: 2 },
      true,
      1,
    ],
    ['same type, date differs desc', { type: 'A', date: 1 }, { type: 'A', date: 2 }, false, -1],
    ['same type and date', { type: 'A', date: 1 }, { type: 'A', date: 1 }, true, 0],
  ])('%s', (_label, mailA, mailB, isAscending, expected) => {
    vi.mocked(getLastSubmittedCommunication)
      .mockImplementationOnce(() => mailA as any)
      .mockImplementationOnce(() => mailB as any);

    expect(compareMail(su('a'), su('b'), isAscending)).toBe(expected);
  });
});

describe('sortSurveyUnitsTrackingTable', () => {
  const person = (firstName: string, lastName: string) => ({
    title: 'MISTER' as const,
    firstName,
    lastName,
    email: '',
    birthdate: '',
    favoriteEmail: false,
    privileged: true,
    phoneNumbers: [],
  });
  const helpers = {
    getLastName: (s: SurveyUnit) => (s as any).lastName,
    getOrder: (s: SurveyUnit) => (s as any).order,
    getOutcomeIndex: (s: SurveyUnit) => (s as any).outcomeIndex,
    compareValues: (a: number | string, b: number | string, isAscending: boolean) =>
      a === b ? 0 : a > b === isAscending ? 1 : -1,
  };

  beforeEach(() => {
    vi.mocked(getprivilegedPerson).mockImplementation((s: any) =>
      person(s.firstName ?? '', s.lastName ?? '')
    );
  });

  it('filters by campaign', () => {
    const units = [
      { ...su('1'), campaign: 'C1', firstName: 'A', lastName: 'A' },
      { ...su('2'), campaign: 'C2', firstName: 'B', lastName: 'B' },
    ] as unknown as SurveyUnit[];

    const result = sortSurveyUnitsTrackingTable(
      units,
      'C1',
      '',
      { key: 'id', direction: 'asc' },
      helpers
    );
    expect(result.map(u => u.id)).toEqual(['1']);
  });

  it.each([
    ['lastName match', 'doe'],
    ['firstName match', 'john'],
    ['displayName match', 'nick'],
    ['id match', '42'],
  ])('filters by search text: %s', (_label, search) => {
    const units = [
      { ...su('42'), campaign: '', firstName: 'John', lastName: 'Doe', displayName: 'Nickname' },
      { ...su('99'), campaign: '', firstName: 'X', lastName: 'Y', displayName: 'Z' },
    ] as unknown as SurveyUnit[];

    const result = sortSurveyUnitsTrackingTable(
      units,
      '',
      search,
      { key: 'id', direction: 'asc' },
      helpers
    );
    expect(result.map(u => u.id)).toEqual(['42']);
  });

  it('sorts by lastName', () => {
    const units = [
      { ...su('1'), campaign: '', lastName: 'Zed', firstName: '' },
      { ...su('2'), campaign: '', lastName: 'Ann', firstName: '' },
    ] as unknown as SurveyUnit[];

    const result = sortSurveyUnitsTrackingTable(
      units,
      '',
      '',
      { key: 'lastName', direction: 'asc' },
      helpers
    );
    expect(result.map(u => u.id)).toEqual(['2', '1']);
  });

  it('sorts by order', () => {
    const units = [
      { ...su('1'), campaign: '', order: 2, firstName: '', lastName: '' },
      { ...su('2'), campaign: '', order: 1, firstName: '', lastName: '' },
    ] as unknown as SurveyUnit[];

    const result = sortSurveyUnitsTrackingTable(
      units,
      '',
      '',
      { key: 'order', direction: 'asc' },
      helpers
    );
    expect(result.map(u => u.id)).toEqual(['2', '1']);
  });

  it.each([
    ['ascending keeps Infinity', 'asc', Infinity, 1, ['2', '1']],
    ['descending swaps Infinity to -Infinity', 'desc', Infinity, 1, ['1', '2']],
  ])('sorts by outcome: %s', (_label, direction, outcomeA, outcomeB, expectedOrder) => {
    const units = [
      { ...su('1'), campaign: '', outcomeIndex: outcomeA, firstName: '', lastName: '' },
      { ...su('2'), campaign: '', outcomeIndex: outcomeB, firstName: '', lastName: '' },
    ] as unknown as SurveyUnit[];

    const result = sortSurveyUnitsTrackingTable(
      units,
      '',
      '',
      { key: 'outcome', direction },
      helpers
    );
    expect(result.map(u => u.id)).toEqual(expectedOrder);
  });

  it('sorts by mail using compareMail', () => {
    const units = [
      { ...su('1'), campaign: '', firstName: '', lastName: '' },
      { ...su('2'), campaign: '', firstName: '', lastName: '' },
    ] as unknown as SurveyUnit[];

    vi.mocked(getLastSubmittedCommunication)
      .mockImplementationOnce(() => ({ type: 'B', date: 1 }) as any)
      .mockImplementationOnce(() => ({ type: 'A', date: 1 }) as any);

    const result = sortSurveyUnitsTrackingTable(
      units,
      '',
      '',
      { key: 'mail', direction: 'asc' },
      helpers
    );
    expect(result.map(u => u.id)).toEqual(['2', '1']);
  });

  it('defaults to sorting by id when key is unknown', () => {
    const units = [
      { ...su('b'), campaign: '', firstName: '', lastName: '' },
      { ...su('a'), campaign: '', firstName: '', lastName: '' },
    ] as unknown as SurveyUnit[];

    const result = sortSurveyUnitsTrackingTable(
      units,
      '',
      '',
      { key: 'unknown', direction: 'asc' },
      helpers
    );
    expect(result.map(u => u.id)).toEqual(['a', 'b']);
  });
});
