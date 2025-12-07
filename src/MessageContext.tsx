import type { PropsWithChildren } from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

type MessageContextValue = {
	message: string | undefined;
	showMessage: (message: string) => void;
	dismissMessage: () => void;
};

const MessageContext = createContext<MessageContextValue>({
	message: "",
	showMessage: (_message: string) => {},
	dismissMessage: () => {},
});

const MessageProvider = ({ children }: PropsWithChildren) => {
	const [snackPack, setSnackPack] = useState<string[]>([]);
	const [message, setMessage] = useState<string>();

	useEffect(() => {
		if (snackPack.length && !message) {
			setMessage(snackPack[0]);
			setSnackPack((prev) => prev.slice(1));
		}
	}, [snackPack, message]);

	const showMessage = useCallback((newMessage: string) => {
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
