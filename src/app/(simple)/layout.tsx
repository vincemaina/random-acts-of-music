import Header from "@/components/landing/header"

export default function SimpleLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="p-16">
            <div>
                <Header />
                {children}
            </div>
        </main>
    )
}