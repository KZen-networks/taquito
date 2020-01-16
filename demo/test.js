const { getBalance, generateNewAccount, transfer, transferAll } = require('./index');
const assert = require('assert');

const network = 'babylonnet';

const revealedAccount1 = {
  address: 'tz2MC3sfZJjbjXV4nv5KJPhEWgUStr9Yvanw',
  privateKey: 'spsk1dCkP43rh7YDHSxHNNvF8MdojHsw47HzMSfw6qiTtHhZrd9qdw'
};

const revealedAccount2 = {
  address: 'tz2Hfx453GNFUTdDCfipvjcoH7M7pUBr61jJ',
  privateKey: 'spsk3B46kboUhTf2dRpCaUNZGtMoHaR2AxQ8JjfbpCZNyA712uQgDN'
};

const MUTEZ_IN_TZ = 1000000;

function sumFieldValues(op, fieldName) {
  return op.results.reduce((sum, currResult) => {
    return sum + parseInt(currResult[fieldName]);
  }, 0);
}

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
});

