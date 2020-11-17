const crypto = require('crypto');
const { InMemorySigner } = require('../packages/taquito-signer/dist/lib');
const { LocalForger } = require('../packages/taquito-local-forging/dist/lib/taquito-local-forging');
const { TezosToolkit, DEFAULT_GAS_LIMIT, DEFAULT_STORAGE_LIMIT, DEFAULT_FEE } = require('../packages/taquito/dist/lib/taquito');
const { prefix, b58cencode } = require('../packages/taquito-utils/dist/lib/taquito-utils');
const BigNumber = require('bignumber.js');

const MUTEZ_IN_TZ = 1000000;

const rpcUrl = {
  babylonnet: 'https://api.tez.ie/rpc/babylonnet/',
  carthagenet: 'https://api.tez.ie/rpc/carthagenet/',
  delphinet: 'https://api.tez.ie/rpc/delphinet/',
  mainnet: 'https://mainnet.tezrpc.me/'
};

async function getBalance(address, network) {
  const Tezos = new TezosToolkit(rpcUrl[network]);
  try {
    return Tezos.tz.getBalance(address)
  } catch (e) {
    return new BigNumber(0);
  }
}

async function generateNewAccount() {
  const privateKeyHex = crypto.randomBytes(32).toString('hex');
  const privateKey = b58cencode(privateKeyHex, prefix['spsk']);
  const Tezos = new TezosToolkit(rpcUrl['mainnet']);
  Tezos.setProvider({
    signer: new InMemorySigner(privateKey)
  });
  const address = await Tezos.signer.publicKeyHash();
  return { privateKey, address };
}

async function transfer(fromPrivateKey, to, xtzAmount, network) {
  const Tezos = new TezosToolkit(rpcUrl[network]);
  Tezos.setProvider({
    signer: new InMemorySigner(fromPrivateKey),
    forger: new LocalForger(),
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
  const Tezos = new TezosToolkit(rpcUrl[network]);
  Tezos.setProvider({
    signer: new InMemorySigner(fromPrivateKey),
    forger: new LocalForger(),
  });
  const from = await Tezos.signer.publicKeyHash();
  const managerPromise = Tezos.rpc.getManagerKey(from);
  const isDelegatedPromise = isDelegated(from, network);
  const balancePromise = Tezos.tz.getBalance(from);
  const isDestinationAddressActivePromise = isAddressActive(to, network);

  const [manager, _isDelegated, balance, isDestinationAddressActive] = await Promise.all([
    managerPromise,
    isDelegatedPromise,
    balancePromise,
    isDestinationAddressActivePromise
  ]);
  const requireReveal = !manager;

  // A transfer from an unrevealed account will require a an additional fee of 0.00142 tz (reveal operation)
  const revealFee = requireReveal ? DEFAULT_FEE.REVEAL : 0;
  /* A delegated implicit account cannot be emptied:
     https://tezos.stackexchange.com/questions/2118/assert-failure-src-proto-005-psbabym1-lib-protocol-contract-storage-ml55516 */
  const delegateLeftover = _isDelegated ? 1 : 0;
  const storageFee = !isDestinationAddressActive ? 64251 : 0;

  const estimate = await Tezos.estimate.transfer({ to, amount: balance.minus(revealFee + storageFee + delegateLeftover).toNumber(), mutez : true, storageLimit: storageFee ? DEFAULT_STORAGE_LIMIT.TRANSFER : 0 });

  // The max amount that can be sent now is the total balance minus the fees + reveal fees (assuming the dest is already allocated)
  const maxAmount = balance.minus(estimate.suggestedFeeMutez + revealFee + storageFee + delegateLeftover).toNumber();

  // Get signature hash
  const forgedBytes = await Tezos.contract.getTransferSignatureHash({
    source: from,
    to,
    mutez: true,
    amount: maxAmount,
    fee: estimate.suggestedFeeMutez,
    gasLimit: estimate.gasLimit,
    storageLimit: storageFee ? DEFAULT_STORAGE_LIMIT.TRANSFER : 0
  });
  const {prefixSig, sbytes} = await Tezos.signer.sign(forgedBytes.opbytes, new Uint8Array([3]));

  // Inject signature and broadcast
  return Tezos.contract.injectTransferSignatureAndBroadcast(forgedBytes, prefixSig, sbytes);
}

async function delegate(fromPrivateKey, to, network, trackingId) {
  const Tezos = new TezosToolkit(rpcUrl[network]);
  Tezos.setProvider({
    signer: new InMemorySigner(fromPrivateKey),
    forger: new LocalForger(),
  });
  try {
    const source = await Tezos.signer.publicKeyHash();
    const delegateParams = { source, delegate: to };
    if (trackingId) {
      delegateParams.gasLimit = Math.ceil(DEFAULT_GAS_LIMIT.DELEGATION / 1000) * 1000 + parseInt(trackingId);
    }

    const forgedBytes = await Tezos.contract.getDelegateSignatureHash(delegateParams);
    const {prefixSig, sbytes} = await Tezos.signer.sign(forgedBytes.opbytes, new Uint8Array([3]));
    return Tezos.contract.injectDelegateSignatureAndBroadcast(forgedBytes, prefixSig, sbytes);
  } catch (err) {
    console.error('err =', err);
  }
}

async function isDelegated(address, network) {
  let isDelegated = false;
  try {
    const Tezos = new TezosToolkit(rpcUrl[network]);
    const delegate = await Tezos.rpc.getDelegate(address);
    isDelegated = !!delegate;
  } catch (e) {}

  return isDelegated;
}

async function isAddressActive(address, network) {
  try {
    const Tezos = new TezosToolkit(rpcUrl[network]);
    let balanceInMutez = await Tezos.tz.getBalance(address);
    return balanceInMutez.gt(0);
  } catch (e) {
    return false;
  }
}

module.exports = { delegate, generateNewAccount, getBalance, transfer, transferAll, isAddressActive, rpcUrl };
