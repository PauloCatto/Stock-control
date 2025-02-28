import { ShortenPipe } from './shorten.pipe';

describe('ShortenPipe', () => {
  let pipe: ShortenPipe;

  beforeEach(() => {
    pipe = new ShortenPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should shorten a string and add "..." when it exceeds the specified length', () => {
    const result = pipe.transform('Hello, this is a test string', 10);
    expect(result).toBe('Hello, thi...');
  });

  it('should not shorten the string if it is less than or equal to the specified length', () => {
    const result = pipe.transform('Short', 10);
    expect(result).toBe('Short');
  });

  it('should return an empty string if the value is null', () => {
    const result = pipe.transform(null, 10);
    expect(result).toBe('');
  });

  it('should return the original string if it is exactly the specified length', () => {
    const result = pipe.transform('ExactLength', 12);
    expect(result).toBe('ExactLength');
  });
});
