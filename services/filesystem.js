const fs = require('promise-fs');

async function deleteFile(path, fileName) {
  if(fileName){
    nPath = path +'/'+ fileName;
    await fs.unlink(nPath);
  }else{
     await fs.unlink(`./${path}`);
  }
  
}

async function deleteFiles(paths, fileNames) {
  if(fileNames){
    if (!Array.isArray(fileNames)) {
      let error = new Error();
      error.message = "file names is not array  arument in delteFiles ";
      error.name = "FileSystemError";
      throw error;
    }

    for (const file of fileNames){
      nPath = paths + '/' + file;
      await fs.unlink(nPath);
    }
  }else{
    for (const path of paths){
      await fs.unlink(`./${path}`);
    }
  }
}
module.exports = {
  deleteFile: deleteFile,
  deleteFiles: deleteFiles
};
