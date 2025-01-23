import MenuTop from './MenuTop';
import MenuButtom from './MenuBottom';

const Header = ({userData}) => {
    return (
        <div style={{'margin':'2%'}} >
            <MenuTop name={userData.name} username={userData.email} />
            <MenuButtom />
        </div>
    );
}

export default Header;
