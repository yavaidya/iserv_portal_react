import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { useEffect } from "react";
import { useCustomTheme } from "../../Context/ThemeContext";
import { useTheme } from "@mui/material";
const QRCode = ({ data = "", title = "" }) => {
	const { theme } = useCustomTheme();
	const [qrData, setQrData] = useState(data);
	const [qrTitle, setQrTitle] = useState(title);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		if (qrData !== "") {
			setLoading(false);
		} else {
			setLoading(true);
		}
	}, [qrData]);

	return (
		<QRCodeSVG
			value={qrData}
			title={qrTitle}
			size={128}
			bgColor={theme.palette.background.paper}
			fgColor={theme.palette.text.primary}
			level={"L"}
		/>
	);
};

export default QRCode;
