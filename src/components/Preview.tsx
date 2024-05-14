'use client'
import { useContext } from 'react';
import { HtmlTreeContext } from '../context/HtmlTreeContext';
import { serializeHtmlTree } from '../utils/serializeHtmlTree';

const Preview = () => {
    const context = useContext(HtmlTreeContext);

    if (!context) {
        throw new Error('Preview must be used within a HtmlTreeProvider');
    }

    const { htmlTree } = context;
    const htmlString = serializeHtmlTree(htmlTree);

    const openInNewTab = () => {
        const newWindow = window.open();
        if (newWindow) {
            newWindow.document.open();
            newWindow.document.write(htmlString);
            newWindow.document.close();
        }
    };

    return (
        <div className="p-4 border rounded-lg border-solid m-2 basis-1/3">
            <div className="flex justify-between">
            <h2>Preview</h2>
            <button onClick={openInNewTab} className="mb-2 bg-blue-500 text-white px-4 py-2 rounded">
                Open in New Tab
            </button>
            </div>
            <iframe 
                srcDoc={htmlString} 
                title="Preview"
                style={{ width: '100%', height: '500px', border: '1px solid black' }} 
            />
        </div>
    );
};

export default Preview;
