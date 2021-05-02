const CatCoin = artifacts.require('CatCoin')
const DaiToken = artifacts.require('DaiToken')
const TokenFarm = artifacts.require('TokenFarm')

module.exports = async function(deployer, network, accounts) {
	await deployer.deploy(DaiToken)
	const daiToken = await DaiToken.deployed()

	await deployer.deploy(CatCoin)
	const catCoin = await CatCoin.deployed()

    await deployer.deploy(TokenFarm, catCoin.address, daiToken.address)
	const tokenFarm = await TokenFarm.deployed()

	//Transfer all to TokenFarm (1 million)
	await catCoin.transfer(tokenFarm.address, '1000000000000000000000000')

	//Transfer 100 DAI to investor
	await daiToken.transfer(accounts[1], '100000000000000000000')
}
