export const convertBlobToBase64 = (blob: Blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

export const downloadFile = (filename: string, data: Blob): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      // REF: https://dev.to/graciesharma/implementing-csv-data-export-in-react-without-external-libraries-3030
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');

      link.href = url;
      link.setAttribute('download', filename);

      // Add event listeners to track success/failure
      link.addEventListener('click', () => {
        setTimeout(() => {
          // Cleanup
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          resolve(true);
        }, 100);
      });

      link.addEventListener('error', (error) => {
        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        reject(error);
      });

      document.body.appendChild(link);
      link.click();
    } catch (error) {
      reject(error);
    }
  });
};
