const db = require('../db');

const createConfigTable = () => {
    db.prepare(`
        CREATE TABLE IF NOT EXISTS config (
            key TEXT PRIMARY KEY,
            value TEXT
        )
    `).run();
};

const setConfig = (key, value) => {
    db.prepare(`
        INSERT INTO config (key, value) VALUES (?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `).run(key, value);
};

const getConfig = (key) => {
    const row = db.prepare('SELECT value FROM config WHERE key = ?').get(key);
    return row ? row.value : null;
};

const getAllConfigs = () => {
    return db.prepare('SELECT * FROM config').all();
};

const deleteConfig = (key) => {
    const result = db.prepare('DELETE FROM config WHERE key = ?').run(key);
    return result.changes > 0;
};

const resetConfig = () => {
    db.prepare('DELETE FROM config').run();
};

const addMultiValueConfig = (key, value, seperator) => {
    const existingValue = getConfig(key);
    const existingValuesArray = existingValue ? existingValue.split(seperator).map(value => value.trim()).filter(Boolean) : [];
    if (existingValuesArray.includes(value)) {
        return false;
    };
    existingValuesArray.push(value);
    const newValue = existingValuesArray.join(seperator);
    setConfig(key, newValue);
    return true;
}

const getMultiValueConfig = (key, seperator) => {
    const existingValue = getConfig(key);
    return existingValue ? existingValue.split(seperator).map(value => value.trim()).filter(Boolean) : [];
}

const removeMultiValueConfig = (key, value, seperator) => {
    const existingValue = getConfig(key);
    const existingValuesArray = existingValue ? existingValue.split(seperator).map(value => value.trim()).filter(Boolean) : [];
    if (!existingValuesArray.includes(value)) {
        return false;
    };
    const newValue = existingValuesArray.filter(existingValue => existingValue !== value).join(seperator);
    setConfig(key, newValue || null);
    return true;
}

module.exports = {
    createConfigTable,
    setConfig,
    getConfig,
    getAllConfigs,
    deleteConfig,
    resetConfig,
    addMultiValueConfig,
    getMultiValueConfig,
    removeMultiValueConfig
};