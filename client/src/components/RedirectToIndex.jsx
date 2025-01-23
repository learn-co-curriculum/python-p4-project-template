import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RedirectToIndex() {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/') 
    }, []);
}

export default RedirectToIndex