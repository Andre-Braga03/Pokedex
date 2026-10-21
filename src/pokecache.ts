
export type CacheEntry<T>= {
    createdAt: Date;
    val: T;
}

export class Cache{
    #cache = new Map<string, CacheEntry<any>>();
    #reapInterval: NodeJS.Timeout | undefined;
    #interval: number;



    constructor(interval: number){
        this.#interval = interval;
        this.#reapInterval = undefined;
        this.#startReapLoop();
    }

    add<T>(key: string, val: T): void{
        const entry: CacheEntry<T> = {
            createdAt: new Date(Date.now()),
            val: val,
        };
        this.#cache.set(key, entry);
    }

    get<T>(key: string): T | undefined{
        const entry = this.#cache.get(key);

        if(!entry){
            return undefined;
        }
        return entry.val;
    }

    #reap(){
        const now = Date.now();
        for(const [key,entry] of this.#cache){
            if(now - entry.createdAt.getTime() > this.#interval){
                this.#cache.delete(key);
            }
        }
    }

    #startReapLoop(){
        this.#reapInterval = setInterval(() => {
            this.#reap();
        }, this.#interval);
  
    }
    stopReapLoop(){
        if(this.#reapInterval){
            clearInterval(this.#reapInterval);
        }
            this.#reapInterval = undefined;
        
    }
}