'use client'

import { HtmlTreeContext } from "@/context/HtmlTreeContext";
import { Download } from "@/icons/download"
import { serializeHtmlTree } from "@/utils/serializeHtmlTree";
import { useContext } from "react";

export default function Header() {
    const { htmlTree } = useContext(HtmlTreeContext);

    const downloadHtml = () => {
        const htmlString = serializeHtmlTree(htmlTree);
        const blob = new Blob([htmlString], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'index.html';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <header className="flex justify-between mx-4 my-2">
            <h1 className="font-semibold">MVP Sites</h1>
            <button onClick={downloadHtml} className="bg-blue-500 text-white px-4 py-2 rounded">
                    <Download fill="#fff" height={20}/>
                </button>
        </header>
    )
}