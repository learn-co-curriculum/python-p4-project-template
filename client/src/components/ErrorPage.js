import { useRouteError } from "react-router-dom"; 

function ErrorPage () { 
  // COVER PAGE FOR ERROR
    const error = useRouteError(); 

  return( 
    <>
      <header>
        <h1>
        Whats Going ON!? Got lost ? 
        </h1>
      </header>
      <main>
        <h2>Hit the Home Page button to bring you back on track with Pen Prez ! </h2>
      </main>
    </>
  );
} 

export default ErrorPage;