import { describe, expect, it } from 'vitest';
import mailMessage from './mailMessage';

it('should define bodyTempZonePearl', () => {
  expect(mailMessage.bodyTempZonePearl.fr('1')()).toContain(
    'Les données sont de nature organisationnelle.'
  );
});

it('should define bodyTempZonePearl', () => {
  expect(mailMessage.bodyTempZoneQueen.fr('1')()).toContain(
    'Les données sont de nature questionnaire.'
  );
});
