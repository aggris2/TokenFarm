const CatCoin = artifacts.require('CatCoin')
const DaiToken = artifacts.require('DaiToken')
const TokenFarm = artifacts.require('TokenFarm')

require('chai')
.use(require('chai-as-promised'))
.should()

function tokens(n) {
	return web3.utils.toWei(n, 'ether');
}

contract('TokenFarm', ([owner, investor]) => {
	let daiToken, catCoin, tokenFarm

	before(async () => {
		//Load contracts
		daiToken = await DaiToken.new()
		catCoin = await CatCoin.new()
		tokenFarm = await TokenFarm.new(catCoin.address, daiToken.address)

		//Transfer all tokens to TokenFarm
		await catCoin.transfer(tokenFarm.address, tokens('1000000'))

        //Send tokens to investor
		await daiToken.transfer(investor, tokens('100'), { from: owner })
	})


	describe('Dai deployment', async () => {
		it('has a name', async () =>{	
			const name = await daiToken.name()
			assert.equal(name, 'Dai Token')
		})
	})

	describe('CatCoin deployment', async () => {
		it('has a name', async () =>{	
			const name = await catCoin.name()
			assert.equal(name, 'Cat Coin')
		})
	})

	describe('TokenFarm deployment', async () => {
		it('has a name', async () =>{	
			const name = await tokenFarm.name()
			assert.equal(name, 'Cat Coin Farm')
		})
		it('contract has tokens', async () => {
			let balance = await catCoin.balanceOf(tokenFarm.address)
			assert.equal(balance.toString(), tokens('1000000'))
		})		
	})

	describe('Farming tokens', async () => {
		it('revards investors for staking Dai tokens', async () => {
			let result

			result = await daiToken.balanceOf(investor)
			assert.equal(result.toString(), tokens('100'), 'investor Dai wallet balance correct before staking')

			await daiToken.approve(tokenFarm.address, tokens('100'), { from: investor })
			await tokenFarm.stakeTokens(tokens('100'), { from: investor })

			result = await daiToken.balanceOf(investor)
			assert.equal(result.toString(), tokens('0'), 'investor Dai wallet balance correct after staking')

			result = await daiToken.balanceOf(tokenFarm.address)
			assert.equal(result.toString(), tokens('100'), 'Token Farm Dai balance correct after staking')

			result = await tokenFarm.stakingBalance(investor)
			assert.equal(result.toString(), tokens('100'), 'investor staking balance correct after staking')

			result = await tokenFarm.isStaking(investor)
			assert.equal(result.toString(), 'true', 'investor staking status correct after staking')

			await tokenFarm.issueTokens({ from: owner })

			result = await catCoin.balanceOf(investor)
			assert.equal(result.toString(), tokens('100'), 'investor CatCoin wallet balance correct after issuance')

			await tokenFarm.issueTokens({ from: investor }).should.be.rejected;

			await tokenFarm.unstakeTokens({ from: investor})

			result = await daiToken.balanceOf(investor)
			assert.equal(result.toString(), tokens('100'), 'investor Dai wallet balance correct after staking')

			result = await daiToken.balanceOf(tokenFarm.address)
			assert.equal(result.toString(), tokens('0'), 'Token Farm Dai balance correct after staking')

			result = await tokenFarm.stakingBalance(investor)
			assert.equal(result.toString(), tokens('0'), 'investor staking balance correct after staking')

			result = await tokenFarm.isStaking(investor)
			assert.equal(result.toString(), 'false', 'investor staking status correct')

		})
	})



})