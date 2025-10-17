// widget-src/components/ui/atoms/MessageAtoms.tsx

// Dependencies
const { Frame, AutoLayout, Text, SVG } = figma.widget
// Components
import { remapTokens } from "@/utils"

/** Import Changelog
 * Tail Atom (Merged In Out with props)
 * Add color object (surface) at Atom & Status (handle theme mode with remapTokens() from utils )
 * Add ReqCompProps (theme) to Atom & Status
 * Handle all svg paths outside the return jsx statement, as const
 */

interface StatusAtomProps extends Partial<AutoLayoutProps> {
  /** Status color */
  color: Color
  status?: "read" | "pending" | "sent" | "received"
  dir: number
  /** НОВОЕ: время сообщения (HH:MM) */
  time?: string
}

export function StatusAtom({ color, dir, time, ...props }: StatusAtomProps) {
  const svgPaths = {
    doubleCheck: `<svg width='14' height='9' viewBox='0 0 14 9' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path d='M6.63361 7.62383L13.1336 0.703371C13.3215 0.503315 13.6379 0.491731 13.8402 0.677497C14.0201 0.842623 14.0493 1.1081 13.9217 1.30556L13.8664 1.37609L7.3664 8.29654C7.1785 8.4966 6.86213 8.50818 6.65978 8.32242C6.47991 8.15729 6.45066 7.89182 6.57835 7.69436L6.63361 7.62383L13.1336 0.703371L6.63361 7.62383Z' fill='${color}'/>
          <path d='M3.43573 7.24034L9.63521 0.701674C9.82405 0.502492 10.1405 0.492377 10.3419 0.67908C10.521 0.845038 10.549 1.11065 10.4204 1.30751L10.3648 1.37779L3.80333 8.29824C3.62866 8.48246 3.34667 8.50393 3.14702 8.36193L3.07639 8.30101L0.137853 5.24922C-0.0525441 5.05148 -0.0447525 4.73859 0.155256 4.55036C0.333042 4.38304 0.602859 4.37053 0.794346 4.5087L0.862149 4.56756L3.43573 7.24034L9.63521 0.701674L3.43573 7.24034Z' fill='${color}'/>
        </svg>
        `,
  }

  return (
    <AutoLayout
      name="StatusAtom"
      overflow="visible"
      spacing={3}
      horizontalAlignItems="end"
      verticalAlignItems="center"
      {...props}
    >
      <Text
        name="time"
        fill={color}
        horizontalAlignText="right"
        fontSize={11}
        italic={true}
        fontWeight={500}
        strokeWidth={0}
        strokeAlign="center"
      >
        {time ?? "10:15"}
      </Text>
      <Frame hidden={dir === 0} name="double-check" strokeWidth={0} overflow="visible" width={14} height={7.909}>
        <SVG name="Path_Path" height={8} width={14} src={svgPaths.doubleCheck} />
      </Frame>
    </AutoLayout>
  )
}

interface TailAtomProps extends ReqCompProps, Partial<FrameProps> {
  dir: number
}

export function TailAtom({ dir, theme, ...props }: TailAtomProps) {
  // Theme Mode
  const color = remapTokens({
    surface: {
      In: { dark: "#262628", light: "white" },
      Out: { dark: "#363638", light: "#E1FEC6" },
    },
    text: {},
  })[theme]

  // dir Prop
  const svgPaths = {
    tail: [
      `<svg width='14' height='21' viewBox='0 0 14 21' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M6.0874 4.2408C6.07746 4.00483 6.07243 3.76761 6.07243 3.52922C6.07243 0.329218 10.3115 -0.137449 12.431 0.0292181C13.5977 4.60169 15.231 14.3249 12.431 16.6379C9.23879 19.4306 5.15531 20.5878 0.180569 20.1094C0.117102 20.1033 0.0603914 20.0676 0.0279045 20.0134C-0.0283432 19.9194 0.00307751 19.7982 0.0980797 19.7426L0.457226 19.5283C2.81102 18.0973 4.35045 16.615 5.0755 15.0814C5.85649 13.4294 6.19381 9.81615 6.0874 4.2408Z' fill='${color.surface.In}'/></svg>`,
      `<svg width='14' height='21' viewBox='0 0 14 21' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M7.88965 4.2408C7.89959 4.00483 7.90462 3.76761 7.90462 3.52922C7.90462 0.329218 3.66556 -0.137449 1.54602 0.0292181C0.379358 4.60169 -1.25398 14.3249 1.54602 16.6379C4.73826 19.4306 8.82174 20.5878 13.7965 20.1094C13.8599 20.1033 13.9167 20.0676 13.9491 20.0134C14.0054 19.9194 13.974 19.7982 13.879 19.7426L13.5198 19.5283C11.166 18.0973 9.62661 16.615 8.90155 15.0814C8.12056 13.4294 7.78325 9.81615 7.88965 4.2408Z' fill='${color.surface.Out}'/></svg>`,
    ],
  }

  return (
    <Frame name={`TailAtom${dir}`} overflow="visible" width={13.977} height={20.214} {...props}>
      <SVG
        name="Tail"
        x={{
          type: "horizontal-scale",
          leftOffsetPercent: 0,
          rightOffsetPercent: 0,
        }}
        y={{
          type: "vertical-scale",
          topOffsetPercent: 0,
          bottomOffsetPercent: 0,
        }}
        height={20}
        width={14}
        src={svgPaths.tail[dir]}
      />
    </Frame>
  )
}
