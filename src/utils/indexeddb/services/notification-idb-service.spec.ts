import { vi, describe, beforeEach, expect, Mock, it, MockInstance } from 'vitest';
import NotificationIdbService from './notification-idb-service';

vi.mock('./abstract-idb-service');

describe('NotificationIdbService - addOrUpdateNotif', () => {
  let mockGet: MockInstance<(typeof NotificationIdbService)['get']>;
  let mockUpdate: MockInstance<(typeof NotificationIdbService)['update']>;
  let mockInsert: MockInstance<(typeof NotificationIdbService)['insert']>;

  beforeEach(() => {
    mockGet = vi.spyOn(NotificationIdbService, 'get');
    mockUpdate = vi.spyOn(NotificationIdbService, 'update');
    mockInsert = vi.spyOn(NotificationIdbService, 'insert');
    vi.clearAllMocks();
  });

  it('should update the notification if it already exists', async () => {
    const existingNotification = { id: '123', title: 'Existing Notification' };
    const updatedNotification = {
      id: '123',
      title: 'Updated Notification',
    } as unknown as Notification;

    mockGet.mockResolvedValue(existingNotification);
    mockUpdate.mockResolvedValue(updatedNotification);

    const result = await NotificationIdbService.addOrUpdateNotif(updatedNotification);

    expect(mockGet).toHaveBeenCalledWith('123');
    expect(mockUpdate).toHaveBeenCalledWith(updatedNotification);
    expect(result).toEqual(updatedNotification);
  });

  it('should insert the notification if it does not exist', async () => {
    const newNotification = { id: '456', title: 'New Notification' } as unknown as Notification;

    mockGet.mockResolvedValue(null);
    mockInsert.mockResolvedValue(newNotification);

    const result = await NotificationIdbService.addOrUpdateNotif(newNotification);

    expect(mockGet).toHaveBeenCalledWith('456');
    expect(mockInsert).toHaveBeenCalledWith(newNotification);
    expect(result).toEqual(newNotification);
  });

  it('should insert the notification if no id is provided', async () => {
    const notificationWithoutId = { title: 'Notification Without ID' };
    const insertedNotification = { id: '789', title: 'Notification Without ID' };

    mockInsert.mockResolvedValue(insertedNotification);

    const result = await NotificationIdbService.addOrUpdateNotif(notificationWithoutId);

    expect(mockGet).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
    expect(mockInsert).toHaveBeenCalledWith(notificationWithoutId);
    expect(result).toEqual(insertedNotification);
  });
});
