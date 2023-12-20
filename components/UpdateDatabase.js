import { get, put } from 'utils/api';
import { useState, useRef } from 'react';
import FrinksButton from './FrinksButton';
import ShipmentOverFlowModal from './ShipmentOverFlowModal';

function UpdateDatabase() {
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        // Replace 'http://localhost:3001/upload' with your backend upload endpoint
        const response = await put('/api/configuration/update-database', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('File uploaded successfully:', response.data);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };
  
  const downloadFunc = async () => {
    try {
      const res = await get('/api/configuration/organization');
      console.log(res?.data?.data?.organization_id);
      const response = await get(`https://cement-backend.frinks.ai/api/initialize?organization_id=${res?.data?.data?.organization_id}`);
      if (response.status === 200) {
        const sqlData = response.data;
        const blob = new Blob([sqlData], { type: 'application/sql' });
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = 'dump.sql';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        console.error('Failed to download file');
      }
    } catch (error) {
      console.error('Error downloading file', error);
    }
  };

  const uploadFunc = async () => {
    fileInputRef.current.click();
  }

  return (
    <div className="center">
      {error && (
        <ShipmentOverFlowModal
          open={error}
          close={() => {
            setError(false);
          }}
          error={error}
        />
      )}
      <p className="update-scope">
        Updates database values by fetching info from AWS and restarts necessary
        modules
      </p>
      <FrinksButton text="Download Database" onClick={downloadFunc} />
      <br />
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <br />
      <FrinksButton text="Upload Database" onClick={uploadFunc} />
    </div>
  );
}

export default UpdateDatabase;
