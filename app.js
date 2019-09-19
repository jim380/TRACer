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
const config = require("./config.json");
//-----------------------------------------------------------------------------------------//
//                                       Buttons                                           //
//-----------------------------------------------------------------------------------------//
// button naming
const BUTTONS = {
  OriginTrail: {
      label: 'OriginTrail',
      command: '/trac'
  },
  hide: {
      label: '⌨ Hide Keyboard',
      command: '/hide'
  },
  home: {
    label: '⌂ Home',
    command: '/home'
  },
  tracNodeInfo: {
    label: 'Info',
    command: '/trac_info'
  },
  tracNodeBalance: {
    label: 'Balance',
    command: '/trac_balance'
  
  },
};
//----------------------------------------------------//
//                       Plug-ins                     //
//----------------------------------------------------//
const bot = new TeleBot({
  token: config.token,
  usePlugins: ['namedButtons','askUser'],
  pluginFolder: '../plugins/',
  pluginConfig: {
      namedButtons: {
        buttons: BUTTONS
      }
  }
});
//----------------------------------------------------//
//                  Keyboard - General                //
//----------------------------------------------------//
// fire up top-level keyboard
bot.on(['/start', '/home', '/backhome'], msg => {
  let replyMarkup = bot.keyboard([
      // ['/mex', '/cosmos'],
      // ['/home','/hide']
      [BUTTONS.OriginTrail.label, BUTTONS.hide.label],
      //['/home','/hide']
  ], {resize: true});

  return bot.sendMessage(msg.chat.id, 'How can I help you?', {replyMarkup});

});

// Hide keyboard
bot.on('/hide', msg => {
  return bot.sendMessage(
      msg.chat.id, 'Keyboard is now hidden. Type /start to re-enable.', {replyMarkup: 'hide'}
  );
});
//----------------------------------------------------//
//                  Keyboard - OriginTrail                 //
//----------------------------------------------------//
bot.on(['/trac'], msg => {
  let replyMarkup = bot.keyboard([
    [BUTTONS.tracNodeInfo.label, BUTTONS.tracNodeBalance.label, BUTTONS.home.label, BUTTONS.hide.label]
  ], {resize: true});

  return bot.sendMessage(msg.chat.id, 'What would you like to query?', {parseMode: 'Markdown', replyMarkup});

});

function makeRequest(name, verb, endpoint, data = {}) {
  postBody = JSON.stringify(data);
  let url = '';
  const headers = {
    'content-type': 'application/json',
    'accept': 'application/json',
  };

  const requestOptions = {
    method: verb,
    //body: JSON.stringify(data),
    headers,
  };

  if (verb !== 'GET') requestOptions.body = postBody;  // GET/HEAD requests can't have body

  if (name == "omg") {
    url = 'http://watcher.ari.omg.network/' + endpoint;
  } else {
    url = config.url + endpoint;
  }
  
  return fetch(url, requestOptions);
}

// error handling
const handleErrors = (e,chatid) => {
  //console.log(e);
  if (e.name == 'TypeError') {
    //console.error(e);
    bot.sendMessage(chatid,`${e}`);  
  } else {
    //console.error(e);
    bot.sendMessage(chatid,`${e}`);
  }
}

// bot commands
// account - balance
bot.on('/balance', async (msg) => {
  return bot.sendMessage(msg.chat.id, `Please provide an address.`, {ask: 'accountAddr'});
});

bot.on('ask.accountAddr', async msg => {
  const addr = msg.text;
  makeRequest('omg','POST', 'account.get_balance', {address: addr})
  .then(res => res.json())
  .then(async response => {
    //console.log(response);
    if (msg.text.length === 42) {
      await bot.sendMessage(msg.from.id,`\`Balance\`: ${response.data[0].amount/1e18} ETH`, {parseMode: 'Markdown'})
    } else (
      await bot.sendMessage(msg.from.id, `invalid address`)
    )
  })
  // or JSON.stringify(response)
  .catch(error => handleErrors(error, msg.from.id));
});

// account - utxo
bot.on('/utxo', async (msg) => {
  return bot.sendMessage(msg.chat.id, `Please provide an address.`, {ask: 'accountUTXO'});
});

bot.on('ask.accountUTXO', async (msg) => {
  const addr = msg.text;
  makeRequest('omg','POST', 'account.get_utxos', {address: addr})
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
  makeRequest('omg','POST', 'account.get_transactions', {address: addr})
  .then(res => res.json())
  .then(async response => {
    console.log(response);
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

// trac - node info
bot.on('/trac_info', async (msg) => {
  //const addr = msg.text;
  makeRequest('trac','GET', 'info', data={})
  .then(res => res.json())
  .then(async response => {
    //console.log(response);
        await bot.sendMessage(msg.from.id,`Network ID: \`${response.network.contact.network_id}\`\n`
        + `Wallet: \`${response.network.contact.wallet}\`\n`
        + `Identity: \`${response.network.identity}\`\n`
        +`ERC-725 Identity: \`${response.erc_725_identity}\`\n`
        , {parseMode: 'Markdown'})
  })
  // or JSON.stringify(response)
  .catch(error => handleErrors(error, msg.from.id));
});

// trac - balance
// trac - node info
bot.on('/trac_balance', async (msg) => {
  //const addr = msg.text;
  makeRequest('trac','GET', 'balance', data={})
  .then(res => res.json())
  .then(async response => {
    //console.log(response);
        await bot.sendMessage(msg.from.id,`Address: \`${response.wallet.address}\`\n`
        + `Minimal Stake: \`${response.profile.minimalStake/1e18}\` TRAC\n`
        + `Reserved: \`${response.profile.reserved/1e18}\` TRAC\n`
        + `Staked: \`${response.profile.staked/1e18}\` TRAC\n`
        +`ETH Balance: \`${response.wallet.ethBalance/1e18}\` ETH\n`
        +`Token Balance: \`${response.wallet.tokenBalance/1e18}\` TRAC\n`
        , {parseMode: 'Markdown'})
  })
  // or JSON.stringify(response)
  .catch(error => handleErrors(error, msg.from.id));
});

bot.connect();