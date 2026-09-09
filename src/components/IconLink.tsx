interface IconLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  openInNewTab?: boolean;
}

export const IconLink = ({
  href,
  icon,
  label,
  openInNewTab = false,
}: IconLinkProps) => {
  return (
    <a
      href={href}
      aria-label={label}
      target={openInNewTab ? "_blank" : undefined}
      rel={openInNewTab ? "noopener noreferrer" : undefined}
      className="text-inherit no-underline"
    >
      {icon}
    </a>
  );
};
