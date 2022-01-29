const AdmZip = require("adm-zip");
const {parseXML} = require("./xml");
const Roster = require("./Roster");

class InvalidRoster extends Error {
    constructor(message) {
        super("Invalid Roster: " + message);
    }
}

class UnknownGame extends InvalidRoster {
    constructor(gameName) {
        super(`unknown game \"${gameName}\"`);
    }
}

function extractRosterXML(rawData) {
    let zip;
    try {
        zip = new AdmZip(rawData);
    } catch (err) {
        return rawData;
    }
    const zipEntries = zip.getEntries();

    if (zipEntries.length !== 1) {
        throw new InvalidRoster("Invalid Rosz file, it should have only 1 file in archive");
    }

    return zip.readAsText(zipEntries[0]);
}

function getGameSystemName(roster) {
    return roster.roster.$.gameSystemName;
}

module.exports.roszParse = (rawData) => {
    const xmlData = extractRosterXML(rawData);
    const result = parseXML(xmlData);

    const gameSystemName = getGameSystemName(result);
    if (gameSystemName !== "Warhammer 40,000 9th Edition" ) {
        throw new UnknownGame(gameSystemName);
    }

    return Roster.parse(result.roster.forces);
};

module.exports.getGameSystemName = getGameSystemName
module.exports.InvalidRoster = InvalidRoster
module.exports.UnknownGame = UnknownGame