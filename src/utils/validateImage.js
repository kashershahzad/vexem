const validateImage = value => {
  if (!value) {
    return 'Please upload a store logo';
  }

  const supportedFormats = ['image/jpeg', 'image/png'];
  if (!supportedFormats.includes(value.mime)) {
    return 'Unsupported image format. Please upload JPG or PNG.';
  }

  return undefined;
};

export default validateImage;
