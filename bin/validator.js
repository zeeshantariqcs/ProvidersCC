"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidNpiNumber = function (npi) {
    var tmp;
    var sum;
    var i;
    var j;
    i = npi.length;
    if ((i == 15) && (npi.indexOf("80840", 0, 5) == 0))
        sum = 0;
    else if (i == 10)
        sum = 24;
    else
        return false;
    j = 0;
    while (i != 0) {
        tmp = npi.charCodeAt(i - 1) - '0'.charCodeAt(0);
        if ((j++ % 2) != 0) {
            if ((tmp <<= 1) > 9) {
                tmp -= 10;
                tmp++;
            }
        }
        sum += tmp;
        i--;
    }
    if ((sum % 10) == 0)
        return true;
    else
        return false;
};
exports.validateProvider = (firstName, lastName, NpiNumber) => {
    let errors = "";
    if (firstName !== "" || lastName !== "" || NpiNumber !== "") {
        if (typeof NpiNumber !== "undefined" && NpiNumber !== "") {
            if (!exports.isValidNpiNumber(NpiNumber)) {
                errors += "Please enter a valid NPINumber<br/>";
            }
        }
        let name_regex = new RegExp("^[a-zA-Z������????����??����??����������??��??��?��������?????��������???����������??��??��ǌ�?��?� ,.'-]+$");
        if (typeof firstName !== "undefined" && firstName !== "") {
            if (!name_regex.test(firstName)) {
                errors += "Please enter a valid First Name etc Muhammad<br/>";
            }
        }
        if (typeof lastName !== "undefined" && lastName !== "") {
            if (!name_regex.test(lastName)) {
                errors += "Please enter a valid Last Name etc Zeeshan";
            }
        }
    }
    else
        errors += "Sorry, we can not proceed with an empty data.";
    return errors;
};

//# sourceMappingURL=maps/validator.js.map
