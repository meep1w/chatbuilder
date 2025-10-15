// Components
import { Message } from "@/components/ui"
import { DirectionContainer, PreviewLabel, WithButtons } from "@/components/display/atoms"

interface MessagePreviewProps extends Partial<AutoLayoutProps>, ReqCompProps {
   editorState: Message
}

/** Message from editor mode (preview labeled) */
export function MessagePreview({ theme, editorState, ...props }: MessagePreviewProps) {
   const { dir, type, text, name, size, extension, isImg, buttons } = editorState

   // Match Overload
   const propsOfType = [
      {
         isImg,
         name,
         size,
         extension,
         text,
      },
   ]

   return (
      <DirectionContainer name="Preview Container" dir={dir} {...props}>
         <WithButtons buttons={buttons} theme={theme}>
            <PreviewLabel theme={theme} />
            <Message dir={dir} type={type} {...propsOfType[0]} theme={theme} />
         </WithButtons>
      </DirectionContainer>
   )
}
