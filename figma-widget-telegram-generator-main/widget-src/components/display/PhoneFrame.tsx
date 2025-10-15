// widget-src/components/display/PhoneFrame.tsx

// Dependencies
const { Frame, Image, AutoLayout } = figma.widget
// Assets
import { FrameBezel64, DynamicIsland64 } from "@/assets/base64"

type ViewportKey = "sm" | "md" | "lg"

interface PhoneFrameProps extends Partial<AutoLayoutProps>, ReqCompProps, OptionalRender {
  /** Размер экрана (по меню). По умолчанию md. */
  viewport?: ViewportKey
  /** Управление рамкой/островком (полезно для Snapshot) */
  showBezel?: boolean
  showIsland?: boolean

  /** Задел под системную строку/тему (можно не передавать) */
  system?: SystemBar
  appearance?: ChatAppearance
}

/** Габариты экрана/рамки под разные пресеты */
const VIEWPORTS: Record<ViewportKey, { screenW: number; screenH: number; bezelW: number; bezelH: number; corner: number; islandH: number; islandYOffset: number }> = {
  sm: { screenW: 360, screenH: 780, bezelW: 398, bezelH: 812, corner: 46, islandH: 56, islandYOffset: 12 },
  md: { screenW: 390, screenH: 844, bezelW: 428, bezelH: 876, corner: 52, islandH: 60, islandYOffset: 12 },
  lg: { screenW: 414, screenH: 896, bezelW: 452, bezelH: 930, corner: 56, islandH: 64, islandYOffset: 14 },
}

/** iPhone Frame with Bezel + Dynamic Island */
export function PhoneFrame({
  renderElements,
  children,
  viewport = "md",
  showBezel = true,
  showIsland = true,
  ...props
}: PhoneFrameProps) {
  if (!renderElements) return children

  const vp = VIEWPORTS[viewport] ?? VIEWPORTS.md

  return (
    <AutoLayout
      name="Phone"
      effect={[
        { type: "drop-shadow", color: "#0000001A", offset: { x: 0, y: 17 }, blur: 38 },
        { type: "drop-shadow", color: "#00000017", offset: { x: 0, y: 69 }, blur: 69 },
        { type: "drop-shadow", color: "#0000000D", offset: { x: 0, y: 155 }, blur: 93 },
        { type: "drop-shadow", color: "#00000003", offset: { x: 0, y: 275 }, blur: 110 },
        { type: "drop-shadow", color: "#0000", offset: { x: 0, y: 430 }, blur: 120 },
      ]}
      padding={{ vertical: 16, horizontal: 19 }}
      overflow="visible"
      verticalAlignItems="center"
      {...props}
    >
      {showBezel && (
        <Image
          name="Frame + Bezel"
          x={{ type: "left-right", leftOffset: 0, rightOffset: 0 }}
          y={{ type: "top-bottom", topOffset: 0, bottomOffset: 0 }}
          positioning="absolute"
          strokeWidth={1}
          width={vp.bezelW}
          height={vp.bezelH}
          src={FrameBezel64}
        />
      )}

      <Frame
        name="hideCornersOnPhoneDisplay"
        overflow={"hidden"}
        cornerRadius={vp.corner}
        width={vp.screenW}
        height={vp.screenH}
      >
        {/* Viewport */}
        {children}
      </Frame>

      {showIsland && (
        <Image
          name="Dynamic Island"
          x={{ type: "center", offset: 3 }}
          positioning="absolute"
          y={vp.islandYOffset}
          width={vp.screenW}
          height={vp.islandH}
          src={DynamicIsland64}
        />
      )}
    </AutoLayout>
  )
}
