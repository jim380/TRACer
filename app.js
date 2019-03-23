//                                                                                                         
//                                                  jim380 <admin@cyphercore.io>
//  ============================================================================
//  
//  Copyright (C) 2019 jim380
//  
//  Permission is hereby granted, free of charge, to any person obtaining
//  a copy of this software and associated documentation files (the
//  "Software"), to deal in the Software without restriction, including
//  without limitation the rights to use, copy, modify, merge, publish,
//  distribute, sublicense, and/or sell copies of the Software, and to
//  permit persons to whom the Software is furnished to do so, subject to
//  the following conditions:
//  
//  The above copyright notice and this permission notice shall be
//  included in all copies or substantial portions of the Software.
//  
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
//  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
//  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
//  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
//  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
//  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
//  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//  
//  ============================================================================
const fetch = require('node-fetch');

const TeleBot = require('telebot');
const bot = new TeleBot({
  token: '',
  usePlugins: ['namedButtons','askUser'],
  pluginFolder: '../plugins/',
  pluginConfig: {
      namedButtons: {
          //buttons: BUTTONS
      }
  }
});

function makeRequest(verb, endpoint, data = {}) {
  postBody = JSON.stringify(data);

  const headers = {
    'content-type': 'application/json',
    //'accept': 'application/json',
  };

  const requestOptions = {
    method: verb,
    body: JSON.stringify(data),
    headers,
  };

  const url = 'http://watcher.ari.omg.network/' + endpoint;

  // fetch(url, requestOptions)
  // .then(res => res.json())
  // .then(async response => await console.log(`${endpoint}\n\u200b\n${response.data[0].amount/1e18} ETH\n-----------------\n`))
  // // or JSON.stringify(response)
  // .catch(error => console.error('Error:\n', error));
  return fetch(url, requestOptions);
}

// error handling
const handleErrors = (e,chatid) => {
  //console.log(e);
  if (e.name == 'TypeError') {
    //console.error(e);
    bot.sendMessage(chatid,`Account not found!`);  
  } else {
    //console.error(e);
    bot.sendMessage(chatid,`Ooops... connection issue!`);
  }
}

// bot commands
// account - balance
bot.on('/balance', async (msg) => {
  return bot.sendMessage(msg.chat.id, `Please provide an address.`, {ask: 'accountAddr'});
});

bot.on('ask.accountAddr', async msg => {
  const addr = msg.text;
  makeRequest('POST', 'account.get_balance', {address: addr})
  .then(res => res.json())
  .then(async response => {
    //console.log(response);
    if (msg.text.length === 42) {
      await bot.sendMessage(msg.from.id,`\`Balance\`: ${response.data[0].amount/1e18} ETH`, {parseMode: 'Markdown'})
    } else (
      await bot.sendMessage(msg.from.id, `invalid address`)
    )
  })
    //console.log(`Balance\n\u200b\n${response.data[0].amount/1e18} ETH\n-----------------\n`))
  // or JSON.stringify(response)
  .catch(error => handleErrors(error, msg.from.id));
});

// account - utxo
bot.on('/utxo', async (msg) => {
  return bot.sendMessage(msg.chat.id, `Please provide an address.`, {ask: 'accountUTXO'});
});

bot.on('ask.accountUTXO', async (msg) => {
  const addr = msg.text;
  makeRequest('POST', 'account.get_utxos', {address: addr})
  .then(res => res.json())
  .then(async response => {
    console.log(response);
    if (msg.text.length === 42) {
      await bot.sendMessage(msg.from.id,`\`Owner\`: ${response.data[0].owner}`, {parseMode: 'Markdown'})
    } else {
      await bot.sendMessage(msg.from.id, `invalid address`)
    }
  })
  // or JSON.stringify(response)
  .catch(error => handleErrors(error, msg.from.id));
});

// account - txn
//makeRequest('POST', 'account.get_transactions', {address: '0x949c49c809e83f586b188b46d008a8ceebc23a8c'});
bot.on('/txn', async (msg) => {
  return bot.sendMessage(msg.chat.id, `Please provide an address.`, {ask: 'accountTXN'});
});

bot.on('ask.accountTXN', async (msg) => {
  const addr = msg.text;
  makeRequest('POST', 'account.get_transactions', {address: addr})
  .then(res => res.json())
  .then(async response => {
    console.log(response);
    // console.log(response.data[0].results);
    // console.log(response.data[0].block);
    let i = 1;
    for (let el of response.data) {
      if (msg.text.length === 42) {
        await bot.sendMessage(msg.from.id,`${i}.\n`
        +`\`Childchain hash\`: ${el.txhash}\n`
        + `\`Rootchain height\`: ${el.block.eth_height}\n`, {parseMode: 'Markdown'})
      } else {
        await bot.sendMessage(msg.from.id, `invalid address`)
      }
      i++;
    }
  })
  // or JSON.stringify(response)
  .catch(error => handleErrors(error, msg.from.id));
});

// transaction
//makeRequest('POST', 'transaction.all', {address: '0x949c49c809e83f586b188b46d008a8ceebc23a8c'});

// block


bot.connect();