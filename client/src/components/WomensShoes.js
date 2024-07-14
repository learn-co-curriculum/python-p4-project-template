import React from 'react';
import NavBar from './NavBar';
import './WomensShoes.css';

const products = [
  {description: 'Description 1', price: 'Ksh.1,000', img: 'https://i8.amplience.net/s/scvl/154393_335046_SET/1?fmt=auto'},
  {description: 'Description 2', price: 'Ksh.1,000', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf7BrgQ-HPeNv26zNmfB9v34PaB0g4Y7uuBVnsXx0WVbfPWF7BmgFouDdktSXyy7azEFA&usqp=CAU'},
  {description: 'Description 3', price: 'Ksh.1,000', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRn3S-tgMnt9ItjrwElN35dpTfybIU4oiDWqg&s'},
  {description: 'Description 4', price: 'Ksh.1,000', img: 'https://alicemay.ie/wp-content/uploads/2023/05/lena-2-min.jpg'},
  {description: 'Description 5', price: 'Ksh.1,000', img: 'https://m.media-amazon.com/images/I/61A0SSsnA5L._AC_UY900_.jpg'},
  {description: 'Description 6', price: 'Ksh.1,000', img: 'https://m.media-amazon.com/images/I/61WCQGhSJYL._AC_UY1000_.jpg'},
  {description: 'Description 7', price: 'Ksh.1,000', img: 'https://m.media-amazon.com/images/I/61Eh7TrbSgL._AC_SL1500_.jpg'},
  {description: 'Description 8', price: 'Ksh.1,000', img: 'https://m.media-amazon.com/images/I/611hWif+jBL._AC_UY1000_.jpg'},
  {description: 'Description 9', price: 'Ksh.1,000', img: 'https://www.purebrandsuk.com/images/crocs-jayna-w-black-p3-11851-001-womens-clogs-shoes-p865-1129_image.jpg'},
  {description: 'Description 10', price: 'Ksh.1,000', img: 'https://cdn.shopify.com/s/files/1/0525/4863/2739/products/06808701_38_1024x1024.jpg'},
  {description: 'Description 11', price: 'Ksh.1,000', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3XCQqtv0ftHyZUPP4TYypNu7fTk5LwkZiSA&s'},
  {description: 'Description 12', price: 'Ksh.1,000', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR54YCXU-UkYNJg3wfa_FOm2CdsCK8YIxIURLshMaEbf9qJUQrScyq3wJJU9VegBr7Z-gI&usqp=CAU'},
  {description: 'Description 13', price: 'Ksh.1,000', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTx8VbeU_I8ZZC3P0iDus2GlMSS32hQjW6h6Oacadq2jbW9TUQWW4id2zCuMWigDmEYnw&usqp=CAU'},
  {description: 'Description 14', price: 'Ksh.1,000', img: 'https://i5.walmartimages.com/asr/a755e4b7-d84e-47a7-9515-ae4827397d32.ea73b3e5875f6188d605f6af0786fe07.jpeg'},
  {description: 'Description 15', price: 'Ksh.1,000', img: 'https://m.media-amazon.com/images/I/616kUcpbK8L._AC_UY1000_.jpg'},
  {description: 'Description 16', price: 'Ksh.1,000', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjRpfEiPiXVVaCLN4FvrC1hL0OklvKrmMGfCjRSyle7pZgBHQ_rXzFjCEaKe063cfnHKU&usqp=CAU'},
  {description: 'Description 17', price: 'Ksh.1,000', img: 'https://aldoshoes.co.uk/cdn/shop/t/1/assets/vralg_nudeslider.jpg?v=69125343684895158231676970968'},
  {description: 'Description 18', price: 'Ksh.1,000', img: 'https://www.travelandleisure.com/thmb/9Dzlyqe3ue0Cfdgi0_9R-XgJv6g=/fit-in/1500x1000/filters:no_upscale():max_bytes(150000):strip_icc()/DREAM-PAIRS-Womens-Chunk-Low-Heel-Pump-Sandals-eaaface4df364c6fa29983f644d8e28d.jpg'},
  {description: 'Description 19', price: 'Ksh.1,000', img: 'https://www.stevemadden.ca/cdn/shop/files/STEVEMADDEN_SHOES_AILENE_BLACK-LEATHER.jpg?v=1702327896'},
  {description: 'Description 20', price: 'Ksh.1,000', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTZ0TWwEl3qsEoNrYQzlM2xexhU1PqHi3B0A&s'},
  {description: 'Description 21', price: 'Ksh.1,000', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTndKoQW07g1lHVGS3AGMdYD7QyUYh50mfwb3GRu--ba8RP8dKbHB9cQkl9O6LguZLxiRM&usqp=CAU'}
];

const WomensShoes = () => {
  return (
    <div>
      <NavBar /> 
      <div className="collection-container">
        {products.map((product, index) => (
          <div className="card" key={index}>
            <div className="card-img">
              {product.img ? <img src={product.img} alt={`Product ${index + 1}`} /> : <div>No Image Available</div>}
            </div>
            <div className="card-info">
              <p className="text-title">{`Product ${index + 1}`}</p>
              <p className="text-body">{product.description}</p>
            </div>
            <div className="card-footer">
              <span className="text-title">{product.price}</span>
              <div className="card-button">
                <svg className="svg-icon" viewBox="0 0 20 20">
                  
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WomensShoes;