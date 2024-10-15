import {
  communicationMediumEnum,
  communicationReasonEnum,
  communicationTypeEnum,
} from 'utils/enum/CommunicationEnums';
import { describe, it } from 'vitest';
import { communicationSchema, recipientSchema, userSchema } from './schemas';

describe('schemas', () => {
  describe('recipientSchema', () => {
    test.each([
      [{}, false],
      [{ title: 'MISS' }, false],
      [{ title: 'MISS', firstName: 'firstName' }, false],
      [{ title: 'MISS', firstName: 'firstName', lastName: 'lastName' }, false],
      [
        { title: 'MISS', firstName: 'firstName', lastName: 'lastName', postCode: 'postCode' },
        false,
      ],
      [
        {
          title: 'MISS',
          firstName: 'firstName',
          lastName: 'lastName',
          postCode: 'postCode',
          cityName: 'cityName',
        },
        true,
      ],
    ])('expect %o validity -> %s', (data, isValid) => {
      const expectation = expect(() => recipientSchema.parse({ ...data }));
      if (isValid) {
        expectation.not.toThrow();
      } else {
        expectation.toThrow();
      }
    });
  });

  describe('communicationSchema', () => {
    test.each([
      [{}, false],
      [
        {
          medium: communicationMediumEnum.MEDIUM_MAIL.type,
        },
        false,
      ],
      [
        {
          medium: communicationMediumEnum.MEDIUM_MAIL.type,
          type: communicationTypeEnum.COMMUNICATION_NOTICE.type,
        },
        false,
      ],
      [
        {
          medium: communicationMediumEnum.MEDIUM_MAIL.type,
          type: communicationTypeEnum.COMMUNICATION_NOTICE.type,
          reason: communicationReasonEnum.UNREACHABLE.type,
        },
        true,
      ],
    ])('expect %o validity -> %s', (data, isValid) => {
      const expectation = expect(() => communicationSchema.parse({ ...data }));
      if (isValid) {
        expectation.not.toThrow();
      } else {
        expectation.toThrow();
      }
    });
  });

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
