// Dependencies
const { AutoLayout, Text } = figma.widget
// Components
import { Button } from "@/components/ui"
import { remapTokens } from "@/utils"

interface SideContainerProps extends Partial<AutoLayoutProps> {
   dir: Message["dir"]
}

export function DirectionContainer({ children, dir, ...props }: SideContainerProps) {
   switch (dir) {
      case 0:
         return (
            <AutoLayout name="In" overflow="visible" direction="vertical" spacing={8} width="fill-parent" {...props}>
               {children}
            </AutoLayout>
         )
      case 1:
         return (
            <AutoLayout name="Out" overflow="visible" direction="vertical" spacing={8} width="fill-parent" verticalAlignItems="center" horizontalAlignItems="end" {...props}>
               {children}
            </AutoLayout>
         )
   }
}

interface WithButtonsProps extends Partial<AutoLayoutProps>, ReqCompProps {
   buttons: Message["buttons"]
}

export function WithButtons({ children, buttons, theme, ...props }: WithButtonsProps) {
   return (
      <AutoLayout name="With Buttons" overflow="visible" direction="vertical" spacing={8} horizontalAlignItems="end" {...props}>
         {/* Message */}
         {children}
         {/* 1 Buttons Container */}
         <AutoLayout hidden={!(buttons.length > 0)} name="Actions" overflow="visible" direction="vertical" spacing={4} width="fill-parent">
            {/* 2 Buttons Row */}
            {buttons.map(
               (buttonsRow, key) =>
                  buttonsRow.length > 0 && (
                     <AutoLayout key={key} name="Row" overflow="visible" spacing={4} width="fill-parent" horizontalAlignItems="center" verticalAlignItems="center">
                        {buttonsRow.map((button, key) => (
                           <Button key={key} config={{ hasRef: false }} theme={theme} name="chat-button" width="fill-parent">
                              {button.text}
                           </Button>
                        ))}
                     </AutoLayout>
                  ),
            )}
         </AutoLayout>
      </AutoLayout>
   )
}

export function PreviewLabel({ theme, ...props }: Partial<AutoLayoutProps> & ReqCompProps) {
   const gradientHandle = [
      {
         x: 0.873,
         y: -3.048,
      },
      {
         x: 0.937,
         y: 2.048,
      },
      {
         x: 0.89,
         y: -3.079,
      },
   ] as const

   // Theme Mode
   const color = remapTokens({
      text: {
         default: { dark: "#000", light: "#fff" },
      },
      surface: {
         gradient: {
            dark: [
               {
                  type: "gradient-linear",
                  gradientHandlePositions: [...gradientHandle],
                  gradientStops: [
                     {
                        position: 0,
                        color: {
                           r: 0.8274509906768799,
                           g: 1,
                           b: 0.5529412031173706,
                           a: 1,
                        },
                     },
                     {
                        position: 1,
                        color: {
                           r: 0.6423529386520386,
                           g: 1,
                           b: 0.5529412031173706,
                           a: 1,
                        },
                     },
                  ],
               },
            ],
            light: [
               {
                  type: "gradient-linear",
                  gradientHandlePositions: [...gradientHandle],
                  gradientStops: [
                     {
                        position: 0,
                        color: {
                           r: 0.1568627506494522,
                           g: 0.3176470696926117,
                           b: 0.7176470756530762,
                           a: 1,
                        },
                     },
                     {
                        position: 1,
                        color: {
                           r: 0,
                           g: 0.28671324253082275,
                           b: 1,
                           a: 1,
                        },
                     },
                  ],
               },
            ],
         },
      },
   })[theme]

   return (
      <AutoLayout
         name="CenterLabel"
         x={{
            type: "left-right",
            leftOffset: 0,
            rightOffset: 0,
         }}
         y={-15}
         positioning="absolute"
         overflow="visible"
         direction="vertical"
         spacing={8}
         width={278}
         height={15}
         padding={{ horizontal: 20 }}
         horizontalAlignItems="center"
      >
         <AutoLayout
            name="PreviewLabel"
            fill={color.surface.gradient}
            cornerRadius={{
               topLeft: 5,
               topRight: 5,
               bottomRight: 0,
               bottomLeft: 0,
            }}
            strokeWidth={0.625}
            overflow="visible"
            spacing={5}
            padding={{
               vertical: 2.5,
               horizontal: 60,
            }}
            width={"fill-parent"}
            maxWidth={135}
            minWidth={48}
            height={15}
            horizontalAlignItems="center"
            {...props}
         >
            <Text name="PREVIEW" fill={color.text.default} lineHeight={11.25} fontSize={8.75} letterSpacing={0.35} fontWeight={700} strokeWidth={0.625}>
               PREVIEW
            </Text>
         </AutoLayout>
      </AutoLayout>
   )
}
