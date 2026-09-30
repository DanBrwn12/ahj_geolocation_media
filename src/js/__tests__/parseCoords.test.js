import parseCoords from '../parseCoords';

describe('parseCoords', () => {
  test('формат с пробелом', () => {
    expect(parseCoords('50.3453, -0.123455')).toEqual({
      latitude: 50.3453,
      longitude: -0.123455,
    });
  });

  test('формат без пробела', () => {
    expect(parseCoords('50.3453,-0.123455')).toEqual({
      latitude: 50.3453,
      longitude: -0.123455,
    });
  });

  test('формат с квадратными скобками', () => {
    expect(parseCoords('[50.3453,-0.123455]')).toEqual({
      latitude: 50.3453,
      longitude: -0.123455,
    });
  });

  test('не верный формат', () => {
    expect(() => parseCoords('aasdasdasd')).toThrow();
  });
});
