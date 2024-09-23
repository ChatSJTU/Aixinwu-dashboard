import React, { useState, useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import { useIntl } from "react-intl";
import useNotifier from "@dashboard/hooks/useNotifier";
import ImageResize from "quill-image-resize-module-react";
import { useSingleFileUploadMutation } from '@dashboard/graphql';

import 'react-quill/dist/quill.snow.css';
import './quill.css';

Quill.register("modules/imageResize", ImageResize);

const fontArr = ['Microsoft-YaHei', 'SimSun', 'SimHei', 'KaiTi', 'FangSong'];
const Font = Quill.import('formats/font');
Font.whitelist = fontArr;

const Parchment = Quill.import('parchment');
const lineHeightStyle = new Parchment.Attributor.Style('lineHeight', 'line-height', {
  scope: Parchment.Scope.INLINE,
  whitelist: ["1", "1.5", "1.75", "2", "3", "4", "5"],
});

Quill.register(Font, true);
Quill.register({ 'formats/lineHeight': lineHeightStyle }, true);

const ImageBlot = Quill.import('formats/image');

class CenteredImage extends ImageBlot {
  static create(value: any) {
    let node = super.create(value);
    node.setAttribute('style', 'margin: 0 auto; display: block;');
    return node;
  }
}
CenteredImage.blotName = 'CenteredImage';
CenteredImage.tagName = 'IMG';
Quill.register(CenteredImage, true);

interface QuillEditorProps {
  value: string;
  onChange?: (content: string) => void;
  editorRef: React.MutableRefObject<any>;
}

const QuillEditor: React.FC<QuillEditorProps> = ({ value, onChange, editorRef }) => {
  const intl = useIntl();
  const notify = useNotifier();

  const [editorValue, setEditorValue] = useState<string>(value);

  useEffect(() => {
    setEditorValue(value);
  }, [value]);

  const modules = React.useMemo(
    () => ({
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          ['link', 'image'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ script: 'sub' }, { script: 'super' }],
          [{ align: [] }],
          [{ color: [] }, { background: [] }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: fontArr }],
          [{ lineheight: ['1', '1.5', '1.75', '2', '3', '4', '5'] }],
        ],
        handlers: {
          image: () => handleImageUpload(),
          lineheight: (value: any) => {
            if (value) {
              let quill = editorRef.current.getEditor();
              quill.format("lineHeight", value);
            }
          },
        },
      },
      imageResize: {
        displayStyles: {
          border: "none",
          color: "white",
          backgroundColor: "black",
        },
        modules: ["Resize", "DisplaySize", "Toolbar"],
      },
      clipboard: {
        matchers: [[]],
      },
    }),
    [],
  );

  const [imageUpload] = useSingleFileUploadMutation({
    onCompleted: data => {
      if (data.fileUpload.errors.length !== 0) {
        notify({
          status: "error",
          text: data.fileUpload.errors[0].message
        })
      }
    }
  })

  const handleImageUpload = () => {
    const qlEditor = editorRef.current.getEditor();
    let range = qlEditor.getSelection();

    if (!range || !range.index) { // 只有光标在编辑器内才允许插入图片
      return;
    }

    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const maxFileSize = 10 * 1024 * 1024;

      if (!file) {
        notify({
          status: "error",
          text: intl.formatMessage({
            id: "aiso87",
            defaultMessage: "Error: File does not exist!"
          })
        })
        return;
      }

      if (file.size > maxFileSize) {
        notify({
          status: "error",
          text: intl.formatMessage({
            id: "9hg8yf",
            defaultMessage: "Error: File size exceeds 10MB!"
          })
        })
        return;
      }

      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type) && !file.name.endsWith(".webp")) {
        notify({
          status: "error",
          text: intl.formatMessage({
            id: "6t7y89",
            defaultMessage: "Error: File type is not image!"
          })
        })
        return;
      }

      try {
        const response = await imageUpload({ variables: { file } });
        const url = response.data?.fileUpload?.uploadedFile?.url;

        if (url) {
          range = qlEditor.getSelection();
          qlEditor.insertEmbed(range.index, 'CenteredImage', url);
          qlEditor.setSelection(range.index + 1);
        } else {
          notify({
            status: "error",
            text: intl.formatMessage({
              id: "2fre1d",
              defaultMessage: "Error: Failed to fetch uploaded url!"
            })
          })
        }
      } catch (error) {
        notify({
          status: "error",
          text: error
        })
      }
    }
  }

  const handleQuillValueChange = (content: string) => {
    setEditorValue(content);
    onChange?.(content);
  };

  return (
    <ReactQuill
      ref={editorRef}
      theme="snow"
      value={editorValue}
      onChange={handleQuillValueChange}
      modules={modules}
    />
  );
};

export default QuillEditor;