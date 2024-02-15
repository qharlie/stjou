
const DB_NAME = 'imports_db';
const DB_VERSION = 1;
let DB;
import log from '@/logger';
export default {

    async getDb() {
        return new Promise((resolve, reject) => {

            if (DB) {
                return resolve(DB);
            }
            log.info(`Opening db ${DB_NAME} version ${DB_VERSION}`);
            let request = window.indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = e => {
                log.error('Error opening db', e);
                reject('Error');
            };

            request.onsuccess = e => {

                DB = e.target.result; // eslint-disable-line
                resolve(DB);
            };

            request.onupgradeneeded = e => {
                log.warn('onupgradeneeded');
                let db = e.target.result;
                db.createObjectStore("trade_imports", {autoIncrement: true, keyPath: 'id'});
            };
        });
    },
    async deleteImport(id) {

        let db = await this.getDb();

        return new Promise(resolve => {

            let trans = db.transaction(['trade_imports'], 'readwrite');
            trans.oncomplete = () => {
                resolve({});
            };

            let store = trans.objectStore('trade_imports');
            store.delete(id);
        });
    },
    async getImport() {

        let db = await this.getDb();

        return new Promise(resolve => {

            let trans = db.transaction(['trade_imports'], 'readonly');
            trans.oncomplete = () => {
                resolve(trade_imports);
            };

            let store = trans.objectStore('trade_imports');
            let trade_imports = [];

            store.openCursor().onsuccess = e => {
                let cursor = e.target.result;
                if (cursor) {
                    trade_imports.push(cursor.value)
                    cursor.continue();
                }
            };

        });
    },

    async saveImport(imports) {

        let db = await this.getDb();

        return new Promise(resolve => {

            let trans = db.transaction(['trade_imports'], 'readwrite');
            trans.oncomplete = () => {
                resolve({});
            };

            let store = trans.objectStore('trade_imports');
            store.put(imports);

        });

    },

    async clearAll() {
        window.indexedDB.deleteDatabase(DB_NAME);
    }

}
