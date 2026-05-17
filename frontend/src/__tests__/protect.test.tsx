import { describe, expect, it } from 'vitest';
import {
  getProtectFailureReason,
  isValidEncryptionMethod,
  validateProtectFile,
  validateProtectPassword,
} from '@/app/protect/logic';
import { calculatePasswordStrength, getPasswordStrengthLevel } from '@/components/PasswordInput';

describe('STEP-F2-007 — /protect and PasswordInput tests', () => {
  describe('protect file validation', () => {
    it('rejects non-PDF mime type', () => {
      const result = validateProtectFile({ type: 'image/png', size: 1024 });
      expect(result).toBe('Tipe file tidak valid. Hanya file PDF yang diterima.');
    });

    it('rejects empty file', () => {
      const result = validateProtectFile({ type: 'application/pdf', size: 0 });
      expect(result).toBe('File kosong. Silakan upload file PDF yang valid.');
    });

    it('rejects file larger than 20MB', () => {
      const result = validateProtectFile({
        type: 'application/pdf',
        size: 20 * 1024 * 1024 + 1,
      });
      expect(result).toBe('Ukuran file terlalu besar. Maksimal 20MB.');
    });

    it('accepts valid PDF file', () => {
      const result = validateProtectFile({
        type: 'application/pdf',
        size: 1024 * 1024,
      });
      expect(result).toBeNull();
    });
  });

  describe('protect password validation', () => {
    it('rejects password shorter than 4 chars', () => {
      const result = validateProtectPassword('abc', 'abc');
      expect(result).toBe('Password minimal 4 karakter.');
    });

    it('rejects password longer than 128 chars', () => {
      const tooLong = 'a'.repeat(129);
      const result = validateProtectPassword(tooLong, tooLong);
      expect(result).toBe('Password maksimal 128 karakter.');
    });

    it('rejects password mismatch', () => {
      const result = validateProtectPassword('abcd1234', 'abcd0000');
      expect(result).toBe('Password dan konfirmasi password tidak cocok.');
    });

    it('accepts valid matching password', () => {
      const result = validateProtectPassword('abcd1234', 'abcd1234');
      expect(result).toBeNull();
    });
  });

  describe('protect failure reason mapping', () => {
    it('maps 429 to rate_limit', () => {
      expect(getProtectFailureReason(429)).toBe('rate_limit');
    });

    it('maps 409 to already_encrypted', () => {
      expect(getProtectFailureReason(409)).toBe('already_encrypted');
    });

    it('maps other 4xx to validation_error', () => {
      expect(getProtectFailureReason(400)).toBe('validation_error');
      expect(getProtectFailureReason(422)).toBe('validation_error');
    });

    it('maps 5xx to server_error', () => {
      expect(getProtectFailureReason(500)).toBe('server_error');
    });
  });

  describe('encryption method validation', () => {
    it('accepts aes128 and aes256 only', () => {
      expect(isValidEncryptionMethod('aes128')).toBe(true);
      expect(isValidEncryptionMethod('aes256')).toBe(true);
      expect(isValidEncryptionMethod('rc4')).toBe(false);
    });
  });

  describe('PasswordInput strength helpers', () => {
    it('classifies weak/medium/strong levels correctly', () => {
      expect(getPasswordStrengthLevel(calculatePasswordStrength('abc'))).toBe('weak');
      expect(getPasswordStrengthLevel(calculatePasswordStrength('Abcdefgh'))).toBe('medium');
      expect(getPasswordStrengthLevel(calculatePasswordStrength('Abcdefg1!'))).toBe('strong');
    });
  });
});
