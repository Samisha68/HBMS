import { BedDouble, Zap } from "lucide-react"

export function Logo({ className = "", size = "default" }: { className?: string; size?: "default" | "large" | "small" }) {
  const getSizeClasses = () => {
    switch (size) {
      case "large":
        return "text-3xl gap-3"
      case "small":
        return "text-lg gap-1.5"
      default:
        return "text-2xl gap-2"
    }
  }

  return (
    <div className={`flex items-center ${getSizeClasses()} ${className}`}>
      <div className="relative">
        <BedDouble className="text-primary" />
        <Zap className="absolute -right-1 -top-1 h-4 w-4 text-primary" />
      </div>
      <span className="font-bold">
        <span className="text-primary">Swift</span>
        <span>Bed</span>
      </span>
    </div>
  )
} 