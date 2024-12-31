"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Download, Github, Linkedin, Mail, Upload, Video, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export default function UploadVideoComponent() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertType, setAlertType] = useState<"success" | "error" | null>(null);
    const [compressedVideo, setCompressedVideo] = useState<string | null>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAlertMessage(null);
        const files = event.target.files;
        if (files && files[0]) {
            const file = files[0];
            if (file.type !== "video/mp4") {
                setAlertMessage("Please upload an MP4 video file.");
                setAlertType("error");
                return;
            }

            // Check file size (50MB = 50 * 1024 * 1024 bytes) // you can remove this code for testing locally I am just making this check because of low bandwidth issues on free server
            if (file.size > 50 * 1024 * 1024) {
                setAlertMessage("File size exceeds 50MB limit. Please upload a smaller video.");
                setAlertType("error");
                return;
            }

            setSelectedFile(file);
            setVideoPreview(URL.createObjectURL(file));
            setCompressedVideo(null);
        }
    };
    const handleUpload = async () => {
        if (!selectedFile) {
            setAlertMessage("Please select a video file first.");
            setAlertType("error");
            return;
        }

        setIsUploading(true);
        setAlertMessage(null);

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);

            const response = await fetch("/api/upload/video", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (result.error) {
                throw new Error(result.error);
            }

            setCompressedVideo(result.compressedVideo.base64);
            setAlertMessage("Video compressed successfully!");
            setTimeout(() => setAlertMessage(null), 3000);
            setAlertType("success");
        } catch (error: any) {
            setAlertMessage("Error processing video: " + error.message);
            setAlertType("error");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDownload = () => {
        if (!compressedVideo) return;

        const byteCharacters = atob(compressedVideo);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "video/mp4" });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "compressed-video.mp4");
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setVideoPreview(null);
        setCompressedVideo(null);
    };

    return (
        <div className="min-h-screen pb-4 bg-gradient-to-b from-gray-900 to-black text-white">
            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-6">
                        <Video className="h-16 w-16 text-blue-500" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Video Compression Tool</h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        FFmpeg powers high-quality video compression for files of any size. Due to server limitations, this demo is capped at 50MB.
                        For larger videos, install locally from our{" "}
                        <a
                            href="https://github.com/hassaanistic/Video-compressor"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                        >
                            GitHub repository
                        </a>
                        {" "}with complete setup instructions.
                    </p>
                </div>

                {/* Contact Section moved up */}
                <div className="flex justify-center space-x-6 mb-8 flex-wrap">
                    <a
                        href="https://github.com/hassaanistic"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-400 hover:text-blue-500 transition-colors"
                    >
                        <Github className="h-5 w-5 mr-2" />
                        <span>hassaanistic</span>
                    </a>
                    <a
                        href="https://www.linkedin.com/in/hassaanistic/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-400 hover:text-blue-500 transition-colors"
                    >
                        <Linkedin className="h-5 w-5 mr-2" />
                        <span>hassaanistic</span>
                    </a>
                    <a
                        href="mailto:imhassaan.dev@gmail.com"
                        className="flex items-center text-gray-400 hover:text-blue-500 transition-colors"
                    >
                        <Mail className="h-5 w-5 mr-2" />
                        <span>imhassaan.dev@gmail.com</span>
                    </a>
                </div>

                {/* Separator line */}
                <div className="w-32 h-1 bg-blue-500 mx-auto rounded-full"></div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto">
                <Card className="bg-gray-800 border-gray-700 mx-2">
                    <CardHeader>
                        <CardTitle>Upload Your Video</CardTitle>
                        <CardDescription className="text-gray-400">
                            MP4 format only. Maximum file size: 50MB
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Upload Area */}
                            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                                {videoPreview ? (
                                    <div className="relative max-w-md mx-auto">
                                        <video
                                            src={videoPreview}
                                            controls
                                            className="rounded w-full h-auto"
                                            style={{ maxHeight: "300px" }}
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70"
                                            onClick={handleRemoveFile}
                                        >
                                            <X className="h-4 w-4 text-white" />
                                        </Button>
                                    </div>
                                ) : (
                                    <Label htmlFor="video-upload" className="cursor-pointer block">
                                        <div className="flex flex-col items-center p-8 hover:bg-gray-700/50 rounded-lg transition-colors">
                                            <Upload className="h-16 w-16 mb-4 text-blue-500" />
                                            <span className="text-xl font-semibold mb-2">Drag & drop or click to upload</span>
                                            <span className="text-gray-400">MP4 format only (max 50MB)</span>
                                        </div>
                                        <Input
                                            id="video-upload"
                                            type="file"
                                            accept="video/mp4"
                                            className="hidden"
                                            onChange={handleFileSelect}
                                        />
                                    </Label>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button className="flex-1 max-w-xs mx-auto" onClick={handleUpload} disabled={!selectedFile || isUploading}>
                                    {isUploading ? (
                                        <span>Processing...</span>
                                    ) : (
                                        <>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Process Video
                                        </>
                                    )}
                                </Button>

                                {compressedVideo && (
                                    <Button
                                        className="flex-1 max-w-xs mx-auto bg-green-600"
                                        onClick={handleDownload}
                                        disabled={isUploading}
                                    >
                                        <Download className="mr-2 h-4 w-4" />
                                        Download Compressed
                                    </Button>
                                )}
                            </div>

                            {/* Alert Message */}
                            {alertMessage && (
                                <div
                                    className={`p-4 rounded-lg text-center ${alertType === "success" ? "bg-green-800/50 text-green-200" : "bg-red-800/50 text-red-200"
                                    }`}
                                >
                                    {alertMessage}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Features Section */}
                <div className="grid md:grid-cols-3 gap-6 mt-12 mx-2">
                    <div className="p-6 bg-gray-800 rounded-lg">
                        <h3 className="text-xl font-semibold mb-3">FFmpeg Powered</h3>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            FFmpeg powers high-quality video compression for files of any size.
                            <span className="block">

                                <a
                                    href="https://github.com/hassaanistic/Video-compressor"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    GitHub repository
                                </a>
                                {" "}with complete setup instructions.
                            </span>

                        </p>
                    </div>
                    <div className="p-6 bg-gray-800 rounded-lg">
                        <h3 className="text-xl font-semibold mb-3">Secure Processing</h3>
                        <p className="text-gray-400">Server-side FFmpeg processing with no data retention.</p>
                    </div>
                    <div className="p-6 bg-gray-800 rounded-lg">
                        <h3 className="text-xl font-semibold mb-3">Optimized Output</h3>
                        <p className="text-gray-400">Balanced compression settings for quality retention.</p>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="mt-12 text-center">
                    <h2 className="text-2xl font-bold mb-6">Contact & Development</h2>
                    <div className="flex justify-center space-x-6">
                        <a
                            href="https://github.com/hassaanistic"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-gray-400 hover:text-blue-500"
                        >
                            <Github className="h-6 w-6 mr-2" />
                            GitHub
                        </a>
                        <a
                            href="https://www.linkedin.com/in/hassaanistic/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-gray-400 hover:text-blue-500"
                        >
                            <Linkedin className="h-6 w-6 mr-2" />
                            LinkedIn
                        </a>
                        <a href="mailto:imhassaan.dev@gmail.com" className="flex items-center text-gray-400 hover:text-blue-500">
                            <Mail className="h-6 w-6 mr-2" />
                            Email
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
