import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../css/footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container d-flex justify-content-between align-items-center">
        <img
          src="https://i.pinimg.com/564x/86/4a/3e/864a3e877dc16143e216b145da06a336.jpg"
          alt="pic"
          className="footer-logo"
        />
        <div className="company-footer text-center">
          <h2>FREIGHTX</h2>
          <p>4653-Kilindini</p>
          <p>Copyright © 2024</p>
        </div>
        <div className="contacts text-right">
          <h2>Contact us on:</h2>
          <ul className="list-unstyled">
            <li className="contact-item">
              <i className="fab fa-twitter"></i> Twitter: @freightx
            </li>
            <li className="contact-item">
              <i className="fab fa-instagram"></i> Instagram: @freightx
            </li>
            <li className="contact-item">
              <i className="fab fa-facebook"></i> Facebook: @freightx
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
