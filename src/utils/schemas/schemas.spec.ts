import { describe, expect, it, test } from 'vitest';
import { recipientSchema, userSchema } from './schemas';
describe('schemas', () => {
  describe('userSchema', () => {
    const validUser = {
      title: 'MISTER',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@doe.fr',
      phoneNumber: '0123456789',
    };

    it('should accept a valid user', () => {
      expect(() => userSchema.parse(validUser)).not.toThrow();
    });

    test.each([
      [{}, true],
      [{ title: 'hello' }, false],
      [{ email: 'in.validee.ma.il' }, false],
      [{ email: 'too.short@email.x' }, false],
      [{ email: '@missingPreAt.ma.il' }, false],
      [{ email: 'missing.postAt@' }, false],
      [{ email: 'yetAnothervalidemail@add.re.ss' }, true],
      [{ lastName: undefined }, false],
      [{ lastName: '' }, false],
    ])('expect %o validity -> %s', (data, isValid) => {
      const expectation = expect(() => userSchema.parse({ ...validUser, ...data }));
      if (isValid) {
        expectation.not.toThrow();
      } else {
        expectation.toThrow();
      }
    });
  });

  describe('recipientSchema', () => {
    const validRecipient = {
      title: 'MISTER',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@doe.fr',
      postCode: 'postCode',
      cityName: 'cityName',
    };

    it('should accept a valid recipient', () => {
      expect(() => recipientSchema.parse(validRecipient)).not.toThrow();
    });

    test.each([
      [{ title: undefined }, false],
      [{ title: '' }, false],
      [{ firstName: undefined }, false],
      [{ firstName: '' }, false],
      [{ lastName: undefined }, false],
      [{ lastName: '' }, false],
      [{ postCode: undefined }, false],
      [{ postCode: '' }, false],
      [{ cityName: undefined }, false],
      [{ cityName: '' }, false],
    ])('expect %o validity -> %s', (data, isValid) => {
      const expectation = expect(() => recipientSchema.parse({ ...validRecipient, ...data }));
      if (isValid) {
        expectation.not.toThrow();
      } else {
        expectation.toThrow();
      }
    });
  });
});
