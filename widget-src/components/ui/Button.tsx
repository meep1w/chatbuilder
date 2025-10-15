// Dependencies
const { AutoLayout } = figma.widget
// Internal
import { ChatButtonAtom } from "@/components/ui/atoms"

/** Import Changelog
 * Declare props Interface & extract reqProps by children
 * Add ButtonAttom props
 */

interface ButtonProps extends ReqCompProps, Partial<AutoLayoutProps> {
   children: string
   config: {
      hasRef?: boolean
   }
}

export function Button({ children, config, theme, ...props }: ButtonProps) {
   /** Required by children (Drilled Props) */
   const reqChildProps = { ...config, theme }

   return (
      <AutoLayout
         name="ChatButtonStateDefault"
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
         cornerRadius={6}
         width={154}
         height={40}
         horizontalAlignItems="center"
         verticalAlignItems="center"
         {...props}
      >
         <ChatButtonAtom {...reqChildProps} name="_chat-button-atom">
            {children}
         </ChatButtonAtom>
      </AutoLayout>
   )
}
