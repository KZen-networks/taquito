const {
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
} = require('./index');
const assert = require('assert');
const { NotEnoughFundsError } = require("../packages/taquito");

const network = 'carthagenet';

const revealedAccount1 = {
  address: 'tz2MC3sfZJjbjXV4nv5KJPhEWgUStr9Yvanw',
  privateKey: 'spsk1dCkP43rh7YDHSxHNNvF8MdojHsw47HzMSfw6qiTtHhZrd9qdw'
};

const revealedAccount2 = {
  address: 'tz2Hfx453GNFUTdDCfipvjcoH7M7pUBr61jJ',
  privateKey: 'spsk3B46kboUhTf2dRpCaUNZGtMoHaR2AxQ8JjfbpCZNyA712uQgDN'
};

const delegateAddress = 'tz1VxS7ff4YnZRs8b4mMP4WaMVpoQjuo1rjf';  // Carthagenet

const MUTEZ_IN_TZ = 1000000;

describe('Tezos API tests', () => {
  it('transfer from revealed account to old implicit account', async () => {
    const balanceBefore = await getBalance(revealedAccount2.address, network);
    const op = await transfer(revealedAccount1.privateKey, revealedAccount2.address, 0.1, network);
    assert.strictEqual(op.results.length, 1);  // no reveal
    assert.strictEqual(op.results[0].kind, 'transaction');
    assert.strictEqual(op.results[0].storage_limit, '0');

    await op.confirmation();

    const balanceAfter = await getBalance(revealedAccount2.address, network);
    assert.strictEqual(balanceAfter.toString(), balanceBefore.plus(0.1 * MUTEZ_IN_TZ).toString());
  }).timeout(100000);

  it('transfer from revealed account to new implicit account', async () => {
    const newImplicitAccount = await generateNewAccount();

    const op = await transfer(revealedAccount1.privateKey, newImplicitAccount.address, 0.1, network);
    assert.strictEqual(op.results.length, 1);  // no reveal
    assert.strictEqual(op.results[0].kind, 'transaction');
    assert.strictEqual(op.results[0].storage_limit, '257');

    await op.confirmation();

    const balanceAfter = await getBalance(newImplicitAccount.address, network);
    assert.strictEqual(balanceAfter.toString(), (0.1 * MUTEZ_IN_TZ).toString());
  }).timeout(100000);

  it('transfer from unrevealed account to old implicit account', async () => {
    // 1. send to an unrevealed account
    const newImplicitAccount = await generateNewAccount();

    let op = await transfer(revealedAccount1.privateKey, newImplicitAccount.address, 0.1, network);
    assert.strictEqual(op.results.length, 1);  // no reveal
    assert.strictEqual(op.results[0].kind, 'transaction');
    assert.strictEqual(op.results[0].storage_limit, '257');

    await op.confirmation();

    const balanceAfter = await getBalance(newImplicitAccount.address, network);
    assert.strictEqual(balanceAfter.toString(), (0.1 * MUTEZ_IN_TZ).toString());

    // 2. send from the unrevealed account to an old implicit account
    const revealedBalanceBefore = await getBalance(revealedAccount2.address, network);
    op = await transfer(newImplicitAccount.privateKey, revealedAccount2.address, 0.01, network);
    assert.strictEqual(op.results.length, 2);  // with reveal
    assert.strictEqual(op.results[0].kind, 'reveal');
    assert.strictEqual(op.results[0].storage_limit, '0');
    assert.strictEqual(op.results[1].kind, 'transaction');
    assert.strictEqual(op.results[1].storage_limit, '0');

    await op.confirmation();

    const revealedBalanceAfter = await getBalance(revealedAccount2.address, network);
    assert.strictEqual(revealedBalanceAfter.toString(), revealedBalanceBefore.plus(0.01 * MUTEZ_IN_TZ).toString());
  }).timeout(200000);

  it('transfer from unrevealed account to new implicit account', async () => {
    // 1. send to an unrevealed account
    const newImplicitAccount = await generateNewAccount();

    let op = await transfer(revealedAccount1.privateKey, newImplicitAccount.address, 0.5, network);
    assert.strictEqual(op.results.length, 1);  // no reveal
    assert.strictEqual(op.results[0].kind, 'transaction');
    assert.strictEqual(op.results[0].storage_limit, '257');

    await op.confirmation();

    const balanceAfter = await getBalance(newImplicitAccount.address, network);
    assert.strictEqual(balanceAfter.toString(), (0.5 * MUTEZ_IN_TZ).toString());

    // 2. create a second new implicit account
    const newImplicitAccount2 = await generateNewAccount();

    // 3. send from the unrevealed account to the second new implicit account
    const newImplicitAccount2BalanceBefore = await getBalance(newImplicitAccount2.address, network);
    op = await transfer(newImplicitAccount.privateKey, newImplicitAccount2.address, 0.01, network);
    assert.strictEqual(op.results.length, 2);  // with reveal
    assert.strictEqual(op.results[0].kind, 'reveal');
    assert.strictEqual(op.results[0].storage_limit, '0');
    assert.strictEqual(op.results[1].kind, 'transaction');
    assert.strictEqual(op.results[1].storage_limit, '257');

    await op.confirmation();

    const newImplicitAccount2BalanceAfter = await getBalance(newImplicitAccount2.address, network);
    assert.strictEqual(newImplicitAccount2BalanceAfter.toString(), newImplicitAccount2BalanceBefore.plus(0.01 * MUTEZ_IN_TZ).toString());
  }).timeout(200000);

  it('transfer all from unrevealed account to old implicit account', async () => {
    // 1. send to an unrevealed account
    const newImplicitAccount = await generateNewAccount();

    let op = await transfer(revealedAccount1.privateKey, newImplicitAccount.address, 1, network);
    assert.strictEqual(op.results.length, 1);  // no reveal
    assert.strictEqual(op.results[0].kind, 'transaction');
    assert.strictEqual(op.results[0].storage_limit, '257');

    await op.confirmation();

    const balanceAfter = await getBalance(newImplicitAccount.address, network);
    assert.strictEqual(balanceAfter.toString(), MUTEZ_IN_TZ.toString());

    // 2. send from the unrevealed account to an old implicit account
    op = await transferAll(newImplicitAccount.privateKey, revealedAccount1.address, network);
    assert.strictEqual(op.results.length, 2);  // with reveal
    assert.strictEqual(op.results[0].kind, 'reveal');
    assert.strictEqual(op.results[0].storage_limit, '0');
    assert.strictEqual(op.results[1].kind, 'transaction');
    assert.strictEqual(op.results[1].storage_limit, '0');

    await op.confirmation();

    const balanceAfterTransferAll = await getBalance(newImplicitAccount.address, network);
    assert.strictEqual(balanceAfterTransferAll.toString(), '0');
  }).timeout(200000);

  it('transfer all from unrevealed account to new implicit account', async () => {
    // 1. send to an unrevealed account
    const newImplicitAccount = await generateNewAccount();

    let op = await transfer(revealedAccount1.privateKey, newImplicitAccount.address, 1, network);
    assert.strictEqual(op.results.length, 1);  // no reveal
    assert.strictEqual(op.results[0].kind, 'transaction');
    assert.strictEqual(op.results[0].storage_limit, '257');

    await op.confirmation();

    const balanceAfter = await getBalance(newImplicitAccount.address, network);
    assert.strictEqual(balanceAfter.toString(), MUTEZ_IN_TZ.toString());

    // 2. create a second new implicit account
    const newImplicitAccount2 = await generateNewAccount();

    // 3. transfer all from the unrevealed account to the second new implicit account
    op = await transferAll(newImplicitAccount.privateKey, newImplicitAccount2.address, network);
    assert.strictEqual(op.results.length, 2);  // with reveal
    assert.strictEqual(op.results[0].kind, 'reveal');
    assert.strictEqual(op.results[0].storage_limit, '0');
    assert.strictEqual(op.results[1].kind, 'transaction');
    assert.strictEqual(op.results[1].storage_limit, '257');

    await op.confirmation();

    const balanceAfterTransferAll = await getBalance(newImplicitAccount.address, network);
    assert.strictEqual(balanceAfterTransferAll.toString(), '0');
  }).timeout(200000);

  it('transfer all from revealed account to old implicit account', async () => {
    // 1. send to an unrevealed account
    const newImplicitAccount = await generateNewAccount();

    let op = await transfer(revealedAccount1.privateKey, newImplicitAccount.address, 1, network);
    assert.strictEqual(op.results.length, 1);  // no reveal
    assert.strictEqual(op.results[0].kind, 'transaction');
    assert.strictEqual(op.results[0].storage_limit, '257');

    await op.confirmation();

    const balanceAfter = await getBalance(newImplicitAccount.address, network);
    assert.strictEqual(balanceAfter.toString(), MUTEZ_IN_TZ.toString());

    // 2. transfer from the unrevealed (in order to reveal)
    op = await transfer(newImplicitAccount.privateKey, revealedAccount1.address, 0.01, network);
    assert.strictEqual(op.results.length, 2);  // with reveal
    assert.strictEqual(op.results[0].kind, 'reveal');
    assert.strictEqual(op.results[0].storage_limit, '0');
    assert.strictEqual(op.results[1].kind, 'transaction');
    assert.strictEqual(op.results[1].storage_limit, '0');

    await op.confirmation();

    // 3. transfer all from the now revealed account to an old implicit account
    op = await transferAll(newImplicitAccount.privateKey, revealedAccount1.address, network);
    assert.strictEqual(op.results.length, 1);  // no reveal
    assert.strictEqual(op.results[0].kind, 'transaction');
    assert.strictEqual(op.results[0].storage_limit, '0');

    await op.confirmation();

    const balanceAfterTransferAll = await getBalance(newImplicitAccount.address, network);
    assert.strictEqual(balanceAfterTransferAll.toString(), '0');
  }).timeout(200000);

  it('transfer all from revealed account to new implicit account', async () => {
    // 1. send to an unrevealed account
    const newImplicitAccount = await generateNewAccount();

    let op = await transfer(revealedAccount1.privateKey, newImplicitAccount.address, 1, network);
    assert.strictEqual(op.results.length, 1);  // no reveal
    assert.strictEqual(op.results[0].kind, 'transaction');
    assert.strictEqual(op.results[0].storage_limit, '257');

    await op.confirmation();

    const balanceAfter = await getBalance(newImplicitAccount.address, network);
    assert.strictEqual(balanceAfter.toString(), MUTEZ_IN_TZ.toString());

    // 2. transfer from the unrevealed (in order to reveal)
    op = await transfer(newImplicitAccount.privateKey, revealedAccount1.address, 0.01, network);
    assert.strictEqual(op.results.length, 2);  // with reveal
    assert.strictEqual(op.results[0].kind, 'reveal');
    assert.strictEqual(op.results[0].storage_limit, '0');
    assert.strictEqual(op.results[1].kind, 'transaction');
    assert.strictEqual(op.results[1].storage_limit, '0');

    await op.confirmation();

    // 3. create a second new implicit account
    const newImplicitAccount2 = await generateNewAccount();

    // 4. transfer all from the now revealed account to a new implicit account
    op = await transferAll(newImplicitAccount.privateKey, newImplicitAccount2.address, network);
    assert.strictEqual(op.results.length, 1);  // no reveal
    assert.strictEqual(op.results[0].kind, 'transaction');
    assert.strictEqual(op.results[0].storage_limit, '257');

    await op.confirmation();

    const balanceAfterTransferAll = await getBalance(newImplicitAccount.address, network);
    assert.strictEqual(balanceAfterTransferAll.toString(), '0');
  }).timeout(200000);

  it('delegate with a small balance', async () => {
    // 1. send to an unrevealed account
    const newImplicitAccount = await generateNewAccount();

    let op = await transfer(revealedAccount1.privateKey, newImplicitAccount.address, 0.003, network);
    assert.strictEqual(op.results.length, 1);  // no reveal
    assert.strictEqual(op.results[0].kind, 'transaction');
    assert.strictEqual(op.results[0].storage_limit, '257');

    await op.confirmation();

    const balanceAfter = await getBalance(newImplicitAccount.address, network);
    assert.strictEqual(balanceAfter.toString(), (0.003 * MUTEZ_IN_TZ).toString());

    // 2. delegate from the unrevealed account
    const trackingId = 135;
    op = await delegate(newImplicitAccount.privateKey, delegateAddress, network, 135);
    assert.strictEqual(op.results.length, 2);  // with reveal
    assert.strictEqual(op.results[0].kind, 'reveal');
    assert.strictEqual(op.results[0].storage_limit, '0');
    assert.strictEqual(op.results[1].kind, 'delegation');
    assert.strictEqual(op.results[1].storage_limit, '0');
    assert.strictEqual(op.results[1].gas_limit.toString().substr(op.results[1].gas_limit.length - 3, 3), trackingId.toString());

    await op.confirmation();
  }).timeout(200000);

  it('transfer from a delegated address', async () => {
    const sourceBalanceBefore = await getBalance(revealedAccount1.address, network);

    // 1. send to an unrevealed account
    const newImplicitAccount = await generateNewAccount();
    const { forgedBytes, fees } = await getTransferSignatureHashAndFees(revealedAccount1.privateKey, newImplicitAccount.address, 0.1, network);
    let op = await signTransferAndBroadcast(revealedAccount1.privateKey, forgedBytes, network);
    await op.confirmation();

    const sourceBalanceAfter = await getBalance(revealedAccount1.address, network);
    assert.strictEqual(sourceBalanceAfter.toString(), sourceBalanceBefore.minus(0.1 * MUTEZ_IN_TZ + fees).toString());
    const destinationBalanceAfter = await getBalance(newImplicitAccount.address, network);
    assert.strictEqual(destinationBalanceAfter.toString(), (0.1 * MUTEZ_IN_TZ).toString());

    // 2. delegate from the unrevealed account
    const { forgedBytes: delegateForgedBytes, fees: delegateFees } = await getDelegateSignatureHashAndFees(newImplicitAccount.privateKey, delegateAddress, network, 135);
    op = await signDelegateAndBroadcast(newImplicitAccount.privateKey, delegateForgedBytes, network);
    await op.confirmation();

    let delegatedBalanceAfterDelegation = await getBalance(newImplicitAccount.address, network);
    assert.strictEqual(delegatedBalanceAfterDelegation.toString(), destinationBalanceAfter.minus(delegateFees).toString());

    // 3. transfer from the delegated address
    const revealedBalanceBefore = await getBalance(revealedAccount2.address, network);
    const { forgedBytes: transferForgedBytes, fees: transferFees } = await getTransferSignatureHashAndFees(newImplicitAccount.privateKey, revealedAccount2.address, 0.01, network);
    op = await signTransferAndBroadcast(newImplicitAccount.privateKey, transferForgedBytes, network);
    await op.confirmation();

    let delegatedBalanceAfterTransfer = await getBalance(newImplicitAccount.address, network);
    assert.strictEqual(delegatedBalanceAfterTransfer.toString(), delegatedBalanceAfterDelegation.minus(0.01 * MUTEZ_IN_TZ + transferFees).toString());
    const revealedBalanceAfter = await getBalance(revealedAccount2.address, network);
    assert.strictEqual(revealedBalanceAfter.toString(), revealedBalanceBefore.plus(0.01 * MUTEZ_IN_TZ).toString());
  }).timeout(200000);

  it('transfer all from a delegated address', async () => {
    const sourceBalanceBefore = await getBalance(revealedAccount1.address, network);

    // 1. send to an unrevealed account
    const newImplicitAccount = await generateNewAccount();
    const { forgedBytes, fees } = await getTransferSignatureHashAndFees(revealedAccount1.privateKey, newImplicitAccount.address, 0.1, network);
    let op = await signTransferAndBroadcast(revealedAccount1.privateKey, forgedBytes, network);
    await op.confirmation();

    const sourceBalanceAfter = await getBalance(revealedAccount1.address, network);
    assert.strictEqual(sourceBalanceAfter.toString(), sourceBalanceBefore.minus(0.1 * MUTEZ_IN_TZ + fees).toString());
    const destinationBalanceAfter = await getBalance(newImplicitAccount.address, network);
    assert.strictEqual(destinationBalanceAfter.toString(), (0.1 * MUTEZ_IN_TZ).toString());

    // 2. delegate from the unrevealed account
    const { forgedBytes: delegateForgedBytes, fees: delegateFees } = await getDelegateSignatureHashAndFees(newImplicitAccount.privateKey, delegateAddress, network, 135);
    op = await signDelegateAndBroadcast(newImplicitAccount.privateKey, delegateForgedBytes, network);
    await op.confirmation();

    let delegatedBalanceAfterDelegation = await getBalance(newImplicitAccount.address, network);
    assert.strictEqual(delegatedBalanceAfterDelegation.toString(), destinationBalanceAfter.minus(delegateFees).toString());

    // 3. transfer all from the delegated address
    const revealedBalanceBefore = await getBalance(revealedAccount2.address, network);
    const { forgedBytes: transferAllForgedBytes, fees: transferAllFees } = await getTransferAllSignatureHashAndFees(newImplicitAccount.privateKey, revealedAccount2.address, 0.01, network);
    op = await signTransferAndBroadcast(newImplicitAccount.privateKey, transferAllForgedBytes, network);
    await op.confirmation();

    let delegatedBalanceAfterTransferAll = await getBalance(newImplicitAccount.address, network);
    assert.strictEqual(delegatedBalanceAfterTransferAll.toString(), '1');  // 1 Mutez must be left on delegated account https://tezos.stackexchange.com/questions/2118/assert-failure-src-proto-005-psbabym1-lib-protocol-contract-storage-ml55516
    const revealedBalanceAfter = await getBalance(revealedAccount2.address, network);
    assert.strictEqual(revealedBalanceAfter.toString(), revealedBalanceBefore.plus(delegatedBalanceAfterDelegation.minus(1 + transferAllFees)).toString());
  }).timeout(200000);

  it('receive, send, and delegate', async () => {
    // 1. send to an unrevealed account
    const newImplicitAccount = await generateNewAccount();

    let op = await transfer(revealedAccount1.privateKey, newImplicitAccount.address, 0.351864, network);

    await op.confirmation();

    const balanceAfter = await getBalance(newImplicitAccount.address, network);
    assert.strictEqual(balanceAfter.toString(), (0.351864 * MUTEZ_IN_TZ).toString());

    // 2. send from the new account
    op = await transfer(newImplicitAccount.privateKey, revealedAccount1.address, 0.003514, network);
    assert.strictEqual(op.results.length, 2);  // with reveal
    assert.strictEqual(op.results[0].kind, 'reveal');
    assert.strictEqual(op.results[0].storage_limit, '0');
    assert.strictEqual(op.results[1].kind, 'transaction');
    assert.strictEqual(op.results[1].storage_limit, '0');

    await op.confirmation();

    // 3. delegate from the new account
    op = await delegate(newImplicitAccount.privateKey, delegateAddress, network);
    assert.strictEqual(op.results.length, 1);  // no reveal
    assert.strictEqual(op.results[0].kind, 'delegation');
    assert.strictEqual(op.results[0].storage_limit, '0');

    await op.confirmation();
  }).timeout(200000);

  it('fail when sending amount between balance and (balance+fees)', async () => {
    // 1. get balance
    const sourceBalance = await getBalance(revealedAccount1.address, network);

    // 2. get the expected fees
    const { fees } = await getTransferSignatureHashAndFees(revealedAccount1.privateKey, revealedAccount2.address, 1, network);

    // 3. send amount between balance and balance+fees
    try {
      const xtzAmount = sourceBalance.minus(fees / 2).dividedBy(MUTEZ_IN_TZ).toNumber();
      await transfer(revealedAccount1.privateKey, revealedAccount2.address, xtzAmount, network);
    } catch (err) {
      assert.strictEqual(err.name, 'Not enough funds error');
      assert.strictEqual(err.address, revealedAccount1.address);
      assert.ok(err.required, revealedAccount1.required);
      assert.ok(err.balance, revealedAccount1.balance);
      return;
    }

    assert.fail();
  }).timeout(200000);
});

