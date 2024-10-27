// utils/s3.js (for example)
export const fetchNewSignedUrl = async (imageFilename) => {
    const response = await fetch(`/api/getSignedUrl`, {
      method: 'POST',
      body: JSON.stringify({ filename: imageFilename }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch signed URL");
    }
    
    const { signedUrl } = await response.json();
    return signedUrl;
  };
  