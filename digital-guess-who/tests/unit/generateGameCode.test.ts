// digital-guess-who/tests/unit/generateGameCode.test.ts
import { generateGameCode } from '@/lib/utils';

describe('generateGameCode', () => {
  it('should return a 4-character string', () => {
    const code = generateGameCode();
    expect(typeof code).toBe('string');
    expect(code).toHaveLength(4);
  });

  it('should return a string containing only uppercase letters and digits', () => {
    const code = generateGameCode();
    expect(code).toMatch(/^[A-Z0-9]{4}$/);
  });

  it('should generate different codes on successive calls (high probability)', () => {
    const codes = new Set<string>();
    for (let i = 0; i < 1000; i++) {
      codes.add(generateGameCode());
    }
    // With 36^4 possible codes (1,679,616), 1000 unique codes is highly probable
    expect(codes.size).toBeGreaterThan(990);
  });
});
