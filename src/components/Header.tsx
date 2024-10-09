import { HeaderLogin } from "@/components/HeaderLogin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Github, Menu, Search, X } from "lucide-react"
import { Link, useLocation } from "wouter"
import HeaderDropdown from "./HeaderDropdown"
import { useState } from "react"
import { DiscordLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons"

const HeaderButton = ({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) => {
  const [location] = useLocation()

  if (location === href) {
    return (
      <Button
        variant="ghost"
        className={`border-b-2 rounded-none border-blue-600 ${className}`}
      >
        {children}
      </Button>
    )
  }

  return (
    <Link className={className} href={href}>
      <Button className={className} variant="ghost">
        {children}
      </Button>
    </Link>
  )
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="px-4 py-3">
      <div className="flex items-center">
        <Link href="/" className="text-lg font-semibold whitespace-nowrap">
          <span className="bg-blue-500 px-2 py-1 rounded-md text-white">
            tscircuit
          </span>{" "}
          <span className="text-gray-800">snippets</span>
        </Link>
        <div className="hidden md:flex items-center space-x-4">
          <nav>
            <ul className="flex items-center gap-2 ml-2">
              <li>
                <HeaderButton href="/dashboard">Dashboard</HeaderButton>
              </li>
              <li>
                <HeaderButton href="/newest">Newest</HeaderButton>
              </li>
              <li>
                <HeaderButton href="/quickstart">Editor</HeaderButton>
              </li>
              <li>
                <HeaderButton href="/ai">AI</HeaderButton>
              </li>
              <li>
                <Link href="https://docs.tscircuit.com">
                  <Button variant="ghost">Docs</Button>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex-grow"></div>
        <a
          href="https://github.com/tscircuit/tscircuit"
          target="_blank"
          className="mr-4"
        >
          <GitHubLogoIcon className="text-gray-400 hover:text-gray-600 transition-colors" />
        </a>
        {/* <a href="https://tscircuit.com/join" target="_blank" className="mr-2">
          <DiscordLogoIcon className="text-gray-400 hover:text-gray-600 transition-colors" />
        </a> */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative">
            <Search
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              type="search"
              placeholder="Search"
              className="pl-8 focus:border-blue-500 placeholder-gray-400"
            />
          </div>
          <HeaderDropdown />
          <HeaderLogin />
        </div>
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden mt-4">
          <nav className="mb-4">
            <ul className="flex flex-col gap-2 w-full">
              <li>
                <HeaderButton
                  className="w-full justify-start"
                  href="/dashboard"
                >
                  Dashboard
                </HeaderButton>
              </li>
              <li>
                <HeaderButton className="w-full justify-start" href="/newest">
                  Newest
                </HeaderButton>
              </li>
              <li>
                <HeaderButton
                  className="w-full justify-start"
                  href="/quickstart"
                >
                  Editor
                </HeaderButton>
              </li>
              <li>
                <HeaderButton className="w-full justify-start" href="/ai">
                  AI
                </HeaderButton>
              </li>
              <li>
                <HeaderButton
                  className="w-full justify-start"
                  href="https://docs.tscircuit.com"
                >
                  Docs
                </HeaderButton>
              </li>
            </ul>
          </nav>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                type="search"
                placeholder="Search"
                className="pl-8 focus:border-blue-500 placeholder-gray-400"
              />
            </div>
            <HeaderDropdown />
            <HeaderLogin />
          </div>
        </div>
      )}
    </header>
  )
}
