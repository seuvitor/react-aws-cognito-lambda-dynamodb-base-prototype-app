import { useEffect } from "react";
import { useMessageAreaState } from "../../src";

const MessageArea = () => {
	const { message, dismissMessage } = useMessageAreaState();

	useEffect(() => {
		if (message) {
			setTimeout(() => {
				dismissMessage();
			}, 5000);
		}
	}, [dismissMessage, message]);

	return message ? (
		<div
			style={{
				position: "absolute",
				top: 0,
				width: "100%",
				display: "flex",
				justifyContent: "center",
			}}
		>
			<div style={{ border: "solid thin" }}>
				<span>{message}</span>
			</div>
		</div>
	) : null;
};

export default MessageArea;
