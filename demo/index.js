const crypto = require('crypto');
const { InMemorySigner } = require('../packages/taquito-signer/dist/lib');
const { Tezos } = require('../packages/taquito/dist/lib/taquito');
const { prefix, b58cencode } = require('../packages/taquito-utils/dist/lib/taquito-utils');
const BigNumber = require('bignumber.js');

const rpcUrl = {
  babylonnet: 'https://rpcalpha.tzbeta.net/',
  mainnet: 'https://mainnet.tezrpc.me'
};

async function getBalance(address, network) {
  Tezos.setProvider({
    rpc: rpcUrl[network]
  });
  try {
    return Tezos.tz.getBalance(address)
  } catch (e) {
    return new BigNumber(0);
  }
}

async function generateNewAccount() {
  const privateKeyHex = crypto.randomBytes(32).toString('hex');
  const privateKey = b58cencode(privateKeyHex, prefix['spsk']);
  Tezos.setProvider({
    signer: new InMemorySigner(privateKey)
  });
  const address = await Tezos.signer.publicKeyHash();
  return { privateKey, address };
}

async function transfer(fromPrivateKey, to, xtzAmount, network) {
  Tezos.setProvider({
    signer: new InMemorySigner(fromPrivateKey),
    rpc: rpcUrl[network]
  });
  const from = await Tezos.signer.publicKeyHash();
  try {
    // 1. get source balance
    const mutezBalance = await Tezos.tz.getBalance(from);
    const xtzBalance = Tezos.format('mutez', 'tz', mutezBalance);

    // 2. basic sanity (currently not including the fee)
    if (xtzBalance.lt(xtzAmount)) {
      return console.error(`Not enough balance. Have: ${xtzBalance} XTZ. Requested to transfer: ${xtzAmount}`);
    }

    // 3. get signature hash
    const forgedBytes = await Tezos.contract.getTransferSignatureHash({
      source: from,
      to,
      amount: xtzAmount
    });
    const {prefixSig, sbytes} = await Tezos.signer.sign(forgedBytes.opbytes, new Uint8Array([3]));

    // 4. inject signature and broadcast
    return Tezos.contract.injectTransferSignatureAndBroadcast(forgedBytes, prefixSig, sbytes);
  } catch (err) {
    console.error('err =', err);
  }
}

async function transferAll(fromPrivateKey, to, network) {
  Tezos.setProvider({
    signer: new InMemorySigner(fromPrivateKey),
    rpc: rpcUrl[network]
  });
  const from = await Tezos.signer.publicKeyHash();
  try {
    // 1. mock transfer in order to calculate fee
    const mockForgedBytes = await Tezos.contract.getTransferSignatureHash({
      source: from,
      to,
      amount: 1,
      mutez: true
    });

    // 2. calculate amount to transfer
    const totalFee = mockForgedBytes.opOb.contents.reduce((acc, currContent) => {
      return acc + parseInt(currContent.fee);
    }, 0) + 1;
    const storageLimit = mockForgedBytes.opOb.contents[mockForgedBytes.opOb.contents.length - 1].storage_limit * 1000;  // given in mtz
    const mutezBalance = await Tezos.rpc.getBalance(from);
    const mutezAmount = mutezBalance.minus(totalFee + storageLimit);

    // 3. get signature hash of actual transfer
    const forgedBytes = await Tezos.contract.getTransferSignatureHash({
      source: from,
      to,
      amount: mutezAmount,
      mutez: true
    });

    const {prefixSig, sbytes} = await Tezos.signer.sign(forgedBytes.opbytes, new Uint8Array([3]));

    // 4. inject signature and broadcast
    return Tezos.contract.injectTransferSignatureAndBroadcast(forgedBytes, prefixSig, sbytes);
  } catch (err) {
    console.error('err =', err);
  }
}

module.exports = { generateNewAccount, getBalance, transfer, transferAll };
