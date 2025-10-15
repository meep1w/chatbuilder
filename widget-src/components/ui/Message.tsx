// Dependencies
const { Image, AutoLayout, Text } = figma.widget
// Components
import { PreviewImage64 } from "@/assets/base64"
import { remapTokens } from "@/utils"
import { EDITOR_INPUTS } from "@/constants"
// Internal
import { StatusAtom, TailAtom } from "@/components/ui/atoms"
import { FILE_LIGHT_IN64, FILE_LIGHT_OUT64, FILE_DARK64 } from "@/assets/base64/Icons"

/* Import Changelog
 * Added maxWidth at maxMin Layer
 * Images to base64 (full src (data:im...))
 * Props Drilling (ReqCompProps const) for Atom comps
 * Add color object (surface) (handle theme mode with remapTokens() from utils & side prop)
 * Extracted Radius for each side into an object
 * Overload case for MessageProps
 */

const ICON_MAP = {
   light: [FILE_LIGHT_IN64, FILE_LIGHT_OUT64],
   dark: [FILE_DARK64, FILE_DARK64],
}

type PropByType = [
   {
      /** File */
      type: 0
      src?: ""
      isImg: boolean
      /** File Name*/
      name: string
      /** File Size 2.4 MB */
      size: string
      /** File Size .PNG*/
      extension?: string
   },
   {
      /** Text */
      type: 1
      text: string
   },
   {
      /** Image */
      type: 2
      src?: ""
      text: string
   },
]

interface MessageProps extends ReqCompProps, Partial<AutoLayoutProps> {
   dir: Message["dir"]
   type: Message["type"]
}

export function Message({ dir, theme, ...props }: PropByType[number] & MessageProps): void {
   /** Required by children (Drilled Props) */
   const reqChildProps = { type: props.type, dir, theme }

   // Theme Mode
   const color = remapTokens({
      surface: {
         0: { dark: "#262628", light: "#FFF" },
         1: { dark: "#363638", light: "#E1FEC6" },
      },
      text: {
         primary0: { dark: "#FFF", light: "#000" },
         primary1: { dark: "#FFF", light: "#000" },
         label0: { dark: "#8D8D8F", light: "#8D8D8F" },
         label1: { dark: "#8D8D8F", light: "#3EAA3C" },
      },
   })[theme]

   const layout = {
      /** Allignment */
      tailX: ["left", "right"],
      radius: [
         { topLeft: 16, topRight: 18, bottomRight: 18, bottomLeft: 18 },
         { topLeft: 18, topRight: 16, bottomRight: 18, bottomLeft: 18 },
      ],
   } as const

   function Container({ children }: Partial<AutoLayoutProps>) {
      return (
         <AutoLayout
            name={`Message${EDITOR_INPUTS.type.map[props.type] + dir}`}
            effect={{
               type: "drop-shadow",
               color: "#00000040",
               offset: {
                  x: 0,
                  y: 4,
               },
               blur: 22.6,
               showShadowBehindNode: false,
            }}
            overflow="visible"
            verticalAlignItems="end"
            {...props}
         >
            <TailAtom
               {...reqChildProps}
               name="_tail-atom"
               x={{
                  type: layout.tailX[dir],
                  offset: -6.077,
               }}
               y={{
                  type: "bottom",
                  offset: -1,
               }}
               positioning="absolute"
            />
            <AutoLayout
               name="text box"
               fill={color.surface[dir]}
               direction="vertical"
               cornerRadius={layout.radius[dir]}
               spacing={6}
               padding={{
                  vertical: 8,
                  horizontal: props.type === 0 ? 8 : 14,
               }}
            >
               {children}
            </AutoLayout>
            <StatusAtom
               {...reqChildProps}
               color={color.text[`label${props.type === 2 ? 0 : dir}`]}
               dir={dir}
               name="_status-atom"
               x={{
                  type: "right",
                  offset: 12,
               }}
               y={{
                  type: "bottom",
                  offset: 4,
               }}
               positioning="absolute"
               width={43}
            />
         </AutoLayout>
      )
   }

   switch (props.type) {
      case 0: {
         // File
         const { name, size, extension, isImg } = props
         return (
            <Container>
               <AutoLayout name="Conent File" minWidth={100} overflow="visible" verticalAlignItems="center">
                  <Image name="Preview" cornerRadius={11} strokeWidth={0} strokeAlign="center" width={74} height={74} src={isImg ? PreviewImage64 : ICON_MAP[theme][dir]} />
                  <AutoLayout
                     name="Stats"
                     overflow="visible"
                     direction="vertical"
                     padding={{
                        vertical: 0,
                        horizontal: 8,
                     }}
                  >
                     <AutoLayout name="Frame 3" overflow="visible" width="fill-parent">
                        <Text name="IMG_0475.PNG" fill={color.text[`primary${dir}`]} lineHeight={21} letterSpacing={-0.3} strokeWidth={0} strokeAlign="center">
                           {name}
                        </Text>
                        <Text name="IMG_0475.PNG" fill={color.text[`primary${dir}`]} lineHeight={21} letterSpacing={-0.3} strokeWidth={0} strokeAlign="center">
                           {extension}
                        </Text>
                     </AutoLayout>
                     <AutoLayout name="Frame 2" overflow="visible" width={43}>
                        <Text name="2.4 MB" fill={color.text[`label${dir}`]} fontSize={13} letterSpacing={-0.1} strokeWidth={0} strokeAlign="center">
                           {size}
                        </Text>
                        <Text name="Label" fill={color.text[`label${dir}`]} fontSize={13} letterSpacing={-0.1} strokeWidth={0} strokeAlign="center">
                           {"  "}
                           MB
                        </Text>
                     </AutoLayout>
                  </AutoLayout>
               </AutoLayout>
            </Container>
         )
      }
      case 1: {
         // Text
         const { text } = props
         return (
            <Container>
               <AutoLayout name="Content Text" minWidth={60} maxWidth={250} overflow="visible" spacing={8}>
                  <Text name="Text" fill={color.text[`primary${dir}`]} width="fill-parent" lineHeight={22} fontSize={15} letterSpacing={-0.4} strokeWidth={0} strokeAlign="center">
                     {text + "                "}
                  </Text>
               </AutoLayout>
            </Container>
         )
      }
      case 2: {
         // Image
         const { text } = props
         return (
            <Container>
               <AutoLayout name="Content Image" minHeight={!text ? 150 : 135} minWidth={!text ? 250 : 118} overflow="visible" direction="vertical" spacing={8} width="fill-parent">
                  <Image
                     name="Rectangle 1"
                     x={{
                        type: "left-right",
                        leftOffset: -13,
                        rightOffset: -13,
                     }}
                     y={{
                        type: "top-bottom",
                        topOffset: -7,
                        bottomOffset: !text ? -7 : 0,
                     }}
                     positioning="absolute"
                     cornerRadius={{
                        topLeft: layout.radius[dir].topLeft - 1,
                        topRight: layout.radius[dir].topRight - 1,
                        bottomRight: !text ? layout.radius[dir].bottomRight - 1 : 0,
                        bottomLeft: !text ? layout.radius[dir].bottomLeft - 1 : 0,
                     }}
                     width={276}
                     height={142}
                     src={PreviewImage64}
                  />
               </AutoLayout>
               <AutoLayout name="Content Text" hidden={!text} maxWidth={250} overflow="visible" spacing={8}>
                  <Text name="Text" fill={color.text[`primary${dir}`]} width="fill-parent" lineHeight={22} fontSize={15} letterSpacing={-0.4} strokeWidth={0} strokeAlign="center">
                     {text + "                "}
                  </Text>
               </AutoLayout>
            </Container>
         )
      }
   }
}
