'use client'
import { useEffect, useState } from 'react'
import detectEthereumProvider from '@metamask/detect-provider';
//import { MetaMaskSDK } from '@metamask/sdk';

export default function Home() {
    const [hasProvider, setHasProvider] = useState<boolean | null>(null)
    const [address,setAddress]=useState<null|string>()
  
  useEffect(()=>{
    function handleWalletChange(account:any) {
      console.log(account)
      if(account.length>0){
        setAddress(account[0]);
        console.log('new account : ',account)
      }else{
        setAddress(null)
      }
    }
    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true })
      console.log(provider)
      setHasProvider(Boolean(provider)) // transform provider to true or false

      if(provider){
        const account:string[] = await window.ethereum.request(         /* New */
          { method: 'eth_accounts' }                            /* New */
        )
        handleWalletChange(account)
        window.ethereum.on('accountsChanged', handleWalletChange)
      }
    }

    getProvider()
    return ()=>{
      window.ethereum.removeListener('accountsChanged',handleWalletChange);
    }
  },[])

  async function connectWallet() {
    const myaccount=(await window.ethereum.request({method:"eth_requestAccounts"}))[0]
    setAddress(myaccount);
  }
  
  return (
    <div>
      <div>Injected Provider {hasProvider ? 'DOES' : 'DOES NOT'} Exist</div>
      
        <button className='text-ellipsis' id='connectButton' disabled={!hasProvider} onClick={connectWallet}>{address?address:hasProvider?"Connect MetaMask":"Add metamask"}</button>
      
    </div>
  )
}
