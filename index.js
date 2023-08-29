var express = require('express');
var app = express();
app.use(express.json());
var PORT = 5000;
var charToNumObj = {
    'a': '2', 'b': '22', 'c': '222',
    'd': '3', 'e': '33', 'f': '333',
    'g': '4', 'h': '44', 'i': '444',
    'j': '5', 'k': '55', 'l': '555',
    'm': '6', 'n': '66', 'o': '666',
    'p': '7', 'q': '77', 'r': '777', 's': '7777',
    't': '8', 'u': '88', 'v': '888',
    'w': '9', 'x': '99', 'y': '999', 'z': '9999',
    ' ': '0'
};
var charGroup = [
    ['a', 'b', 'c'],
    ['d', 'e', 'f'],
    ['g', 'h', 'i'],
    ['j', 'k', 'l'],
    ['m', 'n', 'o'],
    ['p', 'q', 'r', 's'],
    ['t', 'u', 'v'],
    ['w', 'x', 'y', 'z'],
];
var middleware = function (req, res, next) {
    var sender = req.headers['x-sender'];
    var receiver = req.headers['x-receiver'];
    var startTime = Date.now();
    console.log("x-sender= ".concat(sender));
    console.log("x-receiver= ".concat(receiver));
    console.log("Request Start Time: ".concat(new Date(startTime).toISOString()));
    next();
    var endTime = Date.now();
    var processingTime = endTime - startTime;
    console.log("Request End Time: ".concat(new Date(endTime).toISOString()));
    console.log("Processing Time: ".concat(processingTime, " ms"));
};
var textToNumeric = function (text) {
    var numericMessage = '';
    var _loop_1 = function (i) {
        var char = text[i].toLowerCase();
        if (charToNumObj[char]) {
            if ((i > 0 && charToNumObj[char] === charToNumObj[text[i - 1].toLowerCase()]) ||
                (i > 0 && charGroup.some(function (set) { return set.includes(char) && set.includes(text[i - 1].toLowerCase()); }))) {
                numericMessage += '.';
            }
            numericMessage += charToNumObj[char];
        }
    };
    for (var i = 0; i < text.length; i++) {
        _loop_1(i);
    }
    return numericMessage;
};
var numericToText = function (numericMessage) {
    var findKeyByValue = function (obj, value) {
        for (var key in obj) {
            if (obj[key] === value) {
                return key;
            }
        }
        return null;
    };
    var wordsArray = numericMessage.split('0');
    var finalResult = '';
    for (var _i = 0, wordsArray_1 = wordsArray; _i < wordsArray_1.length; _i++) {
        var word = wordsArray_1[_i];
        var chars = word.split('.');
        for (var _a = 0, chars_1 = chars; _a < chars_1.length; _a++) {
            var char = chars_1[_a];
            var res = char[0];
            for (var i = 1; i <= char.length; i++) {
                if (res.includes(char[i])) {
                    res += char[i];
                }
                else {
                    var key = findKeyByValue(charToNumObj, res);
                    if (key) {
                        finalResult += key;
                    }
                    res = '';
                    res += char[i];
                }
            }
        }
        finalResult += ' ';
    }
    return finalResult;
};
app.post('/api/earth-mars-comm/message', middleware, function (req, res) {
    var sender = req.headers['x-sender'];
    var receiver = req.headers['x-receiver'];
    var message = req.body.message;
    try {
        if (sender === 'earth' && receiver === 'mars') {
            var translatedMessage = textToNumeric(message);
            res.json({ 'Response From Mars': translatedMessage });
        }
        else if (sender === 'mars' && receiver === 'earth') {
            var translatedMessage = numericToText(message);
            res.json({ 'Response From Earth': translatedMessage });
        }
    }
    catch (error) {
        res.json({ error: error });
    }
});
app.listen(PORT, function () {
    console.log("app is listening on port ".concat(PORT));
});
