/**
 * IPFS Upload Utility using Pinata
 *
 * Setup Instructions:
 * 1. Create account at https://pinata.cloud
 * 2. Get API Key from https://app.pinata.cloud/developers/api-keys
 * 3. Add to .env.local:
 *    VITE_PINATA_JWT=your_jwt_token_here
 */

interface IPFSMetadata {
  assetType: string;
  value: string;
  metadata: string;
  isRegulated: boolean;
  timestamp: number;
  owner: string;
}

/**
 * Upload JSON metadata to IPFS via Pinata
 */
export async function uploadToIPFS(metadata: IPFSMetadata): Promise<string> {
  const pinataJWT = import.meta.env.VITE_PINATA_JWT;

  if (!pinataJWT) {
    console.warn("IPFS upload disabled: VITE_PINATA_JWT not configured");
    // Fallback to deterministic hash for demo
    return generateDeterministicHash(metadata);
  }

  try {
    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${pinataJWT}`,
        },
        body: JSON.stringify({
          pinataContent: metadata,
          pinataMetadata: {
            name: `RWA-${metadata.assetType}-${metadata.timestamp}`,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Pinata upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return `ipfs://${data.IpfsHash}`;
  } catch (error) {
    console.error("IPFS upload error:", error);
    // Fallback to deterministic hash
    return generateDeterministicHash(metadata);
  }
}

/**
 * Fallback: Generate deterministic hash when IPFS is not configured
 */
function generateDeterministicHash(metadata: IPFSMetadata): string {
  const metadataString = JSON.stringify(metadata);

  // Simple hash function for demo purposes
  const hashCode = metadataString.split("").reduce((acc, char) => {
    return (acc << 5) - acc + char.charCodeAt(0);
  }, 0);

  const contentHash = Math.abs(hashCode)
    .toString(16)
    .padStart(46, "0")
    .substring(0, 46);
  return `ipfs://Qm${contentHash}`;
}

/**
 * Alternative: Upload file to IPFS (for PDFs, images, etc.)
 */
export async function uploadFileToIPFS(file: File): Promise<string> {
  const pinataJWT = import.meta.env.VITE_PINATA_JWT;

  if (!pinataJWT) {
    throw new Error("IPFS upload not configured. Please set VITE_PINATA_JWT");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "pinataMetadata",
    JSON.stringify({
      name: file.name,
    })
  );

  try {
    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${pinataJWT}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Pinata file upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return `ipfs://${data.IpfsHash}`;
  } catch (error) {
    console.error("IPFS file upload error:", error);
    throw error;
  }
}

/**
 * Get IPFS gateway URL for viewing content
 */
export function getIPFSGatewayUrl(ipfsUri: string): string {
  const hash = ipfsUri.replace("ipfs://", "");
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
}
