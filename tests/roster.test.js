const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

const approvals = require("approvals");

const {roszParse, UnknownGame, getGameSystemName} = require("../bin/roszParser");
const Roster = require("../bin/Roster");
const {parseXML} = require("../bin/xml");
const Output = require("../bin/Output");
const {formatArmy, loadModules} = require("../service");


function getTestNameSafe() {
    return expect.getState().currentTestName
        .replaceAll(" ", "-")
        .replaceAll("/", "-");
}

const approvalSamples = [
    "sample-army.rosz",
    "adepta-sororitas-celestine.rosz",
    "tau-commander.rosz",
    "sample-sm-vanguard-vets.rosz",
    "sample-sm-bike-squad.rosz",
    "sample-sm-librarian-dreadnought.rosz",
    "sample-grey-knights-land-raider.rosz",
    "750-necron.rosz",
]

describe("roster loading = approvals", () => {
   it.each(approvalSamples)("%s", (filename) => {
       var id = 0
       const spy = jest.spyOn(crypto, "randomBytes").mockImplementation((size) => {
           return Buffer.alloc(size, id++);
       });

       const fileContent = fs.readFileSync(path.join(__dirname, "../samples", filename));
       const roster = roszParse(fileContent);
       approvals.verify(__dirname, getTestNameSafe(), Roster.serialize(roster, 4))
       spy.mockRestore();
   })
});

describe("roster validation", () => {
   it.each(approvalSamples)("%s", (filename) => {
       const fileContent = fs.readFileSync(path.join(__dirname, "../samples", filename));
       const result = roszParse(fileContent);

       loadModules()

       const params = {
           uiHeight: 100,
           uiWidth: 100,
           decorativeNames: true,
           modules: ["MatchedPlay", "Crusade"]
       }

       const data = JSON.parse(Roster.serialize(result))

       const armyData = formatArmy(data, params.uiHeight, params.uiWidth, params.decorativeNames, params.modules)

       const {value, error} = Output.validate(armyData)
       expect(error).toBeUndefined()
   });
});

test("empty roster", () => {
    const fileContent = fs.readFileSync(path.join(__dirname, "../samples", "empty-roster.rosz"));
    const roster = roszParse(fileContent);
    expect(roster.units).toStrictEqual(new Map())
    expect(roster.order).toHaveLength(0)
})

test("uncompressed roster", () => {
    const fileContent = fs.readFileSync(path.join(__dirname, "../samples", "sample-army.ros"));
    const roster = roszParse(fileContent);
    expect(roster.units).toBeDefined()
    expect(roster.order).toBeDefined()
})

test("do not load non warhammer 40k rosters", () => {
    const fileContent = fs.readFileSync(path.join(__dirname, "../samples", "aos.ros"));
    expect(() => roszParse(fileContent)).toThrow(UnknownGame)
})

test("retrieve gameSystemName", () => {
    const fileContent = fs.readFileSync(path.join(__dirname, "../samples", "sample-army.ros"));
    const result = parseXML(fileContent);

    expect(getGameSystemName(result)).toBe("Warhammer 40,000 9th Edition" )
})

test("nested detachements", () => {
    const fileContent = fs.readFileSync(path.join(__dirname, "../samples", "nested-detachements.rosz"));
    const roster = roszParse(fileContent);
    expect(roster.units.size).toBe(2);
})