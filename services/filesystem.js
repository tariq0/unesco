const fs = require("promise-fs");

async function deleteFile(path, fileName) {
  try {
    const nPath = path + "/" + fileName;
    await fs.unlink(nPath);
  } catch (err) {
    console.log("FileSystemError: ", err);
  }
}

async function deleteFiles(paths, fileNames) {
  
  try{  if (!Array.isArray(fileNames)) {
      let error = new Error();
      error.message = "file names is not array  arument in delteFiles ";
      error.name = "FileSystemError";
      throw error;
    }

    for (const file of fileNames) {
      let nPath = paths + "/" + file;
      await fs.unlink(nPath);
    }
  }catch(err){
    console.log("FileSystemError: ", err);
  }
  
}
module.exports = {
  deleteFile: deleteFile,
  deleteFiles: deleteFiles
};
