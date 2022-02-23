import React from 'react'
import { Card, ListGroup, ListGroupItem } from "react-bootstrap"

class Wallet extends React.Component {
  render() {
    return (
      <Card bg={'success'} text={'white'} border="success">
        <Card.Header>User Wallet</Card.Header>
        <ListGroup className="list-group-flush">
          <ListGroupItem>Address: {this.props.wallet.address}</ListGroupItem>
          <ListGroupItem>ETH Balance: {this.props.wallet.ethBalance}</ListGroupItem>
          <ListGroupItem>NFT Balance: {this.props.wallet.nft_balance}</ListGroupItem>
          <ListGroupItem>NFT IDs Owned: {this.props.wallet.nfts}</ListGroupItem>
        </ListGroup>
        <Card.Footer>
          <small>Last updated 3 mins ago</small>
        </Card.Footer>
      </Card>
    )
  }
}

export default Wallet;