// Dependencies
const { Frame, Text, Rectangle, SVG } = figma.widget
// Components
import { remapTokens } from "@/utils"
// Internal
import { IosBottomBar } from "@/components/ui/atoms"

/** Import Changelog
 * colors with remapTokens
 * Handle all svg paths outside the return jsx statement, as const
 * ios bottombar req child props
 */

interface BottomBarProps extends ReqCompProps, Partial<FrameProps> {}

export function BottomBar({ theme, ...props }: BottomBarProps) {
   /** Required by children (Drilled Props) */
   const reqChildProps = { theme }

   // Theme Mode
   const color = remapTokens({
      surface: {
         container: { dark: "#1C1C1D", light: "#F6F6F6" },
         icons: { dark: "#8D8D8F", light: "#8D8D8F" },
         input: { dark: "#060606", light: "#FFF" },
      },
      text: {
         input: { dark: "#8D8D8F66", light: "#8D8D8F66" },
      },
   })[theme]

   const svgPaths = {
      attach: `<svg width='31' height='30' viewBox='0 0 31 30' fill='none' xmlns='http://www.w3.org/2000/svg'>
  <path d='M22.835 17.4827L17.3022 23.0156C14.6506 25.6671 10.3517 25.6671 7.70017 23.0156C5.04866 20.3641 5.04866 16.0651 7.70017 13.4136L15.1478 5.96595C16.9169 4.19693 19.785 4.19693 21.554 5.96595C23.323 7.73497 23.323 10.6031 21.554 12.3721L13.8717 20.0544C13.0406 20.8856 11.693 20.8856 10.8619 20.0544C10.0307 19.2233 10.0307 17.8757 10.8619 17.0446L16.6294 11.2771C16.9223 10.9842 16.9223 10.5093 16.6294 10.2164C16.3365 9.92353 15.8616 9.92353 15.5687 10.2164L9.80122 15.9839C8.38428 17.4009 8.38428 19.6982 9.80122 21.1151C11.2182 22.532 13.5155 22.532 14.9324 21.1151L22.6147 13.4328C24.9695 11.078 24.9695 7.2601 22.6147 4.90529C20.2599 2.55048 16.442 2.55048 14.0872 4.90529L6.63951 12.3529C3.40221 15.5902 3.40221 20.8389 6.63951 24.0762C9.87681 27.3135 15.1255 27.3135 18.3628 24.0762L23.8957 18.5434C24.1886 18.2505 24.1886 17.7756 23.8957 17.4827C23.6028 17.1898 23.1279 17.1898 22.835 17.4827Z' fill='${color.surface.icons}'/>
  </svg>`,
      sticker: `<svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
  <path fill-rule='evenodd' clip-rule='evenodd' d='M9.35854 0C11.5227 0 19.8957 8.39007 19.9772 10.3906C19.7123 15.6758 15.3518 19.9823 10 19.9823C4.47715 19.9823 0 15.5052 0 9.98232C0 4.74029 4.22587 0.423732 9.35854 0ZM8.57307 1.60187C4.55807 2.28019 1.5 5.77413 1.5 9.98232C1.5 14.6767 5.30558 18.4823 10 18.4823C14.2081 18.4823 17.7019 15.4244 18.3807 11.4095L18.4422 11.3832C17.5388 11.7689 16.5443 11.9823 15.5 11.9823C11.3579 11.9823 8 8.62445 8 4.48232C8 3.56011 8.16645 2.67677 8.47093 1.86072L8.57307 1.60187ZM10.0119 2.0525L10.1448 1.7726L10.274 1.83794C10.453 1.93193 10.6591 2.0533 10.8858 2.20066C11.8218 2.80933 12.8949 3.8935 14.0378 5.04815C14.1889 5.20082 14.3413 5.35473 14.4947 5.50893C14.6477 5.66277 14.8001 5.8152 14.951 5.96614C16.0961 7.1114 17.1551 8.17063 17.7575 9.10927C17.94 9.3936 18.0819 9.64556 18.1805 9.85219C17.3583 10.2637 16.4466 10.4823 15.5 10.4823C12.1863 10.4823 9.5 7.79602 9.5 4.48232C9.5 3.63084 9.67691 2.80761 10.0119 2.0525Z' fill='${color.surface.icons}'/>
  </svg>`,
      record: `<svg width='19' height='25' viewBox='0 0 19 25' fill='none' xmlns='http://www.w3.org/2000/svg'>
  <path fill-rule='evenodd' clip-rule='evenodd' d='M9.5 0C12.2614 0 14.5 2.23858 14.5 5V12C14.5 14.7614 12.2614 17 9.5 17C6.73857 17 4.5 14.7614 4.5 12V5C4.5 2.23858 6.73857 0 9.5 0ZM18 11.25C18.4142 11.25 18.75 11.5858 18.75 12C18.75 16.6029 15.0002 20.3603 10.2509 20.7216L10.25 24C10.25 24.4142 9.91422 24.75 9.5 24.75C9.1203 24.75 8.80651 24.4678 8.75685 24.1018L8.75 24L8.75008 20.7216C4.00034 20.3609 0.25 16.6032 0.25 12C0.25 11.5858 0.585785 11.25 1 11.25C1.41422 11.25 1.75 11.5858 1.75 12C1.75 15.9936 5.20997 19.25 9.5 19.25C13.79 19.25 17.25 15.9936 17.25 12C17.25 11.5858 17.5858 11.25 18 11.25ZM6 5C6 3.067 7.56701 1.5 9.5 1.5C11.433 1.5 13 3.067 13 5V12C13 13.933 11.433 15.5 9.5 15.5C7.56701 15.5 6 13.933 6 12V5Z' fill='${color.surface.icons}'/>
  </svg>`,
   }

   return (
      <Frame
         name="ChatInput"
         effect={[
            {
               type: "drop-shadow",
               color: "#0000001A",
               offset: {
                  x: -1,
                  y: 7,
               },
               blur: 16,
            },
            {
               type: "drop-shadow",
               color: "#00000017",
               offset: {
                  x: -2,
                  y: 29,
               },
               blur: 29,
            },
            {
               type: "drop-shadow",
               color: "#0000000D",
               offset: {
                  x: -5,
                  y: 66,
               },
               blur: 40,
            },
            {
               type: "drop-shadow",
               color: "#00000003",
               offset: {
                  x: -9,
                  y: 118,
               },
               blur: 47,
            },
            {
               type: "drop-shadow",
               color: "#0000",
               offset: {
                  x: -14,
                  y: 184,
               },
               blur: 52,
            },
         ]}
         width={375}
         height={80}
         {...props}
      >
         <Frame
            name="Message Input"
            x={{
               type: "left-right",
               leftOffset: 0,
               rightOffset: 0,
            }}
            y={{
               type: "top-bottom",
               topOffset: 0,
               bottomOffset: 0,
            }}
            strokeWidth={0}
            overflow="visible"
            width={375}
            height={80}
         >
            <Rectangle
               name="bg"
               effect={{
                  type: "drop-shadow",
                  color: "#3D3D3F",
                  offset: {
                     x: 0,
                     y: -0.33,
                  },
                  blur: 0,
               }}
               x={{
                  type: "left-right",
                  leftOffset: 0,
                  rightOffset: 0,
               }}
               y={{
                  type: "top-bottom",
                  topOffset: 0,
                  bottomOffset: 0,
               }}
               fill={color.surface.container}
               strokeWidth={0}
               strokeAlign="center"
               width={375}
               height={80}
            />
            <Frame name="Attach Icon" x={7.778} y={8.641} strokeWidth={0} overflow="visible" width={29.296} height={29.296}>
               <SVG name="Shape" height={29} width={29} src={svgPaths.attach} />
            </Frame>
            <Frame
               name="Message Input"
               x={{
                  type: "left-right",
                  leftOffset: 42,
                  rightOffset: 42,
               }}
               y={7}
               width={291}
               height={33}
            >
               <Rectangle
                  name="Rectangle"
                  x={{
                     type: "left-right",
                     leftOffset: 0,
                     rightOffset: 0,
                  }}
                  y={{
                     type: "top-bottom",
                     topOffset: 0,
                     bottomOffset: 0,
                  }}
                  fill={color.surface.input}
                  stroke={color.text.input}
                  cornerRadius={16.5}
                  width={291}
                  height={33}
               />
               <Text
                  name="Message"
                  x={13}
                  y={{
                     type: "center",
                     offset: -0.5,
                  }}
                  fill={color.text.input}
                  lineHeight={22}
                  fontSize={17}
                  letterSpacing={-0.4}
                  strokeWidth={0}
                  strokeAlign="center"
               >
                  Message
               </Text>
               <Frame
                  name="Stickers"
                  x={{
                     type: "right",
                     offset: 8,
                  }}
                  y={6}
                  strokeWidth={0}
                  overflow="visible"
                  width={19.977}
                  height={19.982}
               >
                  <SVG name="Shape" height={20} width={20} src={svgPaths.sticker} />
               </Frame>
            </Frame>
            <Frame
               name="Record Audio Icon"
               x={{
                  type: "right",
                  offset: 13,
               }}
               y={11}
               strokeWidth={0}
               overflow="visible"
               width={18.5}
               height={24.75}
            >
               <SVG name="Shape" height={25} width={19} src={svgPaths.record} />
            </Frame>
         </Frame>
         <IosBottomBar
            {...reqChildProps}
            name="_ios/BottomBar"
            x={{
               type: "center",
               offset: 0,
            }}
            y={{
               type: "bottom",
               offset: 0,
            }}
         />
      </Frame>
   )
}
