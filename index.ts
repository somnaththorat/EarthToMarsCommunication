const  express = require('express');
const app = express();
app.use(express.json());
const PORT = 5000;

type CharToNumObj = { [key: string]: string };

const charToNumObj: CharToNumObj = {
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

const charGroup: string[][] = [
  ['a', 'b', 'c'],
  ['d', 'e', 'f'],
  ['g', 'h', 'i'],
  ['j', 'k', 'l'],
  ['m', 'n', 'o'],
  ['p', 'q', 'r', 's'],
  ['t', 'u', 'v'],
  ['w', 'x', 'y', 'z'],
];

const middleware = (req:any, res:any, next:any) => {  
  const sender = req.headers['x-sender'];
  const receiver = req.headers['x-receiver'];
  const startTime = Date.now();

  console.log(`x-sender= ${sender}`);
  console.log(`x-receiver= ${receiver}`);
  console.log(`Request Start Time: ${new Date(startTime).toISOString()}`);

  next();

  const endTime = Date.now();
  const processingTime = endTime - startTime;
  console.log(`Request End Time: ${new Date(endTime).toISOString()}`);
  console.log(`Processing Time: ${processingTime} ms`);
};

const textToNumeric = (text: string): string => {
  let numericMessage = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i].toLowerCase();
    if (charToNumObj[char]) {
      if ((i > 0 && charToNumObj[char] === charToNumObj[text[i - 1].toLowerCase()]) ||
        (i > 0 && charGroup.some(set => set.includes(char) && set.includes(text[i - 1].toLowerCase())))
      ) {
        numericMessage += '.';
      }
      numericMessage += charToNumObj[char];
    }
  }
  return numericMessage;
};

const numericToText = (numericMessage: string): string => {
  const findKeyByValue = (obj: CharToNumObj, value: string): string | null => {
    for (const key in obj) {
      if (obj[key] === value) {
        return key;
      }
    }
    return null;
  };

  const wordsArray = numericMessage.split('0');
  let finalResult = '';
  for (const word of wordsArray) {
    let chars = word.split('.');
    for (const char of chars) {
      let res = char[0];
      for (let i = 1; i <= char.length; i++) {
        if (res.includes(char[i])) {
          res += char[i];
        } else {
          const key = findKeyByValue(charToNumObj, res);
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

app.post('/api/earth-mars-comm/message', middleware, (req: any, res:any) => {
  const sender = req.headers['x-sender'];
  const receiver = req.headers['x-receiver'];
  const message = req.body.message;

  try {
    if (sender === 'earth' && receiver === 'mars') {
      const translatedMessage = textToNumeric(message);
      res.json({ 'Response From Mars': translatedMessage });
    } else if (sender === 'mars' && receiver === 'earth') {
      const translatedMessage = numericToText(message);
      res.json({ 'Response From Earth': translatedMessage });
    }
  } catch (error) {
    res.json({ error: error });
  }
});

app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
});
