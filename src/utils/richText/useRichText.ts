import { OutputBlockData, OutputData } from "@editorjs/editorjs";
import { EditorCore } from "@react-editor-js/core";
import { MutableRefObject, useMemo, useRef, useState } from "react";

export interface UseRichTextOptions {
  initial: string | null | undefined;
  loading?: boolean;
  triggerChange: () => void;
}

interface UseRichTextResult {
  editorRef: MutableRefObject<EditorCore | any | null>;
  handleChange: () => void;
  getValue: () => Promise<OutputData>;
  defaultValue: OutputData | undefined;
  isReadyForMount: boolean;
}

export function useRichText({
  initial,
  loading,
  triggerChange,
}: UseRichTextOptions): UseRichTextResult {
  // const editorRef = useRef<EditorCore | null>(null);
  const editorRef = useRef<any>(null);
  const [isReadyForMount, setIsReadyForMount] = useState(false);

  const handleChange = () => {
    triggerChange();
  };

  const convertStringToOutputData = (str: string): Promise<OutputData> => {
    return new Promise((resolve) => {
      const blocks: OutputBlockData[] = [
        {
          type: 'paragraph',
          data: {
            text: str,
          },
        },
      ];
  
      const outputData: OutputData = {
        time: Date.now(),
        blocks,
      };
  
      resolve(outputData);
    });
  };

  const getValue = async () => {
    if (editorRef.current) {
      if (typeof editorRef.current.save === 'function') {
        // EditorJS
        return editorRef.current.save();
      }
      else if (typeof editorRef.current.getEditor === 'function') {
        // QuillJS
        return convertStringToOutputData(editorRef.current.getEditor().root.innerHTML)
      }
    } else {
      throw new Error("Editor instance is not available");
    }
  };

  const defaultValue = useMemo<OutputData | undefined>(() => {
    if (loading) {
      return;
    }

    if (!initial) {
      setIsReadyForMount(true);
      return "";
    }

    try {
      const result = JSON.parse(initial);
      setIsReadyForMount(true);
      return result;
    } catch (e) {
      return undefined;
    }
  }, [initial, loading]);

  return {
    editorRef,
    handleChange,
    getValue,
    defaultValue,
    isReadyForMount,
  };
}

export default useRichText;
