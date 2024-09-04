/**
 *
 * @param callback - Function to be debounced
 * @param delay - Amount of delay in milliseconds
 * @returns - Debouned version of that function
 */
function debounce(callback: (...args: []) => any, delay: number): (...args: []) => void {
  let timer: NodeJS.Timeout;
  return (...args: []) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export default debounce;
