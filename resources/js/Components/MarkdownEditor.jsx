
import { useEffect, useRef } from 'react';
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';

export default function MarkdownEditor({ value, onChange, height = '400px' }) {
    const editorRef = useRef(null);
    const instanceRef = useRef(null);
    const onChangeRef = useRef(onChange);

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        if (!editorRef.current) return;

        const editor = new Editor({
            el: editorRef.current,
            height,
            initialEditType: 'markdown',
            previewStyle: 'vertical',
            placeholder: 'Mulai tulis artikel kamu di sini...',
            usageStatistics: false,
            toolbarItems: [
                ['heading', 'bold', 'italic', 'strike'],
                ['hr', 'quote'],
                ['ul', 'ol', 'task'],
                ['table', 'link'],
                ['code', 'codeblock'],
            ],
            events: {
                change: () => {
                    onChangeRef.current?.(editor.getMarkdown());
                },
            },
        });

        instanceRef.current = editor;
        editor.setMarkdown(value || '');

        return () => {
            editor.destroy();
            instanceRef.current = null;
        };
    }, []);

    useEffect(() => {
        const editor = instanceRef.current;

        if (editor && editor.getMarkdown() !== (value || '')) {
            editor.setMarkdown(value || '');
        }
    }, [value]);

    return (
        <div
            ref={editorRef}
            className="overflow-hidden rounded-lg border border-slate-300"
        />
    );
}
