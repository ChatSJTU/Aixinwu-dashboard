// @ts-strict-ignore
import CardTitle from "@dashboard/components/CardTitle";
import FormSpacer from "@dashboard/components/FormSpacer";
import { RichTextEditorLoading } from "@dashboard/components/RichTextEditor/RichTextEditorLoading";
import { PageErrorFragment, useSingleFileUploadMutation } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import useNotifier from "@dashboard/hooks/useNotifier";
import { getFormErrors } from "@dashboard/utils/errors";
import getPageErrorMessage from "@dashboard/utils/errors/page";
import { useRichTextContext } from "@dashboard/utils/richText/context";
import { Card, CardContent, TextField } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import ReactQuill, { Quill } from 'react-quill';
import ImageResize from "quill-image-resize-module-react";

import { PageData } from "../PageDetailsPage/form";
import './quill.css'
import 'react-quill/dist/quill.snow.css';

export interface PageInfoProps {
  data: PageData;
  disabled: boolean;
  errors: PageErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

Quill.register("modules/imageResize", ImageResize);

let fontArr = ['Microsoft-YaHei', 'SimSun', 'SimHei', 'KaiTi', 'FangSong'];
let Font = Quill.import('formats/font');
Font.whitelist = fontArr;

const Parchment = Quill.import('parchment');
const lineHeightStyle = new Parchment.Attributor.Style('lineHeight', 'line-height', {
  scope: Parchment.Scope.INLINE,
  whitelist: ["1", "1.5", "1.75", "2", "3", "4", "5"],
});

Quill.register(Font, true);
Quill.register({ 'formats/lineHeight': lineHeightStyle }, true);

const ImageBlot = Quill.import('formats/image');

class CustomImage extends ImageBlot {
  static create(value: any) {
    let node = super.create(value);
    node.setAttribute('style', 'margin: 0 auto; display: block;'); // 设置图片样式居中
    return node;
  }
}
CustomImage.blotName = 'customImage';
CustomImage.tagName = 'IMG';
Quill.register(CustomImage, true);

const useStyles = makeStyles(
  {
    root: {
      overflow: "visible",
    },
  },
  { name: "PageInfo" },
);

const PageInfo: React.FC<PageInfoProps> = props => {
  const { data, disabled, errors, onChange } = props;

  const classes = useStyles(props);
  const intl = useIntl();
  const notify = useNotifier();

  // const { defaultValue, editorRef, isReadyForMount, handleChange } = useRichTextContext();
  const { defaultValue, editorRef, isReadyForMount } = useRichTextContext();
  const formErrors = getFormErrors(["title", "content"], errors);

  const [editorValue, setEditorValue] = useState<string>('');

  useEffect(() => {
    if (defaultValue) {
      setEditorValue(defaultValue.blocks?.map(x => x.data.text).join('<br>'));
    }
  }, [defaultValue])

  const modules = React.useMemo(
    () => ({
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          ['link', 'image'], // 上传图片和链接
          [{ list: 'ordered' }, { list: 'bullet' }], // 有序列表，无序列表
          [{ script: 'sub' }, { script: 'super' }], // 下角标，上角标
          // [{ indent: '-1' }, { indent: '+1' }], // 缩进
          [{ align: [] }], // 居中
          // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
          [{ color: [] }, { background: [] }], // 文字颜色、背景颜色选择
          // [{ direction: 'rtl' }], // 文字输入方向
          [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
          [{ font: fontArr }], // 自定义字体
          [{ lineheight: ['1', '1.5', '1.75', '2', '3', '4', '5'] }], // 自定义行高
          // ['clean'], // 清除样式
        ],
        handlers: {
          image: () => handleImageUpload(), // 自定义图片上传
          lineheight: (value: any) => {  // 自定义行高
            if (value) {
              let quill = editorRef.current.getEditor();
              quill.format("lineHeight", value)
            }
          }
        },
      },
      imageResize: {
        displayStyles: {
          border: "none",
          color: "white",
          backgroundColor: "black"
        },
        modules: ["Resize", "DisplaySize", "Toolbar"]
      },
      clipboard: {
        matchers: [[]],
      }
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
          qlEditor.insertEmbed(range.index, 'customImage', url);
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

  const handleQuillValueChange = (content) => {
    // parmas: content, delta, source, editor
    setEditorValue(content);
  }

  return (
    <Card className={classes.root}>
      <CardTitle
        title={intl.formatMessage(commonMessages.generalInformations)}
      />
      <CardContent>
        <TextField
          disabled={disabled}
          error={!!formErrors.title}
          fullWidth
          helperText={getPageErrorMessage(formErrors.title, intl)}
          label={intl.formatMessage({
            id: "gr+oXW",
            defaultMessage: "Title",
            description: "page title",
          })}
          name={"title" as keyof PageData}
          value={data.title}
          onChange={onChange}
        />
        <FormSpacer />
        {isReadyForMount ? (
          <>
            {/* <RichTextEditor
              defaultValue={defaultValue}
              editorRef={editorRef}
              onChange={handleChange}
              disabled={disabled}
              error={!!formErrors.content}
              helperText={getPageErrorMessage(formErrors.content, intl)}
              label={intl.formatMessage({
                id: "gMwpNC",
                defaultMessage: "Content",
                description: "page content",
              })}
              name={"content" as keyof PageData}
            /> */}
            <FormSpacer />
            <ReactQuill
              ref={editorRef}
              theme={"snow"}
              value={editorValue}
              onChange={handleQuillValueChange}
              modules={modules}
            />
          </>
        ) : (
          <RichTextEditorLoading
            label={intl.formatMessage({
              id: "gMwpNC",
              defaultMessage: "Content",
              description: "page content",
            })}
            name={"content" as keyof PageData}
          />
        )}
      </CardContent>
    </Card>
  );
};
PageInfo.displayName = "PageInfo";
export default PageInfo;
