import React from 'react';
import NavBar from './NavBar';
import './MensShoes.css';

const items = [
  { description: 'brown buckle leather shoes', price: 'Ksh.1,000', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3L0Dy_c_z_07M2MF9QnRu-Rutt2nGnY2acA&s' },
  { description: 'brown boots', price: 'Ksh.1,000', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCv1GB3m4X1k3mXcDB6Ya-gbP6vKKBRktFdQ&s' },
  { description: 'black leather shoes', price: 'Ksh.1,000', img: 'https://m.media-amazon.com/images/I/51WpZbC4dsL._AC_SL1200_.jpg' },
  { description: 'brown PU leather shoes', price: 'Ksh.1,000', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjw3Jg5L8MkaQG03udOWM_QbMc2N8SBJwlYQ&s' },
  { description: 'Air Jordans', price: 'Ksh.1,000', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvwW-j7QbIfIuvY4N_lMHpAtQ33cLWH1MeZw&s' },
  { description: 'Gold shoes', price: 'Ksh.1,000', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzvawzLu_2xiFa0hXOlNC5RsCuah6XpYsvAw&s' },
  { description: 'Whit slip ons', price: 'Ksh.1,000', img:    'https://m.media-amazon.com/images/I/61-XASRWbUL._AC_UY900_.jpg' },
  { description: 'brown heavy duty shoes', price: 'Ksh.1,000', img: 'https://www.fifecountry.co.uk/images/product_images/main_5698.jpg' },
  { description: 'Timberland', price: 'Ksh.1,000', img: 'https://images.timberland.com/is/image/timberland/A5VJN804-HERO?hei=650&wid=650&qlt=50&resMode=sharp2&op_usm=0.9,1.0,8,0' },
  { description: 'Adidas running shoes', price: 'Ksh.1,000', img: 'https://rukminim2.flixcart.com/image/850/1000/kg9qbgw0-0/shoe/u/4/0/fw8414-6-adidas-gretwo-ngtmet-grethr-original-imafwjvarcgqhg6z.jpeg?q=20&crop=false' },
  { description: 'Adidas running shoes2 ', price: 'Ksh.1,000', img: 'https://http2.mlstatic.com/D_NQ_NP_846805-MLC30019405708_042019-O.webp' },
  { description: 'Mens casual shoes', price: 'Ksh.1,000', img: 'https://www.famousfootwear.com/blob/product-images/20000/36/91/3/36913_pair_medium.jpg' },
  { description: 'Mens laced shoes', price: 'Ksh.1,000', img: 'https://m.media-amazon.com/images/I/7188bCCkBdL._AC_UY900_.jpg' },
  { description: 'Hiking shoes', price: 'Ksh.1,000', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTABH4iguiUjWK7J0vl83yoB_EP5LELHrRADb07M0ylOB4I3vpl4FdUpw-QojTMZ6LAGPc&usqp=CAU' },
  { description: 'brown loafers', price: 'Ksh.1,000', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEwYS2tS7OfLb47qgXuxCbvSLw8-XvRZpU-Q&s' },
  { description: 'Description 16', price: 'Ksh.1,000', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHGmO2-025jDx3357fEz6B_HmLjdt2-MVj9sxihCHacDoyRV5XSGq9n4U_T_zNBURqsgk&usqp=CAU' },
  { description: 'Description 17', price: 'Ksh.1,000', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRbuh9SXreO3ck9JmT0ivYShhbb_d0uKCNV2NGP_GMfsvGpiD9shszXutWJkbAwdymR4A&usqp=CAU' },
  { description: 'Description 18', price: 'Ksh.1,000', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUoviuYY0m0n-3Pb6Xb52WCNSkBejWkdf4KM39UpWN0jbcfksUJ19lrXLFuwVXA01G61I&usqp=CAU' },
  { description: 'Description 19', price: 'Ksh.1,000', img: 'https://cdn.shopify.com/s/files/1/1974/6675/products/sperry-mens-authentic-original-leather-boat-shoe-sahara-tan-404233301017-758343_1200x600_crop_center.jpg' },
  { description: 'Description 20', price: 'Ksh.1,000', img: 'https://www.dmarge.com/wp-content/uploads/2020/08/Aurelien-Light-Blue-Suede-Yacht-Loafer-v2.jpg' },
  { description: 'Description 21', price: 'Ksh.1,000', img: 'https://i8.amplience.net/s/scvl/92145_177051_SET/1?fmt=auto' }
];

const MensShoes = () => {
  return (
    <div>
      <NavBar />
      <div className="collection-container">
        {items.map((item, index) => (
          <div className="card" key={index}>
            <div className="card-img">
              {item.img ? <img src={item.img} alt={`Product ${index + 1}`} /> : <div>No Image Available</div>}
            </div>
            <div className="card-info">
              <p className="text-title">{item.description}</p>
              <p className="text-body">{item.description}</p>
            </div>
            <div className="card-footer">
              <span className="text-title">{item.price}</span>
              <div className="card-button">
                <svg className="svg-icon" viewBox="0 0 20 20">
                  <path d="M17.72,5.011H8.026c-0.271,0-0.49,0.219-0.49,0.489c0,0.271,0.219,0.489,0.49,0.489h8.962l-1.979,4.773H6.763L4.935,5.343C4.926,5.316,4.897,5.309,4.884,5.286c-0.011-0.024,0-0.051-0.017-0.074C4.833,5.166,4.025,4.081,2.33,3.908C2.068,3.883,1.822,4.075,1.795,4.344C1.767,4.612,1.962,4.853,2.231,4.88c1.143,0.118,1.703,0.738,1.808,0.866l1.91,5.661c0.066,0.199,0.252,0.333,0.463,0.333h8.924c0.116,0,0.22-0.053,0.308-0.128c0.027-0.023,0.042-0.048,0.063-0.076c0.026-0.034,0.063-0.058,0.08-0.099l2.384-5.75c0.062-0.151,0.046-0.323-0.045-0.458C18.036,5.092,17.883,5.011,17.72,5.011z"></path>
                  <path d="M8.251,12.386c-1.023,0-1.856,0.834-1.856,1.856s0.833,1.853,1.856,1.853c1.021,0,1.853-0.83,1.853-1.853S9.273,12.386,8.251,12.386z M8.251,15.116c-0.484,0-0.877-0.393-0.877-0.874c0-0.484,0.394-0.878,0.877-0.878c0.482,0,0.875,0.394,0.875,0.878C9.126,14.724,8.733,15.116,8.251,15.116z"></path>
                  <path d="M13.972,12.386c-1.022,0-1.855,0.834-1.855,1.856s0.833,1.853,1.855,1.853s1.854-0.83,1.854-1.853S14.994,12.386,13.972,12.386z M13.972,15.116c-0.484,0-0.878-0.393-0.878-0.874c0-0.484,0.394-0.878,0.878-0.878c0.482,0,0.875,0.394,0.875,0.878C14.847,14.724,14.454,15.116,13.972,15.116z"></path>
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MensShoes;
