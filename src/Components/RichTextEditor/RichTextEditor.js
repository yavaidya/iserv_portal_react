import React, { useRef, useMemo, useState } from "react";
import JoditEditor from "jodit-react";
import { Box, Typography } from "@mui/material";

const RichTextEditor = ({
	value,
	onChange,
	readOnly = false,
	height = "250px",
	placeholder = "Details on the reason(s) for opening the ticket...",
}) => {
	const editor = useRef(null);
	const [content, setContent] = useState(value || "");

	const handleChange = (newContent) => {
		setContent(newContent);

		const tempDiv = document.createElement("div");
		tempDiv.innerHTML = newContent;
		const plainText = tempDiv.textContent || tempDiv.innerText || "";

		const json = { html: newContent, text: plainText };

		onChange && onChange({ html: newContent, text: plainText.trim(), json });
	};
	const config = useMemo(
		() => ({
			readonly: readOnly,
			height,
			toolbarSticky: false,
			toolbarAdaptive: false,
			showCharsCounter: false,
			showWordsCounter: false,
			showXPathInStatusbar: false,
			placeholder,
			buttons: [
				"bold",
				"italic",
				"underline",
				"ul",
				"ol",
				"|",
				"outdent",
				"indent",
				"|",
				"left",
				"center",
				"right",
				"justify",
				"|",
				"link",
				"image",
				"|",
				"undo",
				"redo",
			],
		}),
		[readOnly, height]
	);

	return (
		<Box sx={{ width: "100%" }}>
			<JoditEditor
				ref={editor}
				value={content}
				config={config}
				onBlur={(newContent) => handleChange(newContent)}
			/>
		</Box>
	);
};

export default RichTextEditor;
