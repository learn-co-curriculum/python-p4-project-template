import React, {useState, useEffect} from 'react'
import TransactionRequest from './TransactionRequest'
import Payment from './Payment'

export default function Transactions({currentUser}) {

    const [debits, setDebits] = useState([])
    const [credits, setCredits] = useState([])

    const createRequest = (content) =>{
        fetch('/request', {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Accept': 'application/json'
            }, 
            body:JSON.stringify(content)
        })
        .then(()=>{
            fetch('/credits')
            .then(res => {
                if (res.status == 200){
                    res.json()
                    .then(data => setCredits(data))

                }
            })
        })
        
        
        // .then(res => res.json())
        // .then(data => setCredits(credits => [...credits, data]))
    }

// Implement a handle payment.  
// In debit mapping have a button to delete the transaction
// needs a handleDelete or handlePay




    useEffect(() => {
        fetch('/debits')
        .then(res =>{
            if (res.status == 200){
                res.json()
                .then(data =>setDebits(data))
            } 
        })
    }, []);

    useEffect(() =>{
        fetch('/credits')
        .then(res => {
            if (res.status == 200){
                res.json()
                .then(data => setCredits(data))
            } 
        })
    }, []);

    // Implement a handle payment.  
    // In debit mapping have a button to delete the transaction
    // needs a handleDelete or handlePay

    const handlePayment = (e) =>{
        e.preventDefault()
        // console.log(e.target.parentNode.id)
        const transaction_to_delete = e.target.parentNode.id
        fetch('/payment', {
            method:'DELETE',
            headers:{
                'Content-type':'application/json',
                'Accept':'application/json'
            },
            body:JSON.stringify({id:transaction_to_delete})
        })
        .then( res => {
            if(res.status == 204){
                setDebits((debits) => debits.filter((debit) => debit.id !==parseInt(transaction_to_delete)))
            }
            
            })

        // .then(res => res.json())
        // .then(data => setDebits((data) => data.filter((debit) => debit.id !== e.target.parentNode.id)))
    }

  return (
    <>
        <div>Debits:</div>
        { debits.map(debit => <h3 key = {'debit' + debit.id} id = {debit.id}>
                    I owe {debit.requestor_username} ${debit.amount} <button onClick={handlePayment}>$</button>
                    </h3>
                    )}
        <div>Credits:</div>
        { credits.map(credit => <h3 key = {'credit' + credit.id}> {credit.requestee_username} owes me ${credit.amount}</h3>)}

        <TransactionRequest createRequest={createRequest} currentUser = {currentUser}/>
        <Payment />
    </>
  )
}




