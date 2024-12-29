export const metadata = {
    title: "Video Compressor",
    description: "Easy and free solution.",
};
export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
