import React from 'react';
import NavBar from './NavBar';
import './KidsShoes.css';

const products = [
  { description: 'Spider man sneakers', price: 'Ksh.1,000', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdyBJmv7S-262Ez9EjMP_-gJ993XNPizcfHQ&s' },
  { description: 'Trainers', price: 'Ksh.700', img: 'https://www.citywalk.co.ke/wp-content/uploads/2024/01/KD1605-3-copy-500x500.jpg' },
  { description: 'Canvas ', price: 'Ksh.700', img: 'https://images-na.ssl-images-amazon.com/images/I/41NN-JylS7L.jpg' },
  { description: 'Jordans', price: 'Ksh.900', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRXEFTeswAqDyOT4RnTqOgrfOkUbumJcOtQw&s' },
  { description: 'Girls Canvas', price: 'Ksh.1200', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3zeu93rM1X1ru1AW--UpsSYTRoD9_JCVRLQ&s' },
  { description: 'PU leather sneakers', price: 'Ksh.1400', img: 'https://m.media-amazon.com/images/I/81AY+9xBiJL._AC_UY1000_.jpg' },
  { description: 'boys sandals', price: 'Ksh.300', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKqE6ADC6ebzmdjTOe3ry-j7WvaTuKcCua0g&s' },
  { description: 'girls Sandals', price: 'Ksh.1250', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwbZILpX1fIa3mt87C1w4pjXe4pEHz_M-Iow&s' },
  { description: 'rain boots', price: 'Ksh.1500', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS61AO9SeP5eHQsL-CHnynCET0iPJIurfRDVQ&s' },
  { description: 'retro kids shoes', price: 'Ksh.1500', img: 'https://umoja.africa/cdn/shop/files/buggies-retro-kids-shoes-silver-386469_300x_crop_center.jpg?v=1716879358' },
  { description: 'Sambas', price: 'Ksh.1500', img: 'https://images.footlocker.com/is/image/EBFL2/IE3680?wid=200&hei=200&fmt=jpg-alpha' },
  { description: 'boy laced shoes', price: 'Ksh.1700', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-Ah-doH4QE8pi8g8bYKyzsfLxQk3JMVJHfg&s' },
  { description: 'Lightning mcqueen', price: 'Ksh.1500', img: 'https://cdn.media.amplience.net/i/scvl/158569_346503_1?fmt=auto&w=640' },
  { description: 'baby rubber sneakers', price: 'Ksh.1500', img: 'https://www.campusshoes.com/cdn/shop/products/T_J-07V_T_J-07_S.GRN-ORG_2.jpg?v=1670325365' },
  { description: 'crocs', price: 'Ksh.1500', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQolDeMpjC6vRoDXAMphXNezuW0AVYaZI578Q&s' },
  { description: 'Old navy sandals', price: 'Ksh.1500', img: 'https://previews.123rf.com/images/popovaphoto/popovaphoto1701/popovaphoto170100145/70837224-child-s-sandals-on-white-background.jpg' },
  { description: 'Girls dress shoes', price: 'Ksh.1500', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVFVOSMS6A4HcK6DXvWaEI7MzROB3w80NbIw&s' },
  { description: 'Beach shoes', price: 'Ksh.1500', img: 'https://www.coastwatersports.com/images/products/Cressi-Pulpy-Kids-Beach-Aqua-Shoes--Pink.jpg' },
  { description: 'Play shoes', price: 'Ksh.1500', img: 'https://m.media-amazon.com/images/I/61mv9-qVVEL._AC_SL1000_.jpg' },
  { description: 'sneakers', price: 'Ksh.1500', img:'https://m.media-amazon.com/images/I/61Rzix0aSnL._AC_UL1200_.jpg' },
  { description: 'Paw patrol sneakers', price: 'Ksh.1500', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4F-e1s2_upVWbAR6OuGLUe_TU1p-PqydG9w&s' },
];

const KidsShoes = () => {
  return (
    <div>
      <NavBar />
      <div className="collection-container">
        {products.map((product, index) => (
          <div className="card" key={index}>
            <div className="card-img">
              <img src={product.img} alt={product.description} />
            </div>
            <div className="card-info">
              <p className="text-title">{product.description}</p>
              <p className="text-body">{product.description}</p>
            </div>
            <div className="card-footer">
              <span className="text-title">{product.price}</span>
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

export default KidsShoes;
