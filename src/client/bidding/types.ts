export interface BidCommission {
  beneficiary: string;
  amount: string;
}

export interface Bid {
    id: string;
    nft: string;
    buyer: string;
    kiosk: string;
    offer: string;
    commission?: BidCommission;
}

export interface CreateBidInput {
    buyersKiosk: string,
    nft: string,
    price: string,
    wallet: string
}

export interface CreateBidWithCommissionInput {
    buyersKiosk: string,
    nft: string,
    price: string,
    beneficiary: string,
    commission: string,
    wallet: string
}

export interface SellNftFromKiosk {
    bidId: string,
    sellersKiosk: string,
    buyersKiosk: string,
    nftId: string
}

export interface SellNft {
    bidId: string,
    buyersKiosk: string,
    nft: string
}