
export function timeoutPromise(timeout: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(null), timeout);
  });
}
