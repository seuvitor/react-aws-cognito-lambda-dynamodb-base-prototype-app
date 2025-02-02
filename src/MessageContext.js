import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

const MessageContext = createContext();

const MessageProvider = ({ children }) => {
	const [snackPack, setSnackPack] = useState([]);
	const [message, setMessage] = useState(undefined);

	useEffect(() => {
		if (snackPack.length && !message) {
			setMessage(snackPack[0]);
			setSnackPack((prev) => prev.slice(1));
		}
	}, [snackPack, message]);

	const showMessage = useCallback((newMessage) => {
		setSnackPack((prev) => [...prev, newMessage]);
	}, []);

	const dismissMessage = useCallback(() => {
		setMessage(undefined);
	}, []);

	return (
		<MessageContext.Provider value={{ message, showMessage, dismissMessage }}>
			{children}
		</MessageContext.Provider>
	);
};

const useMessage = () => {
	const { showMessage } = useContext(MessageContext);

	return { showMessage };
};

const useMessageAreaState = () => {
	const { message, dismissMessage } = useContext(MessageContext);

	return { message, dismissMessage };
};

export default useMessage;
export { MessageProvider, useMessageAreaState };
