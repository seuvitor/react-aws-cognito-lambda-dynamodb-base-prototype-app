import React, { createContext, useCallback, useContext, useState } from "react";

type SpinnerContextValue = {
	showSpinner: () => void;
	dismissSpinner: () => void;
	showing: boolean;
};

const SpinnerContext = createContext<SpinnerContextValue>({
	showSpinner: () => {},
	dismissSpinner: () => {},
	showing: false,
});

const SpinnerProvider = ({ children }) => {
	const [spinnerCount, setSpinnerCount] = useState(0);

	const showSpinner = useCallback(() => {
		setSpinnerCount((prev) => prev + 1);
	}, []);

	const dismissSpinner = useCallback(() => {
		setSpinnerCount((prev) => prev - 1);
	}, []);

	const showing = spinnerCount > 0;

	return (
		<SpinnerContext.Provider value={{ showSpinner, dismissSpinner, showing }}>
			{children}
		</SpinnerContext.Provider>
	);
};

const useSpinner = () => {
	const { showSpinner, dismissSpinner } = useContext(SpinnerContext);

	return { showSpinner, dismissSpinner };
};

const useSpinnerAreaState = () => {
	const { showing } = useContext(SpinnerContext);

	return { showing };
};

export default useSpinner;
export { SpinnerProvider, useSpinnerAreaState };
