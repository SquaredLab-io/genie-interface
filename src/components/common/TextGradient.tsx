import clsx from "clsx";

/**
 *
 * @param className Gradient colors from, via, and to.
 * @param children Text
 * @returns A span tag with gradient text.
 */
const TextGradient = ({
  className,
  children
}: {
  className: string;
  children: string;
}) => {
  return (
    <span className={clsx("bg-gradient-to-r text-transparent bg-clip-text", className)}>
      {children}
    </span>
  );
};

export default TextGradient;
