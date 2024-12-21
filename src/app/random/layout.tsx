export default function AdsenseLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col md:flex-row">
            <div className="h-[100px] md:h-auto md:w-[200px] p-2 bg-gray-50"></div>
            <main className="flex-auto">{children}</main>
            <div className="h-[100px] md:h-auto md:w-[200px] p-2 bg-gray-50 hidden lg:block"></div>
        </div>
    )
}