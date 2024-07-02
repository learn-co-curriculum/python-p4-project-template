import App from './App'; 
import Login from './Login'; 
import SignUp from './SignUp'; 
import NewRecipeForm from './NewRecipeForm'; 
import FavoriteRecipes from './Favorites'; 
import ErrorPage from './ErrorPage'; 

const routes = [ 
    { 
        path: "/", 
        element: <App/>, 
        children: [ 
            { 
                path: "/login", 
                element: <Login/>, 
                errorElement: <ErrorPage/>
            }, 
            { 
                path: "/signup", 
                element: <SignUp/>, 
                errorElement: <ErrorPage/>
            }, 
            { 
                path: "/NewRecipeForm", 
                element: <NewRecipeForm/>, 
                errorElement: <ErrorPage/>
            }, 
            { 
                path: "/favorites", 
                element: <FavoriteRecipes/>, 
                errorElement: <ErrorPage/>
            }
        ]
    }
]; 
export default routes;