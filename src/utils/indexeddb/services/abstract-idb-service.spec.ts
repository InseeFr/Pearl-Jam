import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { db, User } from '../idb-config';
import AbstractIdbService from './abstract-idb-service';

vi.mock('../idb-config', () => ({
  db: {
    user: {
      get: vi.fn(),
      toArray: vi.fn(),
      orderBy: vi.fn(() => ({ toArray: vi.fn() })),
      add: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      clear: vi.fn(),
      bulkPut: vi.fn(),
      bulkDelete: vi.fn(),
    },
  },
}));

describe('AbstractIdbService', () => {
  let service: AbstractIdbService<User>;

  beforeEach(() => {
    service = new AbstractIdbService('user');
    vi.clearAllMocks();
  });

  it('should fetch an item by id using get', async () => {
    const mockItem = { id: 1, name: 'Test Item' };
    (db.user.get as Mock).mockResolvedValue(mockItem);

    const result = await service.get(1);

    expect(result).toEqual(mockItem);
    expect(db.user.get).toHaveBeenCalledWith({ id: 1 });
  });

  it('should fetch an item by id using getById', async () => {
    const mockItem = { id: 1, name: 'Test Item' };
    (db.user.get as Mock).mockResolvedValue(mockItem);

    const result = await service.getById(1);

    expect(result).toEqual(mockItem);
    expect(db.user.get).toHaveBeenCalledWith(1);
  });

  it('should fetch all items', async () => {
    const mockItems = [{ id: 1 }, { id: 2 }];
    (db.user.toArray as Mock).mockResolvedValue(mockItems);

    const result = await service.getAll();

    expect(result).toEqual(mockItems);
    expect(db.user.toArray).toHaveBeenCalled();
  });

  it('should fetch all items sorted by a variable', async () => {
    const mockItems = [{ id: 1 }, { id: 2 }];
    (db.user.orderBy as Mock).mockReturnValue({ toArray: vi.fn().mockResolvedValue(mockItems) });

    const result = await service.getAllSortedBy('name');

    expect(result).toEqual(mockItems);
    expect(db.user.orderBy).toHaveBeenCalledWith('name');
  });

  it('should add a new item', async () => {
    const mockItem = { id: 1, name: 'Test Item' } as unknown as User;
    (db.user.add as Mock).mockResolvedValue(1);

    const result = await service.insert(mockItem);

    expect(result).toBe(1);
    expect(db.user.add).toHaveBeenCalledWith(mockItem);
  });

  it('should update an existing item', async () => {
    const mockItem = { id: 1, name: 'Updated Item' } as unknown as User;
    (db.user.put as Mock).mockResolvedValue(1);

    const result = await service.update(mockItem);

    expect(result).toBe(1);
    expect(db.user.put).toHaveBeenCalledWith(mockItem);
  });

  it('should delete an item by id', async () => {
    (db.user.delete as Mock).mockResolvedValue(undefined);

    await service.delete(1);

    expect(db.user.delete).toHaveBeenCalledWith(1);
  });

  it('should clear all items', async () => {
    (db.user.clear as Mock).mockResolvedValue(undefined);

    await service.deleteAll();

    expect(db.user.clear).toHaveBeenCalled();
  });

  it('should add or update an item', async () => {
    const mockItem = { id: 1, name: 'Test Item' } as unknown as User;

    (db.user.get as Mock).mockResolvedValue(undefined);
    (db.user.add as Mock).mockResolvedValue(1);

    const result = await service.addOrUpdate(mockItem);

    expect(result).toBe(1);
    expect(db.user.add).toHaveBeenCalledWith(mockItem);
    expect(db.user.put).not.toHaveBeenCalled();
  });

  it('should add multiple items', async () => {
    const mockItems = [{ id: 1 }, { id: 2 }] as unknown as User[];
    (db.user.bulkPut as Mock).mockResolvedValue(undefined);

    await service.addAll(mockItems);

    expect(db.user.bulkPut).toHaveBeenCalledWith(mockItems);
  });

  it('should delete multiple items by ids', async () => {
    const ids = [1, 2];
    (db.user.bulkDelete as Mock).mockResolvedValue(undefined);

    await service.deleteByIds(ids);

    expect(db.user.bulkDelete).toHaveBeenCalledWith(ids);
  });
});
