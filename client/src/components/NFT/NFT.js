import React from 'react'
import { Card, ListGroup, ListGroupItem } from "react-bootstrap"

class NFT extends React.Component {
  render() {
    return (
      <Card bg={'primary'} text={'white'} border="primary">
        <Card.Header>NFT Information</Card.Header>
        <ListGroup className="list-group-flush">
          <ListGroupItem>Address: {this.props.nft.address}</ListGroupItem>
          <ListGroupItem>Owner: {this.props.nft.owner}</ListGroupItem>
          <ListGroupItem>Price: {this.props.nft.nftPrice} ETH</ListGroupItem>
          <ListGroupItem>Current Supply: {this.props.nft.supply}</ListGroupItem>
          <ListGroupItem>Max Supply: {this.props.nft.maxSupply}</ListGroupItem>
          <ListGroupItem>Is Sale Active: {this.props.nft.isSaleActive}</ListGroupItem>
        </ListGroup>
      </Card>
    )
  }
}

export default NFT;