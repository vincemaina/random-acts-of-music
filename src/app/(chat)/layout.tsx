import Header from "@/components/landing/header"

export default function AdsenseLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col md:flex-row">
            <div className="h-[100px] md:h-auto md:w-[200px] p-2 bg-gray-50"></div>
            <main className="flex-auto">
                <div className="h-[100dvh] flex flex-col p-4">
                    <Header />
                    {children}
                </div>
            </main>
            <div className="h-[100px] md:h-auto md:w-[200px] p-2 bg-gray-50 hidden lg:block"></div>
        </div>
    )
}