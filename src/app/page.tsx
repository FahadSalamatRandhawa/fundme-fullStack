'use client'
import { useEffect, useState } from 'react'
import detectEthereumProvider from '@metamask/detect-provider';
//import { MetaMaskSDK } from '@metamask/sdk';

export default function Home() {
    const [hasProvider, setHasProvider] = useState<boolean | null>(null)
    const [address,setAddress]=useState<null|string>()
  
  useEffect(()=>{
    function handleWalletChange(address:any) {
      if(address){
        setAddress(address);
      }else{
        setAddress(null)
      }
    }
    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true })
      console.log(provider)
      setHasProvider(Boolean(provider)) // transform provider to true or false
    }

    getProvider()
    return ()=>{
      window.ethereum.removeListener('accountsChanged',handleWalletChange);
    }
  },[])

  async function connectWallet() {
    const account=(await window.ethereum.request({method:"eth_requestAccounts"}))[0]
    setAddress(account);
  }
  
  return (
    <div>
      <div>Injected Provider {hasProvider ? 'DOES' : 'DOES NOT'} Exist</div>
      { hasProvider &&
        <button className='text-ellipsis' id='connectButton' disabled={!hasProvider} onClick={connectWallet}>{address?address:hasProvider?"Connect MetaMask":"Add metamask"}</button>
      }
    </div>
  )
}
