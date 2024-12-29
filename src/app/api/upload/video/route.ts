import { NextRequest, NextResponse } from "next/server";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import { tmpdir } from "os";
import path from "path";

const uploadsDir = path.resolve("uploads");

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
/*
const getVideoDuration = async (buffer: Buffer) => {
    const tempFilePath = path.join(tmpdir(), `temp-video-${Date.now()}.mp4`);

    // Save the buffer to a temporary file
    fs.writeFileSync(tempFilePath, buffer);

    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(tempFilePath, (err, metadata) => {
            // Delete the temporary file after getting the duration
            fs.unlink(tempFilePath, (unlinkErr) => {
                if (unlinkErr) {
                    return reject("Error deleting temporary file: " + unlinkErr.message);
                }
            });

            if (err) {
                return reject("Error getting video metadata: " + err.message);
            }

            const duration = metadata.format.duration;

            resolve(duration);
        });
    });
};
*/

const compressVideo = async (file: File) => {
    if (file.type !== "video/mp4") {
        return { error: "Uploaded file is not a valid MP4 video." };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const tempFilePath = path.join(tmpdir(), `temp-video-${Date.now()}.mp4`);
    const outputFilePath = path.join(tmpdir(), `compressed-video-${Date.now()}.mp4`);
    const outputThumbnailPath = path.join(tmpdir(), `thumbnail-${Date.now()}.jpg`);

    // Save the buffer to a temporary file
    fs.writeFileSync(tempFilePath, buffer);
    /*
     You can use this function to get the seconds and check the size accordingly if needed.
     const duration = (await getVideoDuration(buffer)) as any;
     if (duration > 31) {
         fs.unlinkSync(tempFilePath);
         return { error: "Video length exceeds the maximum allowed duration of 30 seconds." };
     }
    */

    return new Promise((resolve, reject) => {
        // First compress the video
        ffmpeg(tempFilePath)
            .inputFormat("mp4")
            // Add compression settings
            .videoCodec("libx264")
            .size("720x?") // Resize to 720p width, maintain aspect ratio
            .videoBitrate("1000k") // Lower bitrate for compression
            .outputOptions([
                "-preset faster", // Faster encoding
                "-crf 28", // Compression quality (23-28 is usually good)
                "-movflags +faststart", // Web optimized
            ])
            .output(outputFilePath)
            .on("start", () => {})
            .on("progress", () => {})
            .on("error", (error) => {
                try {
                    fs.unlinkSync(tempFilePath);
                    if (fs.existsSync(outputFilePath)) fs.unlinkSync(outputFilePath);
                } catch (cleanupError) {}
                reject("Error compressing video: " + error.message);
            })
            .on("end", () => {
                // Now generate thumbnail
                ffmpeg(outputFilePath)
                    .inputFormat("mp4")
                    .outputOptions("-vframes 1") // Extract only the first frame
                    .output(outputThumbnailPath)
                    .on("error", (error) => {
                        reject("Error generating thumbnail: " + error.message);
                    })
                    .on("end", async () => {
                        try {
                            // Read both compressed video and thumbnail as base64
                            const compressedVideoData = fs.readFileSync(outputFilePath);
                            const thumbnailData = fs.readFileSync(outputThumbnailPath);

                            const videoBase64 = compressedVideoData.toString("base64");
                            const thumbnailBase64 = `data:image/jpeg;base64,${thumbnailData.toString("base64")}`;

                            // Clean up temporary files
                            fs.unlinkSync(tempFilePath);
                            fs.unlinkSync(outputFilePath);
                            fs.unlinkSync(outputThumbnailPath);

                            resolve({
                                base64: videoBase64,
                                thumbnail: thumbnailBase64,
                            });
                        } catch (error: any) {
                            reject("Error processing files: " + error.message);
                        }
                    })
                    .run();
            })
            .run();
    });
};

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const videoFile = formData.get("file");

    if (!videoFile) {
        return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    try {
        const compressedVideo = (await compressVideo(videoFile as any)) as any;

        if (compressedVideo.error) {
            return NextResponse.json({ error: compressedVideo.error }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: "Video compressed successfully.",
            compressedVideo: compressedVideo,
            thumbnail: compressedVideo.thumbnail,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                error: "Error compressing video: " + error.message,
            },
            { status: 500 }
        );
    }
}
