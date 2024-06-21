import React from "react";
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import { Link, useLocation } from "react-router-dom";
import './Nav.css'

function Navbar() {
    const location = useLocation();

    return (
        <nav className="navbar">
            <Container>
                <div className="navrow">
                    <Link to="/" className="nav-link">
                        {location.pathname !== "/" ?
                            <div className="nav-item">
                                <Image className="nav-image" src="https://i.pinimg.com/originals/11/38/47/1138473f3f6e934e1ea62a3a91d01ac7.jpg" thumbnail />
                                <span className="nav-text">Home</span>
                            </div>
                            : null
                        } 
                    </Link>

                    <Link to="/player" className="nav-link">
                        <div className="nav-item">
                            <Image className="nav-image" src="https://i.pinimg.com/originals/f1/28/7f/f1287f9804f7ed835e3fd1858046811b.jpg" thumbnail />
                            <span className="nav-text">Players</span>
                        </div>
                    </Link>

                    <Link to="/destinations" className="nav-link">
                        <div className="nav-item">
                            <Image className="nav-image" src="https://i0.wp.com/acelessons.com/wp-content/uploads/2021/02/Universe.jpg" thumbnail />
                            <span className="nav-text">Destinations</span>
                        </div>
                    </Link>

                    <Link to="/missions" className="nav-link">
                        <div className="nav-item">
                            <Image className="nav-image" src="https://1.bp.blogspot.com/-VTjCQPpcjk4/Xn6jZJTM9WI/AAAAAAAA-R0/a0onSuZrXaonJsj0my0xQRVxjLOFABfpQCLcBGAsYHQ/s1600/1.jpg" thumbnail />
                            <span className="nav-text">Missions</span>
                        </div>
                    </Link>

                    <Link to="/spacecrafts" className="nav-link">
                        <div className="nav-item">
                            <Image className="nav-image" id="sell" src="https://i.pinimg.com/originals/19/c7/91/19c7919a7db729fe057988c3afa2577b.jpg" thumbnail />
                            <span className="nav-text">Spacecrafts</span>
                        </div>
                    </Link>
                </div>
            </Container>
        </nav>
    )
}

export default Navbar;