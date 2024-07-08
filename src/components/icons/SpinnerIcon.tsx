import { Props } from "./type";

export default function SpinnerIcon(props: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      width="129"
      height="129"
      style="shape-rendering: auto; display: block; background: rgb(255, 255, 255);"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <g>
        <circle
          stroke-dasharray="188.49555921538757 64.83185307179586"
          r="40"
          stroke-width="9"
          stroke="#0094ff"
          fill="none"
          cy="50"
          cx="50"
        >
          <animateTransform
            keyTimes="0;1"
            values="0 50 50;360 50 50"
            dur="1.3888888888888888s"
            repeatCount="indefinite"
            type="rotate"
            attributeName="transform"
          />
        </circle>
        <g />
      </g>
    </svg>
  );
}
