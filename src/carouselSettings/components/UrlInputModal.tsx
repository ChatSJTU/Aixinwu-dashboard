import React from 'react';
import { useIntl } from 'react-intl';
import { TextField, Button, Modal, Box } from '@material-ui/core';
import { useForm } from 'react-hook-form';

interface UrlInputModalProps {
  open: boolean;
  onClose: () => void;
  onUrlSubmit: (url: string) => void;
}

const urlRegex = new RegExp(
  'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)'
);

const UrlInputModal: React.FC<UrlInputModalProps> = ({ open, onClose, onUrlSubmit }) => {
  const intl = useIntl();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const handleClose = () => {
    onClose();
    reset();
  };

  const handleUrlSubmit = (data: { url: string }) => {
    onUrlSubmit(data.url);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{
        position: 'fixed',
        top: '40%',
        marginLeft: '35%',
        width: 700,
        bgcolor: 'background.paper',
        border: '1px solid #000',
        borderRadius: '4px',
        boxShadow: 24,
        p: 4,
        zIndex: 10,
      }}>
        <form onSubmit={handleSubmit(handleUrlSubmit)}>
          <TextField
            {...register('url', {
              required: 'URL 不能为空',
              pattern: {
                value: urlRegex,
                message: 'URL 格式不正确',
              },
            })}
            label={intl.formatMessage({ id: 'urlInputLabel', defaultMessage: '请输入新增轮播图的URL' })}
            error={!!errors.url}
            helperText={errors.url ? errors.url.message : ''}
            fullWidth
          />
          <Box mt={2} display="flex" justifyContent="space-between" style={{marginTop: '24px'}}>
            <Button type="submit" variant="contained" color="primary">
              提交
            </Button>
            <Button onClick={handleClose} variant="text">
              取消
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default UrlInputModal;