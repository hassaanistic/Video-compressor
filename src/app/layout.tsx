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
            <head>
                <link rel="icon" href="/icon.png" sizes="any" />
                <meta name="robots" content="noindex, nofollow" />
            </head>
            <body>{children}</body>
        </html>
    );
}
