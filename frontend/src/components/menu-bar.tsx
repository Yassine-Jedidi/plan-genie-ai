import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";

function MenuBar() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="relative md:hidden">
      {" "}
      {/* Only visible on small screens */}
      <Button
        className="group"
        variant="outline"
        size="icon"
        onClick={() => setOpen((prevState) => !prevState)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </Button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 shadow-lg rounded-lg py-2 z-50">
          <a
            href="#features"
            className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Pricing
          </a>
          <a
            href="#contact"
            className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Contact
          </a>
        </div>
      )}
    </div>
  );
}

export { MenuBar };
