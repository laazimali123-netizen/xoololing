// ─── XooloLing S3 Upload Utility ─────────────────────────────────────
import axios from 'axios';

const UPLOAD_BASE = 'https://animalstock.vercel.app/api/upload';

interface UploadResult {
  url: string;
  key: string;
}

export async function uploadImage(uri: string, type: 'listing' | 'profile' | 'vaccination' = 'listing'): Promise<UploadResult | null> {
  try {
    const filename = uri.split('/').pop() || 'photo.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const ext = match ? match[1] : 'jpg';

    const formData = new FormData();
    formData.append('file', {
      uri,
      name: filename,
      type: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
    } as any);
    formData.append('type', type);

    const { data } = await axios.post(`${UPLOAD_BASE}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (data?.success && data.data) {
      return { url: data.data.url, key: data.data.key };
    }
    return null;
  } catch (error) {
    console.error('Upload failed:', error);
    return null;
  }
}

export async function uploadMultipleImages(uris: string[], type: 'listing' | 'profile' | 'vaccination' = 'listing'): Promise<string[]> {
  const results = await Promise.all(uris.map((uri) => uploadImage(uri, type)));
  return results.filter((r): r is UploadResult => r !== null).map((r) => r.url);
}

export async function deleteImage(key: string): Promise<boolean> {
  try {
    const { data } = await axios.delete(`${UPLOAD_BASE}/image/${key}`);
    return data?.success ?? false;
  } catch {
    return false;
  }
}
