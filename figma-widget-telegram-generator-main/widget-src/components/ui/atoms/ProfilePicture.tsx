// Dependencies
const { Frame, Image } = figma.widget
// Components
import { PROFILE_IMAGES } from "@/constants"

/** Import Changelog
 * SVG to base64 Image with props src
 */

interface ProfilePicProps extends Partial<FrameProps> {
   profilePicSrc?: string
}

export function ProfilePic({ profilePicSrc = PROFILE_IMAGES[1], ...props }: ProfilePicProps) {
   return (
      <Frame name="ProfilePic" overflow="visible" width={37} height={37} {...props}>
         <Image name="Preview" cornerRadius={50} strokeWidth={0} strokeAlign="center" width={37} height={37} src={profilePicSrc} />
      </Frame>
   )
}
