import React, { Component } from 'react'

class Main extends Component {

  render() {
    return (
      <div id="content" className="mt-3">
        <table className="table table-borderless text-muted text center">
          <thead>
            <tr>
              <th scope="col">Staking Balance</th>
              <th scope="col">Reward Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{window.web3.utils.fromWei(this.props.stakingBalance, 'Ether')} Dai</td>
              <td>{window.web3.utils.fromWei(this.props.catCoinBalance, 'Ether')} CAT</td>
            </tr>
          </tbody>  
        </table>
      </div>
    );
  }
}

export default Main;
