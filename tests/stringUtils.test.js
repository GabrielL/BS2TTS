const {sanitize} = require("../bin/stringUtils");

test("string sanitize", () => {
    expect(sanitize("<")).toEqual("＜")
    expect(sanitize("2 > 1")).toEqual("2 ＞ 1")
    expect(sanitize(">")).toEqual("\uff1e")
    expect(sanitize("<")).toEqual("\uff1c")
})