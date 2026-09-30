export default function parseCoords(input) {
  const trimmed = input.trim();

  const regex = /^\[?\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\]?$/;
  const match = trimmed.match(regex);

  if (!match) {
    throw new Error('Неверный формат координат');
  }

  const latitude = Number(match[1]);
  const longitude = Number(match[2]);

  if (latitude < -90 || latitude > 90) {
    throw new Error('Широта должна быть от -90 до 90');
  }

  if (longitude < -180 || longitude > 180) {
    throw new Error('Долгота должна быть от -180 до 180');
  }

  return { latitude, longitude };
}
