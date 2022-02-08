import pdf from '@/assets/images/file/pdf.png';
import xls from '@/assets/images/file/excel.png';
import txt from '@/assets/images/file/text.png';
import doc from '@/assets/images/file/word.png';
import zip from '@/assets/images/file/zip.png';
import img from '@/assets/images/file/img.png';
import ppt from '@/assets/images/file/ppt.png';
import vedio from '@/assets/images/file/vedio.png';
import unknown from '@/assets/images/file/unknown.png';

import { proxyBackUpDefault } from '@/utils/utils';

export * from './storage';

export const PAGE_SIZE = 10; // 分页大小

export const MAX_TABLE_HANDLE_NUM = 2; // tab 操作栏最大展示数量，超过会隐藏到更多里

export const MAX_INPUT_NUMBER = 99999999; // 数字输入框最大值

export const IMAGE_MINI_TYPE = 'image/*';

export const FileIconMap = proxyBackUpDefault({
  zip,
  doc,
  docx: doc,
  xls,
  xlsx: xls,
  pdf,
  txt,
  ppt,
  pptx: ppt,
  jpg: img,
  jpeg: img,
  png: img,
  gif: img,
  mp4: vedio,
  ogg: vedio,
  'file-excel': xls,
  'file-pdf': pdf,
  'file-word': doc,
  'file-text': txt,
  'file-zip': zip,
  'file-unknown': pdf,
  default: unknown,
});

export const DemoTabKeyMap = {
  FORM: 'FORM',
  TABLE: 'TABLE',
};
