export const lsGet = (key) => { try { return localStorage.getItem(key); } catch(e) { return null; } }
export const lsSet = (key, val) => { try { localStorage.setItem(key, val); } catch(e) {} }
