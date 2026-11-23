import { describe, expect, it } from 'vitest';
import { isValidContact, normalizeContact } from '../../backend/src/domain/contact';

describe('contacto', () => {
  it('normaliza nombre, correo y mensaje', () => {
    expect(normalizeContact({ name: '  Ana   Pérez  ', email: ' ANA@EXAMPLE.COM ', message: '  Hola Suner.  ' }))
      .toEqual({ name: 'Ana Pérez', email: 'ana@example.com', message: 'Hola Suner.' });
  });

  it('rechaza mensajes demasiado cortos', () => {
    expect(isValidContact({ name: 'Ana', email: 'ana@example.com', message: 'Hola' })).toBe(false);
  });

  it('acepta un contacto completo', () => {
    expect(isValidContact({ name: 'Ana Pérez', email: 'ana@example.com', message: 'Quiero conversar sobre un sitio web.' })).toBe(true);
  });
});
