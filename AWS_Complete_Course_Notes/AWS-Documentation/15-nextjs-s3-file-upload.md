# 🚀 Upload Files from Next.js App to AWS S3 — Complete Guide

---

## 📚 What You'll Learn

- How to build a complete file upload system using Next.js and AWS S3
- Two methods: Direct Server Upload and Presigned URL Upload
- Setting up AWS SDK v3 in a Next.js project
- Creating beautiful upload components with drag-and-drop and progress bars
- File validation, multiple file uploads, and deleting files
- Security best practices (never expose AWS keys to the browser!)
- CORS configuration and bucket policies
- Deployment considerations
- 10+ interview questions with answers

---

## ✅ Prerequisites

- **Node.js** (v18 or higher) installed on your computer
- **npm** or **yarn** package manager
- **AWS Account** with an IAM user that has S3 permissions
- **S3 Bucket** already created (see **14-create-s3-bucket-upload-files.md**)
- Basic knowledge of **React** and **Next.js**
- Basic understanding of **S3 concepts** (see **13-what-is-s3.md**)

---

## 1. What We're Building 🏗️

We're building a **file upload application** where users can:
- Select files from their computer (or drag and drop)
- Upload files to an S3 bucket
- See upload progress
- View a list of uploaded files
- Delete uploaded files

### Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                        ARCHITECTURE                                │
│                                                                    │
│  ┌──────────────┐     ┌──────────────────┐     ┌──────────────┐  │
│  │   Browser     │     │   Next.js Server  │     │   AWS S3      │  │
│  │   (React)     │     │   (API Routes)    │     │   Bucket      │  │
│  │              │     │                  │     │              │  │
│  │  Upload Form ├────>│  /api/upload     ├────>│  PutObject   │  │
│  │              │ POST│                  │ SDK │              │  │
│  │              │     │                  │     │  📄 Files     │  │
│  │  File List   │<────┤  /api/files      │<────┤              │  │
│  │              │ JSON│                  │ SDK │  🖼️ Images    │  │
│  │              │     │                  │     │              │  │
│  │  Delete Btn  ├────>│  /api/delete     ├────>│  DeleteObject│  │
│  └──────────────┘     └──────────────────┘     └──────────────┘  │
│                                                                    │
│  Method 2 (Presigned URL - for large files):                      │
│  ┌──────────────┐     ┌──────────────────┐     ┌──────────────┐  │
│  │   Browser     │     │   Next.js Server  │     │   AWS S3      │  │
│  │              ├────>│  /api/presign     │     │              │  │
│  │  1. Get URL  │ GET │  Generate URL     │     │              │  │
│  │              │<────┤                  │     │              │  │
│  │  2. Upload   ├─────┼──────────────────┼────>│  Direct PUT  │  │
│  │   directly   │ PUT │  (bypassed!)      │     │              │  │
│  └──────────────┘     └──────────────────┘     └──────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

**Method 1 (Direct Upload):** Browser → Next.js Server → S3
- Simpler to implement
- Server handles the file
- Limited by server memory and timeout
- Best for small files (< 10 MB)

**Method 2 (Presigned URL):** Browser → S3 (directly)
- More complex setup
- Browser uploads directly to S3
- No file size limit from server
- Best for large files
- ✅ **Recommended for production**

---

## 2. Step 1: Create Next.js App 📦

Open your terminal and run:

```bash
npx create-next-app@latest s3-upload-app
```

When prompted, choose these options:

```
✔ Would you like to use TypeScript? → No
✔ Would you like to use ESLint? → Yes
✔ Would you like to use Tailwind CSS? → Yes
✔ Would you like your code inside a `src/` directory? → No
✔ Would you like to use App Router? (recommended) → Yes
✔ Would you like to use Turbopack for next dev? → Yes
✔ Would you like to customize the import alias? → No
```

Navigate into the project:

```bash
cd s3-upload-app
```

### Project Structure Overview

```
s3-upload-app/
├── app/
│   ├── api/                    ← API routes (server-side)
│   │   ├── upload/
│   │   │   └── route.js        ← Handle file uploads
│   │   ├── presign/
│   │   │   └── route.js        ← Generate presigned URLs
│   │   ├── files/
│   │   │   └── route.js        ← List uploaded files
│   │   └── delete/
│   │       └── route.js        ← Delete files
│   ├── layout.js               ← Root layout
│   ├── page.js                 ← Main page
│   └── globals.css             ← Global styles
├── components/
│   └── FileUpload.js           ← Upload component
├── lib/
│   └── s3.js                   ← S3 client configuration
├── .env.local                  ← Environment variables (SECRET!)
├── package.json
└── next.config.mjs
```

---

## 3. Step 2: Install AWS SDK 📥

```bash
# Install the S3 client from AWS SDK v3
npm install @aws-sdk/client-s3

# Install the presigned URL generator
npm install @aws-sdk/s3-request-presigner
```

**What these packages do:**

| Package | Purpose |
|---------|---------|
| `@aws-sdk/client-s3` | Core S3 operations (upload, download, delete, list objects) |
| `@aws-sdk/s3-request-presigner` | Generate presigned URLs for direct browser-to-S3 uploads |

> 💡 **Why AWS SDK v3?** AWS SDK v3 is modular — you only install what you need. SDK v2 (`aws-sdk`) bundled everything (huge package size). SDK v3 packages are much smaller and tree-shakeable.

---

## 4. Step 3: Set Up Environment Variables 🔐

Create a file called `.env.local` in the project root:

```bash
# .env.local
# ⚠️ NEVER commit this file to Git! It's in .gitignore by default.

AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1
S3_BUCKET_NAME=my-nextjs-upload-bucket-2025
```

**Replace the values with your actual AWS credentials!**

**How to get your credentials:**
1. Go to AWS Console → IAM → Users → Your user
2. Click **Security credentials** tab
3. Click **Create access key**
4. Copy the Access Key ID and Secret Access Key

> ⚠️ **CRITICAL SECURITY RULES:**
> - **NEVER** hardcode credentials in your source code
> - **NEVER** commit `.env.local` to Git (it's in `.gitignore` by default)
> - **NEVER** expose `AWS_SECRET_ACCESS_KEY` to the browser/frontend
> - Use IAM roles instead of access keys in production (EC2, ECS, Lambda)

### Verify .gitignore

Make sure your `.gitignore` includes:

```
# .gitignore
.env*.local
```

---

## 5. Step 4: Create S3 Configuration File ⚙️

Create the file `lib/s3.js`:

```javascript
// lib/s3.js
// This file creates and exports a configured S3 client
// It's used by all API routes that need to interact with S3

import { S3Client } from "@aws-sdk/client-s3";

// Create a new S3 client with our configuration
// This client will be reused across all S3 operations
const s3Client = new S3Client({
    region: process.env.AWS_REGION,              // e.g., "us-east-1"
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,         // Your IAM access key
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,  // Your IAM secret key
    },
});

// Export the client and bucket name for use in API routes
export { s3Client };
export const bucketName = process.env.S3_BUCKET_NAME;
```

**Why create a separate config file?**
- **DRY (Don't Repeat Yourself)** — One place to configure S3
- **Easy to change** — Update credentials or region in one place
- **Reusable** — All API routes import from the same config

---

## 6. Step 5: Method 1 — Direct Upload from Server (API Route) 📤

This method uploads files through your Next.js server. The browser sends the file to your API route, and the API route sends it to S3.

### Create the Upload API Route

Create the file `app/api/upload/route.js`:

```javascript
// app/api/upload/route.js
// This API route handles file uploads from the browser
// It receives the file, then uploads it to S3

import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, bucketName } from "@/lib/s3";

export async function POST(request) {
    try {
        // 1. Get the form data from the request
        const formData = await request.formData();
        const file = formData.get("file");

        // 2. Validate that a file was provided
        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // 3. Validate file size (limit to 10 MB for this method)
        const MAX_SIZE = 10 * 1024 * 1024; // 10 MB in bytes
        if (file.size > MAX_SIZE) {
            return NextResponse.json(
                { error: "File too large. Maximum size is 10 MB. Use presigned URL for larger files." },
                { status: 400 }
            );
        }

        // 4. Validate file type (optional - customize as needed)
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
            "application/pdf",
            "text/plain",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: `File type "${file.type}" is not allowed.` },
                { status: 400 }
            );
        }

        // 5. Convert the file to a Buffer (needed for S3 upload)
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 6. Create a unique file name to avoid overwriting
        // Format: timestamp-originalname (e.g., 1705312200000-photo.jpg)
        const timestamp = Date.now();
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const key = `uploads/${timestamp}-${sanitizedName}`;

        // 7. Create the S3 PutObject command
        const command = new PutObjectCommand({
            Bucket: bucketName,           // Your S3 bucket name
            Key: key,                      // The file path in S3
            Body: buffer,                  // The file content
            ContentType: file.type,        // MIME type (image/jpeg, etc.)
            // Optional metadata
            Metadata: {
                "original-name": file.name,
                "uploaded-by": "nextjs-app",
            },
        });

        // 8. Send the file to S3
        await s3Client.send(command);

        // 9. Construct the file URL
        const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        // 10. Return success response
        return NextResponse.json({
            success: true,
            message: "File uploaded successfully!",
            file: {
                key: key,
                url: fileUrl,
                name: file.name,
                size: file.size,
                type: file.type,
            },
        });
    } catch (error) {
        console.error("S3 Upload Error:", error);
        return NextResponse.json(
            { error: "Failed to upload file. " + error.message },
            { status: 500 }
        );
    }
}
```

**Code walkthrough:**

| Step | What It Does |
|------|-------------|
| 1 | Extracts the file from the multipart form data |
| 2-4 | Validates the file (exists, size limit, type check) |
| 5 | Converts the file to a Buffer for S3 |
| 6 | Creates a unique key to prevent filename collisions |
| 7 | Creates the S3 PutObjectCommand with file data and metadata |
| 8 | Sends the file to S3 |
| 9-10 | Returns the file URL and metadata to the browser |

---

## 7. Step 6: Method 2 — Presigned URL Upload (Recommended) 🔗

This is the **recommended method for production** and large files. The browser uploads directly to S3 using a temporary presigned URL.

### Create the Presigned URL API Route

Create the file `app/api/presign/route.js`:

```javascript
// app/api/presign/route.js
// This API route generates a presigned URL that allows
// the browser to upload a file directly to S3

import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, bucketName } from "@/lib/s3";

export async function POST(request) {
    try {
        // 1. Get file info from the request body
        const { fileName, fileType, fileSize } = await request.json();

        // 2. Validate inputs
        if (!fileName || !fileType) {
            return NextResponse.json(
                { error: "fileName and fileType are required" },
                { status: 400 }
            );
        }

        // 3. Validate file size (limit to 100 MB for presigned uploads)
        const MAX_SIZE = 100 * 1024 * 1024; // 100 MB
        if (fileSize > MAX_SIZE) {
            return NextResponse.json(
                { error: "File too large. Maximum size is 100 MB." },
                { status: 400 }
            );
        }

        // 4. Validate file type
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
            "application/pdf",
            "text/plain",
            "video/mp4",
            "video/webm",
        ];

        if (!allowedTypes.includes(fileType)) {
            return NextResponse.json(
                { error: `File type "${fileType}" is not allowed.` },
                { status: 400 }
            );
        }

        // 5. Create a unique key for the file
        const timestamp = Date.now();
        const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
        const key = `uploads/${timestamp}-${sanitizedName}`;

        // 6. Create the PutObject command
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            ContentType: fileType,
        });

        // 7. Generate the presigned URL (valid for 5 minutes)
        const presignedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 300, // 300 seconds = 5 minutes
        });

        // 8. Return the presigned URL and file key
        return NextResponse.json({
            success: true,
            presignedUrl: presignedUrl,
            key: key,
            expiresIn: 300,
        });
    } catch (error) {
        console.error("Presign Error:", error);
        return NextResponse.json(
            { error: "Failed to generate presigned URL. " + error.message },
            { status: 500 }
        );
    }
}
```

**How the Presigned URL flow works:**

```
Step 1: Browser asks Next.js server for a presigned URL
  Browser → POST /api/presign { fileName: "photo.jpg", fileType: "image/jpeg" }

Step 2: Server generates a presigned URL using AWS SDK
  Server → AWS S3 (getSignedUrl) → returns URL

Step 3: Server sends the URL back to the browser
  Server → Browser { presignedUrl: "https://bucket.s3...?X-Amz-Signature=..." }

Step 4: Browser uploads the file DIRECTLY to S3 using the URL
  Browser → PUT presignedUrl (with file data) → S3

✅ The file never passes through your server!
   This saves server bandwidth and avoids timeout issues.
```

---

## 8. Step 7: Create the Upload Component 🎨

Create the file `components/FileUpload.js`:

```javascript
// components/FileUpload.js
// A beautiful file upload component with drag-and-drop,
// progress bar, and file preview

"use client";

import { useState, useRef, useCallback } from "react";

export default function FileUpload({ onUploadComplete }) {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const fileInputRef = useRef(null);

    // Maximum file size: 10 MB (for direct upload method)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    // Allowed file types
    const ALLOWED_TYPES = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/pdf",
        "text/plain",
    ];

    // ── Handle file selection ──────────────────────────────────
    const handleFileSelect = (selectedFiles) => {
        setError(null);
        const validFiles = [];

        for (const file of selectedFiles) {
            // Validate file size
            if (file.size > MAX_FILE_SIZE) {
                setError(`"${file.name}" is too large. Maximum size is 10 MB.`);
                continue;
            }

            // Validate file type
            if (!ALLOWED_TYPES.includes(file.type)) {
                setError(`"${file.name}" has an unsupported file type.`);
                continue;
            }

            validFiles.push(file);
        }

        setFiles((prev) => [...prev, ...validFiles]);
    };

    // ── Handle file input change ───────────────────────────────
    const handleInputChange = (e) => {
        if (e.target.files) {
            handleFileSelect(Array.from(e.target.files));
        }
    };

    // ── Handle drag and drop ───────────────────────────────────
    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelect(Array.from(e.dataTransfer.files));
        }
    }, []);

    // ── Remove a file from the list before uploading ───────────
    const removeFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    // ── Upload files using Method 1 (Direct Server Upload) ─────
    const uploadDirect = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Upload failed");
        }
        return data;
    };

    // ── Upload files using Method 2 (Presigned URL) ────────────
    const uploadWithPresignedUrl = async (file) => {
        // Step 1: Get presigned URL from our API
        const presignResponse = await fetch("/api/presign", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,
            }),
        });

        const presignData = await presignResponse.json();
        if (!presignResponse.ok) {
            throw new Error(presignData.error || "Failed to get presigned URL");
        }

        // Step 2: Upload file directly to S3 using presigned URL
        // We use XMLHttpRequest instead of fetch to track upload progress
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            // Track upload progress
            xhr.upload.addEventListener("progress", (event) => {
                if (event.lengthComputable) {
                    const percent = Math.round((event.loaded / event.total) * 100);
                    setUploadProgress((prev) => ({
                        ...prev,
                        [file.name]: percent,
                    }));
                }
            });

            xhr.addEventListener("load", () => {
                if (xhr.status === 200) {
                    resolve({
                        success: true,
                        file: {
                            key: presignData.key,
                            url: `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${presignData.key}`,
                            name: file.name,
                            size: file.size,
                            type: file.type,
                        },
                    });
                } else {
                    reject(new Error(`Upload failed with status ${xhr.status}`));
                }
            });

            xhr.addEventListener("error", () => {
                reject(new Error("Upload failed due to network error"));
            });

            // Send PUT request directly to S3
            xhr.open("PUT", presignData.presignedUrl);
            xhr.setRequestHeader("Content-Type", file.type);
            xhr.send(file);
        });
    };

    // ── Handle upload button click ─────────────────────────────
    const handleUpload = async () => {
        if (files.length === 0) return;

        setUploading(true);
        setError(null);
        setUploadProgress({});

        const results = [];

        for (const file of files) {
            try {
                setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));

                // Use Method 1 (Direct) for simplicity
                // Switch to uploadWithPresignedUrl(file) for Method 2
                const result = await uploadDirect(file);

                setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }));
                results.push(result.file);
            } catch (err) {
                setError(`Failed to upload "${file.name}": ${err.message}`);
                setUploadProgress((prev) => ({ ...prev, [file.name]: -1 }));
            }
        }

        setUploadedFiles((prev) => [...prev, ...results]);
        setFiles([]);
        setUploading(false);

        // Notify parent component
        if (onUploadComplete) {
            onUploadComplete(results);
        }
    };

    // ── Format file size for display ───────────────────────────
    const formatSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* ── Drop Zone ────────────────────────────────── */}
            <div
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                    dragActive
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400 bg-gray-50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleInputChange}
                    className="hidden"
                    accept={ALLOWED_TYPES.join(",")}
                />
                <div className="text-4xl mb-4">📁</div>
                <p className="text-lg font-semibold text-gray-700">
                    Drag & drop files here
                </p>
                <p className="text-sm text-gray-500 mt-1">
                    or click to browse
                </p>
                <p className="text-xs text-gray-400 mt-2">
                    Max file size: 10 MB | Supported: Images, PDF, Text
                </p>
            </div>

            {/* ── Error Message ─────────────────────────────── */}
            {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    ⚠️ {error}
                </div>
            )}

            {/* ── Selected Files List ──────────────────────── */}
            {files.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">
                        Selected Files ({files.length}):
                    </h3>
                    <div className="space-y-2">
                        {files.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">
                                        {file.type.startsWith("image/")
                                            ? "🖼️"
                                            : file.type === "application/pdf"
                                            ? "📄"
                                            : "📝"}
                                    </span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {formatSize(file.size)}
                                        </p>
                                    </div>
                                </div>

                                {/* Upload Progress or Remove Button */}
                                {uploading ? (
                                    <div className="w-24">
                                        {uploadProgress[file.name] >= 0 ? (
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-300 ${
                                                        uploadProgress[file.name] === 100
                                                            ? "bg-green-500"
                                                            : uploadProgress[file.name] === -1
                                                            ? "bg-red-500"
                                                            : "bg-blue-500"
                                                    }`}
                                                    style={{
                                                        width: `${Math.max(
                                                            uploadProgress[file.name] || 0,
                                                            0
                                                        )}%`,
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400">
                                                Waiting...
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFile(index);
                                        }}
                                        className="text-red-400 hover:text-red-600 text-sm"
                                    >
                                        ✕ Remove
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Upload Button */}
                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className={`mt-4 w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
                            uploading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                        }`}
                    >
                        {uploading
                            ? "⏳ Uploading..."
                            : `📤 Upload ${files.length} file${
                                  files.length > 1 ? "s" : ""
                              }`}
                    </button>
                </div>
            )}

            {/* ── Uploaded Files List ──────────────────────── */}
            {uploadedFiles.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">
                        ✅ Uploaded Files ({uploadedFiles.length}):
                    </h3>
                    <div className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="text-green-500 text-lg">✅</span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {formatSize(file.size)}
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-700 text-sm"
                                >
                                    View →
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
```

---

## 9. Step 8: Create the Main Page 🏠

Replace the contents of `app/page.js`:

```javascript
// app/page.js
// Main page that displays the file upload component
// and a list of previously uploaded files

"use client";

import { useState, useEffect } from "react";
import FileUpload from "@/components/FileUpload";

export default function Home() {
    const [allFiles, setAllFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch the list of uploaded files when the page loads
    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const response = await fetch("/api/files");
            const data = await response.json();
            if (data.success) {
                setAllFiles(data.files);
            }
        } catch (error) {
            console.error("Failed to fetch files:", error);
        } finally {
            setLoading(false);
        }
    };

    // Called when new files are uploaded
    const handleUploadComplete = (newFiles) => {
        setAllFiles((prev) => [...newFiles, ...prev]);
    };

    // Delete a file
    const handleDelete = async (key) => {
        if (!confirm("Are you sure you want to delete this file?")) return;

        try {
            const response = await fetch("/api/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key }),
            });

            const data = await response.json();
            if (data.success) {
                setAllFiles((prev) => prev.filter((f) => f.key !== key));
            }
        } catch (error) {
            console.error("Failed to delete file:", error);
        }
    };

    // Format file size
    const formatSize = (bytes) => {
        if (!bytes) return "Unknown";
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        ☁️ S3 File Upload
                    </h1>
                    <p className="text-gray-500">
                        Upload files to AWS S3 from your Next.js app
                    </p>
                </div>

                {/* Upload Component */}
                <FileUpload onUploadComplete={handleUploadComplete} />

                {/* All Files Section */}
                <div className="mt-12">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        📂 All Files in S3 Bucket
                    </h2>

                    {loading ? (
                        <p className="text-gray-400 text-center py-8">
                            Loading files...
                        </p>
                    ) : allFiles.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">
                            No files uploaded yet. Upload your first file above!
                        </p>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                                            Name
                                        </th>
                                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                                            Size
                                        </th>
                                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                                            Modified
                                        </th>
                                        <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allFiles.map((file, index) => (
                                        <tr
                                            key={file.key}
                                            className="border-b border-gray-100 hover:bg-gray-50"
                                        >
                                            <td className="px-4 py-3">
                                                <p className="text-sm text-gray-700 truncate max-w-xs">
                                                    {file.key.split("/").pop()}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                {formatSize(file.size)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                {file.lastModified
                                                    ? new Date(
                                                          file.lastModified
                                                      ).toLocaleDateString()
                                                    : "—"}
                                            </td>
                                            <td className="px-4 py-3 text-right space-x-2">
                                                <a
                                                    href={file.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 hover:text-blue-700 text-sm"
                                                >
                                                    View
                                                </a>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(file.key)
                                                    }
                                                    className="text-red-500 hover:text-red-700 text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
```

---

## 10. List Files API Route 📋

Create the file `app/api/files/route.js`:

```javascript
// app/api/files/route.js
// This API route lists all files in the S3 bucket

import { NextResponse } from "next/server";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3Client, bucketName } from "@/lib/s3";

export async function GET() {
    try {
        // List all objects in the "uploads/" prefix
        const command = new ListObjectsV2Command({
            Bucket: bucketName,
            Prefix: "uploads/", // Only list files in the uploads folder
            MaxKeys: 100,       // Limit to 100 files
        });

        const response = await s3Client.send(command);

        // Format the file list
        const files = (response.Contents || []).map((item) => ({
            key: item.Key,
            size: item.Size,
            lastModified: item.LastModified,
            url: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`,
        }));

        // Sort by last modified (newest first)
        files.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));

        return NextResponse.json({
            success: true,
            files: files,
            count: files.length,
        });
    } catch (error) {
        console.error("List Files Error:", error);
        return NextResponse.json(
            { error: "Failed to list files. " + error.message },
            { status: 500 }
        );
    }
}
```

---

## 11. Delete Files API Route 🗑️

Create the file `app/api/delete/route.js`:

```javascript
// app/api/delete/route.js
// This API route deletes a file from S3

import { NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, bucketName } from "@/lib/s3";

export async function DELETE(request) {
    try {
        // Get the file key from the request body
        const { key } = await request.json();

        if (!key) {
            return NextResponse.json(
                { error: "File key is required" },
                { status: 400 }
            );
        }

        // Security check: Only allow deleting files in the "uploads/" prefix
        if (!key.startsWith("uploads/")) {
            return NextResponse.json(
                { error: "Invalid file key" },
                { status: 403 }
            );
        }

        // Delete the object from S3
        const command = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key,
        });

        await s3Client.send(command);

        return NextResponse.json({
            success: true,
            message: `File "${key}" deleted successfully`,
        });
    } catch (error) {
        console.error("Delete Error:", error);
        return NextResponse.json(
            { error: "Failed to delete file. " + error.message },
            { status: 500 }
        );
    }
}
```

---

## 12. S3 Bucket CORS Configuration ⚙️

If you're using **Method 2 (Presigned URL)**, you **MUST** configure CORS on your S3 bucket to allow the browser to upload directly.

### Why CORS is Needed

Without CORS, the browser will block the direct upload to S3 because your Next.js app (`localhost:3000`) and S3 (`bucket.s3.amazonaws.com`) are on different domains.

### Set Up CORS

1. Go to AWS Console → S3 → Your bucket → **Permissions** tab
2. Scroll to **Cross-origin resource sharing (CORS)**
3. Click **Edit**
4. Paste this JSON:

```json
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "PUT",
            "POST",
            "DELETE",
            "HEAD"
        ],
        "AllowedOrigins": [
            "http://localhost:3000",
            "https://your-production-domain.com"
        ],
        "ExposeHeaders": [
            "ETag",
            "x-amz-request-id"
        ],
        "MaxAgeSeconds": 3000
    }
]
```

5. Click **Save changes**

**What each field means:**

| Field | Purpose |
|-------|---------|
| `AllowedHeaders` | `*` allows all headers (needed for Content-Type, etc.) |
| `AllowedMethods` | PUT is needed for presigned URL uploads, GET for downloads |
| `AllowedOrigins` | Your app's URL — add both development and production URLs |
| `ExposeHeaders` | Headers the browser can read from S3's response |
| `MaxAgeSeconds` | Browser caches the CORS config for this many seconds |

> ⚠️ **Production:** Replace `http://localhost:3000` with your actual domain and remove localhost.

---

## 13. S3 Bucket Policy for the App 📜

If you want uploaded files to be publicly viewable (like profile pictures), add this bucket policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadUploads",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/uploads/*"
        }
    ]
}
```

This allows anyone to **view** files in the `uploads/` folder, but **not** upload or delete them (only your server can do that with IAM credentials).

> 💡 **Pro Tip:** If files should be private, skip the bucket policy and use presigned URLs for viewing as well (generate a GET presigned URL).

---

## 14. Add Public Environment Variables (for Presigned URL Method) 🌐

For Method 2, the browser needs to know the bucket name and region to construct the file URL after upload. Add these to `.env.local`:

```bash
# .env.local (add these lines)
# These NEXT_PUBLIC_ variables are safe to expose to the browser
NEXT_PUBLIC_S3_BUCKET_NAME=my-nextjs-upload-bucket-2025
NEXT_PUBLIC_AWS_REGION=us-east-1
```

> 💡 **Note:** Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Only put non-sensitive values here — **NEVER** put access keys in `NEXT_PUBLIC_` variables!

---

## 15. Test the Application 🧪

### Start the Development Server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### Test Checklist

| Test | Expected Result |
|------|----------------|
| 1. Click the drop zone | File picker opens |
| 2. Select a file | File appears in the selected files list |
| 3. Drag a file over the drop zone | Drop zone turns blue |
| 4. Drop a file | File appears in the selected files list |
| 5. Click "Upload" | Progress bar shows, file uploads to S3 |
| 6. Check S3 Console | File appears in the `uploads/` folder |
| 7. Click "View" on uploaded file | File opens in a new tab |
| 8. Click "Delete" on uploaded file | File is removed from S3 and the list |
| 9. Try uploading a file > 10 MB | Error message appears |
| 10. Try uploading an unsupported file type | Error message appears |

---

## 16. Handling Multiple File Uploads 📦

The upload component already supports multiple files! Here's how it works:

```javascript
// In the file input, the "multiple" attribute allows selecting multiple files:
<input type="file" multiple />

// In handleUpload, we loop through all files:
for (const file of files) {
    const result = await uploadDirect(file);
    // Each file is uploaded sequentially
}
```

**To upload files in parallel (faster):**

```javascript
const handleUploadParallel = async () => {
    const uploadPromises = files.map((file) => uploadDirect(file));
    const results = await Promise.allSettled(uploadPromises);

    results.forEach((result, index) => {
        if (result.status === "fulfilled") {
            console.log(`✅ ${files[index].name} uploaded`);
        } else {
            console.error(`❌ ${files[index].name} failed:`, result.reason);
        }
    });
};
```

---

## 17. File Type Validation 🔍

Here's a comprehensive file type validation utility:

```javascript
// lib/fileValidation.js

export const FILE_TYPES = {
    images: {
        mimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"],
        extensions: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
        label: "Images",
    },
    documents: {
        mimeTypes: [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ],
        extensions: [".pdf", ".doc", ".docx", ".xls", ".xlsx"],
        label: "Documents",
    },
    videos: {
        mimeTypes: ["video/mp4", "video/webm", "video/ogg"],
        extensions: [".mp4", ".webm", ".ogg"],
        label: "Videos",
    },
};

export function validateFile(file, allowedCategories = ["images", "documents"]) {
    const errors = [];

    // Check if file type is in allowed categories
    const allowedMimeTypes = allowedCategories.flatMap(
        (cat) => FILE_TYPES[cat]?.mimeTypes || []
    );

    if (!allowedMimeTypes.includes(file.type)) {
        errors.push(
            `File type "${file.type}" is not allowed. Allowed: ${allowedCategories.join(", ")}`
        );
    }

    // Check file extension (double validation)
    const extension = "." + file.name.split(".").pop().toLowerCase();
    const allowedExtensions = allowedCategories.flatMap(
        (cat) => FILE_TYPES[cat]?.extensions || []
    );

    if (!allowedExtensions.includes(extension)) {
        errors.push(`File extension "${extension}" is not allowed.`);
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}
```

---

## 18. File Size Limits ⚖️

| Scenario | Recommended Limit | Why |
|----------|-------------------|-----|
| Profile photos | 5 MB | No need for huge photos |
| Document uploads | 25 MB | Most documents are small |
| Video uploads | 100 MB (use presigned) | Videos can be large |
| General uploads | 10 MB (direct), 5 GB (presigned) | Balance between UX and server load |

```javascript
// Example: Different limits per file type
function getMaxSize(fileType) {
    if (fileType.startsWith("image/")) return 5 * 1024 * 1024;     // 5 MB
    if (fileType.startsWith("video/")) return 100 * 1024 * 1024;   // 100 MB
    if (fileType === "application/pdf") return 25 * 1024 * 1024;    // 25 MB
    return 10 * 1024 * 1024;                                        // 10 MB default
}
```

---

## 19. Security Best Practices 🔒

### ⚠️ The #1 Rule: NEVER Expose AWS Keys to the Frontend

```
❌ WRONG (DO NOT DO THIS):
// In a React component or any frontend code
const s3 = new S3Client({
    credentials: {
        accessKeyId: "AKIAIOSFODNN7EXAMPLE",       // ← EXPOSED!
        secretAccessKey: "wJalrXUtnFEMI/K7MDENG/", // ← EXPOSED!
    },
});

✅ CORRECT:
// AWS credentials should ONLY be in:
// 1. Server-side code (API routes, getServerSideProps)
// 2. Environment variables (not NEXT_PUBLIC_ ones)
// 3. IAM roles (on EC2, ECS, Lambda)
```

### Security Checklist

| Practice | Why |
|----------|-----|
| ✅ Use server-side API routes for S3 operations | Keeps credentials on the server |
| ✅ Use presigned URLs for browser uploads | No credentials needed on frontend |
| ✅ Validate file types on the server | Browser validation can be bypassed |
| ✅ Validate file sizes on the server | Prevent abuse and large uploads |
| ✅ Sanitize file names | Prevent path traversal attacks |
| ✅ Use unique keys (timestamps) | Prevent overwriting existing files |
| ✅ Restrict IAM permissions | Only give the app the S3 permissions it needs |
| ✅ Set presigned URL expiration short | 5 minutes is usually enough |
| ✅ Use HTTPS in production | Encrypt data in transit |
| ✅ Add rate limiting to API routes | Prevent upload abuse |

### Minimal IAM Policy for the App

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::YOUR-BUCKET-NAME",
                "arn:aws:s3:::YOUR-BUCKET-NAME/uploads/*"
            ]
        }
    ]
}
```

This policy gives the app **only** the permissions it needs — nothing more.

---

## 20. Deployment Considerations 🚢

### Environment Variables in Production

| Platform | How to Set Env Vars |
|----------|-------------------|
| **Vercel** | Project Settings → Environment Variables |
| **AWS Amplify** | App Settings → Environment Variables |
| **Netlify** | Site Settings → Environment Variables |
| **Docker** | Docker Compose env_file or -e flags |
| **EC2** | Use IAM Roles (no access keys needed!) |

### Using IAM Roles Instead of Access Keys (Recommended for Production)

When deploying on AWS services (EC2, ECS, Lambda), use **IAM Roles** instead of access keys:

```javascript
// lib/s3.js (production version using IAM Roles)
import { S3Client } from "@aws-sdk/client-s3";

// When running on AWS with an IAM Role,
// the SDK automatically picks up credentials from the instance metadata
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    // No credentials needed! The IAM Role provides them automatically.
});

export { s3Client };
export const bucketName = process.env.S3_BUCKET_NAME;
```

### Next.js Configuration for File Uploads

If you're uploading large files through the server (Method 1), you may need to increase the body size limit. Add to `next.config.mjs`:

```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
    // Allow larger request bodies for file uploads
    experimental: {
        serverActions: {
            bodySizeLimit: "10mb",
        },
    },
};

export default nextConfig;
```

---

## 21. Common Errors and Fixes 🔧

### Error: "Access Denied" when uploading

```
AccessDenied: Access Denied
```

**Fixes:**
- Check that your IAM user has `s3:PutObject` permission
- Verify the bucket name in `.env.local` is correct
- Verify the AWS region in `.env.local` is correct
- Check that access keys are valid and not expired

### Error: "CORS error" with presigned URL upload

```
Access to XMLHttpRequest at 'https://bucket.s3.amazonaws.com'
has been blocked by CORS policy
```

**Fixes:**
- Add CORS configuration to your S3 bucket (see Section 12)
- Make sure `AllowedOrigins` includes `http://localhost:3000`
- Make sure `AllowedMethods` includes `PUT`
- Wait a few minutes — CORS changes can take time to propagate

### Error: "Network Error" during upload

**Fixes:**
- Check your internet connection
- Verify the presigned URL hasn't expired (default: 5 minutes)
- Check if the file is too large for the server's timeout
- Use Method 2 (presigned URL) for large files

### Error: "NoSuchBucket"

```
NoSuchBucket: The specified bucket does not exist
```

**Fixes:**
- Check the bucket name in `.env.local` — it's case-sensitive
- Make sure the bucket exists in the correct region
- Create the bucket if it doesn't exist

### Error: "InvalidAccessKeyId"

```
InvalidAccessKeyId: The AWS Access Key Id you provided does not exist
```

**Fixes:**
- Verify your access key ID in `.env.local`
- Check if the IAM user still exists and is active
- Regenerate access keys if needed
- Restart the dev server after changing `.env.local`

### Error: "SignatureDoesNotMatch"

```
SignatureDoesNotMatch: The request signature we calculated does not match
```

**Fixes:**
- Check for extra spaces or newlines in your secret key in `.env.local`
- Make sure you're using the correct secret key for the access key
- Verify the region matches the bucket's region

### Error: "EntityTooLarge"

```
Your proposed upload exceeds the maximum allowed size
```

**Fixes:**
- For Method 1: Increase the limit in your API route or use Method 2
- For files > 5 GB: Use multipart upload
- Use presigned URLs for large files

---

## 🔄 Quick Summary

```
┌─────────────────────────────────────────────────────────────┐
│           NEXT.JS + S3 UPLOAD QUICK SUMMARY                 │
├─────────────────────────────────────────────────────────────┤
│ 1. Create Next.js app (npx create-next-app@latest)          │
│ 2. Install: @aws-sdk/client-s3, @aws-sdk/s3-request-presigner │
│ 3. Set up .env.local with AWS credentials                    │
│ 4. Create lib/s3.js with S3Client configuration             │
│ 5. Method 1: API route receives file → uploads to S3        │
│ 6. Method 2: API route generates presigned URL → browser    │
│    uploads directly to S3 (recommended!)                     │
│ 7. Create FileUpload component with drag & drop              │
│ 8. Add CORS to S3 bucket for presigned URL uploads          │
│ 9. NEVER expose AWS keys to the frontend!                    │
│ 10. Use IAM Roles in production instead of access keys       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎤 Interview Questions (10+)

**Q1: How do you upload files from a Next.js app to S3?**
> Two methods: 1) Direct upload through API route — browser sends file to Next.js server, server uploads to S3 using AWS SDK. 2) Presigned URL — server generates a temporary signed URL, browser uploads directly to S3. Method 2 is recommended for large files as it bypasses the server.

**Q2: What is a presigned URL and why is it useful for file uploads?**
> A presigned URL is a temporary URL that grants permission to perform a specific S3 operation (PUT, GET) without needing AWS credentials. It's useful because: the browser can upload directly to S3 (faster, no server bottleneck), no AWS credentials are exposed to the frontend, and the URL expires after a set time for security.

**Q3: Why should you never expose AWS access keys in frontend code?**
> Frontend code (JavaScript in the browser) is visible to anyone using browser DevTools. If AWS keys are exposed, attackers can use them to access your S3 bucket, upload malicious files, delete data, or incur massive charges. Always keep credentials on the server side.

**Q4: What is CORS and why is it needed for S3 uploads from a browser?**
> CORS (Cross-Origin Resource Sharing) is a browser security mechanism. When a browser at `localhost:3000` tries to upload to `bucket.s3.amazonaws.com`, these are different origins. The browser blocks this unless S3's CORS configuration explicitly allows requests from your origin. Without CORS config, presigned URL uploads from the browser will fail.

**Q5: How would you handle large file uploads (> 100 MB) to S3?**
> Use multipart upload: break the file into chunks (5-100 MB each), upload each chunk separately (can be parallel), then tell S3 to assemble them. AWS SDK provides high-level utilities for this (Upload class). For browser uploads, use a library like `@aws-sdk/lib-storage` or implement chunked uploads with presigned URLs.

**Q6: What is the difference between AWS SDK v2 and v3?**
> SDK v3 is modular — you install only the packages you need (e.g., `@aws-sdk/client-s3`). SDK v2 (`aws-sdk`) bundles everything in one huge package. V3 has smaller bundle size, tree-shaking support, middleware stack architecture, and built-in TypeScript types. V3 uses Command pattern (e.g., `PutObjectCommand`) instead of callback-based methods.

**Q7: How do you validate files before uploading to S3?**
> Validate on both client and server: 1) File type (MIME type and extension), 2) File size (reject files over limit), 3) File name (sanitize to prevent path traversal). Client-side validation for UX, server-side validation for security (client-side can be bypassed).

**Q8: How would you implement file upload progress in a Next.js app?**
> Use `XMLHttpRequest` instead of `fetch()` for the upload. XHR provides an `upload.onprogress` event that fires with `loaded` and `total` bytes. Calculate percentage as `(loaded / total) * 100`. `fetch()` does not natively support upload progress events.

**Q9: What IAM permissions does a Next.js app need for S3 uploads?**
> Minimum: `s3:PutObject` (upload), `s3:GetObject` (download/view), `s3:DeleteObject` (delete), `s3:ListBucket` (list files). Restrict the Resource to your specific bucket and prefix (e.g., `arn:aws:s3:::bucket/uploads/*`). Follow the principle of least privilege.

**Q10: How do you secure an S3 bucket used for user uploads?**
> 1) Block public access (unless files should be public), 2) Use presigned URLs for viewing private files, 3) Validate and sanitize file names on the server, 4) Set file size limits, 5) Scan uploaded files for malware (using Lambda + ClamAV), 6) Use separate S3 prefixes per user, 7) Enable bucket versioning, 8) Enable access logging, 9) Set lifecycle rules to delete old files.

**Q11: How would you display uploaded images in a Next.js app?**
> If files are public: use the S3 URL directly in an `<img>` tag. If private: generate a presigned GET URL on the server, pass it to the frontend. For optimization: use Next.js `<Image>` component with the S3 URL (add the S3 domain to `next.config.mjs` images.remotePatterns). Consider using CloudFront for better performance.

**Q12: What happens if the presigned URL expires before the upload completes?**
> The upload will fail with an "Access Denied" or "Request has expired" error. Solution: set a longer expiration time (e.g., 15 minutes for large files), implement retry logic on the frontend, or use multipart upload where each part has its own presigned URL.

---

## 🚀 What's Next?

Congratulations! You've built a complete file upload system with Next.js and S3. Here are ideas to extend it:

- **Add image optimization** — Resize uploaded images using Sharp
- **Add file previews** — Show image thumbnails before uploading
- **Add user authentication** — Only allow logged-in users to upload
- **Add per-user folders** — Organize files by user ID in S3
- **Add CloudFront CDN** — Serve uploaded files faster globally
- **Add Lambda processing** — Automatically process uploaded files (thumbnails, transcoding)
- **Add virus scanning** — Scan uploaded files for malware before storing
