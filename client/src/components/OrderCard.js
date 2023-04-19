// import { useState } from 'react'

// const Front = ({order}) => {
//     return (
//         <div>
//             <h1>{order.id}</h1>
//         </div>
//     )
// }
// const Back = ({order}) => {
    
//     return (
//         <div>
//             <h1>{order.details}</h1>
//         </div>
//     )
// }


// const OrderCard = ({order}) => {

//     const [ showFront, setShowFront ] = useState( false )
//     const toggleFront = () => setShowFront( showFront => !showFront )

//     return (
//         <div onClick={ toggleFront } 
//             className="ui three wide column image pigTile">
//             { showFront ? 
//                 <Front id={order.id} /> : 
//                 <Back details={order.details} /> 
//             }
//         </div>
//     )
// }

// export default OrderCard