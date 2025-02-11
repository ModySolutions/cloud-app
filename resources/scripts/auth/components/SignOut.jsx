import {useNavigate} from "react-router-dom";
import {useEffect} from "@wordpress/element";

const SignOut = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/auth/sign-in');
    }, []);
    return '';
}

export default SignOut;