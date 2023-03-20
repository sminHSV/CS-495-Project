export const fetchJSON = (...args) => fetch(...args).then(res => res.json());
export const fetchText = (...args) => fetch(...args).then(res => res.text());