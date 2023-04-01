/**
 * Passes the given request to the fetch API and extracts the JSON content.
 * @param  {...any} args - request arguments @see fetch
 * @returns 
 */
export const fetchJSON = (...args) => fetch(...args).then(res => res.json());

/**
 * Passes the given request to the fetch API and extracts the text content.
 * @param  {...any} args - request arguments @see fetch
 * @returns 
 */
export const fetchText = (...args) => fetch(...args).then(res => res.text());