import Header from './Header.jsx'
const LoggedInContainer = ({userData, children}) => {
    return (
      <>
        <Header userData={userData}/>
        {children}
      </>
    );
}

export default LoggedInContainer;
