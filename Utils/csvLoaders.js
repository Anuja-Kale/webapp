const fs = require('fs').promises;
const path = require('path');
const csvParser = require('papaparse');

const loadUsersFromCSV = async (filePath) => {
    const fileContent = await fs.readFile(path.join(__dirname, filePath), 'utf-8');

    // Parse CSV with tab as the delimiter
    const results = csvParser.parse(fileContent, {
        delimiter: '\t',  // <- Tab delimiter
        header: true,
        skipEmptyLines: true
    });

    if (results.errors.length) {
        throw new Error(`Error parsing CSV: ${results.errors[0].message}`);
    }

    return results.data;
};

module.exports = loadUsersFromCSV;

