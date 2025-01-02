import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import { createContext, useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [credit, setCredit] = useState(false);
    const [image, setImage] = useState(false);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { getToken } = useAuth();
    const { isSignedIn } = useUser();
    const { openSignIn } = useClerk();
    const [resultImage, setResultImage] = useState(false);
    const Navigate = useNavigate();

    const loadCreditsData = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get(`${backendUrl}/api/user/credits`, { headers: { token } });
            if (data.success) {
                setCredit(data.credits);
                console.log("Credits Loaded:", data.credits);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const removeBg = async (image) => {
        try {
            if (!isSignedIn) {
                return openSignIn();
            }

            setImage(image);
            setResultImage(false);
            Navigate('/result');

            const token = await getToken();
            const formData = new FormData();

            if (image) {
                formData.append('image', image);
            }

            const { data } = await axios.post(`${backendUrl}/api/image/remove-bg`, formData, { headers: { token } });
            console.log("API Response:", data);

            if (data.success) {
                console.log("Setting Result Image:", data.resultImage);
                setResultImage(data.resultImage);
                if (data.creditBalance !== undefined) setCredit(data.creditBalance);
            } else {
                toast.error(data.message);
                if (data.creditBalance !== undefined) setCredit(data.creditBalance);
                if (data.creditBalance === 0) {
                    Navigate('/buy');
                }
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const value = {
        credit, setCredit, loadCreditsData, backendUrl, image, setImage, removeBg, resultImage, setResultImage
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
