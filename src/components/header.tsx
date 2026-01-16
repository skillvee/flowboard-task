import Link from "next/link";
import { Avatar } from "./ui/avatar";
import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="font-semibold text-xl text-gray-900">
              FlowBoard
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/projects"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Projects
            </Link>
            <Link
              href="/tasks"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              My Tasks
            </Link>
            <Link
              href="/team"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Team
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Notification Bell - Placeholder for the task */}
            <Button variant="ghost" size="icon" className="relative">
              <BellIcon className="w-5 h-5" />
              {/* Unread badge would go here */}
            </Button>

            {/* User Avatar */}
            <Avatar name="User" size="sm" />
          </div>
        </div>
      </div>
    </header>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
      />
    </svg>
  );
}
