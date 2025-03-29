const db = require('../db');

const createGuildConfigTable = () => {
    db.prepare(`
        CREATE TABLE IF NOT EXISTS guildconfig (
            guildId TEXT NOT NULL,
            key TEXT NOT NULL,
            value TEXT,
            PRIMARY KEY (guildId, key)
        )
    `).run();
};

const setGuildConfig = (guildId, key, value) => {
    db.prepare(`
        INSERT INTO guildconfig (guildId, key, value) 
        VALUES (?, ?, ?) 
        ON CONFLICT(guildId, key) DO UPDATE SET value = excluded.value
    `).run(guildId, key, value);
};

const getGuildConfig = (guildId, key) => {
    const row = db.prepare('SELECT value FROM guildconfig WHERE guildId = ? AND key = ?').get(guildId, key);
    return row ? row.value : null;
};

const getAllGuildConfigs = (guildId) => {
    return db.prepare('SELECT key, value FROM guildconfig WHERE guildId = ?').all(guildId);
};

const unsetGuildConfig = (guildId, key) => {
    setGuildConfig(guildId, key, null);
}

const deleteGuildConfig = (guildId, key) => {
    const result = db.prepare('DELETE FROM guildconfig WHERE guildId = ? AND key = ?').run(guildId, key);
    return result.changes > 0;
};

const resetGuildConfig = (guildId) => {
    db.prepare('DELETE FROM guildconfig WHERE guildId = ?').run(guildId);
};

const addMultiValueGuildConfig = (guildId, key, value, seperator) => {
    const existingValue = getGuildConfig(guildId, key);
    const existingValuesArray = existingValue ? existingValue.split(seperator).map(value => value.trim()).filter(Boolean) : [];
    if (existingValuesArray.includes(value)) {
        return false;
    };
    existingValuesArray.push(value);
    const newValue = existingValuesArray.join(seperator);
    setGuildConfig(guildId, key, newValue);
    return true;
}

const getMultiValueGuildConfig = (guildId, key, seperator) => {
    const existingValue = getGuildConfig(guildId, key);
    return existingValue ? existingValue.split(seperator).map(value => value.trim()).filter(Boolean) : [];
}

const removeMultiValueGuildConfig = (guildId, key, value, seperator) => {
    const existingValue = getGuildConfig(guildId, key);
    const existingValuesArray = existingValue ? existingValue.split(seperator).map(value => value.trim()).filter(Boolean) : [];
    if (!existingValuesArray.includes(value)) {
        return false;
    };
    const newValue = existingValuesArray.filter(existingValue => existingValue !== value).join(seperator);
    setGuildConfig(guildId, key, newValue || null);
    return true;
}

module.exports = {
    createGuildConfigTable,
    setGuildConfig,
    getGuildConfig,
    getAllGuildConfigs,
    unsetGuildConfig,
    deleteGuildConfig,
    resetGuildConfig,
    addMultiValueGuildConfig,
    getMultiValueGuildConfig,
    removeMultiValueGuildConfig,
};
