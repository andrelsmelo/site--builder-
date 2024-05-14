import { HtmlTreeProvider } from '@/context/HtmlTreeContext';
import Elements from '@/components/Elements';
import Editor from '@/components/Editor';
import Preview from '@/components/Preview';

const HomePage = () => {
    return (
        <HtmlTreeProvider>
            <div className="flex justify-between items-start">
                <Elements />
                <Editor />
                <Preview />
            </div>
            <div className="fixed top-0 right-0">
   
            </div>
        </HtmlTreeProvider>
    );
};

export default HomePage;
