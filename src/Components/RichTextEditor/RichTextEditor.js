import React, { useRef, useMemo, useState, forwardRef, useImperativeHandle } from "react";
import JoditEditor from "jodit-react";
import { Box } from "@mui/material";
import { iframe } from "jodit/esm/plugins/iframe/iframe";

const RichTextEditor = forwardRef(
	(
		{
			value,
			onChange,
			readOnly = false,
			height = "250px",
			placeholder = "Details on the reason(s) for opening the ticket...",
		},
		ref
	) => {
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

		useImperativeHandle(ref, () => ({
			clear: () => {
				setContent("");
				if (editor.current) {
					editor.current.value = "";
				}
			},
		}));

		const config = useMemo(
			() => ({
				readonly: readOnly,
				toolbarSticky: false,
				toolbarAdaptive: true,
				showCharsCounter: false,
				showWordsCounter: false,
				showXPathInStatusbar: false,
				addNewLine: false,
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
			<JoditEditor
				ref={editor}
				value={content}
				config={config}
				onBlur={(newContent) => handleChange(newContent)}
			/>
		);
	}
);

export default RichTextEditor;
