import NodeCache from 'node-cache';
import { isNilOrEmpty } from 'ramda-extension';

export default class Cache {

  constructor(ttlSeconds) {
    this.cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false });
  }

  get(key, storeFunction) {
    const value = this.cache.get(key);
    if (!isNilOrEmpty(value)) {
      return Promise.resolve(value);
    }
    
    return storeFunction().then((result) => {
      this.cache.set(key, result);
      return result;
    });
  }

  del(keys) {
    this.cache.del(keys);
  }

  delStartWith(startStr) {
    if (!isNilOrEmpty(startStr)) return;

    const keys = this.cache.keys();
    keys.forEach(key => key.indexOf(startStr) === 0 && this.del(key))
  }

  flush() {
    this.cache.flushAll();
  }
}