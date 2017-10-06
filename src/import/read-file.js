
export default (files, callback) => {
  const reader = new FileReader();
  reader.onload = () => {
    const fileContents = reader.result;
    callback(fileContents);
  };
  reader.readAsText(files[0]);
};
