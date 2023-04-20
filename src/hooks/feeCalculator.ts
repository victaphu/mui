import { useEffect, useState } from 'react'
import { Nft } from '../types/nft'
import { useSelector } from 'react-redux'
import { getCurrentNetwork } from '../store/web3'

export default function useFeeCalculator() {
  const [nft, setNft] = useState<Nft>(null)
  const [treasuryFee, setTreasuryFee] = useState<string>(null)
  const [resaleTreasuryFee, setResaleTreasuryFee] = useState<string>(null)
  const [ambassadorFee, setAmbassadorFee] = useState<string>(null)
  const [ambassadorFeeAlt, setAmbassadorFeeAlt] = useState<string>(null)
  const [projectFee, setProjectFee] = useState<string>(null)
  const [projectFeeAlt, setProjectFeeAlt] = useState<string>(null)
  const [creatorRoyalty, setCreatorRoyalty] = useState<string>(null)
  const [total, setTotal] = useState<string>(null)
  const [totalAlt, setTotalAlt] = useState<string>(null)
  const [resaleTotal, setResaleTotal] = useState<string>(null)
  const [creatorResaleTotal, setCreatorResaleTotal] = useState<string>(null)
  const network = useSelector(getCurrentNetwork)

  useEffect(() => {
    const getTreasuryFee = (): number => {
      const totalCalc = nft?.price ? parseFloat(nft?.price.toString()) : 0
      return parseFloat(((totalCalc * 10) / 100).toFixed(10))
    }
    const getResaleTreasuryFee = (): number => {
      const totalCalc = nft?.price ? parseFloat(nft?.price.toString()) : 0
      return parseFloat(((totalCalc * network.platformResaleFee) / 100).toFixed(10))
    }
    const getAmbassadorFee = (totalCalc = null) => {
      const totalCalcNew = totalCalc || (nft?.price ? parseFloat(nft?.price.toString()) : 0)
      return parseFloat(
        (nft?.creator?.ambassador_percent
          ? (totalCalcNew * nft?.creator?.ambassador_percent) / 100
          : 0
        ).toFixed(10)
      )
    }
    const getProjectFee = (totalCalc): number => {
      return parseFloat(
        (nft?.collection?.project_percent
          ? (totalCalc * nft?.collection?.project_percent) / 100
          : 0
        ).toFixed(10)
      )
    }
    const getCreatorRoyalty = (): number => {
      const totalCalc = nft?.price ? parseFloat(nft?.price.toString()) : 0
      return parseFloat(
        (
          (totalCalc *
            (nft?.collection.royalties
              ? parseFloat((nft?.collection.royalties / 100).toString())
              : 0)) /
          100
        ).toFixed(10)
      )
    }
    const getTotal = (excludeProjectFee = false): number => {
      const price = nft?.price ? parseFloat(nft?.price.toString()) : 0
      const ambassadorFeeCalc = getAmbassadorFee()
      const treasuryFeeCalc = getTreasuryFee()
      let totalCalc: number = parseFloat(
        String(
          price - (parseFloat(String(ambassadorFeeCalc)) + parseFloat(String(treasuryFeeCalc)))
        )
      )
      if (!excludeProjectFee) {
        const supportingFee = getProjectFee(getTotal(true))
        totalCalc = totalCalc - parseFloat(String(supportingFee))
      }
      return parseFloat(totalCalc.toFixed(10))
    }
    const getResaleTotal = (): number => {
      const creatorRoyaltyCalc = getCreatorRoyalty()
      const saleFee = getResaleTreasuryFee()
      const totalCalc = (nft?.price || 0) - saleFee - creatorRoyaltyCalc
      return parseFloat(totalCalc.toFixed(10))
    }
    const getCreatorResaleTotal = (): number => {
      return parseFloat(
        (
          getCreatorRoyalty() -
          getAmbassadorFee(getCreatorRoyalty()) -
          getProjectFee(getCreatorRoyalty())
        ).toFixed(10)
      )
    }
    if (nft && nft.price) {
      const setTreasuryFeeVar = getTreasuryFee()
      const setResaleTreasuryFeeVar = getResaleTreasuryFee()
      const setAmbassadorFeeVar = getAmbassadorFee()
      const setAmbassadorFeeAltVar = getAmbassadorFee(getCreatorRoyalty())
      const setProjectFeeVar = getProjectFee(getTotal())
      const setProjectFeeAltVar = getProjectFee(getTotal(true))
      const setCreatorRoyaltyVar = getCreatorRoyalty()
      const setTotalVar = getTotal()
      const setTotalAltVar = getTotal(true)
      const setResaleTotalVar = getResaleTotal()
      const setCreatorResaleTotalVar = getCreatorResaleTotal()
      setTreasuryFee(setTreasuryFeeVar.toString())
      setResaleTreasuryFee(setResaleTreasuryFeeVar.toString())
      setAmbassadorFee(setAmbassadorFeeVar.toString())
      setAmbassadorFeeAlt(setAmbassadorFeeAltVar.toString())
      setProjectFee(setProjectFeeVar.toString())
      setProjectFeeAlt(setProjectFeeAltVar.toString())
      setCreatorRoyalty(setCreatorRoyaltyVar.toString())
      setTotal(setTotalVar.toString())
      setTotalAlt(setTotalAltVar.toString())
      setResaleTotal(setResaleTotalVar.toString())
      setCreatorResaleTotal(setCreatorResaleTotalVar.toString())
    }
  }, [network.platformResaleFee, nft])

  return {
    nftObject: nft,
    setNft,
    treasuryFee,
    resaleTreasuryFee,
    ambassadorFee,
    ambassadorFeeAlt,
    projectFee,
    projectFeeAlt,
    creatorRoyalty,
    total,
    totalAlt,
    resaleTotal,
    creatorResaleTotal
  }
}
