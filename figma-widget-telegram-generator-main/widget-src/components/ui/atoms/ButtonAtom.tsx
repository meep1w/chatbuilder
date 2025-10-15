// Dependencies
const { Frame, AutoLayout, Text, SVG } = figma.widget
// Components
import { remapTokens } from "@/utils"

/** Import Changelog
 * Added colors remapTokens
 * text prop to Text
 * Added hidden={!hasRef} to buttonRef Frame
 * svgPaths outside the return jsx statement
 */

interface ButtonAtomProps extends ReqCompProps, Partial<FrameProps> {
   children: string
   hasRef?: boolean
}

export function ChatButtonAtom({ children, hasRef = true, theme, ...props }: ButtonAtomProps) {
   // Theme Mode
   const colors = remapTokens({
      surface: {
         container: { light: "#24242457", dark: "#BE8AFF33" },
      },
      text: {
         primary: { light: "#FFF", dark: "#FFF" },
      },
   })[theme]

   const svgPaths = {
      diagonalArrow: `<svg width='8' height='8' viewBox='0 0 8 8' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path d='M1.52941 0.823486V2.23525H4.70589L0.294121 6.64702L1.35294 7.70584L5.76471 3.29407V6.47055H7.17647V0.823486H1.52941Z' fill='${colors.text.primary}'/>
        </svg>`,
   }

   return (
      <Frame
         name="ChatButtonAtom"
         effect={[
            {
               type: "drop-shadow",
               color: "#0000001F",
               offset: {
                  x: 0,
                  y: 4,
               },
               blur: 10.4,
               showShadowBehindNode: false,
            },
            {
               blur: 16.8,
               type: "background-blur",
            },
         ]}
         fill={colors.surface.container}
         cornerRadius={6}
         width={"fill-parent"}
         height={40}
         {...props}
      >
         <AutoLayout
            name="Main"
            x={{
               type: "center",
               offset: -0.5,
            }}
            y={{
               type: "center",
               offset: 0,
            }}
            overflow="visible"
            direction="vertical"
            spacing={10}
         >
            <Text name="ButtonAtom" fill={colors.text.primary} verticalAlignText="center" lineHeight={18} fontSize={14} fontWeight={600}>
               {children}
            </Text>
         </AutoLayout>
         <Frame
            name="Filled / External Reference Icon"
            x={{
               type: "right",
               offset: 2,
            }}
            y={2}
            overflow="visible"
            width={12}
            height={12}
            hidden={!hasRef}
         >
            <SVG
               name="Vector"
               x={{
                  type: "horizontal-scale",
                  leftOffsetPercent: 19.118,
                  rightOffsetPercent: 23.529,
               }}
               y={{
                  type: "vertical-scale",
                  topOffsetPercent: 23.529,
                  bottomOffsetPercent: 19.118,
               }}
               height={7}
               width={7}
               src={svgPaths.diagonalArrow}
            />
         </Frame>
      </Frame>
   )
}
