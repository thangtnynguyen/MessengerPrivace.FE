import { enviroment } from "src/environments/environment";
// import { ClassicEditor, Bold, Essentials, Italic, Mention, Paragraph, Undo } from 'ckeditor5';

export const CkEditorConfig = {
  language: 'vi',
  height: '100%',
  uploadFileApiUrl: enviroment.baseApiUploadFile,
  deleteFileApiUrl: enviroment.baseApiDeleteFile,

  // plugins: [Font],

  // toolbar: [
  //   'heading', '|',
  //   'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|',
  //   'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells', '|',
  //   'undo', 'redo', 'imageUpload', '|',
  //   // 'fontColor', 'fontBackgroundColor', 'fullscreen', 'maximize'
  // ],
  // extraPlugins: ['ImageResize' ,'ImageUpload', 'Table', 'Heading', 'Bold', 'Italic', 'Link', 'List', 'BlockQuote',],


  // image: {
  //   toolbar: [
  //     'imageStyle:full', 'imageStyle:side', 'imageResize'
  //   ]
  // },
  // extraPlugins: [ ImageResize ],
  // toolbar: {
  //   items: [
  //     'heading', '|',
  //     'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|',
  //     'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells', '|',
  //     'undo', 'redo', 'ckfinder', 'imageUpload'
  //   ]
  // },


};
