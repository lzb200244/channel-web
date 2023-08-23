class LRUCache<K, V> {
    private capacity: number;

    private cache: Map<K, V>;

    constructor(capacity: number) {
      this.capacity = capacity;
      this.cache = new Map();
    }

    get(key: K): V | undefined {
      if (this.cache.has(key)) {
        const value = this.cache.get(key)!;
        this.cache.delete(key);
        this.cache.set(key, value);
        return value;
      }
      return undefined;
    }

    put(key: K, value: V, cb: (roomID:number) => void): void {
      if (this.cache.size >= this.capacity) {
        const oldestKey = this.cache.keys().next().value;
        // 断开ws
        (this.cache.get(oldestKey) as WebSocket).close();
        // 删除ws缓存
        this.cache.delete(oldestKey);
        // 进行清除缓存的异理
        cb(oldestKey);
      }
      this.cache.set(key, value);
    }
}

// Example usage
// const lruCache = new LRUCache<string, number>(3);
export default LRUCache;
