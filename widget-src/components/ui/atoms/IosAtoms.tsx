// widget-src/components/ui/atoms/IosHeaderStatus.tsx

// Dependencies
const { Frame, AutoLayout, Rectangle, SVG, Text } = figma.widget
// Components
import { remapTokens } from "@/utils"

/** Import Changelog
 * - Добавлен проп system?: SystemBar
 * - Время рендерится через <Text> из system.phoneTime
 * - Индикатор батареи: ширина по system.batteryPercent, подсветка при charging
 */

interface IosHeaderProps extends ReqCompProps, Partial<AutoLayoutProps> {
  system?: SystemBar
}

export function IosHeaderStatus({ theme, system, ...props }: IosHeaderProps) {
  // Theme Mode
  const color = remapTokens({
    surface: {},
    text: {
      status: { dark: "#FFF", light: "#000" },
      faint: { dark: "#FFFFFF80", light: "#00000080" },
      charge: { dark: "#34C759", light: "#34C759" }, // зелёный для charging
    },
  })[theme]

  const svgPaths = {
    mobile: `<svg width='18' height='12' viewBox='0 0 18 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
  <path fill-rule='evenodd' clip-rule='evenodd' d='M1.2276 7.33333H2.2276C2.77988 7.33333 3.2276 7.78105 3.2276 8.33333V10.3333C3.2276 10.8856 2.77988 11.3333 2.2276 11.3333H1.2276C0.675315 11.3333 0.2276 10.8856 0.2276 10.3333V8.33333C0.2276 7.78105 0.675315 7.33333 1.2276 7.33333ZM5.89427 5.33333H6.89427C7.44655 5.33333 7.89427 5.78105 7.89427 6.33333V10.3333C7.89427 10.8856 7.44655 11.3333 6.89427 11.3333H5.89427C5.34198 11.3333 4.89427 10.8856 4.89427 10.3333V6.33333C4.89427 5.78105 5.34198 5.33333 5.89427 5.33333ZM10.5609 3H11.5609C12.1132 3 12.5609 3.44771 12.5609 4V10.3333C12.5609 10.8856 12.1132 11.3333 11.5609 11.3333H10.5609C10.0086 11.3333 9.56093 10.8856 9.56093 10.3333V4C9.56093 3.44771 10.0086 3 10.5609 3ZM15.2276 0.666664H16.2276C16.7799 0.666664 17.2276 1.11438 17.2276 1.66666V10.3333C17.2276 10.8856 16.7799 11.3333 16.2276 11.3333H15.2276C14.6753 11.3333 14.2276 10.8856 14.2276 10.3333V1.66666C14.2276 1.11438 14.6753 0.666664 15.2276 0.666664Z' fill='${color.text.status}'/>
  </svg>`,
    wifi: `<svg width='16' height='12' viewBox='0 0 16 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
  <path fill-rule='evenodd' clip-rule='evenodd' d='M7.86421 2.79454C10.0801 2.79464 12.2113 3.64607 13.8172 5.17287C13.9381 5.29075 14.1314 5.28926 14.2505 5.16954L15.4065 4.00287C15.4668 3.94215 15.5005 3.8599 15.5 3.77432C15.4995 3.68874 15.4649 3.60689 15.4039 3.54687C11.1888 -0.492675 4.53897 -0.492675 0.323873 3.54687C0.262814 3.60684 0.22817 3.68867 0.227607 3.77425C0.227044 3.85983 0.260608 3.94211 0.320873 4.00287L1.47721 5.16954C1.59623 5.28944 1.78968 5.29093 1.91054 5.17287C3.51669 3.64597 5.6481 2.79453 7.86421 2.79454ZM7.86421 6.59021C9.0817 6.59013 10.2557 7.04266 11.1582 7.85987C11.2803 7.97585 11.4726 7.97334 11.5915 7.85421L12.7462 6.68754C12.807 6.62634 12.8408 6.54333 12.8399 6.45706C12.839 6.3708 12.8036 6.28849 12.7415 6.22854C9.99334 3.67216 5.7374 3.67216 2.98921 6.22854C2.92713 6.28848 2.89171 6.37084 2.8909 6.45713C2.89008 6.54342 2.92394 6.62643 2.98487 6.68754L4.13921 7.85421C4.25819 7.97334 4.45048 7.97585 4.57254 7.85987C5.47441 7.0432 6.64752 6.59071 7.86421 6.59021ZM10.0832 9.37454C10.145 9.31393 10.179 9.23053 10.1772 9.14402C10.1754 9.05752 10.138 8.97557 10.0739 8.91754C8.7983 7.83866 6.93011 7.83866 5.65454 8.91754C5.59032 8.97553 5.55287 9.05744 5.55104 9.14395C5.54921 9.23046 5.58316 9.31389 5.64487 9.37454L7.64254 11.3902C7.70109 11.4494 7.78092 11.4828 7.86421 11.4828C7.9475 11.4828 8.02732 11.4494 8.08587 11.3902L10.0832 9.37454Z' fill='${color.text.status}'/>
  </svg>`,
    batteryTip: `<svg width='23' height='12' viewBox='0 0 23 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
  <path opacity='0.34' fill-rule='evenodd' clip-rule='evenodd' d='M2.99998 0.75C1.61927 0.75 0.499977 1.86929 0.499977 3.25V8.75C0.499977 10.1307 1.61926 11.25 2.99997 11.25H18.9686H20C21.3807 11.25 22.5 10.1307 22.5 8.75V3.25C22.5 1.86929 21.3807 0.75 20 0.75H2.99998ZM3.49998 1.75C2.39541 1.75 1.49998 2.64543 1.49998 3.75V8.25C1.49998 9.35457 2.39541 10.25 3.49998 10.25H17.9686H19.5C20.6045 10.25 21.5 9.35457 21.5 8.25V3.75C21.5 2.64543 20.6045 1.75 19.5 1.75H3.49998Z' fill='${color.text.status}'/>
  </svg>`,
    batteryCap: `<svg width='2' height='5' viewBox='0 0 2 5' fill='none' xmlns='http://www.w3.org/2000/svg'>
  <path opacity='0.34' fill-rule='evenodd' clip-rule='evenodd' d='M-0.00917816 4.18699C-0.00612864 4.18701 -0.0030775 4.18701 -2.4762e-05 4.18701C0.00302797 4.18701 0.00607911 4.18701 0.00912864 4.18699H-0.00917816ZM0.499975 4.12401C1.36259 3.90198 1.99998 3.11893 1.99998 2.18701C1.99998 1.25509 1.36259 0.472044 0.499975 0.250023V4.12401Z' fill='${color.text.status}'/>
  </svg>`,
    bolt: `<svg width='6' height='9' viewBox='0 0 6 9' fill='none' xmlns='http://www.w3.org/2000/svg'>
  <path d='M2.8 0L0 5h2.1L1.4 9l4.6-6H3.9L5.3 0H2.8z' fill='${color.text.charge}'/>
  </svg>`,
  }

  // значения из system
  const timeText = system?.phoneTime ?? "9:41"
  const percent = Math.max(0, Math.min(100, system?.batteryPercent ?? 58))
  const isCharging = !!system?.isCharging

  // размеры батареи
  const INNER_MAX_W = 18 // как в исходном макете
  const innerW = Math.max(1, Math.round((INNER_MAX_W * percent) / 100))

  return (
    <AutoLayout
      name="IosHeaderStatus"
      spacing="auto"
      padding={{ top: 16, right: 20, bottom: 12, left: 20 }}
      width={375}
      height={44}
      verticalAlignItems="center"
      {...props}
    >
      {/* Time */}
      <AutoLayout
        name="Time"
        direction="vertical"
        spacing={8}
        padding={{ vertical: 1, horizontal: 8 }}
        height={18}
        verticalAlignItems="center"
        horizontalAlignItems="center"
      >
        <Text
          name="time"
          fill={isCharging ? color.text.charge : color.text.status}
          fontSize={12}
          lineHeight={12}
          fontWeight={600}
          letterSpacing={-0.2}
        >
          {timeText}
        </Text>
      </AutoLayout>

      {/* Right icons */}
      <AutoLayout name="Right" overflow="visible" spacing={8} verticalAlignItems="center">
        <SVG name="Mobile Signal" height={11} width={17} src={svgPaths.mobile} />
        <SVG name="Wifi" height={11} width={15} src={svgPaths.wifi} />
        <Frame name="Battery" strokeWidth={0} overflow="visible" width={24.5} height={10.5}>
          <SVG name="Battery Outline" opacity={0.34} height={11} width={22} src={svgPaths.batteryTip} />
          <SVG name="Battery Cap" opacity={0.34} x={22.491} y={3.5} height={4} width={2} src={svgPaths.batteryCap} />
          <Rectangle
            name="Level"
            x={{ type: "right", offset: 4.5 }}
            y={{ type: "center", offset: 0 }}
            fill={isCharging ? color.text.charge : color.text.status}
            cornerRadius={1}
            strokeWidth={0}
            strokeAlign="center"
            width={innerW}
            height={6.5}
          />
          {isCharging && (
            <Frame name="charge" width={6} height={9} x={{ type: "center", offset: 0 }} y={{ type: "center", offset: 0 }}>
              <SVG name="bolt" width={6} height={9} src={svgPaths.bolt} />
            </Frame>
          )}
        </Frame>
      </AutoLayout>
    </AutoLayout>
  )
}

/* ===== нижняя полоска iOS — без изменений ===== */
interface IosBottomBarProps extends ReqCompProps, Partial<FrameProps> {}

export function IosBottomBar({ theme, ...props }: IosBottomBarProps) {
  const color = remapTokens({
    surface: { bar: { dark: "#FFF", light: "#000" } },
    text: {},
  })[theme]

  return (
    <Frame name="IosBottomBar" width={375} height={34} {...props}>
      <Rectangle
        name="Background"
        x={{ type: "horizontal-scale", leftOffsetPercent: 0, rightOffsetPercent: 0 }}
        y={{ type: "vertical-scale", topOffsetPercent: 0, bottomOffsetPercent: 0 }}
        strokeWidth={0}
        strokeAlign="center"
        width={375}
        height={34}
      />
      <Rectangle
        name="Line"
        x={{ type: "center", offset: 0.5 }}
        y={{ type: "bottom", offset: 9 }}
        fill={color.surface.bar}
        cornerRadius={100}
        strokeWidth={0}
        strokeAlign="center"
        width={134}
        height={5}
      />
    </Frame>
  )
}
