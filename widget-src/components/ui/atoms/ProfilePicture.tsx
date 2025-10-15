// widget-src/components/ui/atoms/ProfilePicture.tsx

// Dependencies
const { Frame, Image, Rectangle } = figma.widget
// Fallback картинка (как раньше)
import { PROFILE_IMAGES } from "@/constants"

interface ProfilePicProps extends Partial<FrameProps> {
  /** Новый вариант — хэш картинки, полученный через figma.createImageAsync(bytes).hash */
  imageHash?: string
  /** Старый вариант — src/base64 (оставляем как фолбэк) */
  profilePicSrc?: string
  /** Размер аватарки (по умолчанию 37) */
  size?: number
}

export function ProfilePic({
  imageHash,
  profilePicSrc = PROFILE_IMAGES[1],
  size = 37,
  ...props
}: ProfilePicProps) {
  return (
    <Frame
      name="ProfilePic"
      overflow="hidden"
      width={size}
      height={size}
      cornerRadius={size / 2}
      {...props}
    >
      {imageHash ? (
        <Image
          name="PreviewHash"
          imageHash={imageHash}
          width={"fill-parent"}
          height={"fill-parent"}
        />
      ) : profilePicSrc ? (
        <Image
          name="PreviewSrc"
          src={profilePicSrc}
          width={"fill-parent"}
          height={"fill-parent"}
        />
      ) : (
        <Rectangle width={"fill-parent"} height={"fill-parent"} fill={"#444"} />
      )}
    </Frame>
  )
}
