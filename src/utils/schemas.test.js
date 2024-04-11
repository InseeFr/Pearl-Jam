import { describe, it } from 'vitest';
import { userSchema } from './schemas';
describe('schemas', () => {
  describe('userSchema', () => {
    const validUser = {
      title: 'MISTER',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@doe.fr',
      phoneNumber: '0123456789',
    };

    it('should accept a valid recipient', () => {
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
});
