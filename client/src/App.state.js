import NFTState from './components/NFT/NFT.state'
import WalletState from './components/Wallet/Wallet.state'

const AppState = {
  web3: null,
  hasError: false,
  wallet: WalletState,
  nft: NFTState
}

export default AppState