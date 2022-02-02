const Joi = require("joi");

const Dictionary = (Key, Value) => Joi.object().pattern(Key, Value)
const Array = (Value) => Joi.array().items(Value)
const StringArray = Array(Joi.string())

const Abilities = Joi.object({
    desc: Joi.string(),
    name: Joi.string()
});

const ModelProfile = Joi.object({
    name: Joi.string(),
    m: Joi.string(),
    ws: Joi.string(),
    bs: Joi.string(),
    s: Joi.string(),
    t: Joi.string(),
    w: Joi.string(),
    a: Joi.string(),
    ld: Joi.string(),
    sv: Joi.string(),
});

const WeaponProfile = Joi.object({
    name: Joi.string(),
    range: Joi.string(),
    type: Joi.string(),
    s: Joi.string(),
    ap: Joi.string(),
    d: Joi.string(),
    abilities: Joi.string()
});

const ModelWeapon = Joi.object({name: Joi.string(), number: Joi.number()});

const Identifier = Joi.string();

const ModelDescription = Joi.object({
    name: Joi.string(),
    abilities: StringArray,
    weapons: Array(ModelWeapon),
    number: Joi.number(),
    node: Joi.object({})
});

const PsykerProfile = Joi.object({
    name: Joi.string(),
    cast: Joi.string(),
    deny: Joi.string(),
    known: Joi.string(),
    other: Joi.string(),
});

const Power = Joi.object({
    name: Joi.string(),
    warpCharge: Joi.string(),
    range: Joi.string(),
    details: Joi.string(),
});

const Unit = Joi.object({
    name: Joi.string().required(),
    uuid: Joi.string().required(),
    pl: Joi.number().required(),

    abilities: Dictionary(Identifier, Abilities).required(),
    factionKeywords: StringArray.required(),
    keywords: StringArray.required(),
    models: Joi.object({
        totalNumberOfModels: Joi.number(),
        models: Dictionary(Identifier, ModelDescription)
    }).required(),
    modelProfiles: Dictionary(Identifier, ModelProfile).required(),
    weapons: Dictionary(Identifier, WeaponProfile).required(),
    rules: StringArray.required(),

    unassignedWeapons: Joi.array().required(),

    isSingleModel: Joi.boolean().required(),
    psykerProfiles: Joi.array().items(PsykerProfile),
    powersKnown: Joi.array().items(Power),
    woundTrack: Dictionary(Identifier, Dictionary(Joi.string(), StringArray))
});

const FormattedArmy = Joi.object({
    xml: Joi.object(),
    height: Joi.object(),

    order: Joi.array().items(Identifier),
    armyData: Dictionary(Identifier, Unit),

    uiHeight: Joi.number(),
    uiWidth: Joi.number(),
    decorativeNames: Joi.boolean(),
    baseScript: Joi.string()
}).required()

/**
 * validate output schema
 *
 * This is not really useful in the code, just used to discover what is the output
 *
 * @param rosterData
 */
function validate(rosterData) {
    return FormattedArmy.validate(rosterData);
}

module.exports = {
    validate: validate,
};