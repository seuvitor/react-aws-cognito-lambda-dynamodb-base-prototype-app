import useAppConfig from "./AppConfigContext";
import type { AppRoute } from "./BaseAppScope";
import BaseAppScope from "./BaseAppScope";
import type { AppConfig } from "./core/makeAppConfig";
import makeAppConfig from "./core/makeAppConfig";
import useDDB from "./DDBContext";
import useLambda from "./LambdaContext";
import useMessage, { useMessageAreaState } from "./MessageContext";
import useSpinner, { useSpinnerAreaState } from "./SpinnerContext";
import useUser from "./UserContext";
import useAppBarState from "./useAppBarState";
import useAppDrawerState from "./useAppDrawerState";

export {
	BaseAppScope,
	makeAppConfig,
	useAppConfig,
	useAppDrawerState,
	useDDB,
	useLambda,
	useMessage,
	useMessageAreaState,
	useAppBarState,
	useSpinner,
	useSpinnerAreaState,
	useUser,
};

export type { AppRoute, AppConfig };
