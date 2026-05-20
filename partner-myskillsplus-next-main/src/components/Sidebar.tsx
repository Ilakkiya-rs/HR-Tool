import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    DollarSign,
    Settings,
} from "lucide-react";

export default function Sidebar() {
    const pathname = usePathname();


    const menuItems = [
        {
            href: "/partner/dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
            active: pathname === "/partner/dashboard"
        },
        {
            href: "/partner/referrals",
            label: "Referrals",
            icon: Users,
            active: pathname === "/partner/referrals"
        },
        {
            href: "/partner/earnings",
            label: "Earnings & Payouts",
            icon: DollarSign,
            active: pathname === "/partner/earnings"
        },
        {
            href: "/partner/settings",
            label: "Settings",
            icon: Settings,
            active: pathname === "/partner/settings"
        }
    ];

    return (
        <aside className="w-64 bg-white border-r border-[#EEEEEE] min-h-screen">
            <div className="p-6">
                <div className="flex items-center space-x-2 mb-8">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">MS</span>
                    </div>
                    <span className="font-bold text-xl text-[#212121]">Partner Portal</span>
                </div>

                <nav className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${item.active
                                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                                        : "text-[#616161] hover:bg-[#FAFAFA]"
                                    }`}
                            >
                                <Icon
                                    className={`h-5 w-5 ${item.active ? "text-blue-700" : "text-[#BDBDBD]"}`}
                                />
                                <span className={`font-medium ${item.active ? "text-blue-700" : ""}`}>
                                    {item.label}
                                </span>
                            </Link>

                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}