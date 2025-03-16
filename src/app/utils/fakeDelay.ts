export async function fakeDelay(ms: number) {
  return new Promise((resolve) => setTimeout(() => resolve(true), ms));
}
