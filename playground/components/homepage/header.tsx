import Image from 'next/legacy/image';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from '@nextui-org/react';
import { cn } from '@nextui-org/react';
import { Icon } from '@iconify/react';

const Logo = ({
  width = 24,
  height = 24,
}: {
  width: number;
  height: number;
}) => {
  return (
    <Image
      src="/img/logo.jpeg"
      alt="Logo"
      width={width}
      height={height}
      priority
      className="object-contain"
    />
  );
};

export default function Header({ className }: { className: string }) {
  return (
    <Navbar
      className={cn('w-full max-w-full flex-grow flex-1', className)}
      position="static"
      maxWidth="full"
    >
      <NavbarBrand>
        <Logo width={32} height={32} />
        <span className="font-bold text-inherit ml-2 mr-2">
          OpenAssistant &gt;
        </span>
        Playground
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#"></Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            as={Link}
            href="https://github.com/geodacenter/openassistant"
            variant="light"
            startContent={<Icon icon="mdi:github" width={32} />}
          >
            Source Code
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button
            as={Link}
            href="https://openassistant-doc.vercel.app"
            variant="light"
            startContent={<Icon icon="bxs:file-doc" width={32} />}
          >
            Documentation
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
