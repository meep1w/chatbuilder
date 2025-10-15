// widget-src/components/ui/Background.tsx

// Dependencies
const { Rectangle, Frame, Image } = figma.widget
// Legacy assets (fallback)
import { LatestDark64, LatestLight64, FlatDark64, FlatLight64 } from "@/assets/base64"

interface BackgroundProps extends ReqCompProps, Partial<FrameProps> {
  /** ЛЕГАСИ: старый пресет обоев */
  type?: "flat" | "latest"
  /** НОВОЕ: внешний вид (тема/цвет/картинка) */
  appearance?: ChatAppearance
  /** НОВОЕ: прямой проброс картинки-обоев */
  imageHash?: string
  /** НОВОЕ: прямой проброс цвета (если appearance не задан) */
  fillColor?: string
}

/**
 * Background
 * Приоритет:
 * 1) appearance.bgKind === "image" && (appearance.bgImageHash || imageHash)
 * 2) solid (appearance.bgColor || fillColor)
 * 3) Легаси: base64-обои по type+theme
 */
export function Background({ theme, type = "latest", appearance, imageHash, fillColor, ...props }: BackgroundProps) {
  const kind = appearance?.bgKind
  const hash = appearance?.bgImageHash ?? imageHash
  const color =
    appearance?.bgColor ??
    fillColor ??
    (appearance?.theme
      ? appearance.theme === "dark"
        ? "#0e0f12"
        : "#ffffff"
      : theme === "dark"
      ? "#0e0f12"
      : "#ffffff")

  const useImage =
    (kind === "image" && !!hash) ||
    (!!hash && kind !== "solid") // если явно передали imageHash — используем

  const useSolid =
    kind === "solid" ||
    (!!fillColor && !useImage) ||
    (!!appearance?.bgColor && !useImage)

  const legacySrc =
    type === "latest"
      ? theme === "dark"
        ? LatestDark64
        : LatestLight64
      : theme === "dark"
      ? FlatDark64
      : FlatLight64

  return (
     <Frame name="Background" overflow="hidden" width={"fill-parent"} height={"fill-parent"} {...props}>
      {useImage ? (
        <Image
          name="wallpaper-image"
          imageHash={hash as string}
          width={"fill-parent"}
          height={"fill-parent"}
        />
      ) : useSolid ? (
        <Rectangle
          name="wallpaper-solid"
          width={"fill-parent"}
          height={"fill-parent"}
          fill={color}
        />
      ) : (
        // Легаси обои (base64)
        <Image
          name="wallpaper-legacy"
          src={legacySrc}
          width={"fill-parent"}
          height={"fill-parent"}
        />
      )}
    </Frame>
  )
}
