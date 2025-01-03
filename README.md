# FFmpeg Video Optimizer 🎥

A modern web-based video compression tool powered by FFmpeg, offering efficient video optimization while maintaining quality.

## 🌟 Features

- **FFmpeg Integration**: Industry-standard compression algorithms
- **Quality Preservation**: Smart compression without significant quality loss
- **Format Support**: MP4 video processing
- **Duration Check**: Built-in video duration validation
- **Responsive UI**: Modern, user-friendly interface

## 🚀 Live Demo

[Live Demo](https://video-compressor-4gjz.onrender.com/) (Limited to 50MB due to server constraints)

## ⚡ Why FFmpeg?

FFmpeg is trusted by industry leaders:
- Netflix (Video processing)
- YouTube (Media transcoding)
- Facebook (Video optimization)
- Instagram (Video compression)

### Benefits:
- High-quality compression
- Fast processing speeds
- Extensive format support
- Reliable performance
- Active community support

## 💻 Local Installation

```bash
# Clone repository
git clone https://github.com/hassaanistic/Video-compressor.git

# Install dependencies
cd Video-compressor
npm install

# Install FFmpeg
# Windows: Use chocolatey
choco install ffmpeg

# Mac
brew install ffmpeg

# Ubuntu
sudo apt install ffmpeg

# Start development server
npm run dev
```

## 🛠️ Technical Details

### Server Configuration
```javascript
// Duration check function (optional)
const getVideoDuration = async (buffer) => {
    const tempFilePath = path.join(tmpdir(), `temp-video-${Date.now()}.mp4`);
    fs.writeFileSync(tempFilePath, buffer);
    
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(tempFilePath, (err, metadata) => {
            // Clean up temp file
            fs.unlink(tempFilePath, (unlinkErr) => {
                if (unlinkErr) reject("Cleanup error: " + unlinkErr.message);
            });
            
            if (err) reject("Metadata error: " + err.message);
            resolve(metadata.format.duration);
        });
    });
};
```

## 🎯 Local vs Online Version

- **Online Demo**: Limited to 50MB due to server constraints
- **Local Installation**: No size limits, faster processing

## 🔓 Removing Size Limits

To process larger videos locally, remove these size checks:

1. In `/app/api/upload/video/route.ts`:
```typescript
// Remove or modify this check
if (videoFile.size > 50 * 1024 * 1024) {
    return NextResponse.json({ 
        error: "File size exceeds 50MB limit." 
    }, { status: 400 });
}
```

2. In `UploadVideoComponent.tsx`:
```typescript
// Remove or modify this check
if (file.size > 50 * 1024 * 1024) {
    setAlertMessage("File size exceeds 50MB limit. Please upload a smaller video.");
    setAlertType("error");
    return;
}
```

Note: Size limits are implemented only for demo server constraints. Local installations can handle larger files based on your system's capabilities.


## 📝 License

MIT License

## 👨‍💻 Developer

- [Hassaan](https://github.com/hassaanistic)
- [LinkedIn](https://www.linkedin.com/in/hassaanistic/)
- [Email](mailto:imhassaan.dev@gmail.com)
