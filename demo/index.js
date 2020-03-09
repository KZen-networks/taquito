const crypto = require('crypto');
const { InMemorySigner } = require('../packages/taquito-signer/dist/lib');
const { LocalForger } = require('../packages/taquito-local-forging/dist/lib/taquito-local-forging');
const { Tezos, DEFAULT_GAS_LIMIT } = require('../packages/taquito/dist/lib/taquito');
const { prefix, b58cencode } = require('../packages/taquito-utils/dist/lib/taquito-utils');
const BigNumber = require('bignumber.js');

const rpcUrl = {
  babylonnet: 'https://api.tez.ie/rpc/babylonnet/',
  carthagenet: 'https://api.tez.ie/rpc/carthagenet/',
  mainnet: 'https://mainnet.tezrpc.me/'
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
    forger: new LocalForger(),
    rpc: rpcUrl[network]
  });

  const { forgedBytes } = await getTransferSignatureHashAndFees(fromPrivateKey, to, xtzAmount, network);

  return signTransferAndBroadcast(fromPrivateKey, forgedBytes, network);
}

async function getTransferSignatureHashAndFees(fromPrivateKey, to, xtzAmount, network) {
  Tezos.setProvider({
    signer: new InMemorySigner(fromPrivateKey),
    forger: new LocalForger(),
    rpc: rpcUrl[network]
  });
  const from = await Tezos.signer.publicKeyHash();

  return Tezos.contract.getTransferSignatureHashAndFees({
    source: from,
    to,
    amount: xtzAmount
  });
}

async function signTransferAndBroadcast(fromPrivateKey, forgedBytes, network) {
  Tezos.setProvider({
    signer: new InMemorySigner(fromPrivateKey),
    forger: new LocalForger(),
    rpc: rpcUrl[network]
  });

  const {prefixSig, sbytes} = await Tezos.signer.sign(forgedBytes.opbytes, new Uint8Array([3]));

  return Tezos.contract.injectTransferSignatureAndBroadcast(forgedBytes, prefixSig, sbytes);
}

async function transferAll(fromPrivateKey, to, network) {
  Tezos.setProvider({
    signer: new InMemorySigner(fromPrivateKey),
    forger: new LocalForger(),
    rpc: rpcUrl[network]
  });

  const { forgedBytes } = await getTransferAllSignatureHashAndFees(fromPrivateKey, to, network);

  return signTransferAndBroadcast(fromPrivateKey, forgedBytes, network);
}

async function getTransferAllSignatureHashAndFees(fromPrivateKey, to, network) {
  Tezos.setProvider({
    signer: new InMemorySigner(fromPrivateKey),
    forger: new LocalForger(),
    rpc: rpcUrl[network]
  });
  const from = await Tezos.signer.publicKeyHash();

  // 1. mock transfer in order to calculate fee
  const isDelegatedPromise = isDelegated(from);
  const mockTxPromise = Tezos.contract.getTransferSignatureHashAndFees({
    source: from,
    to,
    amount: 1,
    mutez: true
  });

  const [_isDelegated, mockTx] = await Promise.all([
    isDelegatedPromise,
    mockTxPromise,
  ]);

  // 2. calculate amount to transfer
  let { fees } = mockTx;
  const mutezBalance = await Tezos.rpc.getBalance(from);
  let mutezAmount = mutezBalance.minus(fees);
  /* delegated account needs to leave at least 1 mutez
     https://tezos.stackexchange.com/questions/2118/assert-failure-src-proto-005-psbabym1-lib-protocol-contract-storage-ml55516 */
  mutezAmount = mutezAmount.minus(_isDelegated ? 2 : 1);

  // 3. get signature hash of actual transfer
  return Tezos.contract.getTransferSignatureHashAndFees({
    source: from,
    to,
    amount: mutezAmount,
    mutez: true
  });
}

async function delegate(fromPrivateKey, to, network, trackingId) {
  Tezos.setProvider({
    signer: new InMemorySigner(fromPrivateKey),
    forger: new LocalForger(),
    rpc: rpcUrl[network]
  });

  const { forgedBytes } = await getDelegateSignatureHashAndFees(fromPrivateKey, to, network, trackingId);
  const {prefixSig, sbytes} = await Tezos.signer.sign(forgedBytes.opbytes, new Uint8Array([3]));
  return Tezos.contract.injectDelegateSignatureAndBroadcast(forgedBytes, prefixSig, sbytes);
}

async function getDelegateSignatureHashAndFees(fromPrivateKey, to, network, trackingId) {
  Tezos.setProvider({
    signer: new InMemorySigner(fromPrivateKey),
    forger: new LocalForger(),
    rpc: rpcUrl[network]
  });

  const source = await Tezos.signer.publicKeyHash();
  const delegateParams = { source, delegate: to };
  if (trackingId) {
    delegateParams.gasLimit = Math.ceil(DEFAULT_GAS_LIMIT.DELEGATION / 1000) * 1000 + parseInt(trackingId);
  }

  return Tezos.contract.getDelegateSignatureHashAndFees(delegateParams);
}

async function signDelegateAndBroadcast(fromPrivateKey, forgedBytes, network) {
  Tezos.setProvider({
    signer: new InMemorySigner(fromPrivateKey),
    forger: new LocalForger(),
    rpc: rpcUrl[network]
  });

  const {prefixSig, sbytes} = await Tezos.signer.sign(forgedBytes.opbytes, new Uint8Array([3]));

  return Tezos.contract.injectDelegateSignatureAndBroadcast(forgedBytes, prefixSig, sbytes);
}

async function isDelegated(address) {
  let isDelegated = false;
  try {
    const delegate = await Tezos.rpc.getDelegate(address);
    isDelegated = !!delegate;
  } catch (e) {}

  return isDelegated;
}

module.exports = {
  delegate,
  getDelegateSignatureHashAndFees,
  signDelegateAndBroadcast,
  generateNewAccount,
  getBalance,
  transfer,
  transferAll,
  getTransferSignatureHashAndFees,
  getTransferAllSignatureHashAndFees,
  signTransferAndBroadcast,
};
